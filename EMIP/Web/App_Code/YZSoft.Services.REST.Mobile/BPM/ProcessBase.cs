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
    public class ProcessBase : YZServiceHandler
    {
        protected virtual BPMTask GetSimulateTask(User user, string processName, Version version)
        {
            BPMTask task = new BPMTask();
            task.TaskID = 120001;
            task.ProcessName = processName;
            task.OwnerPositionID = 1003;
            task.OwnerAccount = user.Account;

            task.OwnerFullName = user.DisplayName;
            task.AgentAccount = null;
            task.AgentFullName = null;
            task.CreateAt = DateTime.Now.AddDays(-1);
            task.Description = "采购申请，总金额：￥18,888.00，事由：BPM服务。";
            task.FinishAt = DateTime.MinValue;
            task.TaskState = TaskState.Running;
            task.SerialNum = String.Format("PR{0}0001", DateTime.Now.ToString("yyyyMM"));
            task.OptUser = null;
            task.OptAt = DateTime.MinValue;
            task.OptMemo = null;
            task.FormDataSetID = -1;
            task.ParentTaskID = -1;
            task.ParentStepID = -1;
            task.ParentStepName = null;
            task.ProcessVersion = version;
            task.ParentServerIdentity = null;
            task.ReturnToParent = false;
            task.UrlParams = null;
            return task;
        }

        protected virtual BPMProcStep GetSimulateStep(BPMTask task, User user)
        {
            BPMProcStep step = new BPMProcStep();
            step.StepID = 13009;
            step.TaskID = 12001;
            step.ProcessName = task.ProcessName;
            step.ProcessVersion = task.ProcessVersion;
            step.NodeName = "经理审批";
            step.OwnerAccount = user.Account;
            step.OwnerPositionID = 1006;
            step.OwnerFullName = user.DisplayName;
            step.AgentAccount = null;
            step.AgentFullName = null;
            step.ReceiveAt = DateTime.Now.AddHours(-2);
            step.FinishAt = DateTime.MinValue;
            step.SelAction = null;
            step.Share = false;
            step.Memo = null;
            step.IsHumanStep = true;
            step.HandlerAccount = null;
            step.HandlerFullName = null;
            step.SubNodeName = null;
            step.AutoProcess = false;
            step.Comments = null;
            step.UsedMinutes = -1;
            step.UsedMinutesWork = -1;
            step.RecedeFromStep = -1;
            step.TimeoutNotifyCount = 0;
            step.RisedConsignID = -1;
            step.BelongConsignID = -1;
            step.ConsignOwnerAccount = null;
            step.TimeoutFirstNotifyDate = DateTime.Now.AddDays(1);
            step.TimeoutDeadline = DateTime.Now.AddDays(2);
            step.StandardMinutesWork = 24 * 60;
            step.BatchApprove = false;
            step.Posted = false;
            step.FormSaved = false;
            step.ParentStepID = 01;
            step.NodePath = null;

            return step;
        }

        protected virtual BPMStepCollection GetSimulateSteps(BPMTask task, BPMProcStep step, User user)
        {
            BPMStepCollection steps = new BPMStepCollection();
            steps.Add(step);

            BPMProcStep step1;

            step1 = new BPMProcStep();
            step1.StepID = 13002;
            step1.TaskID = 12001;
            step1.NodeName = "部长审批";
            step1.FinishAt = DateTime.Now.AddDays(-2);
            step1.OwnerAccount = "44144";
            step1.OwnerFullName = "李四";
            step1.HandlerAccount = "44144";
            step1.HandlerFullName = "李四";
            step1.SelAction = "同意";
            step1.Comments = "很棒！";
            steps.Add(step1);

            step1 = new BPMProcStep();
            step1.StepID = 13001;
            step1.TaskID = 12001;
            step1.NodeName = "开始";
            step1.FinishAt = DateTime.Now.AddDays(-2);
            step1.OwnerAccount = "33133";
            step1.OwnerFullName = "张三";
            step1.HandlerAccount = "33133";
            step1.HandlerFullName = "张三";
            step1.SelAction = "提交";
            step1.Comments = "";
            steps.Add(step1);

            return steps;
        }

        protected virtual DataSet ParseFormData(JObject jFormData)
        {
            DataSet dataset = new DataSet("FormData");

            foreach (JProperty prop in jFormData.Properties())
            {
                int index = prop.Name.LastIndexOf('.');
                if (index == -1)
                    throw new Exception(String.Format("Invalid field name:{0}", prop.Name));

                string tableName = prop.Name.Substring(0, index);
                string columnName = prop.Name.Substring(index + 1);

                DataTable table = dataset.Tables[tableName];
                if (table == null)
                {
                    table = new DataTable(tableName);
                    dataset.Tables.Add(table);
                }

                DataColumn column = table.Columns[columnName];
                if (column == null)
                {
                    column = new DataColumn(columnName);
                    table.Columns.Add(column);
                }

                DataRow row;
                if (table.Rows.Count == 0)
                {
                    row = table.NewRow();
                    table.Rows.Add(row);
                }
                else
                    row = table.Rows[0];

                row[column] = (string)prop.Value;

            }

            return dataset;
        }

        protected virtual JObject Serialize(BPMTask task)
        {
            JObject rv = new JObject();

            rv["ProcessName"] = task.ProcessName;
            rv["OwnerAccount"] = task.OwnerAccount;
            rv["OwnerShortName"] = task.OwnerDisplayName;
            rv["AgentAccount"] = task.AgentAccount;
            rv["AgentShortName"] = task.AgentDisplayName;
            rv["ProcessVersion"] = task.ProcessVersion.ToString(2);
            rv["SerialNum"] = task.SerialNum;
            rv["TaskID"] = task.TaskID;
            rv["TaskState"] = task.TaskState.ToString();

            return rv;
        }

        protected virtual void ParseMobileForm(string mobileForm,out string xclass,out JObject config)
        {
            if (String.IsNullOrEmpty(mobileForm))
            {
                xclass = "";
                config = new JObject();
                return;
            }

            int index = mobileForm.IndexOf('?');
            if (index == -1)
            {
                xclass = mobileForm;
                config = new JObject();
                return;
            }

            xclass = mobileForm.Substring(0, index);
            YZUrlBuilder builder = new YZUrlBuilder(xclass);
            config = JObject.FromObject(builder.QueryString);      
        }
    }
}