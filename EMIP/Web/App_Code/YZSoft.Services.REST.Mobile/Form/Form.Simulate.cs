using System;
using System.Web;
using System.Collections.Generic;
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

namespace YZSoft.Services.REST.Mobile.Form
{
    partial class FormHandler
    {
        public virtual JObject GetSimulateForm(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string processName = request.GetString("processName");
            Version version = request.GetVersion("version");
            string uid = request.GetString("uid");

            BPMProcStep step;
            BPMTask task;
            MobileFormSetting formSetting;
            FlowDataSet formdataset;
            CommentItemCollection comments;

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

            JObject post = request.GetPostData<JObject>();
            if (post != null)
                formSetting = post.ToObject<MobileFormSetting>();
            else
                formSetting = new MobileFormSetting();

            comments = new CommentItemCollection();

            for (int i = 0; i < formdataset.Tables.Count; i++)
            {
                FlowDataTable table = formdataset.Tables[i];
                if (!table.IsRepeatableTable)
                {
                    table.Rows.Add(this.CreateNewRow(table, i, 0));
                }
                else
                {
                    table.Rows.Add(this.CreateNewRow(table, i, 0));
                    table.Rows.Add(this.CreateNewRow(table, i, 1));
                }
            }

            //附件的演示数据会导致错误（附件ID没有），必须处理(将附件数据置空)
            foreach (FlowDataTable table in formSetting.ControlDataSet.Tables)
            {
                FlowDataTable dataTable = formdataset.Tables.TryGetTable(table.TableName);
                if (dataTable != null)
                {
                    foreach (FlowDataColumn column in table.Columns)
                    {
                        if (column.MapTo == "YZSoft$ux.field.Attachment")
                        {
                            foreach (FlowDataRow row in dataTable.Rows)
                            {
                                row[column.ColumnName] = ""; //不能设置null,设置null附件控件表现形式不同
                            }
                        }
                    }
                }
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
            field["html"] = YZStringHelper.DateToStringL(task.CreateAt);

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

        #region 基础

        protected virtual FlowDataRow CreateNewRow(FlowDataTable table, int tableIndex, int rowIndex)
        {
            FlowDataRow row = new FlowDataRow();
            for (int i = 0; i < table.Columns.Count; i++)
            {
                FlowDataColumn column = table.Columns[i];
                row[column.ColumnName] = GetDemoValue(column, tableIndex, rowIndex, i);
            }

            return row;
        }

        protected virtual object GetDemoValue(FlowDataColumn column, int tableIndex, int rowIndex, int columnIndex)
        {
            switch (Type.GetTypeCode(column.DataType))
            {
                case TypeCode.Boolean:
                    return true;
                case TypeCode.Byte:
                case TypeCode.SByte:
                case TypeCode.UInt16:
                case TypeCode.UInt32:
                case TypeCode.UInt64:
                case TypeCode.Int16:
                case TypeCode.Int32:
                case TypeCode.Int64:
                case TypeCode.Char:
                    return (rowIndex + 1) * 10 + (columnIndex + 1);
                case TypeCode.Single:
                    return (Single)(rowIndex + 1) * 10 + (Single)(columnIndex + 1) + (Single)0.123;
                case TypeCode.Double:
                    return (Double)(rowIndex + 1) * 10000 + (Double)(columnIndex + 1) + (Double)0.123;
                case TypeCode.Decimal:
                    return (Decimal)(rowIndex + 1) * 10000 + (Decimal)(columnIndex + 1) + (Decimal)0.123;
                case TypeCode.DBNull:
                case TypeCode.Empty:
                    return null;
                case TypeCode.DateTime:
                    return DateTime.Now;
                case TypeCode.String:
                    return String.Format("{0}1\n{0}2\n<font color=red>{0}3</font>", column.ColumnName);
                default:
                    if (column.DataType == typeof(Guid))
                    {
                        return Guid.NewGuid();
                    }
                    else
                    {
                        try
                        {
                            return Activator.CreateInstance(column.DataType);
                        }
                        catch (Exception)
                        {
                            return null;
                        }
                    }
            }
        }

        #endregion
    }
}
