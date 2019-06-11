using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using System.Security.Cryptography;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;
using YZSoft.Web.Mobile;
using Top.Api;
//using Top.Api.Request;
//using Top.Api.Response;
using YZSoft.Web.Validation;
using YZSoft.Web.DingTalk;
using YZAppAdmin;

namespace YZSoft.Services.REST.Mobile.core
{
    public class AuthHandler : YZServiceHandler
    {
        protected override void AuthCheck(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string method = request.GetString("method");

            if (NameCompare.EquName(method, "Login") ||
                NameCompare.EquName(method, "LoginTrial") ||
                NameCompare.EquName(method, "SendLoginValidationCode") ||
                NameCompare.EquName(method, "GetPublicKey") ||
                NameCompare.EquName(method, "DingTalkLogin"))
                return;

            YZAuthHelper.AshxAuthCheck();
        }

        public virtual JObject GetPublicKey(HttpContext context)
        {
            RSACryptoServiceProvider rsaProvider = new RSACryptoServiceProvider(1024);
            string publicKey = rsaProvider.ToXmlString(false);
            string privateKey = rsaProvider.ToXmlString(true);

            string keystore = YZTempStorageManager.CurrentStore.Save(privateKey);
            string publicKeyPKCS = YZSecurityHelper.RSAPublicKeyDotNet2PCKS(publicKey);

            JObject rv = new JObject();
            rv["success"] = true;
            rv["publicKey"] = publicKeyPKCS;
            rv["keystore"] = keystore;
            return rv;
        }

        public virtual JObject Login(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string lang = request.GetString("lang", "zh-chs");
            string uid = request.GetString("uid");
            string pwd = request.GetString("pwd", null);
            bool isapp = request.GetBool("isapp");
            string cordova = request.GetString("cordova");
            string model = request.GetString("model");
            string name = request.GetString("name", model);
            string platform = request.GetString("platform");
            string uuid = request.GetString("uuid");
            string version = request.GetString("version");
            string manufacturer = request.GetString("manufacturer");
            bool isVirtual = request.GetBool("isVirtual",false);
            string serial = request.GetString("serial");
            bool validationPanelShow = request.GetBool("validationPanelShow");
            string smsGuid = request.GetString("smsGuid", null);
            string vcode = request.GetString("vcode", null);
            string keystore = request.GetString("keystore", null);

            //用私钥解密
            if (!String.IsNullOrEmpty(keystore))
            {
                string privateKey = (string)YZTempStorageManager.CurrentStore.Load(keystore);

                RSACryptoServiceProvider rsaProvider = new RSACryptoServiceProvider(1024);
                rsaProvider.FromXmlString(privateKey);

                uid = System.Text.Encoding.UTF8.GetString(rsaProvider.Decrypt(Convert.FromBase64String(uid), false));
                pwd = System.Text.Encoding.UTF8.GetString(rsaProvider.Decrypt(Convert.FromBase64String(pwd), false));
            }

            Device device = null;
            SMS sms = null;
            JObject rv;

            if (isapp)
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {
                        device = DeviceManager.TryGetDevice(provider, cn, uid, uuid);
                    }
                }

                //设备禁用
                if (device != null && device.Disabled)
                {
                    rv = new JObject();
                    rv[YZJsonProperty.success] = false;
                    rv["prompt"] = true;
                    rv[YZJsonProperty.errorMessage] = Resources.YZMobile.Aspx_Auth_DeviceDisabled;
                    return rv;
                }

                //账号保护
                if (device == null)
                {
                    bool IsAppLoginProtected;
                    using (BPMConnection cn = new BPMConnection())
                    {
                        cn.WebOpenAnonymous();
                        IsAppLoginProtected = User.IsAppLoginProtected(cn, uid);
                    }

                    if (IsAppLoginProtected)
                    {
                        if (!validationPanelShow)
                        {
                            rv = new JObject();
                            rv[YZJsonProperty.success] = false;
                            rv["needSmsValidation"] = true;
                            rv[YZJsonProperty.errorMessage] = Resources.YZMobile.Aspx_Auth_StrangerDevice;
                            return rv;
                        }

                        if (String.IsNullOrEmpty(smsGuid))
                            throw new Exception(Resources.YZMobile.Aspx_Auth_GetValidationCodeFirst);
               
                        using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                        {
                            using (IDbConnection cn = provider.OpenConnection())
                            {
                                sms = SMSManager.TryGetSMS(provider, cn, smsGuid);
                            }
                        }

                        if (sms == null)
                            throw new Exception(Resources.YZMobile.Aspx_Auth_GetValidationCodeAgain);

                        if (sms.ValidationCode != vcode)
                            throw new Exception(Resources.YZMobile.Aspx_Auth_IncorrectValidationCode);

                        if (sms.ExpireDate < DateTime.Now)
                            throw new Exception(Resources.YZMobile.Aspx_Auth_GetValidationCodeAgain);
                    }
                }
            }

