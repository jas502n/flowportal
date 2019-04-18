<%@ WebHandler Language="C#" Class="data" %>

using System;
using System.Web;
using Newtonsoft.Json.Linq;
using YZAppAdmin;
using System.Web.Script.Serialization;
using System.Collections;
using BPM;
using BPM.Client;
using BPM.Client.Notify;
using YZSoft.Web.WeChat;
using YZSoft.Web.DingTalk;
using System.Net;
using System.Text;
public class data : YZApplHandler
{

    public JObject LoadNoticeConfig(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        MessageGroupCollection MGC = new MessageGroupCollection();
        using (BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();
            MGC = NotifyManager.GetDefaultNotifyMessages(cn);
        }
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            rv["NoticeInfo"] = JObject.FromObject(app.LoadNotice());
            rv["NotifyMessages"] = JArray.FromObject(MGC);
        }
        return rv;
    }

    public JObject SaveNoticeConfig(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        string data = request.GetString("formdata", "");
        string wechat = request.GetString("wechat", "");
        string dingtalk = request.GetString("dingtalk", "");
        JArray jwechat = JArray.FromObject(JSON.Decode(wechat));
        JArray jdingtalk = JArray.FromObject(JSON.Decode(dingtalk));
        PushNoticeModule Lm = YZApp.DataTableToModel.Hashtable2Object<PushNoticeModule>((Hashtable)JSON.Decode(data));
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            app.SaveNotice(Lm);
        }

        using (BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();

            MessageGroupCollection messageGroups = NotifyManager.GetDefaultNotifyMessages(cn);
            for (int i = 1; i < messageGroups.Count; i++)
            {
                for (int j = 0; j < messageGroups[i].MessageItems.Count; j++)
                {
                    if (messageGroups[i].MessageItems[j].ProviderName == "WeChat")
                    {
                        messageGroups[i].MessageItems[j].Title = jwechat[(i - 1)]["Title"].ToString();
                        messageGroups[i].MessageItems[j].Message = jwechat[(i - 1)]["Message"].ToString();
                        messageGroups[i].MessageItems[j].Enabled = Convert.ToBoolean(jwechat[(i - 1)]["Enabled"]);
                    }
                    if (messageGroups[i].MessageItems[j].ProviderName == "DingTalk")
                    {
                        messageGroups[i].MessageItems[j].Title = jdingtalk[(i - 1)]["Title"].ToString();
                        messageGroups[i].MessageItems[j].Message = jdingtalk[(i - 1)]["Message"].ToString();
                        messageGroups[i].MessageItems[j].Enabled = Convert.ToBoolean(jdingtalk[(i - 1)]["Enabled"]);
                    }
                }
            }


            NotifyManager.SaveDefaultNotifyMessages(cn, messageGroups);
        }

        return rv;
    }


    public JObject WxLogSuccess(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        int page = request.GetInt32("page", 0);
        int limit = request.GetInt32("limit", 0);
        int start = limit * page - limit + 1;//开始行数
        int end = limit * page;//结束行数

        string sql = "select * from (select MessageID,Address,Title,Message,convert(varchar(30),CreateAt,120) as Ca,convert(varchar(30),SendAt,120) as Sa,Extra, ROW_NUMBER() OVER(Order by CreateAt desc) AS RowId from BPMSysMessagesSucceed where ProviderName='WeChat' ) as b where RowId between " + start + " and " + end + "";
        JObject rv = new JObject();
        rv["data"] = JArray.FromObject(DBUtil_APP.Select(sql));
        rv["count"] = DBUtil_APP.Select("select * from  BPMSysMessagesSucceed  where ProviderName='WeChat'").Count;
        return rv;
    }
    public JObject WxLogError(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        int page = request.GetInt32("page", 0);
        int limit = request.GetInt32("limit", 0);
        int start = limit * page - limit + 1;//开始行数
        int end = limit * page;//结束行数
        string sql = "select * from (select MessageID,Address,Title,Message,convert(varchar(30),CreateAt,120) as Ca,replace(CONVERT(nvarchar(max),Error),'''','') as  Error,Extra, ROW_NUMBER() OVER(Order by CreateAt desc) AS RowId from BPMSysMessagesFailed where ProviderName='WeChat' ) as b where RowId between " + start + " and " + end + "";
        JObject rv = new JObject();
        rv["data"] = JArray.FromObject(DBUtil_APP.Select(sql));
        rv["count"] = DBUtil_APP.Select("select * from  BPMSysMessagesFailed  where ProviderName='WeChat'").Count;
        return rv;
    }

    public JObject DdLogSuccess(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        int page = request.GetInt32("page", 0);
        int limit = request.GetInt32("limit", 0);
        int start = limit * page - limit + 1;//开始行数
        int end = limit * page;//结束行数

        string sql = "select * from (select MessageID,Address,Title,Message,convert(varchar(30),CreateAt,120) as Ca,convert(varchar(30),SendAt,120) as Sa,Extra, ROW_NUMBER() OVER(Order by CreateAt desc) AS RowId from BPMSysMessagesSucceed where ProviderName='DingTalk' ) as b where RowId between " + start + " and " + end + "";
        JObject rv = new JObject();
        rv["data"] = JArray.FromObject(DBUtil_APP.Select(sql));
        rv["count"] = DBUtil_APP.Select("select * from  BPMSysMessagesSucceed  where ProviderName='DingTalk'").Count;
        return rv;
    }
    public JObject DdLogError(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        int page = request.GetInt32("page", 0);
        int limit = request.GetInt32("limit", 0);
        int start = limit * page - limit + 1;//开始行数
        int end = limit * page;//结束行数
        string sql = "select * from (select MessageID,Address,Title,Message,convert(varchar(30),CreateAt,120) as Ca,replace(CONVERT(nvarchar(max),Error),'''','') as  Error,Extra, ROW_NUMBER() OVER(Order by CreateAt desc) AS RowId from BPMSysMessagesFailed where ProviderName='DingTalk' ) as b where RowId between " + start + " and " + end + "";
        JObject rv = new JObject();
        rv["data"] = JArray.FromObject(DBUtil_APP.Select(sql));
        rv["count"] = DBUtil_APP.Select("select * from  BPMSysMessagesFailed  where ProviderName='DingTalk'").Count;
        return rv;
    }



    public JObject WxPushTest(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        string WxAgentid = request.GetString("WxAgentid", "");
        string WxId = request.GetString("WxId", "");
        string WxSecret = request.GetString("WxSecret", "");
        string Account = request.GetString("Account", "");
        string WxContent = request.GetString("WxContent", "");
        string accessToken = WeChatManager.Instance.GetAccessToken(WxId, WxSecret);
        WebClient webClient = new WebClient();
        webClient.Encoding = Encoding.UTF8;
        webClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
        webClient.Headers.Add(HttpRequestHeader.KeepAlive, "false");
        UrlBuilder urlBuilder = new UrlBuilder("https://qyapi.weixin.qq.com/cgi-bin/message/send");
        urlBuilder.QueryString["access_token"] = accessToken;
        object o = new
        {
            touser = Account,
            toparty = "",
            totag = "",
            msgtype = "text",
            agentid = WxAgentid,
            text = new
            {
                content = WxContent
            },
            safe = 0
        };
        JObject jObject2 = JObject.FromObject(o);
        byte[] bytes = webClient.UploadData(urlBuilder.ToString(), "POST", Encoding.UTF8.GetBytes(jObject2.ToString()));
        JObject jObject3 = JObject.Parse(Encoding.UTF8.GetString(bytes));
        if ((int)jObject3["errcode"] != 0)
        {
            throw new Exception((string)jObject3["errmsg"]);
        }
        JObject rv = new JObject();
        return rv;
    }
    public JObject DdPushTest(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        string DdAgentid = request.GetString("DdAgentid", "");
        string DdId = request.GetString("DdId", "");
        string DdSecret = request.GetString("DdSecret", "");
        string Account = request.GetString("Account", "");
        string DdContent = request.GetString("DdContent", "");
        string accessToken = DingTalkManager.Instance.GetAccessToken(DdId, DdSecret);
        WebClient webClient = new WebClient();
        webClient.Encoding = Encoding.UTF8;
        webClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
        webClient.Headers.Add(HttpRequestHeader.KeepAlive, "false");
        UrlBuilder urlBuilder = new UrlBuilder("https://oapi.dingtalk.com/message/send");
        urlBuilder.QueryString["access_token"] = accessToken;
        object o = new
        {
            touser = Account,
            toparty = "",
            agentid = DdAgentid,
            msgtype = "text",
            text = new
            {
                content = DdContent
            }
        };
        JObject jObject2 = JObject.FromObject(o);
        byte[] bytes = webClient.UploadData(urlBuilder.ToString(), "POST", Encoding.UTF8.GetBytes(jObject2.ToString()));
        JObject jObject3 = JObject.Parse(Encoding.UTF8.GetString(bytes));
        if ((int)jObject3["errcode"] != 0)
        {
            throw new Exception((string)jObject3["errmsg"]);
        }
        JObject rv = new JObject();
        return rv;
    }
}

