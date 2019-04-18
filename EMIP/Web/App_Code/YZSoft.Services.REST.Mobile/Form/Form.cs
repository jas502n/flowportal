using System;
using System.Web;
using System.Collections.Generic;
using System.Collections;
using System.Text;
using System.Web.Configuration;
using System.Data;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;
using BPM.Resources;

namespace YZSoft.Services.REST.Mobile.Form
{
    public partial class FormHandler : YZSoft.Services.REST.Mobile.BPM.ProcessBase
    {
        protected override void AuthCheck(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string method = request.GetString("Method",null);

            if (method != "Simulate")
                YZAuthHelper.AshxAuthCheck();
        }

        public virtual JObject GetProcessForm(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int stepid = request.GetInt32("pid");
            string uid = YZAuthHelper.LoginUserAccount;

            BPMProcStep step;
            BPMTask task;
            MobileFormSetting formSetting;
            FlowDataSet formdataset;
            CommentItemCollection comments;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                step = BPMProcStep.Load(cn, stepid);
                task = BPMTask.Load(cn, step.TaskID);
                formSetting = BPMProcess.GetMobileFormSetting(cn, task.ProcessName, task.ProcessVersion);
                formdataset = BPMProcess.GetFormData(cn, stepid);
                comments = BPMTask.GetComments(cn, task.TaskID);
            }

            this.ParseMobileFormSetting(formSetting);

            //准备返回值
            JObject result = new JObject();

            //填充form域(表单信息)
            JObject fieldset;
            JArray items;
            JObject field;

            JObject form = new JObject();
            result["form"] = form;

            JArray formitems = new JArray();
            form["items"] = formitems;

            //基本信息的fieldset填充
            fieldset = new JObject();
            formitems.Add(fieldset);
            fieldset["xtype"] = "fieldset";
            fieldset["innerName"] = "Header";

            //fieldset["title", "基本信息");
            items = new JArray();
            fieldset["items"] = items;

            field = new JObject();
            items.Add(field);
            field["xclass"] = "YZSoft.form.FormHeader";
            field["padding"] = "16 10 10 16";
            field["task"] = this.Serialize(task);

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Field";
            field["label"] = Resources.YZMobile.Aspx_FormData_StepName;
            field["html"] = step.StepDisplayName;

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Field"; 
            field["label"] = Resources.YZMobile.Aspx_FormData_Date;
            field["html"] = YZStringHelper.DateToStringM(task.CreateAt);

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Field";
            field["label"] = Resources.YZMobile.Aspx_FormData_Desc;
            field["html"] = task.Description;

            //应用移动表单设定字段 - 非可重复表
            this.ApplyMasterFields(Model.Process, form, formitems, task, step, formSetting, formdataset);

            //应用移动表单设定字段 - 可重复表
            this.ApplyDetailFields(Model.Process, form, formitems, task, step, formSetting, formdataset);

            //自定义信息
            this.ApplyCustomFields(Model.Process, form, formitems, task, step, formdataset, comments);

            //控件测试 
            //this.AddTestingFields(Model.Process, form, formitems, task, step, formdataset, comments);
            
            return result;
        }

        public virtual JObject GetReadForm(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int taskid = request.GetInt32("tid");
            string uid = YZAuthHelper.LoginUserAccount;

            BPMTask task;
            MobileFormSetting formSetting;
            FlowDataSet formdataset;
            CommentItemCollection comments;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                task = BPMTask.Load(cn, taskid);
                formSetting = BPMProcess.GetMobileFormSetting(cn, task.ProcessName, task.ProcessVersion);
                formdataset = BPMProcess.GetFormDataForRead(cn, taskid);
                comments = BPMTask.GetComments(cn, task.TaskID);
            }

            this.ParseMobileFormSetting(formSetting);

            //准备返回值
            JObject result = new JObject();

            //填充form域(表单信息)
            JObject fieldset;
            JArray items;
            JObject field;

            JObject form = new JObject();
            result["form"] = form;

            JArray formitems = new JArray();
            form["items"] = formitems;

            //基本信息的fieldset填充
            fieldset = new JObject();
            formitems.Add(fieldset);
            fieldset["xtype"] = "fieldset";
            fieldset["innerName"] = "Header";

            //fieldset["title", "基本信息");
            items = new JArray();
            fieldset["items"] = items;