            if (String.IsNullOrEmpty(uid) /*|| String.IsNullOrEmpty(password)*/)
                throw new Exception(Resources.YZStrings.Aspx_Login_EnterAccountTip);

            string realAccount = null;
            string token = null;
            if (!BPMConnection.Authenticate(YZAuthHelper.BPMServerName, YZAuthHelper.BPMServerPort, uid, pwd, out realAccount, out token))
                throw new Exception(Resources.YZStrings.Aspx_Login_Fail);

            YZAuthHelper.SetAuthCookie(realAccount, token);
            YZAuthHelper.SetLangSession(YZCultureInfoParse.Parse(lang, YZCultureInfoParse.DefauleCultureInfo).LCID);
            YZAuthHelper.ClearLogoutFlag();

            rv = this.GenLoginResult(realAccount,false);

            //登录成功后处理
            if (isapp)
            {
                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {
                        if (device != null)
                        {
                            device.LastLogin = DateTime.Now;
                            DeviceManager.Update(provider, cn, device);
                        }
                        else
                        {
                            device = new Device();
                            device.Account = realAccount;
                            device.UUID = uuid;
                            device.Name = name;
                            device.Model = model;
                            device.Description = String.Format("{0} {1} {2} {3}", manufacturer, model, platform, version);
                            device.Disabled = false;
                            device.RegisterAt = DateTime.Now;
                            device.LastLogin = device.RegisterAt;
                            DeviceManager.Insert(provider, cn, device);
                        }

                        if (sms != null)
                            SMSManager.DeleteSMS(provider, cn, sms.ItemGUID);
                    }
                }
            }

            return rv;
        }

        public virtual void Logout(HttpContext context)
        {
            LoginManager.OnSignOut();
        }

        public virtual JObject WeChatLogin(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string lang = request.GetString("lang", "zh-chs");
            string uid = YZAuthHelper.LoginUserAccount;
            JObject rv;

            YZAuthHelper.SetLangSession(YZCultureInfoParse.Parse(lang, YZCultureInfoParse.DefauleCultureInfo).LCID);
            rv = this.GenLoginResult(uid, false);
            return rv;
        }

        public virtual JObject DingTalkLogin(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string code = request.GetString("code");
            string corpId = request.GetString("corpId");
            string appSecret = request.GetString("appSecret");
            string lang = request.GetString("lang", "zh-chs");

            string accesstoken = DingTalkManager.Instance.GetAccessToken(corpId, appSecret);
            string uid = DingTalkManager.Instance.TryGetUserIdFromCode(accesstoken, code);
            string regularAccount = null;
            string linsql = "";
            using (IYZAppAdminProvider applogin = IYZAppAdminProviderManager.DefaultProvider)
            {
                YZAppAdmin.LoginModule lm = applogin.LoadLogin();
                linsql = lm.DdLinkSql;
            }
            if (!string.IsNullOrEmpty(linsql))
            {
                string sql = string.Format(System.Web.HttpUtility.UrlDecode(linsql), uid);
                uid = Convert.ToString(DBUtil_APP.GetSingle(sql));
            }
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpenAnonymous();
                if (!User.IsAccountExist(cn, uid, ref regularAccount))
                    throw new Exception(String.Format("当前钉钉登录用户{0}，不是有效的BPM账号！", uid));

                YZAuthHelper.SetAuthCookie(regularAccount);
            }

            YZAuthHelper.SetLangSession(YZCultureInfoParse.Parse(lang, YZCultureInfoParse.DefauleCultureInfo).LCID);

            JObject rv = this.GenLoginResult(regularAccount, false);
            return rv;
        }

        public virtual JObject LoginTrial(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            bool isapp = request.GetBool("isapp");
            string lang = request.GetString("lang", "zh-chs");
            string cordova = request.GetString("cordova");
            string model = request.GetString("model");
            string name = request.GetString("name", model);
            string platform = request.GetString("platform");
            string uuid = request.GetString("uuid");
            string version = request.GetString("version");
            string manufacturer = request.GetString("manufacturer");
            bool isVirtual = request.GetBool("isVirtual", false);
            string serial = request.GetString("serial");

            string uid = "99199";
            string pwd = "1";

            string realAccount = null;
            string token = null;
            if (!BPMConnection.Authenticate(YZAuthHelper.BPMServerName, YZAuthHelper.BPMServerPort, uid, pwd, out realAccount, out token))
                throw new Exception(Resources.YZStrings.Aspx_Login_Fail);

            YZAuthHelper.SetAuthCookie(realAccount, token);
            YZAuthHelper.SetLangSession(YZCultureInfoParse.Parse(lang, YZCultureInfoParse.DefauleCultureInfo).LCID);
            YZAuthHelper.ClearLogoutFlag();

            JObject rv = this.GenLoginResult(realAccount,true);
            return rv;
        }

        public virtual object SendLoginValidationCode(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");

            string validationCode = SMS.GenValidationCode(6);
            JObject jsmsParam = new JObject();
            jsmsParam["code"] = validationCode;
            jsmsParam["product"] = Resources.YZStrings.All_MobileAppName;

            string iddCode = null;
            string phoneNumber = null;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpenAnonymous();
                User.GetPhoneBind(cn, uid, out iddCode, out phoneNumber);
            }

            string url = "http://gw.api.taobao.com/router/rest";
            string appkey = "24031655";
            string secret = "76a58b1f3739694821c2d1e83e248c12";

            ITopClient client = new DefaultTopClient(url, appkey, secret);
            
            //AlibabaAliqinFcSmsNumSendRequest req = new AlibabaAliqinFcSmsNumSendRequest();
            //req.Extend = "";
            //req.SmsType = "normal";
            //req.SmsFreeSignName = "公司门户";
            //req.SmsParam = jsmsParam.ToString();
            //req.RecNum = phoneNumber;
            //req.SmsTemplateCode = "SMS_70620129";

            //AlibabaAliqinFcSmsNumSendResponse rsp = client.Execute(req);
            //if (rsp.IsError)
            //    throw new Exception(rsp.SubErrMsg);

            SMS sms = new SMS();
            sms.ItemGUID = Guid.NewGuid().ToString("");
            sms.IDDCode = iddCode;
            sms.PhoneNumber = phoneNumber;
            sms.ValidationCode = validationCode;
            sms.CreateDate = DateTime.Now;
            sms.ExpireDate = sms.CreateDate + TimeSpan.FromSeconds(60);
            sms.CreateBy = uid;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    SMSManager.Insert(provider, cn, sms);
                }
            }

            return new
            {
                ItemGUID = sms.ItemGUID,
                ExpireDate = sms.ExpireDate,
                PhoneNumber = phoneNumber.Remove(3,4).Insert(3,"****")
            };
        }

        public virtual JObject ValidateCurrentUserPassword(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string pwd = request.GetString("Password", null);
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                JObject rv = new JObject();
                rv[YZJsonProperty.success] = true;

                string token;
                if (BPMConnection.Authenticate(YZAuthHelper.BPMServerName, YZAuthHelper.BPMServerPort, uid, pwd, out uid, out token))
                    rv["pass"] = true;
                else
                    rv["pass"] = false;

                return rv;
            }
        }

        public virtual void ChangePassword(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string orgPwd = request.GetString("orgPassword", "");
            string newPwd = request.GetString("newPassword", "");
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.ChangePassword(cn, uid, orgPwd, newPwd);
            }
        }

        private JObject GenLoginResult(string account,bool trial)
        {
            string andriodPushService = WebConfigurationManager.AppSettings["AndroidPushService"];
            DateTime today = DateTime.Today;
            JObject rv = new JObject();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User user = User.FromAccount(cn, account);
                UserCommonInfo userCommonInfo = UserCommonInfo.FromAccount(cn, account);

                JObject juser = new JObject();
                rv["user"] = juser;

                juser["Account"] = user.Account;
                juser["AndroidPushService"] = String.IsNullOrEmpty(andriodPushService) ? "JPush" : andriodPushService;
                juser["HRID"] = user.HRID;
                juser["DisplayName"] = user.DisplayName;
                juser["ShortName"] = YZStringHelper.GetUserShortName(user.Account, user.DisplayName);
                juser["LongName"] = YZStringHelper.GetUserFriendlyName(user.Account, user.DisplayName);
                juser["LoginDate"] = DateTime.Now;
                juser["ScreenLock"] = userCommonInfo.ScreenLock;
                juser["TouchUnlock"] = userCommonInfo.TouchUnlock;
                juser["Trial"] = trial;

                rv["BPMSiteUrl"] = WebConfigurationManager.AppSettings["BPMSiteUrl"];
                rv["LocalLibrary"] = String.Compare(System.Web.Configuration.WebConfigurationManager.AppSettings["LocalLibrary"], "false", true) == 0 ? false : true;
                rv["JSCache"] = YZSetting.JSCache;
                rv["JSVersion"] = YZSetting.JSVersion;
                rv["ver"] = 2;
            }

            rv["xclass"] = "EMIP.view.Main";
            rv["success"] = true;

            return rv;
        }
    }
}