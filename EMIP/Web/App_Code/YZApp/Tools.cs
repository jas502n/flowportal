using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Web;
using BPM.Client;
using YZSoft.Web.Org;
namespace YZApp
{

    public static class App
    {

        public static string GetAllAppId(string sid)
        {
            string appid = "";
            if (string.IsNullOrEmpty(sid))
            {
                using (BPMConnection cn = new BPMConnection())
                {
                    cn.WebOpen();
                    object[] groups = OrgManager.GetGroups(cn, YZAuthHelper.LoginUserAccount);
                    ArrayList al = (ArrayList)JSON.Decode(JsonConvert.SerializeObject(groups));
                    for (int i = 0; i < al.Count; i++)
                    {
                        Hashtable ht = (Hashtable)al[i];
                        string sids = Convert.ToString(ht["SID"]);

                        DataTable dt = DBUtil_APP.Query("select APPID from  APP_APPAUTH where sid=" + sids + "").Tables[0];
                        for (int j = 0; j < dt.Rows.Count; j++)
                        {
                            appid += "'" + dt.Rows[j][0] + "',";
                        }
                    }
                    DataTable dtt = DBUtil_APP.Query("select APPID from  APP_APPAUTH where sid='S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542'").Tables[0];
                    for (int j = 0; j < dtt.Rows.Count; j++)
                    {
                        appid += "'" + dtt.Rows[j][0] + "',";
                    }

                }
            }
            else
            {
                DataTable dt = DBUtil_APP.Query("select APPID from  APP_APPAUTH where sid=" + sid + "").Tables[0];
                for (int j = 0; j < dt.Rows.Count; j++)
                {
                    appid += "'" + dt.Rows[j][0] + "',";
                }
            }
            if (!string.IsNullOrEmpty(appid))
            {
                return appid.Trim(',');
            }
            else {
                return "'-1'";
            }
            
        }

    }







    /// <summary>
    /// DataTableToModel 的摘要说明
    /// </summary>
    public static class DataTableToModel
    {
        /// <summary>
        /// DataTable通过反射获取单个像
        /// </summary>
        public static T ToSingleModel<T>(this DataTable data) where T : new()
        {
            T t = data.GetList<T>(null, true).Single();
            return t;
        }


        /// <summary>
        /// DataTable通过反射获取单个像
        /// <param name="prefix">前缀</param>
        /// <param name="ignoreCase">是否忽略大小写，默认不区分</param>
        /// </summary>
        public static T ToSingleModel<T>(this DataTable data, string prefix, bool ignoreCase = true) where T : new()
        {
            T t = data.GetList<T>(prefix, ignoreCase).Single();
            return t;
        }

        /// <summary>
        /// DataTable通过反射获取多个对像
        /// </summary>
        /// <typeparam name="type"></typeparam>
        /// <param name="type"></param>
        /// <returns></returns>
        public static List<T> ToListModel<T>(this DataTable data) where T : new()
        {
            List<T> t = data.GetList<T>(null, true);
            return t;
        }


        /// <summary>
        /// DataTable通过反射获取多个对像
        /// </summary>
        /// <param name="prefix">前缀</param>
        /// <param name="ignoreCase">是否忽略大小写，默认不区分</param>
        /// <returns></returns>
        private static List<T> ToListModel<T>(this DataTable data, string prefix, bool ignoreCase = true) where T : new()
        {
            List<T> t = data.GetList<T>(prefix, ignoreCase);
            return t;
        }



        private static List<T> GetList<T>(this DataTable data, string prefix, bool ignoreCase = true) where T : new()
        {
            List<T> t = new List<T>();
            int columnscount = data.Columns.Count;
            if (ignoreCase)
            {
                for (int i = 0; i < columnscount; i++)
                    data.Columns[i].ColumnName = data.Columns[i].ColumnName.ToUpper();
            }
            try
            {
                var properties = new T().GetType().GetProperties();

                var rowscount = data.Rows.Count;
                for (int i = 0; i < rowscount; i++)
                {
                    var model = new T();
                    foreach (var p in properties)
                    {
                        var keyName = prefix + p.Name + "";
                        if (ignoreCase)
                            keyName = keyName.ToUpper();
                        for (int j = 0; j < columnscount; j++)
                        {
                            if (data.Columns[j].ColumnName == keyName && data.Rows[i][j] != null)
                            {
                                string pval = data.Rows[i][j].ToString();
                                if (!string.IsNullOrEmpty(pval))
                                {
                                    try
                                    {
                                        // We need to check whether the property is NULLABLE
                                        if (p.PropertyType.IsGenericType && p.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
                                        {
                                            p.SetValue(model, Convert.ChangeType(data.Rows[i][j], p.PropertyType.GetGenericArguments()[0]), null);
                                        }
                                        else
                                        {
                                            p.SetValue(model, Convert.ChangeType(data.Rows[i][j], p.PropertyType), null);
                                        }
                                    }
                                    catch (Exception x)
                                    {
                                        throw x;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    t.Add(model);
                }
            }
            catch (Exception ex)
            {


                throw ex;
            }


            return t;
        }
        /// <summary>
        /// 将集合类转换为DataTable
        /// </summary>
        /// <param name="list"></param>
        /// <returns></returns>
        public static DataTable ToDataTableTow(IList list)
        {
            if (list.Count == 0) return null;
            DataTable dt = new DataTable();
            PropertyInfo[] propertys = list[0].GetType().GetProperties();
            foreach (PropertyInfo pi in propertys)
            {
                dt.Columns.Add(pi.Name, pi.PropertyType);//添加列
            }
            List<object> tempList = null;
            for (int i = 0; i < list.Count; i++)
            {
                tempList = new List<object>();
                foreach (PropertyInfo pi in propertys)
                {
                    tempList.Add(pi.GetValue(list[i], null));
                }
                dt.LoadDataRow(tempList.ToArray(), true);
            }
            return dt;
        }


        /// <summary>
        /// C# Hashtable转object实体对象
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="source"></param>
        /// <returns></returns>
        public static T Hashtable2Object<T>(Hashtable source)
        {
            T obj = Activator.CreateInstance<T>();
            object tv;

            PropertyInfo[] ps = obj.GetType().GetProperties(System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.Public);
            foreach (PropertyInfo p in ps)
            {
                if (source.ContainsKey(p.Name))
                {
                    tv = source[p.Name];

                    if (p.PropertyType.IsArray)//数组类型,单独处理
                    {
                        p.SetValue(obj, tv, null);
                    }
                    else if (p.PropertyType.FullName == "System.Collections.ArrayList")
                    {
                        p.SetValue(obj, tv, null);
                    }
                    else
                    {
                        if (String.IsNullOrEmpty(tv.ToString()))//空值
                            tv = p.PropertyType.IsValueType ? Activator.CreateInstance(p.PropertyType) : null;//值类型
                        else
                            tv = System.ComponentModel.TypeDescriptor.GetConverter(p.PropertyType).ConvertFromString(tv.ToString());//创建对象

                        p.SetValue(obj, tv, null);
                    }

                }
            }

            return obj;
        }


    }


}
