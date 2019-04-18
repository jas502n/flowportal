using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using System.Net;
using System.IO;
using System.Collections;
using System.Threading;

namespace WeChatSync
{
    class Program
    {
        public static int ParentOUID = 3058;//部门根目录ID
        public static string Corpid = "wxb4d141e3e359dbba";//微信corpid
        public static string Corpsecret = "du3flOokj6tzSeR0hRnqxFgsRxAMF0G7hRBLLF6dAFQ";//微信corpsecret
        public static string OUPath = "E:\\wechat\\WeChatSync\\WeChatSync\\bin\\batch_party_sample.csv";//部门模板文件路径
        public static string UserPath = "E:\\wechat\\WeChatSync\\WeChatSync\\bin\\batch_user_sample.csv";//用户模板文件路径
        public static string logpath = "E:\\wechat\\WeChatSync\\WeChatSync\\bin\\wxlog";//日志存放文件夹
        public static string connectionString = "Data Source=139.196.204.38;Initial Catalog=BPMDB;Integrated Security=False;User ID=sa;Password=Abc123";//数据库连接
        static void Main(string[] args)
        {
            syncou();//同步部门
            syncuser();//同步用户
        }
        public static void syncou()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("============================同步部门开始,日期" + DateTime.Now.ToString() + "=======================");
            sb.Append(Environment.NewLine);
            sb.Append("获取Access_Token");
            sb.Append(Environment.NewLine);
            string Access_Token = wxhelper.Get_Access_Token(Corpid, Corpsecret);//获取Access_Token
            sb.Append("" + Access_Token + "");
            sb.Append(Environment.NewLine);
            if (string.IsNullOrEmpty(Access_Token))
            {
                sb.Append("============================获取Access_Token失败,结束同步=======================");
                wxhelper.WriteLog(logpath, sb.ToString());
                return;
            }
            sb.Append("获取同步部门数量");
            sb.Append(Environment.NewLine);
            DataTable dt = OUData();//获取同步部门
            sb.Append("" + dt.Rows.Count + "");
            sb.Append(Environment.NewLine);
            if (dt.Rows.Count == 0)
            {
                sb.Append("============================部门数量为0,结束同步=======================");
                wxhelper.WriteLog(logpath, sb.ToString());
                return;
            }
            sb.Append("生成部门Csv");
            sb.Append(Environment.NewLine);
            bool sc = dt2csv(dt, OUPath, "部门名称,部门ID,父部门ID,排序");//生成部门Csv
            if (sc == false)
            {
                sb.Append("============================生成部门Csv失败,结束同步=======================");
                wxhelper.WriteLog(logpath, sb.ToString());
                return;
            }
            sb.Append("上传部门Csv到微信");
            sb.Append(Environment.NewLine);
            Hashtable result = wxhelper.HttpUploadFile(Access_Token, OUPath);//上传到微信
            string media_id = result["media_id"].ToString();
            sb.Append("获取media_id:" + media_id + "");
            sb.Append(Environment.NewLine);
            sb.Append("执行覆盖部门");
            sb.Append(Environment.NewLine);
            Hashtable result2 = wxhelper.FullConvertDept(media_id, Access_Token);
            if (result2["errcode"].ToString() != "0")
            {
                sb.Append("============================覆盖部门失败," + result2["errmsg"].ToString() + "=======================");
                sb.Append(Environment.NewLine);
                sb.Append("============================结束同步=======================");
                sb.Append(Environment.NewLine);
                wxhelper.WriteLog(logpath, sb.ToString());
                return;

            }
            sb.Append("============================异步任务id:" + result2["jobid"].ToString() + "=======================");
            sb.Append(Environment.NewLine);
            Thread.Sleep(3000);
            sb.Append(Environment.NewLine);
            sb.Append("===========================同步结果=======================");
            sb.Append(Environment.NewLine);
            sb.Append(wxhelper.Getresult(result2["jobid"].ToString(), Access_Token));
            sb.Append(Environment.NewLine);
            sb.Append("============================结束同步=======================");
            sb.Append(Environment.NewLine);
            sb.Append(Environment.NewLine);
            sb.Append(Environment.NewLine);
            wxhelper.WriteLog(logpath, sb.ToString());




        }
        public static void syncuser()
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("============================同步用户开始,日期" + DateTime.Now.ToString() + "=======================");
            sb.Append(Environment.NewLine);
            sb.Append("获取Access_Token");
            sb.Append(Environment.NewLine);
            string Access_Token = wxhelper.Get_Access_Token(Corpid, Corpsecret);//获取Access_Token
            sb.Append("" + Access_Token + "");
            sb.Append(Environment.NewLine);
            if (string.IsNullOrEmpty(Access_Token))
            {
                sb.Append("============================获取Access_Token失败,结束同步=======================");
                sb.Append(Environment.NewLine);
                wxhelper.WriteLog(logpath, sb.ToString());
                return;
            }
            sb.Append("获取同步用户数量");
            sb.Append(Environment.NewLine);
            DataTable dt = UserData(); //获取同步用户
            sb.Append("" + dt.Rows.Count + "");
            sb.Append(Environment.NewLine);
            if (dt.Rows.Count == 0)
            {
                sb.Append("============================用户数量为0,结束同步=======================");
                sb.Append(Environment.NewLine);
                wxhelper.WriteLog(logpath, sb.ToString());
                return;
            }
            sb.Append("生成用户Csv");
            sb.Append(Environment.NewLine);
            bool sc = dt2csv(dt, UserPath, "姓名,帐号,手机号,邮箱,所在部门,职位,性别"); ;//生成用户Csv
            if (sc == false)
            {
                sb.Append("============================生成用户Csv失败,结束同步=======================");
                sb.Append(Environment.NewLine);
                wxhelper.WriteLog(logpath, sb.ToString());
                return;
            }
            sb.Append("上传用户Csv到微信");
            sb.Append(Environment.NewLine);
            Hashtable result = wxhelper.HttpUploadFile(Access_Token, UserPath);//上传到微信
            string media_id = result["media_id"].ToString();
            sb.Append("获取media_id:" + media_id + "");
            sb.Append(Environment.NewLine);
            sb.Append("执行覆盖用户");
            sb.Append(Environment.NewLine);
            Hashtable result2 = wxhelper.UpdateConvertMember(media_id, Access_Token);
            if (result2["errcode"].ToString() != "0")
            {
                sb.Append("============================覆盖用户失败," + result2["errmsg"].ToString() + "=======================");
                sb.Append(Environment.NewLine);
                sb.Append("============================结束同步=======================");
                sb.Append(Environment.NewLine);
                wxhelper.WriteLog(logpath, sb.ToString());
                return;

            }
            sb.Append("============================异步任务id:"+ result2["jobid"].ToString() + "=======================");
            sb.Append(Environment.NewLine);
            Thread.Sleep(3000);
            sb.Append(Environment.NewLine);
            sb.Append("===========================同步结果=======================");
            sb.Append(Environment.NewLine);
            sb.Append(wxhelper.Getresult(result2["jobid"].ToString(), Access_Token));
            sb.Append(Environment.NewLine);
            sb.Append("============================结束同步=======================");
            sb.Append(Environment.NewLine);
            sb.Append(Environment.NewLine);
            sb.Append(Environment.NewLine);
            wxhelper.WriteLog(logpath, sb.ToString());
        }
        /// <summary>
        /// 获取部门数据源
        /// </summary>
        /// <param name="ParentOUID">根目录</param>
        /// <returns></returns>
        public static DataTable OUData()
        {

            DataTable dt = new DataTable();
            try
            {
                string SQL = @"with cte as  (
 select OUName AS 部门名称,Code AS 部门Code, OUID AS 部门ID, 
 ISNULL(ParentOUID,0) AS 父部门ID,OrderIndex AS  排序 from BPMSysOUs A where ParentOUID="+ ParentOUID +@"
 union all   
 select OUName AS 部门名称,Code AS 部门Code,OUID AS 部门ID,ISNULL(ParentOUID,0) AS 父部门ID,OrderIndex AS  排序 from BPMSysOUs K inner join cte c on c.部门ID = k.ParentOUID  
 )select 部门名称, 部门ID,CASE WHEN 父部门ID=3058 THEN 1 ELSE 父部门ID END AS 父部门ID,排序 from cte  ParentOUID
 ";
                DBUtil.connectionString = connectionString;
                dt = DBUtil.Query(SQL).Tables[0];
            }
            catch (Exception)
            {

            }

            return dt;
        }
        /// <summary>
        /// 获取用户数据源
        /// </summary>
        /// <returns></returns>
        public static DataTable UserData()
        {
            DataTable dt = new DataTable();
            try
            {
                string SQL = @" 
  
 with aa as( SELECT B.DisplayName,A.UserAccount,B.Mobile,B.EMail,
  OUID,
 (SELECT TOP 1 LeaderTitle FROM BPMSysOUMembers WHERE UserAccount=A.UserAccount) LeaderTitle,case when Sex='Female' then '女'
else '男'end as Sex
FROM  BPMSysOUMembers A INNER JOIN BPMSysUsers B 
ON A.UserAccount=B.Account
WHERE B.DisplayName IS NOT NULL AND B.Mobile IS NOT NULL AND Disabled=0
)

select DisplayName,UserAccount,Mobile,EMail,
  stuff((select ';'+CONVERT(nvarchar(50),OUID) from aa 
where a.UserAccount=UserAccount for xml path('')),1,1,'') as OUID,LeaderTitle,Sex
from aa as a group by DisplayName,UserAccount,Mobile,EMail,LeaderTitle,Sex

";
                DBUtil.connectionString = connectionString;
                dt = DBUtil.Query(SQL).Tables[0];
            }
            catch (Exception)
            {


            }


            return dt;
        }
        /// <summary>
        /// 转为csv文件
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="strFilePath"></param>
        /// <param name="columname"></param>
        /// <returns></returns>
        public static bool dt2csv(DataTable dt, string strFilePath, string columname)
        {
            StreamWriter streamWriter = new StreamWriter(strFilePath, false, Encoding.UTF8);
            bool result;
            try
            {
                streamWriter.WriteLine(columname);
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    string text = "";
                    for (int j = 0; j < dt.Columns.Count; j++)
                    {
                        if (j > 0)
                        {
                            text += ",";
                        }
                        text += dt.Rows[i][dt.Columns[j]].ToString();
                    }
                    streamWriter.WriteLine(text);
                }
                streamWriter.Close();
                result = true;
            }
            catch
            {
                streamWriter.Close();
                result = false;
            }
            return result;
        }

    }
}
