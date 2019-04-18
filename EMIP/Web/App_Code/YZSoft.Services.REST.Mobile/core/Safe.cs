using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;
using YZSoft.Web.Mobile;
using Top.Api;
using Top.Api.Request;
using Top.Api.Response;
using YZSoft.Web.Validation;

namespace YZSoft.Services.REST.Mobile.core
{
    public class SafeHandler : YZServiceHandler
    {
        public virtual object GetMyDevices(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = YZAuthHelper.LoginUserAccount;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return DeviceManager.GetUserDevices(provider, cn, uid, null, null, 0, -1);
                }
            }
        }

        public virtual object RenameDevice(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uuid = request.GetString("uuid");
            string value = request.GetString("value");
            string uid = YZAuthHelper.LoginUserAccount;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Device device = DeviceManager.GetDevice(provider, cn, uid, uuid);
                    device.Name = value;
                    DeviceManager.Update(provider, cn, device);
                    return device;
                }
            }
        }

        public virtual void DeleteDevice(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uuid = request.GetString("uuid");
            string uid = YZAuthHelper.LoginUserAccount;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    DeviceManager.DeleteDevice(provider, cn, uid, uuid);
                }
            }
        }

        public virtual object SendValidationCode(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string iddCode = request.GetString("iddcode");
            string phoneNumber = request.GetString("phoneNumber");
            string validationCode = SMS.GenValidationCode(6);
            JObject jsmsParam = new JObject();
            jsmsParam["code"] = validationCode;

            string url = "http://gw.api.taobao.com/router/rest";
            string appkey = "24031655";
            string secret = "76a58b1f3739694821c2d1e83e248c12";

            ITopClient client = new DefaultTopClient(url, appkey, secret);
            AlibabaAliqinFcSmsNumSendRequest req = new AlibabaAliqinFcSmsNumSendRequest();
            req.Extend = "";
            req.SmsType = "normal";
            req.SmsFreeSignName = "公司门户";
            req.SmsParam = jsmsParam.ToString();
            req.RecNum = phoneNumber;
            req.SmsTemplateCode = "SMS_70455212";

            AlibabaAliqinFcSmsNumSendResponse rsp = client.Execute(req);
            if (rsp.IsError)
                throw new Exception(rsp.SubErrMsg);

            SMS sms = new SMS();
            sms.ItemGUID = Guid.NewGuid().ToString("");
            sms.IDDCode = iddCode;
            sms.PhoneNumber = phoneNumber;
            sms.ValidationCode = validationCode;
            sms.CreateDate = DateTime.Now;
            sms.ExpireDate = sms.CreateDate + TimeSpan.FromSeconds(180);
            sms.CreateBy = YZAuthHelper.LoginUserAccount;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    SMSManager.Insert(provider, cn, sms);
                }
            }

            return new
            {
                ItemGUID = sms.ItemGUID
            };
        }

        public virtual void SMSValidation(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string validateItemGUID = request.GetString("validateItemGUID");
            string validateCode = request.GetString("validateCode");
            string action = request.GetString("action",null);
            string uid = YZAuthHelper.LoginUserAccount;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    SMS sms = SMSManager.TryGetSMS(provider, cn, validateItemGUID);

                    if (sms == null)
                        throw new Exception(Resources.YZMobile.Aspx_Auth_GetValidationCodeAgain);

                    if (sms.ValidationCode != validateCode)
                        throw new Exception(Resources.YZMobile.Aspx_Auth_IncorrectValidationCode);

                    if (sms.ExpireDate < DateTime.Now)
                        throw new Exception(Resources.YZMobile.Aspx_Auth_GetValidationCodeAgain);

                    SMSManager.DeleteSMS(provider, cn, validateItemGUID);
                }
            }

            if (NameCompare.EquName(action, "bindandprotect"))
            {
                string iddcode = request.GetString("iddcode");
                string phoneNumber = request.GetString("phoneNumber");

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    User.SetAppLoginProtect(cn, uid, true);
                    User.BindPhone(cn, uid, iddcode, phoneNumber);

                    User user = User.TryGetUser(cn,uid);
                    if (user != null)
                    {
                        if ((user.Permision & BPMObjectPermision.Edit) == BPMObjectPermision.Edit)
                        {
                            user.Mobile = phoneNumber;
                            User.Update(cn, uid, user);
                        }
                    }
                }
            }

            if (NameCompare.EquName(action, "changebind"))
            {
                string iddcode = request.GetString("iddcode");
                string phoneNumber = request.GetString("phoneNumber");

                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();

                    User.BindPhone(cn, uid, iddcode, phoneNumber);

                    User user = User.TryGetUser(cn, uid);
                    if (user != null)
                    {
                        if ((user.Permision & BPMObjectPermision.Edit) == BPMObjectPermision.Edit)
                        {
                            user.Mobile = phoneNumber;
                            User.Update(cn, uid, user);
                        }
                    }
                }
            }
        }

        public virtual void SetLoginProtect(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            bool value = request.GetBool("value");
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.SetAppLoginProtect(cn, uid, value);
            }
        }

        public virtual void InitScreenLock(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string password = request.GetString("password");
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.SetScreenLockPassword(cn, uid, "", password);
                User.SetScreenLock(cn, uid, true);
                User.SetTouchUnlock(cn, uid, true);
            }
        }

        public virtual object ValidateScreenLockPassword(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string password = request.GetString("password");
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return User.ScreenUnlockAuthenticate(cn, uid, password);
            }
        }

        public virtual void CloseScreenLock(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.SetScreenLock(cn, uid, false);
                User.SetTouchUnlock(cn, uid, false);
            }
        }

        public virtual void OpenScreenLock(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.SetScreenLock(cn, uid, true);
            }
        }

        public virtual void SetTouchUnlock(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            bool value = request.GetInt32("value") == 1;
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.SetTouchUnlock(cn, uid, value);
            }
        }

        public virtual void ChangeScreenLockPassword(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string oldPassword = request.GetString("oldPassword");
            string newPassword = request.GetString("newPassword");
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.SetScreenLockPassword(cn, uid, oldPassword, newPassword);
            }
        }

        public virtual void ResetScreenLockPassword(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string userPassword = request.GetString("userPassword");
            string newPassword = request.GetString("newPassword");
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.ResetScreenLockPassword(cn, uid, userPassword, newPassword);
            }
        }

        public virtual void ResetScreenLock(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.ResetScreenLock(cn, uid);
            }
        }
    }
}