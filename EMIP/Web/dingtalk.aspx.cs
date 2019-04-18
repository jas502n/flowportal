using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using YZSoft.Web.DingTalk;
using YZAppAdmin;

public partial class dingtalk : System.Web.UI.Page
{
    static string corpId = "";
    static string secret = "";
    static string agentId = "";
    static string appkey = "";
    static object apps = new
    {
        main = new
        {
            title = "企信通",
            jsApiList = new string[]{
                "biz.util.uploadImage",
                "biz.util.uploadImageFromCamera",
                "biz.util.uploadAttachment",
                "biz.cspace.saveFile"
            },
            xclass = "EMIP.view.Main"
        },
        worklist = new
        {
            title = "流程审批",
            jsApiList = new string[]{
            },
            xclass = "YZSoft.task.MainPanel",
            config = new
            {
                titleBar = false
            }
        },
        post = new
        {
            title = "流程发起",
            jsApiList = new string[]{
            },
            xclass = "YZSoft.request.MainPanel",
            config = new
            {
                titleBar = false
            }
        },
        process = new
        {
            title = "任务审批", //打开表单处理
            jsApiList = new string[]{
            },
            xclass = "YZSoft.form.MessageCardProcess",
            config = new
            {
                titleBar = false
            }
        },
        openTask = new
        {
            title = "任务查看", //打开表单查看
            jsApiList = new string[]{
            },
            xclass = "YZSoft.form.MessageCardOpenTask",
            config = new
            {
                titleBar = false
            }
        }
    };
    static JObject jApps;

    static dingtalk()
    {
        jApps = JObject.FromObject(apps);
    }

    //http://blog.csdn.net/jeryjeryjery/article/details/53199992
    //https://github.com/injekt/openapi-demo-java/blob/master/WebContent/javascripts/demo.js?spm=a219a.7629140.0.0.nWbroF&file=demo.js
    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            string code = this.Request.Params["code"];
            string app = this.Request.Params["app"];
            using (IYZAppAdminProvider applogin = IYZAppAdminProviderManager.DefaultProvider)
            {
                YZAppAdmin.LoginModule lm = applogin.LoadLogin();
                if (lm.DdLogin != "1")
                {
                    this.Response.Clear();
                    this.Response.Write("<script>alert('未开启钉钉登陆')</script>");
                    return;
                

                }
                dingtalk.appkey = lm.DdId;
                dingtalk.secret = lm.DdSecret;
                dingtalk.agentId = lm.DdAgentId;
                dingtalk.corpId = lm.DdCorpId;
            }
            if (String.IsNullOrEmpty(app))
                app = "main";

            JObject jApp = jApps[app] as JObject;
            string corpId = dingtalk.corpId;
            string appSecret = dingtalk.secret;
            string accesstoken = DingTalkManager.Instance.GetAccessToken(appkey, appSecret);
            string ticket = DingTalkManager.Instance.GetJSapiTicket(accesstoken);
            string timeStamp = DingTalkManager.Instance.GetTimeStamp();
            string nonceStr = YZSecurityHelper.SecurityKey;
            string url = this.Request.Url.ToString();
            string signature = DingTalkManager.Instance.GenSigurate(nonceStr, timeStamp, ticket, url);

            this.Title = (string)jApp["title"];

            JObject jAppResult = new JObject();
            jAppResult["app"] = app;
            jAppResult["agentId"] = dingtalk.agentId;
            jAppResult["secret"] = dingtalk.secret;
            jAppResult["title"] = jApp["title"];
            jAppResult["corpId"] = corpId;
            jAppResult["timeStamp"] = timeStamp;
            jAppResult["nonceStr"] = nonceStr;
            jAppResult["signature"] = signature;
            jAppResult["jsApiList"] = jApp["jsApiList"];
            jAppResult["xclass"] = jApp["xclass"];

            JObject jConfig = jApp["config"] == null ? new JObject() : JObject.FromObject(jApp["config"]);
            jAppResult["config"] = jConfig;
            foreach (string key in this.Request.QueryString.Keys)
                jConfig[key] = this.Request.QueryString[key];

            this._litApp.Text = jAppResult.ToString(Formatting.Indented, YZJsonHelper.Converters);
        }
        catch (Exception exp)
        {
            this.Response.Redirect("~/YZSoft/assist/AspxError/default.aspx?err=" + HttpUtility.UrlEncode(exp.Message));
        }
    }
}