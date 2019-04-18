using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;

namespace YZSoft.Services.REST.Mobile.BPM
{
    public class TaskListHandler : YZServiceHandler
    {
        private string _deletedProcessColor = "#ddd";

        public virtual JObject GetWorkList(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path", null);
            string processName = request.GetString("processName", null);
            string uid = YZAuthHelper.LoginUserAccount;

            //过滤
            string filter = null;

            if (!String.IsNullOrEmpty(processName))
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    filter = String.Format("ProcessName=N'{0}'", provider.EncodeText(processName));
                }
            }

            //获得数据
            BPMTaskListCollection tasks = new BPMTaskListCollection();
            int rowcount;



            JObject rv = new JObject();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                tasks = cn.GetTaskList(path, uid, filter, "StepID DESC", request.Start, request.Limit, out rowcount);
                rv = this.Serialize(cn, tasks, rowcount);
            }

            return rv;
        }

        public virtual JObject GetShareTasks(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path", null);
            string processName = request.GetString("processName", null);
            string uid = YZAuthHelper.LoginUserAccount;

            //过滤
            string filter = null;

            if (!String.IsNullOrEmpty(processName))
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    filter = String.Format("ProcessName=N'{0}'", provider.EncodeText(processName));
                }
            }

            //获得数据
            BPMTaskListCollection tasks = new BPMTaskListCollection();
            int rowcount;

            JObject rv = new JObject();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                tasks = cn.GetShareTaskList(path, uid, filter, "StepID DESC", request.Start, request.Limit, out rowcount);
                rv = this.Serialize(cn, tasks, rowcount);
            }

            return rv;
        }

        public virtual object GetTaskCount(HttpContext context)
        {
            //获得数据
            int total;
            int worklist;
            int sharetask;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                total = cn.GetMyTaskCount(out worklist, out sharetask);
            }

            return new {
                total = total,
                worklist = worklist,
                sharetask = sharetask
            };
        }

        public virtual JObject GetHistoryTasks(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            HistoryTaskType taskType = request.GetEnum<HistoryTaskType>("HistoryTaskType", HistoryTaskType.AllAccessable);
            int year = request.GetString("byYear", "1") == "0" ? -1 : request.GetInt32("Year",DateTime.Today.Year);

            //获得数据
            JObject rv = new JObject();

            string taskTableFilter;
            string stepTableFilter;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                taskTableFilter = this.GetFilterStringHistoryTaskTaskTable(request, provider);
                stepTableFilter = this.GetFilterStringHistoryTaskStep(request, provider);
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                int rowcount;
                BPMTaskCollection tasks = cn.GetHistoryTasks(year, taskType, taskTableFilter, stepTableFilter, null, request.Start, request.Limit, out rowcount);

                rv[YZJsonProperty.total] = rowcount;
                JArray children = new JArray();
                rv[YZJsonProperty.children] = children;

                foreach (BPMTask task in tasks)
                {
                    JObject item = new JObject();
                    children.Add(item);

                    item["TaskID"] = task.TaskID;
                    item["SerialNum"] = task.SerialNum;
                    item["ProcessName"] = task.ProcessName;
                    item["ProcessVersion"] = task.ProcessVersion.ToString(2);
                    item["OwnerAccount"] = task.OwnerAccount;
                    item["OwnerDisplayName"] = task.OwnerDisplayName;
                    item["AgentAccount"] = task.AgentAccount;
                    item["AgentDisplayName"] = task.AgentDisplayName;
                    item["CreateAt"] = task.CreateAt;
                    item["State"] = YZJsonHelper.GetTaskStateJObject(cn, task.TaskState, task.TaskID);
                    item["Description"] = task.Description;

                    try
                    {
                        ProcessProperty property = BPMProcess.GetProcessProperty(cn, task.ProcessName, task.ProcessVersion);
                        item["ShortName"] = property.ShortName;
                        item["Color"] = property.Color;

                        if (String.IsNullOrEmpty(property.ShortName))
                            item["ShortName"] = YZStringHelper.GetProcessDefaultShortName(task.ProcessName);
                    }
                    catch (Exception)
                    {
                        item["Color"] = this._deletedProcessColor;
                        item["ShortName"] = YZStringHelper.GetProcessDefaultShortName(task.ProcessName);
                    }
                }
            }

            return rv;
        }

        protected virtual JObject Serialize(BPMConnection cn, BPMTaskListCollection tasks, int rowcount)
        {
            JObject rv = new JObject();

            //将数据转化为Json集合
            rv[YZJsonProperty.total] = rowcount;

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            foreach (BPMTaskListItem task in tasks)
            {
                JObject item = new JObject();
                children.Add(item);

                string stepDisplayName = BPMProcStep.GetStepDisplayName(task.StepName);

                item["StepID"] = task.StepID;
                item["TaskID"] = task.TaskID;
                item["SerialNum"] = task.SerialNum;
                item["ProcessName"] = task.ProcessName;
                item["ProcessVersion"] = task.ProcessVersion.ToString(2);
                item["OwnerAccount"] = task.OwnerAccount;
                item["OwnerDisplayName"] = task.OwnerDisplayName;
                item["AgentAccount"] = task.AgentAccount;
                item["AgentDisplayName"] = task.AgentDisplayName;
                item["CreateAt"] = task.CreateAt;
                item["NodeName"] = stepDisplayName;
                item["ReceiveAt"] = task.ReceiveAt;
                item["Share"] = task.Share;
                item["TimeoutFirstNotifyDate"] = task.TimeoutFirstNotifyDate;
                item["TimeoutDeadline"] = task.TimeoutDeadline;
                item["TimeoutNotifyCount"] = task.TimeoutNotifyCount;
                item["Description"] = task.Description;

                if (task.Progress != -1)
                    item["Progress"] = task.Progress;

                try
                {
                    string memberFullName = PositionManager.MemberFullNameFromID(cn, task.OwnerPositionID);
                    OU ou = Member.GetParentOU(cn, memberFullName, null);

                    item["Owner"] = String.Format("{0}/{1}", task.OwnerDisplayName, ou.Name);
                }
                catch (Exception)
                {
                    item["Owner"] = task.OwnerDisplayName;
                }

                try
                {
                    ProcessProperty property = BPMProcess.GetProcessProperty(cn, task.ProcessName, task.ProcessVersion);
                    item["ShortName"] = property.ShortName;
                    item["Color"] = property.Color;

                    if (String.IsNullOrEmpty(property.ShortName))
                        item["ShortName"] = YZStringHelper.GetProcessDefaultShortName(task.ProcessName);
                }
                catch (Exception)
                {
                    item["Color"] = this._deletedProcessColor;
                    item["ShortName"] = YZStringHelper.GetProcessDefaultShortName(task.ProcessName);
                }

                JObject perm = new JObject();
                item["perm"] = perm;
                perm["Share"] = task.Share;
            }

            return rv;
        }

        protected virtual string GetFilterStringHistoryTaskTaskTable(YZRequest request, IYZDbProvider provider)
        {
            string filter = null;

            string serialNumLike = null;
            string processNameLike = null;
            string ownerAccountLike = null;
            string agentAccountLike = null;
            string descriptionLike = null;
            string taskidEqu = null;

            string keyword = request.GetString("Keyword", null);
            if (!String.IsNullOrEmpty(keyword))
            {
                serialNumLike = String.Format("SerialNum LIKE(N'%{0}%')", provider.EncodeText(keyword));
                processNameLike = String.Format("ProcessName LIKE(N'%{0}%')", provider.EncodeText(keyword));
                ownerAccountLike = String.Format("OwnerAccount LIKE(N'%{0}%')", provider.EncodeText(keyword));
                agentAccountLike = String.Format("AgentAccount LIKE(N'%{0}%')", provider.EncodeText(keyword));
                descriptionLike = String.Format("Description LIKE(N'%{0}%')", provider.EncodeText(keyword));
                if (YZStringHelper.IsNumber(keyword))
                    taskidEqu = String.Format("TaskID={0}", keyword);
            }

            string processName = request.GetString("processName", null);
            string status = request.GetString("status", null);
            string sn = request.GetString("sn", null);
            string keywordFilter = null;

            if (!String.IsNullOrEmpty(processName))
                filter = provider.CombinCond(filter, String.Format("ProcessName=N'{0}'", provider.EncodeText(processName)));
            else
                keywordFilter = provider.CombinCondOR(keywordFilter, processNameLike);

            DateTime date1 = DateTime.MinValue;
            DateTime date2 = DateTime.MaxValue;
            date1 = request.GetDateTime("reqStart", DateTime.MinValue);
            date2 = request.GetDateTime("reqEnd", DateTime.MaxValue);

            if (date1 != DateTime.MinValue || date2 != DateTime.MaxValue)
                filter = provider.CombinCond(filter, provider.GenPeriodCond("CreateAt", date1, date2));

            if (!String.IsNullOrEmpty(status))
                filter = provider.CombinCond(filter, String.Format("State=N'{0}'", status));

            if (!String.IsNullOrEmpty(sn))
                filter = provider.CombinCond(filter, String.Format("SerialNum LIKE(N'%{0}%')", provider.EncodeText(sn)));
            else
                keywordFilter = provider.CombinCondOR(keywordFilter, serialNumLike);

            keywordFilter = provider.CombinCondOR(keywordFilter, ownerAccountLike);
            keywordFilter = provider.CombinCondOR(keywordFilter, agentAccountLike);
            keywordFilter = provider.CombinCondOR(keywordFilter, taskidEqu);
            keywordFilter = provider.CombinCondOR(keywordFilter, descriptionLike);

            filter = provider.CombinCond(filter, keywordFilter);
            return filter;
        }

        protected virtual string GetFilterStringHistoryTaskStep(YZRequest request, IYZDbProvider provider)
        {
            string filter = null;
            string status = request.GetString("status", null);

            if (YZStringHelper.EquName(status, TaskState.Running.ToString()))
            {
                string recipientUserAccount = request.GetString("RecipientUserAccount", null);
                if (!String.IsNullOrEmpty(recipientUserAccount))
                    filter = provider.CombinCond(filter, String.Format("(FinishAt IS NULL AND (OwnerAccount=N'{0}' OR AgentAccount=N'{0}'))", provider.EncodeText(recipientUserAccount)));
            }

            return filter;
        }
    }
}