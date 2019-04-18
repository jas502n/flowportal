using BPM;
using BPM.Client;
using Newtonsoft.Json.Linq;
using System;
using System.Data;
using System.Web;
using YZSoft.Web;
using YZSoft.Web.DAL;

namespace YZSoft.Services.REST.Mobile.BPM
{
    public class ProcessHandler : ProcessBase
    {
        public virtual BPMObjectNameCollection GetAllProcessNames(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string bpmServer = request.GetString("bpmServer", null);
            using (BPMConnection cn = new BPMConnection())
            {
                this.OpenConnection(cn, bpmServer);
                return ProcessNameManager.GetProcessNames(cn);
            }
        }

        public virtual JObject GetFavoriteProcesses(HttpContext context)
        {
            //System.Threading.Thread.Sleep(3000);
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path", null);
            BPMPermision perm = request.GetEnum<BPMPermision>("perm", BPMPermision.Execute);
            string uid = YZAuthHelper.LoginUserAccount;

            FavoriteCollection favirites;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    favirites = FavoriteManager.GetFavorites(provider, cn, uid, YZResourceType.Process);
                }
            }

            BPMProcessCollection processes;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                processes = cn.GetProcessList(path, favirites.ResIDs, perm);
            }

            //将数据转化为Json集合
            JObject rv = new JObject();
            rv[YZJsonProperty.total] = processes.Count;

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            foreach (BPMProcess process in processes)
            {
                if (!process.Property.MobileInitiation)
                    continue;

                JObject item = new JObject();
                children.Add(item);

                item["ProcessName"] = process.Name;
                item["Active"] = process.Active;
                item["ProcessVersion"] = process.Version.ToString(2);
                item["Description"] = process.Property.Description;
                item["RelatedFile"] = process.Property.RelatedFile;

                item["ShortName"] = process.Property.ShortName;
                item["Color"] = process.Property.Color;

                if (String.IsNullOrEmpty(process.Property.ShortName))
                    item["ShortName"] = YZStringHelper.GetProcessDefaultShortName(process.Name);
            }

            return rv;
        }

        public virtual JObject GetRecentlyProcess(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            int top = request.GetInt32("top", 48);

            BPMProcessCollection processes;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                processes = cn.GetRecentlyProcess(true, top);
            }

            //将数据转化为Json集合
            JObject rv = new JObject();
            rv[YZJsonProperty.total] = processes.Count;

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            foreach (BPMProcess process in processes)
            {
                if (!process.Property.MobileInitiation)
                    continue;

                JObject item = new JObject();
                children.Add(item);

                item["ProcessName"] = process.Name;
                item["Active"] = process.Active;
                item["ProcessVersion"] = process.Version.ToString(2);
                item["Description"] = process.Property.Description;
                item["RelatedFile"] = process.Property.RelatedFile;

                item["ShortName"] = process.Property.ShortName;
                item["Color"] = process.Property.Color;

                if (String.IsNullOrEmpty(process.Property.ShortName))
                    item["ShortName"] = YZStringHelper.GetProcessDefaultShortName(process.Name);
            }

            return rv;
        }

        public virtual JObject SearchProcess(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string keyword = request.GetString("kwd", null);
            string uid = YZAuthHelper.LoginUserAccount;

            BPMProcessCollection processes;
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                processes = cn.SearchProcess(null, BPMPermision.Execute, keyword, true, 100);
            }

            //将数据转化为Json集合
            JObject rv = new JObject();
            rv[YZJsonProperty.total] = processes.Count;

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    foreach (BPMProcess process in processes)
                    {
                        if (!process.Property.MobileInitiation)
                            continue;

                        JObject item = new JObject();
                        children.Add(item);

                        item["ProcessName"] = process.Name;
                        item["Active"] = process.Active;
                        item["ProcessVersion"] = process.Version.ToString(2);
                        item["Description"] = process.Property.Description;
                        item["RelatedFile"] = process.Property.RelatedFile;

                        item["ShortName"] = process.Property.ShortName;
                        item["Color"] = process.Property.Color;

                        if (String.IsNullOrEmpty(process.Property.ShortName))
                            item["ShortName"] = YZStringHelper.GetProcessDefaultShortName(process.Name);

                        item["Favorited"] = FavoriteManager.HasFavorited(provider, cn, uid, YZResourceType.Process, process.Name);
                    }
                }
            }

            return rv;
        }
    }
}