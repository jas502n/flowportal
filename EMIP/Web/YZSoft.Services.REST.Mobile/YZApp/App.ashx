<%@ WebHandler Language="C#" Class="App" %>

using System;
using System.Web;
using Newtonsoft.Json.Linq;
using YZAppAdmin;
using System.Web.Script.Serialization;
using YZSoft;
using BPM;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
public class App : YZApplHandler
{
    public JObject GetMFavorite(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            rv["Applist"] = JArray.FromObject(app.GetMFavorite());
        }
        return rv;
    }
    public JObject GetMApplist(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            rv["Applist"] = JArray.FromObject(app.GetMApplist(""));
        }
        return rv;
    }
    public JObject SearchMApplist(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        string kwd = request.GetString("kwd", "");
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            rv["Applist"] = JArray.FromObject(app.SearchMApplist(kwd));
        }
        return rv;
    }

    public JObject MoveFavorites(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        string target = request.GetString("target");
        MovePosition position = request.GetEnum<MovePosition>("position");
        JArray post = request.GetPostData<JArray>();
        List<string> ids = post.ToObject<List<string>>();
        if (position == MovePosition.Before)
        {
            string sql = "select orderIndex from YZSysFavorites  where resID='" + target + "'";
            int orderIndex = Convert.ToInt32(DBUtil_APP.GetSingle(sql));
            string sql2 = @"update YZSysFavorites set orderIndex=orderIndex+1 where orderIndex>='" + orderIndex + "' and  resType='App'  and uid='" + YZAuthHelper.LoginUserAccount + @"';
               update  YZSysFavorites  set orderIndex='" + orderIndex + @"' where   resType='App'  and uid='" + YZAuthHelper.LoginUserAccount + @"' and  resId='" + ids[0] + "'";
            DBUtil_APP.ExecuteSqlWithGoUseTran(sql2);
        }
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            rv["Applist"] = JArray.FromObject(app.GetMFavorite());
        }
        return rv;
    }

    public JObject CancelFavorite(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        string resId = request.GetString("resId", "");
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            app.DeleteMFavorite(resId);
        }
        rv["result"] = "false";
        return rv;
    }

    public JObject AddFavorite(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        string resId = request.GetString("resId", "");
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            app.AddMFavorite(resId);
        }
        rv["result"] = "true";
        return rv;
    }
    public JObject GetApplistInfo(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        string appname = request.GetString("appname", "");
        string kwd = request.GetString("kwd", "");
        int page = request.GetInt32("page", 0);
        int limit = request.GetInt32("limit", 0);
        int start = limit * page - limit + 1;//开始行数
        int end = limit * page;//结束行数

        string sql = "select json from  APP_APPINFO where PID in(select id from APP_INDEX where Appname='" + appname + "')";
        JObject rv2 = JObject.Parse(Convert.ToString(DBUtil_APP.GetSingle(sql)));
        string primarykey = Convert.ToString(rv2["primarykey"]);
        string tablename = Convert.ToString(rv2["table"]["name"]);
        JArray columns = JArray.Parse(Convert.ToString(rv2["table"]["columns"]));
        JArray newcolumns =JArray.FromObject(columns.Where(x => Convert.ToBoolean(x["show"]) == true).OrderBy(s=> s["sort"]).ToList());
        string sqlcol = "";
        foreach (JObject item in newcolumns)
        {
            sqlcol +=item["name"]+",";
            
        }
        string sql2 = "";
        string sql3 = "";
        if (string.IsNullOrEmpty(kwd))
        {
            sql2 = "select * from (select  " + primarykey + " as primarykeyyzapp," + sqlcol.TrimEnd(',') + ", ROW_NUMBER() OVER(Order by " + primarykey + @" desc) AS RowId from " + tablename + " ) as b where RowId between " + start + " and " + end + "";
            sql3 = "select * from " + tablename + "";
        }
        else {
            string where = "";
            foreach (JObject item in newcolumns)
            {
                where += item["name"] + " like '%"+kwd+"%' or ";
            }

            sql2 = "select * from (select  " + primarykey + " as primarykeyyzapp," + sqlcol.TrimEnd(',') + ", ROW_NUMBER() OVER(Order by " + primarykey + @" desc) AS RowId from " + tablename + "  where  " + where.Substring(0, where.Length - 3) + ") as b where RowId between " + start + " and " + end + "";
            sql3 = "select * from " + tablename + "  where  " + where.Substring(0, where.Length - 3) + "";
        }
        rv["children"] =JArray.FromObject(DBUtil_APP.Select(sql2));
        rv["total"] = DBUtil_APP.Select(sql3).Count;
        return rv;
    }

    public JObject GetColumns(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        string appname = request.GetString("appname", "");
        string sql = "select json from  APP_APPINFO where PID in(select id from APP_INDEX where Appname='" + appname + "')";
        JObject rv2 = JObject.Parse(Convert.ToString(DBUtil_APP.GetSingle(sql)));
        JArray columns = JArray.Parse(Convert.ToString(rv2["table"]["columns"]));
        JArray newcolumns = JArray.FromObject(columns.Where(x => Convert.ToBoolean(x["show"]) == true).OrderBy(s => s["sort"]).ToList());
        rv["displayname"] = newcolumns;
        rv["formstate"] = JObject.Parse(Convert.ToString(rv2["formstate"]));
        rv["formservice"] =Convert.ToString(rv2["formservice"]);
        return rv;
    }
    public void del(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        string sql = request.GetString("sql", "");
        string key = request.GetString("key", "");
        string sql2 = string.Format(System.Web.HttpUtility.UrlDecode(sql), key);
        DBUtil_APP.ExecuteSqlWithGoUseTran(sql2);
    }

}