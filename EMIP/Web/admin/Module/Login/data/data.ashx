<%@ WebHandler Language="C#" Class="data" %>

using System;
using System.Web;
using Newtonsoft.Json.Linq;
using YZAppAdmin;
using System.Web.Script.Serialization;
using System.Collections;
public class data : YZApplHandler
{

    public JObject LoadLoginConfig(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
       
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            rv["LoginInfo"]=JObject.FromObject(app.LoadLogin());
        }
        return rv;
    }
    public JObject SaveLoginConfig(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        string data = request.GetString("data", "");
        LoginModule Lm = YZApp.DataTableToModel.Hashtable2Object<LoginModule>((Hashtable)JSON.Decode(data));

        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            app.SaveLogin(Lm);
        }
        return rv;
    }

}

