using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;
using YZSoft.Apps;

namespace YZSoft.Services.REST.Mobile.Apps
{
    public class FootmarkHandler : YZServiceHandler
    {
        public virtual object GetSignCount(HttpContext context)
        {
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return FootmarkManager.GetSignCount(provider, cn, YZAuthHelper.LoginUserAccount, DateTime.Today);
                }
            }
        }

        public virtual object Save(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject jPost = request.GetPostData<JObject>();
            Footmark footmark = jPost.ToObject<Footmark>(request.Serializer);
            DateTime now = DateTime.Now;

            footmark.Account = YZAuthHelper.LoginUserAccount;
            footmark.Time = new DateTime(now.Year,now.Month,now.Day,now.Hour,now.Minute,0);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    FootmarkManager.Insert(provider, cn, footmark);
                    return footmark.ItemID;
                }
            }
        }

        public virtual object GetTeamList(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            DateTime date = request.GetDateTime("date");

            string uid = YZAuthHelper.LoginUserAccount;
            BPMObjectNameCollection accounts = new BPMObjectNameCollection();
            accounts.Add(uid);

            using (BPMConnection bpmcn = new BPMConnection())
            {
                bpmcn.WebOpen();

                MemberCollection positions = OrgSvr.GetUserPositions(bpmcn, uid);
                foreach (Member position in positions)
                {
                    DirectXSCollection xss = position.GetDirectXSs(bpmcn);
                    foreach (DirectXS xs in xss)
                    {
                        if (!accounts.Contains(xs.UserAccount))
                            accounts.Add(xs.UserAccount);
                    }
                }

                using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                {
                    using (IDbConnection cn = provider.OpenConnection())
                    {
                        FootmarkCollection footmarks = FootmarkManager.GetFootmarks(provider, cn, accounts, date);
                        return new 
                        {
                            children = this.SerializeAsTeamList(bpmcn,footmarks),
                            unsignedusers = footmarks.GetUnSignedUsers(bpmcn, accounts)
                        };
                    }
                }
            }
        }

        public virtual object GetUserList(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = request.GetString("account", YZAuthHelper.LoginUserAccount);
            DateTime month = request.GetDateTime("month");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return FootmarkManager.GetFootmarks(provider, cn, account, month.Year, month.Month, null, null, request.Start, request.Limit);
                }
            }
        }

        public virtual object GetFootmark(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int itemid = request.GetInt32("itemid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return FootmarkManager.GetFootmark(provider, cn, itemid);
                }
            }
        }

        public virtual void Delete(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int itemid = request.GetInt32("itemid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    FootmarkManager.DeleteFootmark(provider, cn, itemid);
                }
            }
        }

        protected virtual object SerializeAsTeamList(BPMConnection cn, FootmarkCollection footmarks)
        {
            List<object> rv = new List<object>();
            UserCollection users = footmarks.GetUsers(cn);

            foreach (User user in users)
            {
                FootmarkCollection userfootmarks = footmarks.SubSet(user.Account);

                rv.Add(new {
                    Account = user.Account,
                    Name = user.ShortName,
                    Count = userfootmarks.Count,
                    Items = userfootmarks
                });
            }

            return rv;
        }
    }
}