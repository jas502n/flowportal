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
    public class CashHandler : YZServiceHandler
    {
        public virtual object Save(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject jPost = request.GetPostData<JObject>();
            Cash cash = jPost.ToObject<Cash>(request.Serializer);

            cash.Account = YZAuthHelper.LoginUserAccount;
            cash.CreateAt = DateTime.Now;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    CashManager.Insert(provider, cn, cash);
                    return cash;
                }
            }
        }

        public virtual object Update(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int itemid = request.GetInt32("itemid");
            JObject jPost = request.GetPostData<JObject>();
            Cash cashNew = jPost.ToObject<Cash>(request.Serializer);

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Cash cash = CashManager.GetCash(provider, cn, itemid);

                    cash.Amount = cashNew.Amount;
                    cash.Date = cashNew.Date;
                    cash.Invoice = cashNew.Invoice;
                    cash.Type = cashNew.Type;
                    cash.Comments = cashNew.Comments;

                    CashManager.Update(provider, cn, cash);
                    return cash;
                }
            }
        }

        public virtual object GetMyList(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = YZAuthHelper.LoginUserAccount;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return CashManager.GetCashs(provider,cn,uid,null,null,request.Start,request.Limit);
                }
            }
        }

        public virtual object GetCash(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int itemid = request.GetInt32("itemid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return CashManager.GetCash(provider, cn, itemid);
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
                    CashManager.DeleteCash(provider, cn, itemid);
                }
            }
        }
    }
}