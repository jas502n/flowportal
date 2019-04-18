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
    public class SpeakHandler : YZServiceHandler
    {
        public virtual object Save(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject jPost = request.GetPostData<JObject>();
            Speak speak = jPost.ToObject<Speak>(request.Serializer);

            speak.Account = YZAuthHelper.LoginUserAccount;
            speak.CreateAt = DateTime.Now;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    SpeakManager.Insert(provider, cn, speak);
                    return speak.ItemID;
                }
            }
        }

        public virtual object Rename(HttpContext context) {
            YZRequest request = new YZRequest(context);
            int itemid = request.GetInt32("itemid");
            string comments = request.GetString("comments");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    Speak speak = SpeakManager.GetSpeak(provider, cn, itemid);
                    speak.Comments = comments;
                    SpeakManager.Update(provider, cn, speak);
                    return speak;
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
                    return SpeakManager.GetSpeaks(provider,cn,uid,null,null,request.Start,request.Limit);
                }
            }
        }

        public virtual object GetSpeak(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int itemid = request.GetInt32("itemid");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return SpeakManager.GetSpeak(provider, cn, itemid);
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
                    SpeakManager.DeleteSpeak(provider, cn, itemid);
                }
            }
        }
    }
}