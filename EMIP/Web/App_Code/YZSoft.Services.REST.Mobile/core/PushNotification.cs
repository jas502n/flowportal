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
using YZSoft.Web.Social;
using YZSoft.Web.PushNotification;

namespace YZSoft.Services.REST.Mobile.core
{
    public class PushNotificationHandler : YZServiceHandler
    {
        public virtual void Register(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string serviceName = request.GetString("serviceName");
            string os = request.GetString("os");
            string registerId = request.GetString("registerId");
            string uid = YZAuthHelper.LoginUserAccount;

            BPMObjectNameCollection uids;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    uids = PushNotificationManager.GetUidsFromRegisterId(provider, cn, registerId);
                }
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (string orguid in uids)
                    User.SetPushNotificationToken(cn, orguid, "", "", "");

                User.SetPushNotificationToken(cn, uid, serviceName, os, registerId);
            }
        }

        public virtual void UnRegister(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string registerId = request.GetString("registerId",null);

            if (String.IsNullOrEmpty(registerId))
                return;

            BPMObjectNameCollection uids;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    uids = PushNotificationManager.GetUidsFromRegisterId(provider, cn, registerId);
                }
            }

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (string uid in uids)
                    User.SetPushNotificationToken(cn, uid, "", "", "");
            }
        }
    }
}