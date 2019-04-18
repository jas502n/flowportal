using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using System.Reflection;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;
using BPM.Resources;

namespace YZSoft.Services.REST.Mobile.BPM
{
    public partial class FormHandler : ProcessBase
    {
        protected override void AuthCheck(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string method = request.GetString("Method",null);

            if (method != "GetSimulateInfo")
                YZAuthHelper.AshxAuthCheck();
        }

        public virtual JObject GetPostInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string processName = request.GetString("processName");
            int restartTaskID = request.GetInt32("restartTaskID", -1);
            string permisions = request.GetString("Permisions", null);

            Version processVersion = null;
            PostInfo postInfo;
            JObject perm;
            MemberCollection positions;
            FlowDataSet formdataset;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (restartTaskID == -1)
                    processVersion = cn.GetGlobalObjectLastVersion(StoreZoneType.Process, processName);

                postInfo = BPMProcess.GetPostInfo(cn, processName, processVersion, null, restartTaskID);

                perm = this.CheckPermision(postInfo, permisions);
                positions = OrgSvr.GetUserPositions(cn, cn.UID);

                formdataset = BPMProcess.GetFormData(cn, processName, processVersion, null, restartTaskID);

                //准备返回值
                JObject result = new JObject();

                JObject jForm = new JObject();
                if (String.IsNullOrEmpty(postInfo.MobileForm))
                {
                    //jForm["xclass"] = "YZSoft.form.Form5";
                    //jForm["config"] = new JObject();

                    jForm["xclass"] = "YZSoft.form.aspx.Form";

                    if (String.IsNullOrEmpty(postInfo.FormFile))
                        throw new Exception(Resources.YZStrings.Aspx_Post_MissForm);

                    jForm["config"] = JObject.FromObject(new
                    {
                        aspxform = postInfo.FormFile
                    });
                }
                else
                {
                    string xclass;
                    JObject config;
                    this.ParseMobileForm(postInfo.MobileForm, out xclass, out config);
                    jForm["xclass"] = xclass;
                    jForm["config"] = config;
                }
                result["form"] = jForm;
                result["subModel"] = "Post";

                result["processName"] = postInfo.ProcessName;
                result["processVersion"] = postInfo.ProcessVersion.ToString(2);
                result["restartTaskID"] = restartTaskID;
                result["perm"] = perm;
                result["PersistParams"] = postInfo.PersistParams;
                result["NodePermisions"] = this.Serialize(postInfo.NodePermision);
                result["formdataset"] = this.ToResult(formdataset, true);

                //处理按钮
                JArray links = new JArray();
                result["links"] = links;
                foreach (Link link in postInfo.Links)
                    links.Add(this.Serialize(link, "normal"));

                JArray jPoss = new JArray();
                result["positions"] = jPoss;
                foreach (Member position in positions)
                {
                    JObject jPos = new JObject();
                    jPoss.Add(jPos);

                    string name = position.GetParentOU(cn).Name + "\\" + position.UserAccount;

                    if (position.IsLeader)
                        name += "(" + position.LeaderTitle + ")";

                    jPos["name"] = name;
                    jPos["value"] = position.FullName;
                }

