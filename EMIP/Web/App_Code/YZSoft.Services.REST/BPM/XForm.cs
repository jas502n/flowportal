using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;

namespace YZSoft.Services.REST.BPM
{
    public class XFormHandler : YZServiceHandler
    {
        public virtual JObject GetFolders(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            BPMPermision perm = request.GetEnum<BPMPermision>("perm");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                JObject rv = new JObject();

                JArray items = new JArray();
                rv[YZJsonProperty.children] = items;

                this.ExpandTree(cn, items, null, perm);

                rv[YZJsonProperty.success] = true;
                return rv;
            }
        }

        protected virtual void ExpandTree(BPMConnection cn, JArray items, string path, BPMPermision perm)
        {
            BPMObjectNameCollection folderNames = cn.GetFolders(StoreZoneType.Form, path, perm);

            foreach (String folderName in folderNames)
            {
                string folderPath;

                if (String.IsNullOrEmpty(path))
                    folderPath = folderName;
                else
                    folderPath = path + "/" + folderName;

                JObject item = new JObject();
                items.Add(item);
                item["leaf"] = false;
                item["text"] = folderName;
                item["iconCls"] = "folder";
                item["expanded"] = false;
                item["path"] = folderPath;

                JArray children = new JArray();
                item[YZJsonProperty.children] = children;
                this.ExpandTree(cn, children, folderPath, perm);
            }
        }

        public virtual JObject GetFormsInFolder(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path",null);
            string rsid = String.IsNullOrEmpty(path) ? WellKnownRSID.FormRoot : StoreZoneType.Form.ToString() + "://" + path;
            BPMPermision perm = request.GetEnum<BPMPermision>("perm");

            BPMFileInfoCollection fileInfos = new BPMFileInfoCollection();

            JObject rv = new JObject();
            rv["dataVersion"] = new JObject();
            rv["dataVersion"]["lastUpdateTime"] = DateTime.Now;

            //获得数据
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                if (SecurityManager.CheckPermision(cn, rsid, perm))
                    fileInfos = cn.GetFileInfoList(StoreZoneType.Form, path);
            }

            //将数据转化为Json集合
            rv[YZJsonProperty.total] = fileInfos.Count;

            JArray children = new JArray();
            rv[YZJsonProperty.children] = children;

            foreach (BPMFileInfo fileInfo in fileInfos)
            {
                if (!FileTypeChecker.IsFormFile(fileInfo.FileName))
                    continue;

                string fullName = String.IsNullOrEmpty(path) ? fileInfo.FileName : path + "/" + fileInfo.FileName;

                JObject item = new JObject();
                children.Add(item);

                item["FileName"] = fileInfo.FileName;
                item["FullName"] = fullName;
                item["Length"] = fileInfo.Length;
                item["CreationTime"] = fileInfo.CreationTime;
                item["LastWriteTime"] = fileInfo.LastWriteTime;
            }

            return rv;
        }
    }
}