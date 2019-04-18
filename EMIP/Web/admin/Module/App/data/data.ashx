<%@ WebHandler Language="C#" Class="data" %>

using System;
using System.Web;
using Newtonsoft.Json.Linq;
using YZAppAdmin;
using System.Web.Script.Serialization;
using BPM;
using BPM.Client;
public class data : YZApplHandler
{

    public JObject GetApplist(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            rv["Applist"] =JArray.FromObject(app.GetApplist(""));
        }
        return rv;
    }
    public virtual JObject GetTableSchemas(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        string TableName = request.GetString("TableName", null);
        string DataSourceName = request.GetString("DataSourceName", null);
         bool IsRepeatableTable = request.GetBool("IsRepeatableTable", false);
        TableIdentityCollection tables = new TableIdentityCollection ();
        TableIdentity item = new TableIdentity();
        item.IsRepeatableTable = IsRepeatableTable;
        item.TableName = TableName;
        item.DataSourceName = DataSourceName;
        tables.Add(item);
        FlowDataSet dataSet;

        using (BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();
            dataSet = DataSourceManager.LoadDataSetSchema(cn, tables);
            return YZJsonHelper.SerializeSchema(dataSet);
        }
    }

    public JObject LoadFormApplication(HttpContext context)
    {
        
        using (BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();

            JObject rv = new JObject();

            JArray items = new JArray();
            rv[YZJsonProperty.children] = items;

            this.ExpandTree(cn, items, null, StoreZoneType.FormService, BPMPermision.Read, false);

            rv[YZJsonProperty.success] = true;
            return rv;
        }
    }
    
    
    protected virtual void ExpandTree(BPMConnection cn, JArray items, string path, StoreZoneType zone, BPMPermision perm, bool expand)
    {
        BPMObjectNameCollection folderNames = cn.GetFolders(zone, path, perm);



        FormApplicationCollection formApplications = cn.GetFormApplicationList(path, BPMPermision.Read);
        foreach (FormApplication tmpformapp in formApplications)
        {
            string fullName;
            if (String.IsNullOrEmpty(path))
                fullName = tmpformapp.Name;
            else
                fullName = path + "/" + tmpformapp.Name;

            FormApplication formapp = FormApplication.Open(cn, fullName);

            JObject item = new JObject();
            items.Add(item);
            item["label"] = formapp.Name;
            item["app"] = true;
            item["Name"] = formapp.Name;
            item["FullName"] = fullName;
            item["rsid"] = StoreZoneType.FormService.ToString() + "://" + fullName;
            item["data"] = JToken.FromObject(FormApplication.Open(cn, fullName));
            JArray jStates = new JArray();
            item["States"] = jStates;
            foreach (FormState state in formapp.FormStates)
            {
                JObject jState = new JObject();
                jStates.Add(jState);

                jState["Name"] = state.Name;
            }

            item["FormFile"] = formapp.Form;
        }
        
        
        
        
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
            item["app"] = false;
            item["text"] = folderName;
            item["label"] = folderName;
            item["iconCls"] = "folder";
            item["expanded"] = expand;
            item["path"] = folderPath;
            item["rsid"] = zone.ToString() + "://" + folderPath;
            item["id"] = zone.ToString() + "://" + folderPath;
            JArray children = new JArray();
            item[YZJsonProperty.children] = children;
            this.ExpandTree(cn, children, folderPath, zone, perm, expand);
        }
       

       
        
    }

    public void SaveAppInfo(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        string data = request.GetString("data");
        string pid = request.GetString("pid");
        AppInfoModule AIM = new AppInfoModule();
        AIM.CREATEDATE=DateTime.Now.ToString();
        AIM.PID = pid;
        AIM.UID = YZAuthHelper.LoginUserAccount;
        AIM.JSON = data;
       
       
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            app.SaveAppInfo(AIM);
        }

    }
    public JObject LoadFormservice(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        string formservice = request.GetString("formservice", "");
        JObject rv = new JObject();
         using (BPMConnection cn = new BPMConnection())
        {
            cn.WebOpen();
            rv["Formservice"] = JToken.FromObject(FormApplication.Open(cn, formservice));
         }
        return rv;
    }
    public JObject LoadAppInfo(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        string pid = request.GetString("pid", "");
        JObject rv = new JObject();
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {

            if (app.LoadAppInfo(pid).JSON != null)
            {
                rv["appinfo"] = JToken.FromObject(app.LoadAppInfo(pid).JSON);
            }
            else {
                rv["appinfo"] = 0;
            }
        }

        return rv;
    }
    public JObject SaveApp(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        string formdata = request.GetString("data", "");
        AppModule am = new AppModule();
        JavaScriptSerializer js = new JavaScriptSerializer();
        am = js.Deserialize<AppModule>(formdata);
        JObject rv = new JObject();
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            app.SaveApp(am);
        }

        return rv;
    }
    public JObject DeletApp(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        int id = request.GetInt32("id", 0);

        JObject rv = new JObject();
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            app.DeleteApp(id);
        }

        return rv;
    }

}