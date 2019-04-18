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
        //根据流程名调用相应的函数，一个流程一个文件，参考“我的流程1、我的流程2”
        protected virtual void ApplyCustomFields(Model model, JObject form, JArray formitems, BPMTask task, BPMProcStep step, FlowDataSet formdataset, CommentItemCollection comments)
        {
            string processName = "";
            //string processName = "我的流程1";  //表单定制演示
            string functionName = "Form_" + processName;

            MethodInfo method = this.GetType().GetMethod(functionName, BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public);
            if (method != null)
            {
                method.Invoke(this, new object[] { model, form, formitems, task, step, formdataset, comments });
            }

            this.Default(model, form, formitems, task, step, formdataset, comments);
        }

        protected virtual void Default(Model model, JObject form, JArray formitems, BPMTask task, BPMProcStep step, FlowDataSet formdataset, CommentItemCollection comments)
        {
        }

        protected static object RenderLeaveType(string fieldXClass, object value)
        {
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    using (IDbCommand cmd = cn.CreateCommand())
                    {
                        IDbDataParameter pmTypeCode = provider.CreateParameter("TypeCode",value,true);
                        cmd.CommandText = String.Format("select * from YZMDLeavingType WHERE TypeCode={0}",pmTypeCode.ParameterName);
                        cmd.Parameters.Add(pmTypeCode);

                        using (YZReader reader = new YZReader(cmd.ExecuteReader()))
                        {
                            if (reader.Read())
                                return reader.ReadString("Name");
                            else
                                return value;
                        }
                    }
                }
            }
        }
    }
}
