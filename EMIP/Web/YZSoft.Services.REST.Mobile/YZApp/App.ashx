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
using System.Data.SqlClient;
using System.Data;
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
            string sql = "select orderIndex from YZSysFavorites  where resID='" + target + "' and  resType='App' and uid='" + YZAuthHelper.LoginUserAccount + @"'";
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
        JArray newcolumns = JArray.FromObject(columns.Where(x => Convert.ToBoolean(x["show"]) == true).OrderBy(s => s["sort"]).ToList());
        string sqlcol = "";
        foreach (JObject item in newcolumns)
        {
            sqlcol += item["name"] + ",";

        }
        string sql2 = "";
        string sql3 = "";
        if (string.IsNullOrEmpty(kwd))
        {
            sql2 = "select * from (select  " + primarykey + " as primarykeyyzapp," + sqlcol.TrimEnd(',') + ", ROW_NUMBER() OVER(Order by " + primarykey + @" desc) AS RowId from " + tablename + " ) as b where RowId between " + start + " and " + end + "";
            sql3 = "select * from " + tablename + "";
        }
        else
        {
            string where = "";
            foreach (JObject item in newcolumns)
            {
                where += item["name"] + " like '%" + kwd + "%' or ";
            }

            sql2 = "select * from (select  " + primarykey + " as primarykeyyzapp," + sqlcol.TrimEnd(',') + ", ROW_NUMBER() OVER(Order by " + primarykey + @" desc) AS RowId from " + tablename + "  where  " + where.Substring(0, where.Length - 3) + ") as b where RowId between " + start + " and " + end + "";
            sql3 = "select * from " + tablename + "  where  " + where.Substring(0, where.Length - 3) + "";
        }
        rv["children"] = JArray.FromObject(DBUtil_APP.Select(sql2));
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
        rv["formservice"] = Convert.ToString(rv2["formservice"]);
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
    public JObject reportdefine(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        string id = request.GetString("id", "");
        JObject rv = new JObject();
        string sql = "select json from  APP_APPINFO where PID='" + id + "'";
        JObject rv2 = JObject.Parse(Convert.ToString(DBUtil_APP.GetSingle(sql)));
        string type = Convert.ToString(rv2["type"]);
        string datasql = Convert.ToString(rv2["datas"]);
        rv["type"] = type;
        Hashtable ht = new Hashtable();
        ht["@Account"] = YZAuthHelper.LoginUserAccount;
        DataTable dt = DBUtil_APP.Query(datasql, ht).Tables[0];
        string legenddata = Convert.ToString(rv2["legend"]);
        ArrayList htdata = new ArrayList();
        Hashtable ht3 = new Hashtable();
        if (type.ToLower() != "pie")
        {
            string[] legend = legenddata.Split(',');
            for (int i = 0; i < dt.Columns.Count; i++)
            {
                string name = dt.Columns[i].ColumnName;
                if (i == 0)
                {
                    var list = dt.AsEnumerable().Select(c => c.Field<string>(name)).ToList();
                    rv["xdata"] = JArray.FromObject(list);
                }
                else
                {
                    Hashtable ht2 = new Hashtable();
                    if (legend.Length == dt.Columns.Count - 1)
                    {
                        ht2["name"] = legend[i - 1];
                    }
                    else
                    {
                        ht2["name"] = legend[0];
                    }
                    ht2["type"] = type.ToLower();
                    ht2["data"] = JArray.FromObject(dt.AsEnumerable().Select(d => d.Field<string>(name)).ToArray());
                    htdata.Add(ht2);
                }
            }
            rv["data2"] = JArray.FromObject(htdata);
            rv["legend"] = JArray.FromObject(Convert.ToString(rv2["legend"]).Split(','));
        }
        else
        {
            for (int i = 0; i < dt.Columns.Count; i++)
            {
                string name = dt.Columns[i].ColumnName;
                if (i == 0)
                {
                    dt.Columns[name].ColumnName = "name";
                }
                else if (i == 1)
                {
                    dt.Columns[name].ColumnName = "value";
                }
                else
                {
                    dt.Columns.Remove(name);

                }

            }

            ht3["type"] = "pie";
            ht3["data"] = dt;
            ht3["radius"] = "55%";
        }
        rv["data"] = JObject.FromObject(ht3);
        return rv;
    }


    public JObject GetInvoiceInfo(HttpContext context)
    {
        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        string localData = request.GetString("localData", "");
        string base64 = HttpUtility.UrlEncode(localData.Split(',')[1]);

        string result = com.baidu.ai.baidu.getVat_invoice(base64);
        JToken j = JObject.Parse(result);
        string error_code = Convert.ToString(j["error_code"]);
        rv["baidusuccess"] = "false";
        if (error_code == "")
        {
            rv["baidusuccess"] = "true";
            JToken ja = JToken.Parse(Convert.ToString(j["words_result"]));
            rv["InvoiceNum"] = Convert.ToString(ja["InvoiceNum"]);
            rv["TotalAmount"] = Convert.ToString(ja["TotalAmount"]);
            rv["TotalTax"] = Convert.ToString(ja["TotalTax"]);
            rv["AmountInFiguers"] = Convert.ToString(ja["AmountInFiguers"]);

            JArray jaa = JArray.Parse(Convert.ToString(ja["CommodityName"]));
            rv["word"] = Convert.ToString(jaa[0]["word"]);

        }
        else
        {

            rv["bderror_msg"] = Convert.ToString(j["error_msg"]);
        }

        return rv;
    }

    public JObject GetDdInvoiceInfo(HttpContext context)
    {

        YZRequest request = new YZRequest(context);
        JObject rv = new JObject();
        string mediaUrl = request.GetString("mediaUrl", "");

        System.Net.WebClient webClient = new System.Net.WebClient();
        webClient.Encoding = System.Text.Encoding.UTF8;
        webClient.Headers.Add(System.Net.HttpRequestHeader.KeepAlive, "false");

        using (System.IO.Stream stream = webClient.OpenRead(mediaUrl))
        {

            System.IO.MemoryStream ms = new System.IO.MemoryStream();
            stream.CopyTo(ms);
            //System.Drawing.Image img = System.Drawing.Image.FromStream(stream);
            //img.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
            byte[] buff = new byte[ms.Length];
            ms.Position = 0;
            ms.Read(buff, 0, (int)ms.Length);
            ms.Close();


            string pic = HttpUtility.UrlEncode(Convert.ToBase64String(buff.ToArray()));
            string result = com.baidu.ai.baidu.getVat_invoice(pic);
            JToken j = JObject.Parse(result);
            string error_code = Convert.ToString(j["error_code"]);
            rv["baidusuccess"] = "false";
            if (error_code == "")
            {
                rv["baidusuccess"] = "true";
                JToken ja = JToken.Parse(Convert.ToString(j["words_result"]));
                rv["InvoiceNum"] = Convert.ToString(ja["InvoiceNum"]);
                rv["TotalAmount"] = Convert.ToString(ja["TotalAmount"]);
                rv["TotalTax"] = Convert.ToString(ja["TotalTax"]);
                rv["AmountInFiguers"] = Convert.ToString(ja["AmountInFiguers"]);

                JArray jaa = JArray.Parse(Convert.ToString(ja["CommodityName"]));
                rv["word"] = Convert.ToString(jaa[0]["word"]);

            }
            else
            {

                rv["bderror_msg"] = Convert.ToString(j["error_msg"]);
            }

            return rv;
        }
       
    }

}