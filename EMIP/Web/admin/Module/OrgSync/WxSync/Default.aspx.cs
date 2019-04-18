using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using WeChatSync;
using System.Data;
using YZAppAdmin;
using System.IO;
using System.Collections;
using System.Threading;
public partial class admin_Module_OrgSync_WxSync_Default : System.Web.UI.Page
{
    public static OrgSyncInfoModule m = new OrgSyncInfoModule();
    public static string OUPath = "";
    public static string UserPath = "";
    protected void Page_Load(object sender, EventArgs e)
    {
        using (IYZAppAdminProvider app = IYZAppAdminProviderManager.DefaultProvider)
        {
            m = app.LoadOrgSyncConfig();
        }
        OUPath = Server.MapPath("") + "\\batch_party_sample.csv";
        UserPath = Server.MapPath("") + "\\batch_user_sample.csv";
        HttpContext context = this.Context;
        YZRequest request = new YZRequest(context);
        string method = request.GetString("method","");
        if (method == "syncou")
        {
            syncou();
        }
        if (method == "syncuser")
        {
            syncuser();

        }
        if (method == "all")
        {
            syncou();
            syncuser();

        }

    }
    public static void syncou() {

       
        Res("=========同步部门==========");
        Res("开始获取Access_Token");
        string Access_Token = wxhelper.Get_Access_Token(m.WxCorpId, m.WxSecret);//获取Access_Token
        if (string.IsNullOrEmpty(Access_Token))
        {
            Res("获取Access_Token失败,结束同步");
            return;
        }
        Res("Access_Token," + Access_Token);
        Res("开始获取同步部门数量");
        DataTable dt = OUData();//获取同步部门
        if (dt.Rows.Count == 0)
        {
            Res("部门数量为0,请检查SQL,结束同步");
            return;
        }
        Res("部门数量为:"+dt.Rows.Count+"");
        Res("开始生成部门Csv");
        bool sc = dt2csv(dt, OUPath, "部门名称,部门ID,父部门ID,排序");
        if (sc == false)
        {
            Res("生成部门Csv失败,结束同步");
            return;
        }
        Res("开始上传部门Csv到微信");
        Hashtable result = wxhelper.HttpUploadFile(Access_Token, OUPath);//上传到微信
        string media_id = result["media_id"].ToString();
        Res("获取media_id:" + media_id + "");
        Res("开始执行覆盖部门");
        Hashtable result2 = wxhelper.FullConvertDept(media_id, Access_Token);
        if (result2["errcode"].ToString() != "0")
        {
            Res("覆盖部门失败," + result2["errmsg"].ToString() +"");
            Res("结束同步");
            return;
        }
        Res("异步任务id:" + result2["jobid"].ToString() +"");
        Thread.Sleep(3000);
        Res("开始同步结果");
        Res(wxhelper.Getresult(result2["jobid"].ToString(), Access_Token));
        Res("=========结束同步部门==========");
 
    }

    public static void syncuser()
    {

        Res("=========同步人员==========");
        Res("开始获取Access_Token");
        string Access_Token = wxhelper.Get_Access_Token(m.WxCorpId, m.WxSecret);//获取Access_Token
        if (string.IsNullOrEmpty(Access_Token))
        {
            Res("获取Access_Token失败,结束同步");
            return;
        }
        Res("Access_Token," + Access_Token);
        Res("开始获取同步人员数量");
        DataTable dt = UserData();//获取同步人员
        if (dt.Rows.Count == 0)
        {
            Res("人员数量为0,请检查SQL,结束同步");
            return;
        }
        Res("人员数量为:" + dt.Rows.Count + "");
        Res("开始生成人员Csv");
        bool sc = dt2csv(dt, UserPath, "姓名,帐号,手机号,邮箱,所在部门,职位,性别"); ;//生成用户Csv
        if (sc == false)
        {
            Res("生成人员Csv失败,结束同步");
            return;
        }
        Res("开始上传人员Csv到微信");
        Hashtable result = wxhelper.HttpUploadFile(Access_Token, UserPath);
        string media_id = result["media_id"].ToString();
        Res("获取media_id:" + media_id + "");
        Res("开始执行覆盖人员");
        Hashtable result2 = wxhelper.UpdateConvertMember(media_id, Access_Token);
        if (result2["errcode"].ToString() != "0")
        {
            Res("覆盖人员失败," + result2["errmsg"].ToString() + "");
            Res("结束同步");
            return;
        }
        Res("异步任务id:" + result2["jobid"].ToString() +"");
        Thread.Sleep(3000);
        Res("开始同步结果");
        Res(wxhelper.Getresult(result2["jobid"].ToString(), Access_Token));
        Res("=========结束同步人员==========");
 
       
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
            string SQL = System.Web.HttpUtility.HtmlDecode(m.WxOuSql);

            dt = DBUtil_APP.Query(SQL).Tables[0];
        }
        catch (Exception ex)
        {
            Res("获取部门数据源失败,"+ex.Message);
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
            string SQL = System.Web.HttpUtility.HtmlDecode(m.WxUserSql);
          
            dt = DBUtil_APP.Query(SQL).Tables[0];
        }
        catch (Exception ex)
        {
            Res("获取人员数据源失败," + ex.Message);
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
        bool result;
        
        try
        {
            StreamWriter streamWriter = new StreamWriter(strFilePath, false, Encoding.UTF8);
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
        catch(Exception ex)
        {
            //streamWriter.Close();
            result = false;
            Res(ex.Message);
        }
        
        return result;
    }
    public static void Res( string message){

        HttpContext context = HttpContext.Current;
        string mes = DateTime.Now.ToString() + ":&nbsp;&nbsp;" + message + "<br>";
        context.Response.Write(mes);
    }

}