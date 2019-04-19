using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;


namespace YZAppAdmin
{
    /// <summary>
    /// DataSource 的摘要说明
    /// </summary>
    public class YZAppAdminDataSource : IYZAppAdminProvider
    {


        public void Dispose()
        {

        }


        /// <summary>
        /// 删除应用
        /// </summary>
        /// <param name="id"></param>
        public void DeleteApp(int id)
        {
            string sql = "delete  App_Index  where  id='" + id + "'";
            DBUtil_APP.ExecuteSqlWithGoUseTran(sql);
        }

   
 
        /// <summary>
        /// 读取应用
        /// </summary>
        /// <param name="type">类别</param>
        public List<AppModule> GetApplist(string type)
        {
            string sql = "";
            if (string.IsNullOrEmpty(type))
            {
                sql = "select * from  App_Index  order by  sort";
            }
            else
            {

                sql = "select * from  App_Index  where ViewType='" + type + "' order by sort";
            }

            DataTable dt = DBUtil_APP.Query(sql).Tables[0];
            return YZApp.DataTableToModel.ToListModel<AppModule>(dt);
        }
        /// <summary>
        /// 获取应用数据
        /// </summary>
        /// <param name="type">类别</param>
        /// <returns></returns>
        public List<ApplistItem> GetMApplist(string type)
        {
            List<ApplistItem> AP = new List<ApplistItem>();
            string sql = "";
            if (string.IsNullOrEmpty(type))
            {
                sql = " select VIEWTYPE,MAX(sort) as SORT from  App_Index where Enable=1  group by  VIEWTYPE  order by sort";
            }
            else
            {
                sql = " select VIEWTYPE,MAX(sort) as SORT from  App_Index   where    Enable=1  and ViewType='" + type + "'  group by  VIEWTYPE  order by sort";
            }
            DataTable dt = DBUtil_APP.Query(sql).Tables[0];
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                string GroupName = Convert.ToString(dt.Rows[i][0]);
                ApplistItem apl = new ApplistItem();
                apl.GroupName = GroupName;
                List<AppItem> atl = new List<AppItem>();
                string sql2 = " select AppName,AppUrl,Badge,Icon,IconColor,IconSize,Type,ID  from  App_Index  where     Enable=1  and VIEWTYPE='" + GroupName + "'  order by sort";
                DataTable dt2 = DBUtil_APP.Query(sql2).Tables[0];
                for (int j = 0; j < dt2.Rows.Count; j++)
                {
                    AppItem at = new AppItem();
                    at.AppName = Convert.ToString(dt2.Rows[j][0]);//应用名称
                    at.AppUrl = Convert.ToString(dt2.Rows[j][1]);//应用路径

                    string Badgesql = Convert.ToString(dt2.Rows[j][2]);//角标sql
                    if (Badgesql == "0" || Badgesql == "")
                    {
                        at.Badge = 0;
                    }
                    else
                    {
                        SqlParameter[] paras = new SqlParameter[]
                        { new SqlParameter("@Account",YZAuthHelper.LoginUserAccount)
                         };
                        at.Badge = Convert.ToInt32(DBUtil_APP.GetSingle(Badgesql, paras));
                    }
                    at.Icon = Convert.ToString(dt2.Rows[j][3]);//图标名称
                    at.IconColor = Convert.ToString(dt2.Rows[j][4]);//图标颜色
                    at.IconSize = Convert.ToString(dt2.Rows[j][5]);//图标大小
                    at.Type = Convert.ToString(dt2.Rows[j][6]);//图标类别
                    at.Json =Convert.ToString(DBUtil_APP.GetSingle("select  JSON from  APP_APPINFO  where PID='" + Convert.ToString(dt2.Rows[j][7]) + "'"));
                    atl.Add(at);
                }
                apl.App = atl;
                AP.Add(apl);
            }
            return AP;
        }

