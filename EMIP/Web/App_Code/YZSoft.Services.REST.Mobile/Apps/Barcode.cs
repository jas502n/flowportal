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
using System.Data.SqlClient;

namespace YZSoft.Services.REST.Mobile.Apps
{
    public class BarcodeHandler : YZServiceHandler
    {
        public virtual object Save(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JObject jPost = request.GetPostData<JObject>();
            Barcode barcode = jPost.ToObject<Barcode>();

            barcode.Account = YZAuthHelper.LoginUserAccount;
            barcode.CreateAt = DateTime.Now;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    BarcodeManager.Insert(provider, cn, barcode);
                    return barcode;
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
                    return BarcodeManager.GetBarcodes(provider, cn, uid, null, null, request.Start, request.Limit);
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
                    BarcodeManager.DeleteBarcode(provider, cn, itemid);
                }
            }
        }
    }
}