            field = new JObject();
            items.Add(field);
            field["xclass"] = "YZSoft.form.FormHeader";
            field["padding"] = "16 10 10 16";
            field["task"] = this.Serialize(task);

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Field";
            field["label"] = Resources.YZMobile.Aspx_FormData_Date;
            field["html"] = YZStringHelper.DateToStringM(task.CreateAt);

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Field";
            field["label"] = Resources.YZMobile.Aspx_FormData_Desc;
            field["html"] = task.Description;

            //应用移动表单设定字段 - 非可重复表
            this.ApplyMasterFields(Model.Read, form, formitems, task, null, formSetting, formdataset);

            //应用移动表单设定字段 - 可重复表
            this.ApplyDetailFields(Model.Read, form, formitems, task, null, formSetting, formdataset);

            //自定义信息
            this.ApplyCustomFields(Model.Read, form, formitems, task, null, formdataset, comments);

            //控件测试 
            //this.AddTestingFields(Model.Read,form, formitems, task, null, formdataset, comments);

            return result;
        }

        public virtual JObject GetPostForm(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string processName = request.GetString("processName");
            Version processVersion = request.GetVersion("processVersion");
            int restartTaskID = request.GetInt32("restartTaskID", -1);
            string uid = YZAuthHelper.LoginUserAccount;

            MobileFormSetting formSetting;
            FlowDataSet formdataset;
            CommentItemCollection comments = new CommentItemCollection();
            User user = new User();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                user.Open(cn, uid);
                formSetting = BPMProcess.GetMobileFormSetting(cn, processName, processVersion);
                formdataset = BPMProcess.GetFormData(cn, processName, processVersion, null, restartTaskID);
            }

            this.ParseMobileFormSetting(formSetting);

            //准备返回值
            JObject result = new JObject();

            //填充form域(表单信息)
            JObject fieldset;
            JArray items;

            JObject form = new JObject();
            result["form"] = form;

            JArray formitems = new JArray();
            form["items"] = formitems;

            //基本信息的fieldset填充
            fieldset = new JObject();
            formitems.Add(fieldset);
            fieldset["xtype"] = "fieldset";
            fieldset["hidden"] = true;
            fieldset["innerName"] = "Header";

            //fieldset["title", "基本信息");
            items = new JArray();
            fieldset["items"] = items;

            //field = new JObject();
            //items.Add(field);
            //field["xclass"] = "Ext.field.Field";
            //field["label"] = "提交人";
            //field["html"] = user.ShortName;

            //field = new JObject();
            //items.Add(field);
            //field["xclass"] = "Ext.field.Field";
            //field["label"] = Resources.YZMobile.Aspx_FormData_Date;
            //field["html"] = YZStringHelper.DateToStringM(DateTime.Today);

            //field = new JObject();
            //items.Add(field);
            //field["xclass"] = "Ext.field.Field";
            //field["label"] = "部门";
            //field["html"] = "财务部";


            //应用移动表单设定字段 - 非可重复表
            this.ApplyMasterFields(Model.Post, form, formitems, null, null, formSetting, formdataset);

            //应用移动表单设定字段 - 可重复表
            this.ApplyDetailFields(Model.Post, form, formitems, null, null, formSetting, formdataset);

            //自定义信息
            this.ApplyCustomFields(Model.Post, form, formitems, null, null, formdataset, comments);

            //控件测试 
            //this.AddTestingFields(Model.Post, form, formitems, null, null, formdataset, comments);

            return result;
        }

        //应用移动表单设定字段 - 非可重复表
        protected virtual void ApplyMasterFields(Model model, JObject form, JArray formitems, BPMTask task, BPMProcStep step, MobileFormSetting formSetting, FlowDataSet formdataset)
        {
            foreach (FlowDataTable table in formSetting.ControlDataSet.Tables)
            {
                FlowDataTable srcTable = formdataset.Tables.TryGetTable(table.TableName);
                if (srcTable == null)
                    continue;

                if (srcTable.IsRepeatableTable)
                    continue;

                JArray citems = this.GenFieldItems(model, srcTable, table);
                foreach (JObject citem in citems)
                    formitems.Add(citem);
            }
        }

        //应用移动表单设定字段 - 可重复表
        protected virtual void ApplyDetailFields(Model model, JObject form, JArray formitems, BPMTask task, BPMProcStep step, MobileFormSetting formSetting, FlowDataSet formdataset)
        {
            foreach (FlowDataTable table in formSetting.ControlDataSet.Tables)
            {
                FlowDataTable srcTable = formdataset.Tables.TryGetTable(table.TableName);
                if (srcTable == null)
                    continue;

                if (!srcTable.IsRepeatableTable)
                    continue;

                JArray citems = this.GenFieldItems(model, srcTable, table);
                foreach (JObject citem in citems)
                    formitems.Add(citem);
            }
        }

        #region 基础

        public virtual JObject TryGetFieldSet(JObject form, string tableName)
        {
            JArray formitems = form["items"] as JArray;
            foreach (JObject fieldset in formitems)
            {
                JToken value = fieldset["innerName"];
                string innerName = (value != null && value.Type == JTokenType.String) ? (string)value : null;
                if (String.Compare(innerName, tableName, true) == 0)
                    return fieldset;
            }

            return null;
        }

        protected virtual void ParseMobileFormSetting(MobileFormSetting formSetting)
        {
            foreach (FlowDataTable table in formSetting.ControlDataSet.Tables)
            {
                foreach (FlowDataColumn column in table.Columns)
                {
                    if (!String.IsNullOrEmpty(column.SParam2))
                        column.FilterValue = JObject.Parse(column.SParam2);
                    else
                        column.FilterValue = null;
                }
            }
        }

        protected virtual JArray GenFieldItems(Model model, FlowDataTable srcTable, FlowDataTable settingTable)
        {
            JArray rv = new JArray();
            
            foreach (FlowDataRow row in srcTable.Rows)
            {
                JArray items = this.GenFieldItems(model, srcTable, row, settingTable);
                if(items.Count != 0)
                {
                    JObject fieldset = new JObject();
                    rv.Add(fieldset);

                    fieldset["xtype"] = "fieldset";
                    fieldset["innerName"] = srcTable.TableName;
                    fieldset["items"] = items;
                }
            }
            
            return rv;
        }

        protected virtual JArray GenFieldItems(Model model, FlowDataTable srcTable, FlowDataRow srcRow, FlowDataTable settingTable)
        {
            JArray rv = new JArray();

            foreach (FlowDataColumn settingColumn in settingTable.Columns)
            {
                FlowDataColumn srcColumn = srcTable.Columns.TryGetColumn(settingColumn.ColumnName);
                if (srcColumn == null || !settingColumn.AllowRead)
                    continue;

                JObject fieldItem = this.GenFieldItem(model, srcTable, srcRow, srcColumn, settingColumn);
                rv.Add(fieldItem);
            }

            return rv;
        }

        protected virtual JObject GenFieldItem(Model model, FlowDataTable table, FlowDataRow row, FlowDataColumn column, FlowDataColumn setting)
        {
            object value = row[column.ColumnName];
            JObject field = new JObject();
            string valuePropertyName;
            string xclass = setting.MapTo;

            switch (xclass)
            {
                case "Ext.field.Field":
                    valuePropertyName = "html";
                    break;
                case "YZSoft.src.field.Users":
                    valuePropertyName = "stringValue";
                    break;
                default:
                    valuePropertyName = "value";
                    break;
            }

            value = this.DoRender(setting.SParam1, xclass, value);

            if (valuePropertyName == "html" && value is string)
                value = YZUtility.HtmlEncodeBR((string)value);

            field["xclass"] = xclass;
            field["label"] = setting.DisplayName;
            field[valuePropertyName] = new JValue(value);

            if (!table.IsRepeatableTable)
            {
                if (setting.AllowWrite || model == Model.Post)
                {
                    field["xdatabind"] = column.FullName;
                }
                else
                {
                    field["readOnly"] = true;
                }
            }
            else
            {
                field["readOnly"] = true;
            }

            JObject config = setting.FilterValue as JObject;
            if (config != null)
            {
                foreach (KeyValuePair<string, JToken> kv in config)
                {
                    field[kv.Key] = kv.Value;
                }
            }

            return field;
        }

        protected virtual object DoRender(string rederFunction, string fieldXClass, object value)
        {
            if (rederFunction != null)
                rederFunction = rederFunction.Trim();
            
            if (String.IsNullOrEmpty(rederFunction))
                rederFunction = "Default";
            
            MethodInfo method = this.GetType().GetMethod(rederFunction, BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public);
            if (method == null)
            {
                return Default(fieldXClass, value);
            }
            else
            {
                try
                {
                    return method.Invoke(null, new object[] { fieldXClass, value });
                }
                catch (Exception e)
                {
                    return Default(fieldXClass, String.Format("{0} : {1}", rederFunction, e.InnerException.Message));
                }
            }
        }

        protected static object Default(string fieldXClass, object value)
        {
            //SQL Server数据库中monery4位小数点处理
            //if (value is decimal)
            //    value = (decimal)Decimal.ToDouble((decimal)value);
            
            return value;
        }

        protected static object DateYMD(string fieldXClass, object value)
        {
            if (value is DateTime && fieldXClass != "Ext.field.DatePicker")
                return YZStringHelper.DateToString((DateTime)value);
 
            return value;
        }

        protected static object DateYMDHM(string fieldXClass, object value)
        {
            if (value is DateTime && fieldXClass != "Ext.field.DatePicker")
                return YZStringHelper.DateToStringM((DateTime)value);

            return value;
        }

        protected static object DateYMDHMS(string fieldXClass, object value)
        {
            if (value is DateTime && fieldXClass != "Ext.field.DatePicker")
                return YZStringHelper.DateToStringL((DateTime)value);

            return value;
        }

        protected static object Currency(string fieldXClass, object value)
        {
            return Convert.ToDecimal(value).ToString("#,##0.##");
        }

        protected static object CurrencyD3(string fieldXClass, object value)
        {
            return Convert.ToDecimal(value).ToString("#,##0.###");
        }

        protected static object CurrencyD4(string fieldXClass, object value)
        {
            return Convert.ToDecimal(value).ToString("#,##0.####");
        }

        protected static object CurrencyD0(string fieldXClass, object value)
        {
            return Convert.ToDecimal(value).ToString("#,##0");
        }

        protected static object Qty(string fieldXClass, object value)
        {
            return Convert.ToDecimal(value).ToString("0.##");
        }

        protected static object QtyD3(string fieldXClass, object value)
        {
            return Convert.ToDecimal(value).ToString("0.###");
        }

        protected static object QtyD4(string fieldXClass, object value)
        {
            return Convert.ToDecimal(value).ToString("0.####");
        }

        protected static object QtyD0(string fieldXClass, object value)
        {
            return Convert.ToDecimal(value).ToString("0");
        }

        protected static object HtmlEncode(string fieldXClass, object value)
        {
            if(value is string)
                return YZUtility.HtmlEncode((string)value);
            
            return Default(fieldXClass, value);
        }

        #endregion

        #region 测试

        public virtual void AddTestingFields(JObject form, JArray formitems, JObject fieldset, JArray items, BPMTask task, BPMProcStep step, FlowDataSet formdataset, CommentItemCollection comments)
        {
            JObject field;
            
            fieldset = new JObject();
            formitems.Add(fieldset);
            items = new JArray();
            fieldset["items"] = items;

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Text";
            field["label"] = "Text";
            field["value"] = task.ProcessName;

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Number";
            field["label"] = "Number";
            field["value"] = 123;

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.TextArea";
            field["label"] = "TextArea";
            field["value"] = task.ProcessName;

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.DatePicker";
            field["label"] = "DatePicker";
            field["value"] = DateTime.Today;

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Email";
            field["label"] = "Email";
            field["value"] = task.ProcessName;

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Password";
            field["label"] = "Password";
            field["value"] = "123";

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Checkbox";
            field["label"] = "Checkbox";
            field["value"] = true;

            field = new JObject();
            items.Add(field);
            field["xclass"] = "Ext.field.Radio";
            field["label"] = "Radio";
            field["value"] = true;

            //field = new JObject();
            //items.Add(field);
            //field["xclass"] = "Ext.field.Select";
            //field["label"] = "Select";
            //field["value"] = "SH";

            //field = new JObject();
            //items.Add(field);
            //field["xclass"] = "YZSoft$ux.field.Attachment";
            //field["label"] = "Attachment";
            //field["value"] = task.ProcessName;
        }

        #endregion

        public enum Model
        {
            Post,
            Process,
            Read
        }
    }
}