        /// <summary>
        /// 新增编辑应用
        /// </summary>
        /// <param name="id"></param>
        public void SaveApp(AppModule app)
        {
            if (app.Id == 0)
            {
                string sql = string.Format(@"INSERT INTO  App_Index
           ([CreateDate]
           ,[CreateUser]
           ,[AppName]
           ,[Icon]
           ,[IconColor]
           ,[IconSize]
           ,[AppUrl]
           ,[Enable]
           ,[Sort]
           ,[TYPE]
           ,[ViewType]
           ,[BADGE])
            VALUES
           ('{0}','{1}','{2}','{3}','{4}','{5}','{6}','{7}','{8}','{9}','{10}','{11}')", DateTime.Now.ToString(), YZAuthHelper.LoginUserAccount, app.AppName, app.Icon, app.IconColor, app.IconSize, app.AppUrl, app.Enable, app.Sort, app.Type, app.ViewType, app.BADGE);
                DBUtil_APP.ExecuteSqlWithGoUseTran(sql);

            }
            else
            {
                string sql = string.Format(@"UPDATE App_Index
   SET [CreateDate] = '{0}'
      ,[CreateUser] ='{1}'
      ,[AppName] = '{2}'
      ,[Icon] = '{3}'
      ,[IconColor] = '{4}'
      ,[IconSize] ='{5}'
      ,[AppUrl] = '{6}'
      ,[Enable] = '{7}'
      ,[Sort] = '{8}'
      ,[TYPE] = '{9}'
      ,[ViewType]='{10}',[BADGE]='{11}' where id='{12}'", DateTime.Now.ToString(), YZAuthHelper.LoginUserAccount, app.AppName, app.Icon, app.IconColor, app.IconSize, app.AppUrl, app.Enable, app.Sort, app.Type, app.ViewType, app.BADGE, app.Id);
                DBUtil_APP.ExecuteSqlWithGoUseTran(sql);

            }
        }

        public LoginModule LoadLogin()
        {
        
             string sql = "select * from  APP_LOGIN_CONFIG  ";
       
            DataTable dt = DBUtil_APP.Query(sql).Tables[0];
            if (dt.Rows.Count > 0)
            {

                return YZApp.DataTableToModel.ToSingleModel<LoginModule>(dt);
            }
            else {

                return new LoginModule();
            }
        }

        public PushNoticeModule LoadNotice()
        {
            string sql = "select * from  APP_NOTICE_CONFIG  ";

            DataTable dt = DBUtil_APP.Query(sql).Tables[0];
            if (dt.Rows.Count > 0)
            {

                return YZApp.DataTableToModel.ToSingleModel<PushNoticeModule>(dt);
            }
            else
            {

                return new PushNoticeModule();
            }
        }

      

        public void SaveLogin(LoginModule login)
        {
            string sql = string.Format(@"DELETE  APP_LOGIN_CONFIG;INSERT INTO [APP_LOGIN_CONFIG]
           (
            [CREATEDATE]
           ,[CREATEUSER]
           ,[WXLOGIN]
           ,[WXID]
           ,[WXAGENTID]
           ,[WXSECRET]
           ,[DDLOGIN]
           ,[DDID]
           ,[DDAGENTID]
           ,[DDSECRET]
           ,[OLOGIN], [DDCORPID],[WXLINKSQL],[DDLINKSQL])
     VALUES
           ('{0}'
           ,'{1}'
           ,'{2}'
           ,'{3}'
           ,'{4}'
           ,'{5}','{6}','{7}','{8}','{9}','{10}','{11}','{12}','{13}')", DateTime.Now.ToString(), YZAuthHelper.LoginUserAccount, login.WxLogin,  login.WxId, login.WxAgentId, login.WxSecret, login.DdLogin,  login.DdId,login.DdAgentId, login.DdSecret, login.OLogin,login.DdCorpId,login.WxLinkSql,login.DdLinkSql);
            DBUtil_APP.ExecuteSqlWithGoUseTran(sql);
        }

      

        public void SaveNotice(PushNoticeModule Notice)
        {
            string sql = string.Format(@"DELETE  APP_NOTICE_CONFIG;INSERT INTO [APP_NOTICE_CONFIG]
           ([CREATEDATE]
           ,[CREATEUSER]
           ,[WXID]
           ,[WXAGENTID]
           ,[WXSECRET]
           ,[WXPUSHURL]
           ,[DDID]
           ,[DDAGENTID]
           ,[DDSECRET],[DDPUSHURL],[WXLINKSQL],[DDLINKSQL])
     VALUES
           ('{0}'
           ,'{1}'
           ,'{2}'
           ,'{3}'
           ,'{4}'
           ,'{5}','{6}','{7}','{8}','{9}','{10}','{11}')", DateTime.Now.ToString(), YZAuthHelper.LoginUserAccount, Notice.WxId, Notice.WxAgentid, Notice.WxSecret, Notice.WxPushUrl, Notice.DdId, Notice.DdAgentid, Notice.DdSecret, Notice.DdPushUrl,Notice.WxLinkSql,Notice.DdLinkSql);
            DBUtil_APP.ExecuteSqlWithGoUseTran(sql);
        }




        public List<AppModule> GetMFavorite()
        {
            string sql = "select * from YZSysFavorites  A LEFT JOIN  App_Index  B  ON A.resID=B.AppName   LEFT JOIN  APP_APPINFO C ON B.ID=C.PID where  Enable=1  and  resType='App'   and  a.uid='" + YZAuthHelper.LoginUserAccount + "' and AppName is not null  ORDER BY orderIndex";
            DataTable dt = DBUtil_APP.Query(sql).Tables[0];
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                int Badge = 0;
                string Badgesql = Convert.ToString(dt.Rows[i]["BADGE"]);//角标sql
                if (Badgesql != "0" && Badgesql != "")
                {
                    SqlParameter[] paras = new SqlParameter[]
                        { new SqlParameter("@Account",YZAuthHelper.LoginUserAccount)
                         };
                   Badge = Convert.ToInt32(DBUtil_APP.GetSingle(Badgesql, paras));
                }
                dt.Rows[i]["BADGE"] = Badge;
                     
            }
            return YZApp.DataTableToModel.ToListModel<AppModule>(dt);

        }
        public void DeleteMFavorite(string resID)
        {
            string sql = "delete   YZSysFavorites   where resID='" + resID + "' and   resType='App'  and  uid='" + YZAuthHelper.LoginUserAccount + "' ";
            DBUtil_APP.ExecuteSqlWithGoUseTran(sql);
            
        }




        public List<SearchAppModule> SearchMApplist(string kwd)
        {
            string sql = "";
            if (string.IsNullOrEmpty(kwd))
            {
                 sql = @"select *,case   when resID is not null then 'true' else 'false' end as Favorited from App_Index  A LEFT JOIN YZSysFavorites  B  ON A.AppName=B.resID  and resType='App' and uid='" + YZAuthHelper.LoginUserAccount + @"'
                          LEFT JOIN  APP_APPINFO C ON A.ID=C.PID     where    Enable=1   and AppName is not null  ORDER BY a.Sort";
            }
            else
            {


                 sql = @"select *,case   when resID is not null then 'true' else 'false' end as Favorited from App_Index  A LEFT JOIN YZSysFavorites  B  ON A.AppName=B.resID  and resType='App' and uid='" + YZAuthHelper.LoginUserAccount + @"'
                          LEFT JOIN  APP_APPINFO C ON A.ID=C.PID    where  AppName like '%" + kwd + @"%' and  Enable=1   and AppName is not null  ORDER BY a.Sort";
             
            }
            DataTable dt = DBUtil_APP.Query(sql).Tables[0];
            return YZApp.DataTableToModel.ToListModel<SearchAppModule>(dt);
        }


        public void AddMFavorite(string resID)
        {

            string sql = "select * from  YZSysFavorites where uid='" + YZAuthHelper.LoginUserAccount + "' and resid='" + resID + "' and resType='App'";

            if (!DBUtil_APP.Exists(sql))
            {
                string sql3 = "select max(ORDERINDEX) from  YZSysFavorites where uid='" + YZAuthHelper.LoginUserAccount + "'  and resType='App'";
                int ORDERINDEX=Convert.ToInt32(DBUtil_APP.GetSingle(sql3))+1;
                string sql2 = string.Format(@"INSERT INTO [YZSysFavorites]
           (
            [UID]
           ,[RESTYPE]
           ,[RESID]
           ,[DATE]
           ,[COMMENTS]
           ,[ORDERINDEX]
           )
     VALUES
           ('{0}'
           ,'{1}'
           ,'{2}'
           ,'{3}'
           ,'{4}'
           ,'{5}')", YZAuthHelper.LoginUserAccount, "App", resID, DateTime.Now.ToString(), "", ORDERINDEX);
                DBUtil_APP.ExecuteSqlWithGoUseTran(sql2);
            
            }

          
        }


        public void SaveAppInfo(AppInfoModule aim)
        {
            string sql = @"DELETE  APP_APPINFO WHERE PID='"+aim.PID+@"';INSERT INTO APP_APPINFO
           ([UID]
           ,[PID]
           ,[CREATEDATE]
           ,[JSON])
     VALUES
           ('" + aim.UID+ @"'
           ,'" + aim.PID + @"'
           ,'" + aim.CREATEDATE + @"'
           ,'" + aim.JSON + "')";
            DBUtil_APP.ExecuteSqlWithGoUseTran(sql);
        }

        public AppInfoModule LoadAppInfo(string pid)
        {
            string sql = @"select * from   APP_APPINFO where PID='" + pid + "' ";
            if (DBUtil_APP.Exists("select count(*) from   APP_APPINFO where PID='" + pid + "' "))
            {
                DataTable dt = DBUtil_APP.Query(sql).Tables[0];
                if (dt.Rows.Count > 0)
                {

                    return YZApp.DataTableToModel.ToSingleModel<AppInfoModule>(dt);
                }
                else
                {

                    return new AppInfoModule();
                }
            }
            else {

                return new AppInfoModule();
            }
        }


        public OrgSyncInfoModule LoadOrgSyncConfig()
        {
            string sql = "select * from  APP_ORGSYNC ";

            DataTable dt = DBUtil_APP.Query(sql).Tables[0];
            if (dt.Rows.Count > 0)
            {

                return YZApp.DataTableToModel.ToSingleModel<OrgSyncInfoModule>(dt);
            }
            else
            {

                return new OrgSyncInfoModule();
            }
        }


        public void SaveOrgSyncConfig(OrgSyncInfoModule OrgSync)
        {
            string sql = string.Format(@"DELETE  APP_ORGSYNC;INSERT INTO [APP_ORGSYNC]
           (
            [WXCORPID]
           ,[WXSECRET]
           ,[DDCORPID]
           ,[DDSECRET]
,[DDOUSQL]
,[DDUSERSQL]
,[WXOUSQL]
,[WXUSERSQL]
          )
     VALUES
           ('{0}'
           ,'{1}'
           ,'{2}'
           ,'{3}','{4}','{5}','{6}','{7}'
           )", OrgSync.WxCorpId, OrgSync.WxSecret,OrgSync.DdCorpId,OrgSync.DdSecret,System.Web.HttpUtility.HtmlEncode(OrgSync.DdOuSql),System.Web.HttpUtility.HtmlEncode(OrgSync.DdUserSql),System.Web.HttpUtility.HtmlEncode(OrgSync.WxOuSql),System.Web.HttpUtility.HtmlEncode(OrgSync.WxUserSql));
            DBUtil_APP.ExecuteSqlWithGoUseTran(sql);
        }
    }




}