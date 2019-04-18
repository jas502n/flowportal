using BPM.Server.Notify;
using System;
using System.Collections.Generic;
using System.Text;
using BPM;
using BPM.Server.OAL;
using Newtonsoft.Json.Linq;
using System.Net;
using BPM.Server;
using Newtonsoft.Json;
using System.Threading;
using System.Collections.ObjectModel;
using System.Data;
using System.Xml;
using System.IO;

namespace WeChatProvider
{
    public class Provider : INotifyProvider
    {
        public string Name
        {
            get
            {
                return "WeChat";
            }
        }
        public NotifyContentType ContentType
        {
            get
            {
                return NotifyContentType.TitleAndMessage;
            }
        }
        public void Load()
        {
        }
        public string GetAddress(User user, UserCommonInfo userCommonInfo)
        {
            return user.Account;
        }
        public void Send(string address, string title, string message, JToken jtExtra, NotifyAttachmentCollection attachments)
        {

            try
            {

                string path = "Server.config";
                XmlDocument xmlDocument = new XmlDocument();
                MemoryStream inStream = new MemoryStream(File.ReadAllBytes(path));
                xmlDocument.Load(inStream);
                XmlNode xmlNode = xmlDocument.SelectSingleNode("//database");
                string innerText = xmlNode.SelectSingleNode("Server").InnerText;
                string innerText2 = xmlNode.SelectSingleNode("Database").InnerText;
                string innerText3 = xmlNode.SelectSingleNode("Uid").InnerText;
                string innerText4 = xmlNode.SelectSingleNode("Password").InnerText;
                string connectionString = string.Format("Data Source={0};Initial Catalog={1};User ID={2};Password={3}", new object[]
                {
            innerText,
            innerText2,
            innerText3,
            innerText4
                });
                DBUtil_APP.connectionString = connectionString;
                string sql = "Select WXID,WXAGENTID,WXSECRET,WXPUSHURL from  APP_NOTICE_CONFIG";
                DataTable dt = DBUtil_APP.Query(sql).Tables[0];
                if (dt.Rows.Count == 0)
                {
                    throw new Exception("微信推送参数为空！");
                }
                string CropId = Convert.ToString(dt.Rows[0][0]);
                string Secret = Convert.ToString(dt.Rows[0][2]);
                string AgentId = Convert.ToString(dt.Rows[0][1]);
                // string EMIPSiteUrl = Convert.ToString(dt.Rows[0][3]);
                string accessToken = WeChatManager.Instance.GetAccessToken(CropId, Secret);
                WebClient webClient = new WebClient();
                webClient.Encoding = Encoding.UTF8;
                webClient.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                webClient.Headers.Add(HttpRequestHeader.KeepAlive, "false");
                UrlBuilder urlBuilder = new UrlBuilder("https://qyapi.weixin.qq.com/cgi-bin/message/send");
                urlBuilder.QueryString["access_token"] = accessToken;
                JObject jObject = jtExtra as JObject;
                object o;
                if (string.IsNullOrEmpty(Server.EMIPSiteUrl) || jObject == null)
                {
                    o = new
                    {
                        touser = address,
                        toparty = "",
                        totag = "",
                        msgtype = "text",
                        agentid = AgentId,
                        text = new
                        {
                            content = (title + "\n" + message).Replace("<br/>", "\n")
                        },
                        safe = 0
                    };
                }
                else
                {
                    if (string.IsNullOrEmpty(title))
                    {
                        throw new Exception("title不能为null、不能为空字符串");
                    }
                    if (string.IsNullOrEmpty(message))
                    {
                        throw new Exception("message不能为null、不能为空字符串");
                    }
                    if (string.IsNullOrEmpty(Server.EMIPSiteUrl))
                    {
                        throw new BPMException(BPMExceptionType.MissEMIPSiteUrlSetting, new object[0]);
                    }
                    UrlBuilder urlBuilder2 = new UrlBuilder(Server.EMIPSiteUrl + "wechat.aspx");
                    string a = (string)jObject["Type"];
                    if (!(a == "Task.Process"))
                    {
                        if (a == "Task.Read")
                        {
                            urlBuilder2.QueryString["app"] = "openTask";
                            urlBuilder2.QueryString["tid"] = ((int)jObject["TaskID"]).ToString();
                        }
                    }
                    else
                    {
                        urlBuilder2.QueryString["app"] = "process";
                        urlBuilder2.QueryString["pid"] = ((int)jObject["StepID"]).ToString();
                    }
                    o = new
                    {
                        touser = address,
                        toparty = "",
                        totag = "",
                        msgtype = "textcard",
                        agentid = AgentId,
                        textcard = new
                        {
                            title = title,
                            description = message.Replace("<br/>", "\n"),
                            url = urlBuilder2.ToString()
                        }
                    };
                }
                JObject jObject2 = JObject.FromObject(o);
                byte[] bytes = webClient.UploadData(urlBuilder.ToString(), "POST", Encoding.UTF8.GetBytes(jObject2.ToString()));
                JObject jObject3 = JObject.Parse(Encoding.UTF8.GetString(bytes));
                if ((int)jObject3["errcode"] != 0)
                {
                    throw new Exception((string)jObject3["errmsg"]);
                }
            }
            catch (Exception ex)
            {

                throw new Exception(ex.Message);
            }

        }
        public void OnMessageGenerated(MessageCat messageCat, NotifyItem item)
        {
            object obj;
            switch (messageCat)
            {
                case MessageCat.NewTaskNormal:
                case MessageCat.TimeoutNotify:
                case MessageCat.RecedeBack:
                case MessageCat.IndicateTask:
                case MessageCat.InformTask:
                case MessageCat.ManualRemind:
                    obj = new
                    {
                        Version = 1.0,
                        MessageCat = messageCat,
                        Type = "Task.Process",
                        StepID = Context.Current.Step.StepID
                    };
                    break;
                case MessageCat.Approved:
                case MessageCat.Rejected:
                case MessageCat.Aborted:
                case MessageCat.Deleted:
                case MessageCat.StepStopHumanOpt:
                case MessageCat.StepStopVoteFinished:
                case MessageCat.NoParticipantException:
                    obj = new
                    {
                        Version = 1.0,
                        MessageCat = messageCat,
                        Type = "Task.Read",
                        TaskID = Context.Current.Task.TaskID
                    };
                    break;
                default:
                    obj = null;
                    break;
            }
            if (obj == null)
            {
                item.Extra = null;
                return;
            }
            item.Extra = JObject.FromObject(obj).ToString(Newtonsoft.Json.Formatting.None, null);
        }
    }