                //自由流
                result["ParticipantDeclares"] = JArray.FromObject(postInfo.ParticipantDeclares);
                return result;
            }
        }

        public virtual JObject GetProcessInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("pid");
            string permisions = request.GetString("Permisions", null);
            string uid = YZAuthHelper.LoginUserAccount;

            BPMProcStep step;
            BPMTask task;
            global::BPM.Client.ProcessInfo processInfo;
            CommentItemCollection comments;
            FlowDataSet formdataset;
            BPMStepCollection steps;
            ProcessSubModel subModel;
            JObject perm = null;
            JObject directSendInfo = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                step = BPMProcStep.Load(cn, stepid);
                task = BPMTask.Load(cn, step.TaskID);
                processInfo = BPMProcess.GetProcessInfo(cn, stepid);

                comments = BPMTask.GetComments(cn, task.TaskID);
                formdataset = BPMProcess.GetFormData(cn, stepid);
                steps = BPMTask.GetAllSteps(cn, task.TaskID);

                //获得ProcessSubModel
                if (step.Share && String.IsNullOrEmpty(step.OwnerAccount))
                    subModel = ProcessSubModel.Share;
                else
                {
                    if (processInfo.StepProcessPermision == StepProcessPermision.Inform)
                        subModel = ProcessSubModel.Inform;
                    else if (processInfo.StepProcessPermision == StepProcessPermision.Indicate)
                        subModel = ProcessSubModel.Indicate;
                    else
                        subModel = ProcessSubModel.Process;
                }

                //ProcessSubModel.Process - 则获得任务操作权限
                if (subModel == ProcessSubModel.Process ||
                    subModel == ProcessSubModel.Inform ||
                    subModel == ProcessSubModel.Indicate)
                    perm = this.CheckPermision(cn, step.TaskID, stepid, permisions);
                else
                    perm = new JObject();

                directSendInfo = this.GetDirectSendInfo(cn, step, processInfo.SystemLinks);
            }

            int total;
            int newMessageCount;
            using(IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    total = YZSoft.Web.Social.SocialManager.GetMessageCount(provider,cn,YZResourceType.Task,task.TaskID.ToString());
                    newMessageCount = YZSoft.Web.Social.SocialManager.GetNewMessageCount(provider,cn, YZResourceType.Task, task.TaskID.ToString(),uid);
                }
            }

            //准备返回值
            JObject result = new JObject();

            JObject jForm = new JObject();
            if(String.IsNullOrEmpty(processInfo.MobileForm))
            {
                //jForm["xclass"] = "YZSoft.form.Form5";
                //jForm["config"] = new JObject();

                jForm["xclass"] = "YZSoft.form.aspx.Form";

                if (String.IsNullOrEmpty(processInfo.FormFile))
                    throw new Exception(String.Format(Resources.YZStrings.Aspx_Process_MissForm, step.NodeName));

                jForm["config"] = JObject.FromObject(new
                {
                    aspxform = processInfo.FormFile
                });
            }
            else
            {
                string xclass;
                JObject config;
                this.ParseMobileForm(processInfo.MobileForm, out xclass, out config);
                jForm["xclass"] = xclass;
                jForm["config"] = config;
            }
            result["form"] = jForm;

            result["subModel"] = subModel.ToString();
            result["task"] = this.Serialize(task);
            result["step"] = this.Serialize(step);
            result["NodePermisions"] = this.Serialize(processInfo.NodePermision);
            result["Comments"] = step.Comments;
            result["perm"] = perm;
            result["socialInfo"] = this.SerializeSocialInfo(total,newMessageCount);
            result["steps"] = this.SerializeForTrace(steps);
            result["signcomments"] = JArray.FromObject(comments);
            result["formdataset"] = this.ToResult(formdataset,true);

            if (subModel == ProcessSubModel.Process)
            {
                result["shareTask"] = step.Share;
                result["IsConsign"] = step.IsConsignStep;

                JArray links = new JArray();
                result["links"] = links;
                foreach (Link link in processInfo.Links)
                    links.Add(this.Serialize(link, "normal"));

                result["directsend"] = directSendInfo;

                //自由流
                if (!step.IsConsignStep) //加签不显示自由流
                {
                    result["ParticipantDeclares"] = JArray.FromObject(processInfo.ParticipantDeclares);
                    result["Routing"] = processInfo.Routing;
                }
            }

            return result;
        }

        public virtual JObject GetTaskReadInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("tid");
            string permisions = request.GetString("Permisions", null);
            string uid = YZAuthHelper.LoginUserAccount;

            BPMTask task;
            CommentItemCollection comments;
            FlowDataSet formdataset;
            BPMStepCollection steps;
            JObject perm = null;
            string readForm;
            string mobileReadForm;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                task = BPMTask.Load(cn, taskid);
                comments = BPMTask.GetComments(cn, task.TaskID);
                readForm = BPMProcess.GetTaskReadForm(cn, taskid);

                formdataset = BPMProcess.GetFormDataForRead(cn, taskid);
                steps = BPMTask.GetAllSteps(cn, task.TaskID);
                mobileReadForm = BPMProcess.GetTaskReadFormMobile(cn, task.TaskID);

                perm = this.CheckPermision(cn, taskid, -1, permisions);
            }

            int total;
            int newMessageCount;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    total = YZSoft.Web.Social.SocialManager.GetMessageCount(provider, cn, YZResourceType.Task, task.TaskID.ToString());
                    newMessageCount = YZSoft.Web.Social.SocialManager.GetNewMessageCount(provider, cn, YZResourceType.Task, task.TaskID.ToString(), uid);
                }
            }

            //准备返回值
            JObject result = new JObject();

            JObject jForm = new JObject();
            if (String.IsNullOrEmpty(mobileReadForm))
            {
                //jForm["xclass"] = "YZSoft.form.Form5";
                //jForm["config"] = new JObject();

                jForm["xclass"] = "YZSoft.form.aspx.Form";

                if (String.IsNullOrEmpty(readForm))
                    throw new Exception(Resources.YZStrings.Aspx_Read_MissForm);

                jForm["config"] = JObject.FromObject(new
                {
                    aspxform = readForm
                });
            }
            else
            {
                string xclass;
                JObject config;
                this.ParseMobileForm(mobileReadForm, out xclass, out config);
                jForm["xclass"] = xclass;
                jForm["config"] = config;
            }
            result["form"] = jForm;
            result["subModel"] = "Read";
            result["task"] = this.Serialize(task);
            result["perm"] = perm;
            result["socialInfo"] = this.SerializeSocialInfo(total, newMessageCount);
            result["steps"] = this.SerializeForTrace(steps);
            result["signcomments"] = JArray.FromObject(comments);
            result["formdataset"] = this.ToResult(formdataset, true);

            return result;
        }

        public virtual JObject GetFormStateInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string app = request.GetString("app");
            string key = request.GetString("key", null);
            string formstate = request.GetString("formstate", null);

            FormApplication formApplication;
            FormState formState;
            FlowDataSet formdataset;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                formApplication = FormApplication.Open(cn, app);
                formState = FormService.GetFormStateBasicInfo(cn, app, formstate);
                formdataset = FormService.GetFormApplicationData(cn, app, formstate, key);
            }

            //准备返回值
            JObject result = new JObject();

            JObject jForm = new JObject();
            jForm["xclass"] = "YZSoft.form.aspx.Form";
            jForm["config"] = JObject.FromObject(new
            {
                aspxform = formApplication.Form
            });
            result["form"] = jForm;

            result[YZJsonProperty.success] = true;
            result["app"] = app;
            result["key"] = key;
            result["formstate"] = formstate;
            result["appShortName"] = formApplication.Name;
            result["showSaveButton"] = formState.ShowSaveButton;
            result["validationGroup"] = formState.ValidationGroup;
            result["formdataset"] = this.ToResult(formdataset, true);

            return result;
        }

        public virtual JObject GetSimulateInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string processName = request.GetString("processName");
            Version version = request.GetVersion("version");
            string permisions = request.GetString("Permisions", null);
            string uid = request.GetString("uid");

            BPMProcStep step;
            BPMTask task;
            CommentItemCollection comments;
            FlowDataSet formdataset;
            BPMStepCollection steps;
            ProcessSubModel subModel;
            JObject perm = null;
            JObject directSendInfo = null;

            User user;
            YZAuthHelper.SetAuthCookie(uid);
            try
            {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    TableIdentityCollection tableIdentities = BPMProcess.GetProcessGlobalTableIdentitys(cn, processName, version);
                    formdataset = DataSourceManager.LoadDataSetSchema(cn, tableIdentities);
                    user = User.TryGetUser(cn, uid);
                    if (user == null)
                    {
                        user = new User();
                        user.Account = uid;
                        user.DisplayName = "张三";
                    }
                }
            }
            catch (Exception e)
            {
                YZAuthHelper.ClearAuthCookie();
                throw e;
            }

            task = this.GetSimulateTask(user, processName, version);
            step = this.GetSimulateStep(task, user);

            comments = new CommentItemCollection();
            steps = this.GetSimulateSteps(task, step, user);

            subModel = ProcessSubModel.Process;
            perm = new JObject();
            directSendInfo = null;

            int total = 3;
            int newMessageCount = 1;

            //准备返回值
            JObject result = new JObject();

            JObject jForm = new JObject();
            jForm["xclass"] = "YZSoft.form.Form5";
            jForm["config"] = new JObject();
            result["form"] = jForm;

            result["subModel"] = subModel.ToString();
            result["task"] = this.Serialize(task);
            result["step"] = this.Serialize(step);
            result["NodePermisions"] = this.Serialize(NodePermision.Inform);
            result["Comments"] = step.Comments;
            result["perm"] = perm;
            result["socialInfo"] = this.SerializeSocialInfo(total, newMessageCount);
            result["steps"] = this.SerializeForTrace(steps);
            result["signcomments"] = JArray.FromObject(comments);
            result["formdataset"] = this.ToResult(formdataset, true);

            if (subModel == ProcessSubModel.Process)
            {
                result["shareTask"] = step.Share;
                result["IsConsign"] = step.IsConsignStep;

                JArray links = new JArray();
                result["links"] = links;

                result["directsend"] = directSendInfo;
            }

            return result;
        }

        public virtual JObject GetReadFormToken(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            string token = YZSecurityHelper.GenReadFormToken(taskid);

            JObject rv = new JObject();
            rv["token"] = token;
            return rv;
        }

        public virtual JObject GetStepInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("pid");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                return this.Serialize(BPMProcStep.Load(cn, stepid));
            }
        }
 
        public virtual JObject GetUniformDefine(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string aspxform = request.GetString("aspxform");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                return cn.GetUniformDefine(aspxform, true);
            }
        }

        #region 基础函数

        protected virtual JObject CheckPermision(BPMConnection cn, int taskid, int stepid, string permString)
        {
            JObject rv = new JObject();
            NodePermision[] perms = YZSecurityHelper.ParseNodePermisions(permString);

            bool[] allows = BPMTask.TaskOptPermCheckExt(cn, taskid, stepid, perms);

            for (int i = 0; i < perms.Length; i++)
            {
                rv[perms[i].ToString()] = allows[i];
            }

            return rv;
        }

        protected virtual JObject CheckPermision(PostInfo postInfo, string permString)
        {
            JObject rv = new JObject();
            NodePermision[] perms = YZSecurityHelper.ParseNodePermisions(permString);

            for (int i = 0; i < perms.Length; i++)
            {
                NodePermision perm = perms[i];
                rv[perm.ToString()] = (postInfo.NodePermision & perm) == perm;
            }

            return rv;
        }

        protected virtual JObject GetDirectSendInfo(BPMConnection cn, BPMProcStep step, SystemLinkCollection systemLinks)
        {
            if (step.RecedeFromStep == -1)
                return null;

            int idx = systemLinks.Find(SystemLinkType.DirectSend);
            SystemLink directSendLink = idx == -1 ? null : systemLinks[idx];
            if (directSendLink != null && !directSendLink.Enabled)
                return null;

            BPMStepCollection toSteps = null;
            toSteps = BPMProcStep.GetDirectSendTargetSteps(cn, step.StepID);

            if (toSteps == null || toSteps.Count == 0)
                return null;

            JObject rv = new JObject();
            JArray jtoSteps = new JArray();
            rv["toSteps"] = jtoSteps;
            rv["validationGroup"] = directSendLink.ValidationGroup;

            foreach (BPMProcStep toStep in toSteps)
            {
                JObject jtoStep = new JObject();
                jtoSteps.Add(jtoStep);

                jtoStep["NodeName"] = toStep.NodeName;
                jtoStep["User"] = YZStringHelper.GetUserShortName(toStep.RecipientAccount, toStep.RecipientFullName);
            }

            return rv;
        }

        protected virtual JObject Serialize(NodePermision perm)
        {
            JObject rv = new JObject();
            foreach (NodePermision permCheck in Enum.GetValues(typeof(NodePermision)))
                rv[permCheck.ToString()] = (perm & permCheck) == permCheck;

            return rv;
        }

        protected virtual JObject Serialize(Link link, string type)
        {
            JObject rv = new JObject();
            rv["type"] = type;
            rv["DisplayString"] = link.DisplayString;
            rv["ValidationGroup"] = link.ValidationGroup;
            rv["ProcessConfirmType"] = link.ProcessConfirmType.ToString();
            rv["PromptMessage"] = link.PromptMessage;
            return rv;
        }

        protected virtual JObject ToResult(FlowDataSet dataset, bool formTable)
        {
            JObject rv = new JObject();
            foreach (FlowDataTable table in dataset.Tables)
                rv[table.TableName] = this.ToResult(table, formTable);
            return rv;
        }

        protected virtual JObject ToResult(FlowDataTable table, bool formTable)
        {
            JObject jTable = new JObject();

            jTable["DataSource"] = TableIdentityHelper.IsDefaultDataSource(table.DataSourceName) ? "" : table.DataSourceName;
            jTable["TableName"] = table.TableName;
            jTable["FormTable"] = formTable;

            if (formTable)
            {
                jTable["IsRepeatable"] = table.IsRepeatableTable;
                jTable["AllowAddRecord"] = table.AllowAddRecord;

                if (!table.IsRepeatableTable)
                {
                    jTable["CKeyName"] = table.CKeyName;
                    jTable["CKeyValue"] = table.CKeyValue;
                }
            }

            JObject jColumns = new JObject();
            jTable["Columns"] = jColumns;
            foreach (FlowDataColumn column in table.Columns)
            {
                JObject jColumn = new JObject();
                jColumns[column.ColumnName] = jColumn;

                jColumn["ColumnName"] = column.ColumnName;
                jColumn["Type"] = (column.DataType == null ? typeof(String) : column.DataType).Name;
                if (formTable)
                {
                    jColumn["Length"] = column.MaxLength;
                    jColumn["Readable"] = column.AllowRead;
                    jColumn["Writeable"] = column.AllowWrite;
                    jColumn["AutoIncrement"] = column.AutoIncrement;
                    jColumn["PrimaryKey"] = column.PrimaryKey;
                    jColumn["DefaultValue"] = new JValue(column.DefaultValue);
                    jColumn["ShowSpoor"] = column.ShowSpoor;
                }
            }

            JArray jRows = new JArray();
            jTable["Rows"] = jRows;
            foreach (FlowDataRow row in table.Rows)
            {
                JObject jRow = new JObject();
                jRows.Add(jRow);

                foreach (string colName in row.Keys)
                    jRow[colName] = new JValue(this.FormatValue(row[colName]));
            }

            return jTable;
        }

        protected virtual object FormatValue(object value)
        {
            if (value != null)
            {
                if (value is byte[])
                    value = Convert.ToBase64String((byte[])value);
            }

            return value;
        }

        protected virtual JObject Serialize(BPMProcStep step)
        {
            JObject item = new JObject();

            item["StepID"] = step.StepID;
            item["TaskID"] = step.TaskID;
            item["ProcessName"] = step.ProcessName;
            item["ProcessVersion"] = step.ProcessVersion.ToString(2);
            item["NodeName"] = step.NodeName;
            item["NodeDisplayName"] = step.StepDisplayName;
            item["SelAction"] = step.SelActionDisplayString;
            item["SelActionDisplayString"] = step.SelActionDisplayString;
            item["OwnerAccount"] = step.OwnerAccount;
            item["OwnerDisplayName"] = step.OwnerDisplayName;
            item["AgentAccount"] = step.AgentAccount;
            item["AgentDisplayName"] = step.AgentDisplayName;
            item["RecipientAccount"] = step.RecipientAccount;
            item["RecipientDisplayName"] = step.RecipientDisplayName;
            item["HandlerAccount"] = step.HandlerAccount;
            item["HandlerDisplayName"] = step.HandlerDisplayName;
            item["Comments"] = step.Comments;
            item["Memo"] = step.Memo;
            item["FinishAt"] = step.FinishAt;
            item["ReceiveAt"] = step.ReceiveAt;
            item["Finished"] = step.Finished;
            item["IsConsignStep"] = step.IsConsignStep;
            item["Share"] = step.Share;
            item["AutoProcess"] = step.AutoProcess;

            return item;
        }

        protected virtual JArray SerializeForTrace(BPMStepCollection steps)
        {
            JArray rv = new JArray();

            foreach (BPMProcStep step in steps)
            {
                //不是有效的步骤
                if (!step.IsHumanStep)
                    continue;

                //跳过 - 无处理人的非共享任务
                if (String.IsNullOrEmpty(step.OwnerAccount) && !step.Share)
                    continue;

                rv.Add(this.Serialize(step));
            }

            return rv;
        }

        protected virtual JObject SerializeSocialInfo(int total, int newMessageCount)
        {
            JObject rv = new JObject();

            rv["total"] = total;
            rv["newMessageCount"] = newMessageCount;

            return rv;
        }

        public virtual object GetPositionInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string ouLevel = request.GetString("OULevel", null);
            string memberfullname = request.GetString("memberfullname");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                Member member = Member.FromFullName(cn, memberfullname);
                OU ou = null;
                OU parentOU = member.GetParentOU(cn);

                if (!String.IsNullOrEmpty(ouLevel))
                    ou = member.GetParentOU(cn, ouLevel);

                return new
                {
                    MemberFullName = member.FullName,
                    LeaderTitle = member.LeaderTitle,
                    Department = member.Department,
                    Level = member.Level,
                    OUName = ou == null ? "" : ou.Name,
                    OUCode = ou == null ? "" : ou.Code,
                    ParentOUName = parentOU == null ? "" : parentOU.Name,
                    ParentOUCode = parentOU == null ? "" : parentOU.Code,
                };
            }
        }

        #endregion
    }

    internal enum PostSubModel
    {
        Post,
        Draft,
        FormTemplate,
        TestingTemplate
    }

    internal enum ProcessSubModel
    {
        Process,
        Share,
        Inform,
        Indicate
    }

    internal enum ReadSubModel
    {
        Read,
        History,
        Snapshot
    }
}