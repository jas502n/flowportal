using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using System.Web.Security;
/// <summary>
///PortalHandler 的摘要说明
/// </summary>
public class YZApplHandler : IHttpHandler
{
    public virtual void ProcessRequest(HttpContext context)
    {
     
        YZAuthHelper.AshxAuthCheck();
        YZRequest request = new YZRequest(context);
        context.Response.AppendHeader("Access-Control-Allow-Origin", "*");
        try
        {
            string method = request.GetString("Method");
            if (!YZNameChecker.IsValidMethodName(method))
                throw new Exception("Invalid method name");
            Type type = this.GetType();
            System.Reflection.MethodInfo methodcall = type.GetMethod(method, System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Public, null, new Type[] { typeof(HttpContext) }, null);
            if (methodcall == null)
                throw new Exception(String.Format(Resources.YZStrings.Aspx_UnknowCommand, method));
            object rv;
            try
            {
                rv = methodcall.Invoke(this, new object[] { context });
            }
            catch (Exception exp)
            {
                throw exp.InnerException;
            }
            if (rv is JsonItem || rv is JsonItemCollection)
                throw new Exception("JsonItem/JsonItemCollection is Obsoleted, please replace with JObject/JArray");
            JToken jToken;
            if (rv == null)
            {
                jToken = new JObject();
            }
            else if (rv is JToken)
            {
                jToken = rv as JToken;
            }
            else
            {
                if (rv is string)
                    jToken = JValue.FromObject(rv);
                else if (rv is IEnumerable)
                    jToken = JArray.FromObject(rv);
                else
                    jToken = JValue.FromObject(rv);
            }
            jToken["code"] = 0;

           

            if (context.Request.Params["DateFormat"] == "text")
                context.Response.Write(jToken.ToString(Formatting.Indented));
            else
                context.Response.Write(jToken.ToString(Formatting.Indented, request.Converters));
        }
        catch (Exception e)
        {
            JObject rv = new JObject();
            rv["code"] = -1;
            rv["msg"] = HttpUtility.HtmlEncode(e.Message);
            context.Response.Write(rv.ToString(Formatting.Indented, request.Converters));
        }
    }
    protected virtual void AuthCheck(HttpContext context)
    {
        YZAuthHelper.AshxAuthCheck();
    }
    public virtual bool IsReusable
    {
        get
        {
            return true;
        }
    }
}