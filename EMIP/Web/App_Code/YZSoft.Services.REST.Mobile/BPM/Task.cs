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
    public class TaskHandler : YZServiceHandler
    {
        public virtual JArray GetPickbackableSteps(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            JObject rv = new JObject();

            //获得数据
            BPMStepCollection steps = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                steps = BPMTask.GetPickbackableSteps(cn, taskid);
            }

            return this.Serialize(steps);
        }

        public virtual JArray GetRecedeBackSteps(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("StepID");
            JObject rv = new JObject();

            //获得数据
            BPMStepCollection steps = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                steps = BPMProcStep.GetRecedableToSteps(cn, stepid);
            }

            return this.Serialize(steps);
        }

        public virtual JArray GetRemindTarget(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");
            JArray rv = new JArray();

            //获得数据
            BPMStepCollection steps = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                steps = BPMTask.GetUnFinishedHumanSteps(cn, taskid);

                foreach (BPMProcStep step in steps)
                {

                    if (step.Share && String.IsNullOrEmpty(step.OwnerAccount))
                    {
                        UserCollection users = BPMProcStep.GetShareUsers(cn, step.StepID);
                        foreach (User user in users)
                        {
                            JObject jStep = new JObject();
                            rv.Add(jStep);

                            jStep["StepID"] = step.StepID;
                            jStep["Share"] = true;
                            jStep["NodeDisplayName"] = step.StepDisplayName;
                            jStep["Account"] = user.Account;
                            jStep["ShortName"] = user.ShortName;
                            jStep["ElapsedMinutes"] = (DateTime.Now - step.ReceiveAt).TotalMinutes;
                        }
                    }
                    else
                    {
                        JObject jStep = new JObject();
                        rv.Add(jStep);

                        jStep["StepID"] = step.StepID;
                        jStep["Share"] = false;
                        jStep["NodeDisplayName"] = step.StepDisplayName;
                        jStep["Account"] = step.RecipientAccount;
                        jStep["ShortName"] = step.RecipientDisplayName;
                        jStep["ElapsedMinutes"] = (DateTime.Now - step.ReceiveAt).TotalMinutes;
                    }
                }
            }

            return rv;
        }

        public virtual object GetTaskInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("TaskID");

            BPMTask task = new BPMTask();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                task.Open(cn, taskid);
            }

            return new
            {
                TaskID = task.TaskID,
                ProcessName = task.ProcessName,
                ProcessVersion = task.ProcessVersion.ToString(2),
                SerialNum = task.SerialNum,
            };
        }

        protected virtual JArray Serialize(BPMStepCollection steps)
        {
            JArray rv = new JArray();
            foreach (BPMProcStep step in steps)
            {
                rv.Add(this.Serialize(step));
            }

            return rv;
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
    }
}