    public class AccessToken
    {
        public string appSecret
        {
            get;
            set;
        }
        public string accessToken
        {
            get;
            set;
        }
        public DateTime expireDate
        {
            get;
            set;
        }
    }
    public class AccessTokenCollection : KeyedCollection<string, AccessToken>
    {
        protected override string GetKeyForItem(AccessToken accessToken)
        {
            return accessToken.appSecret;
        }
    }
    public class WeChatManager
    {
        private AccessTokenCollection accessTokens = new AccessTokenCollection();
        private ReaderWriterLock RWLocker = new ReaderWriterLock();
        private int AcquireReadTimeOut = 30000;
        private int AcquireWriteTimeOut = 30000;
        private object ModifyLockObj = new object();
        private static WeChatManager _instance;
        public static WeChatManager Instance
        {
            get
            {
                return WeChatManager._instance;
            }
        }
        static WeChatManager()
        {
            WeChatManager._instance = new WeChatManager();
        }
        private void AcquireReaderLock()
        {
            this.RWLocker.AcquireReaderLock(this.AcquireReadTimeOut);
        }
        private void AcquireWriterLock()
        {
            this.RWLocker.AcquireWriterLock(this.AcquireWriteTimeOut);
        }
        private void UpgradeToWriterLock()
        {
            this.RWLocker.UpgradeToWriterLock(this.AcquireWriteTimeOut);
        }
        private void ReleaseLock()
        {
            this.RWLocker.ReleaseLock();
        }
        private void ReleaseReaderLock()
        {
            this.RWLocker.ReleaseReaderLock();
        }
        private void ReleaseWriterLock()
        {
            this.RWLocker.ReleaseWriterLock();
        }
        public virtual string GetAccessToken(string cropId, string appSecret)
        {
            this.AcquireReaderLock();
            string accessToken3;
            try
            {
                AccessToken accessToken = this.accessTokens.Contains(appSecret) ? this.accessTokens[appSecret] : null;
                if (accessToken == null || (accessToken.expireDate - DateTime.Now).TotalSeconds < 60.0)
                {
                    this.UpgradeToWriterLock();
                    WebClient expr_58 = new WebClient();
                    expr_58.Encoding = Encoding.UTF8;
                    expr_58.Headers.Add(HttpRequestHeader.ContentType, "application/json");
                    expr_58.Headers.Add(HttpRequestHeader.KeepAlive, "false");
                    UrlBuilder urlBuilder = new UrlBuilder("https://qyapi.weixin.qq.com/cgi-bin/gettoken");
                    urlBuilder.QueryString["corpid"] = cropId;
                    urlBuilder.QueryString["corpsecret"] = appSecret;
                    DateTime now = DateTime.Now;
                    byte[] bytes = expr_58.DownloadData(urlBuilder.ToString());
                    JObject jObject = JObject.Parse(Encoding.UTF8.GetString(bytes));
                    if ((int)jObject["errcode"] != 0)
                    {
                        throw new Exception((string)jObject["errmsg"]);
                    }
                    string accessToken2 = (string)jObject["access_token"];
                    double value = Convert.ToDouble(jObject["expires_in"]);
                    if (accessToken == null)
                    {
                        accessToken = new AccessToken();
                        accessToken.appSecret = appSecret;
                        this.accessTokens.Add(accessToken);
                    }
                    accessToken.accessToken = accessToken2;
                    accessToken.expireDate = now + TimeSpan.FromSeconds(value);
                }
                accessToken3 = accessToken.accessToken;
            }
            finally
            {
                this.ReleaseLock();
            }
            return accessToken3;
        }
    }
}
