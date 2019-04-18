<%@ WebHandler Language="C#" Class="data" %>

using System;
using System.Web;
using Newtonsoft.Json.Linq;
using YZAppAdmin;
using System.Web.Script.Serialization;
using System.Collections;
using BPM;
using BPM.Client;
using BPM.Client.Notify;
public class data : YZApplHandler
{

    public JObject LoadOrgSyncConfig(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
       
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            OrgSyncInfoModule L = app.LoadOrgSyncConfig();
            //L.DdOuSql = System.Web.HttpUtility.HtmlDecode(L.DdOuSql);
            //L.DdUserSql = System.Web.HttpUtility.HtmlDecode(L.DdUserSql);
            //L.WxOuSql = System.Web.HttpUtility.HtmlDecode(L.WxOuSql);
            //L.WxUserSql = System.Web.HttpUtility.HtmlDecode(L.WxUserSql);
            rv["OrgSyncInfo"] = JObject.FromObject(L);
        }
        return rv;
    }

    public JObject SaveOrgSyncConfig(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        string data = request.GetString("data", "");
        OrgSyncInfoModule Lm = YZApp.DataTableToModel.Hashtable2Object<OrgSyncInfoModule>((Hashtable)JSON.Decode(data));

        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            app.SaveOrgSyncConfig(Lm);
        }
        return rv;
    }


   
}

