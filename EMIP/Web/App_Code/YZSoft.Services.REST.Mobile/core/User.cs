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
using BPM.Client.Notify;
using YZSoft.Web.DAL;
using YZSoft.Web.Mobile;
using Top.Api;
using Top.Api.Request;
using Top.Api.Response;
using YZSoft.Web.Validation;

namespace YZSoft.Services.REST.Mobile.core
{
    public class UserHandler : YZServiceHandler
    {
        public virtual object GetOutOfOffice(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = YZAuthHelper.LoginUserAccount;

            UserCommonInfo userCommonInfo;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                userCommonInfo = UserCommonInfo.FromAccount(cn, uid);
            }

            return new
            {
                state = userCommonInfo.OutOfOfficeState.ToString(),
                DateFrom = userCommonInfo.OutOfOfficeFrom,
                DateTo = userCommonInfo.OutOfOfficeTo
            };
        }

        public virtual void SetOutOfOffice(HttpContext context)
        {
            YZRequest request = new YZRequest(context);

            OutOfOfficeState state = request.GetEnum<OutOfOfficeState>("state");
            DateTime dateFrom = request.GetDateTime("DateFrom",DateTime.MinValue);
            DateTime dateTo = request.GetDateTime("DateTo", DateTime.MinValue);
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.SetOutOfOffice(cn, uid, state, dateFrom, dateTo);
            }
        }

        public virtual JObject GetCurrentNotificationSetting(HttpContext context)
        {
            string account = YZAuthHelper.LoginUserAccount;

            NotifyProviderInfoCollection providers;
            UserCommonInfo userCommonInfo;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                providers = NotifyManager.GetProviders(cn);
                userCommonInfo = UserCommonInfo.FromAccount(cn, account);
            }

            JObject rv = new JObject();
            JArray jProviders = new JArray();
            rv["providers"] = jProviders;
            foreach (NotifyProviderInfo provider in providers)
            {
                JObject jProvider = new JObject();
                jProviders.Add(jProvider);

                jProvider["ProviderName"] = provider.Name;
                jProvider["Enabled"] = !userCommonInfo.RejectedNotifys.Contains(provider.Name);
            }

            rv[YZJsonProperty.success] = true;
            return rv;
        }

        public virtual void SaveNotificationSetting(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = YZAuthHelper.LoginUserAccount;
            BPMObjectNameCollection rejectedNotifys = BPMObjectNameCollection.FromStringList(request.GetString("rejectedNotifys", ""), ';');

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                User.SaveNotifySetting(cn, YZAuthHelper.LoginUserAccount, rejectedNotifys);
            }
        }
    }
}