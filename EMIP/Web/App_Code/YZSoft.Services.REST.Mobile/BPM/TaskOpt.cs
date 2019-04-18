using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;

namespace YZSoft.Services.REST.Mobile.BPM
{
    public class TaskOptHandler : ProcessBase
    {
        public virtual object ReturnToInitiator(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            string formdata = (string)jPost["formdata"];

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (!String.IsNullOrEmpty(formdata))
                    BPMProcess.Post(cn, formdata);

                User user = BPMTask.RecedeRestart(cn, taskid, comments);

                return new{
                    UserFriendlyName = user.FriendlyName
                };
            }
        }

        public virtual JObject RecedeBack(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("StepID");
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            string formdata = (string)jPost["formdata"];
            List<int> toStepIDs = jPost["toStepIDs"].ToObject<List<int>>();

            BPMProcStep srcStep;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (!String.IsNullOrEmpty(formdata))
                    BPMProcess.Post(cn, formdata);

                srcStep = BPMProcStep.Load(cn, stepid);

                BPMStepCollection newSteps = BPMProcStep.RecedeBack(cn, stepid, toStepIDs.ToArray(), comments);
                List<string> to = new List<string>();
                foreach (BPMProcStep step in newSteps)
                    to.Add(String.Format("{0}[{1}]", step.NodeName, YZStringHelper.GetUserShortName(step.RecipientAccount, step.RecipientFullName)));

                JObject rv = new JObject();
                rv["tosteps"] = String.Join(";", to.ToArray());

                return rv;
            }
        }

        public virtual void Reject(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            string formdata = (string)jPost["formdata"];

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (!String.IsNullOrEmpty(formdata))
                    BPMProcess.Post(cn, formdata);

                BPMTask.Reject(cn, taskid, comments);
            }
        }

        public virtual void PickbackRestart(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            string comments = request.GetString("Comments",null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMTask.PickBackRestart(cn, taskid, comments);
            }
        }

        public virtual JObject Pickback(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            int stepid = request.GetInt32("StepID");
            string comments = request.GetString("Comments",null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMProcStep step = BPMTask.PickBack(cn, taskid, stepid, comments);

                JObject rv = new JObject();
                rv["StepName"] = step.NodeName;
                rv["UserFriendlyName"] = YZStringHelper.GetUserFriendlyName(step.RecipientAccount, step.RecipientFullName);
                return rv;
            }
        }

        public virtual void Abort(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            string comments = request.GetString("Comments",null);

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                BPMTask.Abort(cn, taskid, comments);
            }
        }

        public virtual object Inform(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            BPMObjectNameCollection uids = jPost["uids"].ToObject<BPMObjectNameCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                UserCollection users = BPMTask.Inform(cn, taskid, uids, comments);

                return new {
                    UserNameList = YZStringHelper.GetUserShortNameListString(users)
                };
            }
        }

        public virtual object InviteIndicate(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            BPMObjectNameCollection uids = jPost["uids"].ToObject<BPMObjectNameCollection>();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                UserCollection users = BPMTask.InviteIndicate(cn, taskid, uids, comments);

                return new
                {
                    UserNameList = YZStringHelper.GetUserShortNameListString(users)
                };
            }
        }

        public virtual object PickupShareStep(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("StepID");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                return new
                {
                    stepid = BPMProcStep.PickupShareStep(cn, stepid)
                };
            }
        }

        public virtual void PutbackShareStep(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("StepID");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                BPMProcStep.PutbackShareStep(cn, stepid);
            }
        }

        public virtual object Transfer(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("StepID");
            string account = request.GetString("Account");
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                MemberCollection members = OrgSvr.GetUserPositions(cn, account);
                if (members.Count == 0)
                    throw new Exception(String.Format(Resources.YZMobile.Aspx_User_NoPosition, account));

                User user = BPMProcStep.Transfer(cn, stepid, members[0].FullName, comments);

                return new
                {
                    ShortName = user.ShortName
                };
            }
        }

        public virtual JObject Remind(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject jPost = request.GetPostData<JObject>();
            string comments = (string)jPost["comments"];
            JArray jTargets = (JArray)jPost["targets"];
            UserCollection users = new UserCollection();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (JObject jTarget in jTargets)
                {
                    int stepid = (int)jTarget["stepid"];
                    BPMObjectNameCollection uids = jTarget["uids"].ToObject<BPMObjectNameCollection>();
                    users.Append(BPMProcStep.Remind(cn, stepid, uids, comments));
                }
            }

            JObject rv = new JObject();
            rv[YZJsonProperty.success] = true;
            rv["UserNameList"] = YZStringHelper.GetUserNameListString(users);

            return rv;
        }
    }
}