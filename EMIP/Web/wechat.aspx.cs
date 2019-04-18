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
using YZSoft.Web.WeChat;
using YZAppAdmin;

public partial class wechat : System.Web.UI.Page
{
    
    static string corpId = "";
    static string secret = "";
    static string agentId = "";
    static object apps = new
    {
        main = new {
            title = "企信通",
            jsApiList = new string[]{
                "onMenuShareAppMessage",
                "onMenuShareWechat",
                "startRecord",
                "stopRecord",
                "onVoiceRecordEnd",
                "playVoice",
                "pauseVoice",
                "stopVoice",
                "onVoicePlayEnd",
                "uploadVoice",
                "downloadVoice",
                "chooseImage",
                "previewImage",
                "previewFile",
                "uploadImage",
                "downloadImage",
                "getNetworkType",
                "openLocation",
                "getLocation",
                "hideOptionMenu",
                "showOptionMenu",
                "hideMenuItems",
                "showMenuItems",
                "hideAllNonBaseMenuItem",
                "showAllNonBaseMenuItem",
                "closeWindow",
                "scanQRCode"
            },
            xclass = "EMIP.view.Main"
        },
        worklist = new {
            title = "流程审批",
            jsApiList = new string[]{
                "onMenuShareAppMessage",
                "onMenuShareWechat",
                "startRecord",
                "stopRecord",
                "onVoiceRecordEnd",
                "playVoice",
                "pauseVoice",
                "stopVoice",
                "onVoicePlayEnd",
                "uploadVoice",
                "downloadVoice",
                "chooseImage",
                "previewImage",
                "previewFile",
                "uploadImage",
                "downloadImage",
                "getNetworkType",
                "openLocation",
                "getLocation",
                "hideOptionMenu",
                "showOptionMenu",
                "hideMenuItems",
                "showMenuItems",
                "hideAllNonBaseMenuItem",
                "showAllNonBaseMenuItem",
                "closeWindow",
                "scanQRCode"
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
                "onMenuShareAppMessage",
                "onMenuShareWechat",
                "startRecord",
                "stopRecord",
                "onVoiceRecordEnd",
                "playVoice",
                "pauseVoice",
                "stopVoice",
                "onVoicePlayEnd",
                "uploadVoice",
                "downloadVoice",
                "chooseImage",
                "previewImage",
                "previewFile",
                "uploadImage",
                "downloadImage",
                "getNetworkType",
                "openLocation",
                "getLocation",
                "hideOptionMenu",
                "showOptionMenu",
                "hideMenuItems",
                "showMenuItems",
                "hideAllNonBaseMenuItem",
                "showAllNonBaseMenuItem",
                "closeWindow",
                "scanQRCode"
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
                "onMenuShareAppMessage",
                "onMenuShareWechat",
                "startRecord",
                "stopRecord",
                "onVoiceRecordEnd",
                "playVoice",
                "pauseVoice",
                "stopVoice",
                "onVoicePlayEnd",
                "uploadVoice",
                "downloadVoice",
                "chooseImage",
                "previewImage",
                "previewFile",
                "uploadImage",
                "downloadImage",
                "getNetworkType",
                "openLocation",
                "getLocation",
                "hideOptionMenu",
                "showOptionMenu",
                "hideMenuItems",
                "showMenuItems",
                "hideAllNonBaseMenuItem",
                "showAllNonBaseMenuItem",
                "closeWindow",
                "scanQRCode"
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
                "onMenuShareAppMessage",
                "onMenuShareWechat",
                "startRecord",
                "stopRecord",
                "onVoiceRecordEnd",
                "playVoice",
                "pauseVoice",
                "stopVoice",
                "onVoicePlayEnd",
                "uploadVoice",
                "downloadVoice",
                "chooseImage",
                "previewImage",
                "previewFile",
                "uploadImage",
                "downloadImage",
                "getNetworkType",
                "openLocation",
                "getLocation",
                "hideOptionMenu",
                "showOptionMenu",
                "hideMenuItems",
                "showMenuItems",
                "hideAllNonBaseMenuItem",
                "showAllNonBaseMenuItem",
                "closeWindow",
                "scanQRCode"
            },
            xclass = "YZSoft.form.MessageCardOpenTask",
            config = new
            {
                titleBar = false
            }
        }
    };
    static JObject jApps;

    static wechat()
    {
        jApps = JObject.FromObject(apps);
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        string code = this.Request.Params["code"];
        string app = this.Request.Params["app"];
 
        using (IYZAppAdminProvider applogin = IYZAppAdminProviderManager.DefaultProvider)
        {
            YZAppAdmin.LoginModule lm = applogin.LoadLogin();
            if (lm.WxLogin != "1")
            {
                this.Response.Clear();
                this.Response.Write("<script>alert('未开启微信登陆')</script>");
                return;
            }
            wechat.corpId = lm.WxId;
            wechat.agentId = lm.WxAgentId;
            wechat.secret = lm.WxSecret;
        }
        if (String.IsNullOrEmpty(app))
            app = "main";

        if (String.IsNullOrEmpty(code))
        {
            YZUrlBuilder uri = new YZUrlBuilder("https://open.weixin.qq.com/connect/oauth2/authorize");
            uri.QueryString["appid"] = wechat.corpId;
            uri.QueryString["response_type"] = "code";
            uri.QueryString["redirect_uri"] = this.Request.Url.ToString();
            uri.QueryString["scope"] = "SCOPE";
            uri.QueryString["state"] = "STATE#wechat_redirect";

            this.Response.Redirect(uri.ToString());
        }
        else
        {
            try
            {
                JObject jApp = jApps[app] as JObject;
                string accesstoken = WeChatManager.Instance.GetAccessToken(wechat.corpId, wechat.secret);
                string userid = WeChatManager.Instance.TryGetUserIdFromCode(accesstoken, code);
                string ticket = WeChatManager.Instance.GetJSapiTicket(accesstoken);
                string timeStamp = WeChatManager.Instance.GetTimeStamp();
                string nonceStr = YZSecurityHelper.SecurityKey;
                string url = this.Request.Url.ToString();
                string signature = WeChatManager.Instance.GenSigurate(nonceStr, timeStamp, ticket, url);

                if (String.IsNullOrEmpty(userid))
                    throw new Exception("非企业号用户！");

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpenAnonymous();
                    string regularAccount = null;
                    if (!BPM.Client.User.IsAccountExist(cn, userid, ref regularAccount))
                        throw new Exception(String.Format("当前企业号登录用户{0}，不是有效的BPM账号！", userid));

                    YZAuthHelper.SetAuthCookie(regularAccount);

                    this.Title = (string)jApp["title"];

                    JObject jAppResult = new JObject();
                    jAppResult["app"] = app;
                    jAppResult["agentId"] = wechat.agentId;
                    jAppResult["secret"] = wechat.secret;
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
            }
            catch (Exception exp)
            {
                this.Response.Redirect("~/YZSoft/assist/AspxError/default.aspx?err=" + HttpUtility.UrlEncode(exp.Message));
            }
        }
    }
}