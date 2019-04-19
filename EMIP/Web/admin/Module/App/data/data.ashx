<%@ WebHandler Language="C#" Class="data" %>

using System;
using System.Web;
using Newtonsoft.Json.Linq;
using YZAppAdmin;
using System.Web.Script.Serialization;
using BPM;
using BPM.Client;
using System.Collections.Generic;
using System.Data;
using System.Collections;
public class data : YZApplHandler
{

    public JObject GetApplist(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            rv["Applist"] = JArray.FromObject(app.GetApplist(""));
        }
        return rv;
    }
    public virtual JObject GetTableSchemas(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        string TableName = request.GetString("TableName", null);
        string DataSourceName = request.GetString("DataSourceName", null);
        bool IsRepeatableTable = request.GetBool("IsRepeatableTable", false);
        TableIdentityCollection tables = new TableIdentityCollection();
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
        AIM.CREATEDATE = DateTime.Now.ToString();
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
            else
            {
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
    public JObject LoadGroups(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();

        YZSoft.Services.REST.BPM.SecurityGroupHandler s = new YZSoft.Services.REST.BPM.SecurityGroupHandler();
        rv["Groups"] = JArray.FromObject(s.GetGroups(context));
        return rv;
    }

    public JObject LoadApp(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        string sid = request.GetString("sid");
      
        string sql = "";
        sql = " select VIEWTYPE,MAX(sort) as SORT from  App_Index where Enable=1  group by  VIEWTYPE  order by sort";
        DataTable dt = DBUtil_APP.Query(sql).Tables[0];
        ArrayList list2=new ArrayList ();
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            Hashtable ht = new Hashtable();
            string GroupName = Convert.ToString(dt.Rows[i][0]);
            ht["GroupName"] = GroupName;
            string sql2 = " select AppName,ID  from  App_Index  where     Enable=1   and VIEWTYPE='" + GroupName + "'  order by sort";
            DataTable dt2 = DBUtil_APP.Query(sql2).Tables[0];
            ArrayList list = new ArrayList();
            for (int j = 0; j < dt2.Rows.Count; j++)
            {
                Hashtable ht2 = new Hashtable();
                string appname = Convert.ToString(dt2.Rows[j][0]);
                string id = Convert.ToString(dt2.Rows[j][1]);
                ht2["appname"] = appname;
                ht2["id"] = id;
                ht2["check"] = DBUtil_APP.Exists("select count(*) from  APP_APPAUTH  where SID='" + sid + "' and APPID='" + id + "'");
                list.Add(ht2);
            }
            ht["data"]=list;
            list2.Add(ht);
        }
        rv["applist"] = JArray.FromObject(list2);
        return rv;
    }

    public void updateapp(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        string sid = request.GetString("sid");
        string appid = request.GetString("appid");
        bool check = request.GetBool("check");
        string sql="";
        if (check)
        {

            sql = string.Format(@"INSERT INTO [APP_APPAUTH]
           ([CREATEDATE]
           ,[CREATEUSER]
           ,[SID]
           ,[APPID])
     VALUES
           ('{0}'
           ,'{1}'
           ,'{2}'
           ,'{3}')", DateTime.Now.ToString(), YZAuthHelper.LoginUserAccount, sid, appid);

        }
        else {
                sql = string.Format(@"delete [APP_APPAUTH]
               where  SID='{0}' and APPID='{1}'",  sid, appid);
        }
        DBUtil_APP.ExecuteSqlWithGoUseTran(sql);
    }
}