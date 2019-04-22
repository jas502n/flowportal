using DingTalk.Api;
using DingTalk.Api.Request;
using DingTalk.Api.Response;
using System;
using System.Collections.Generic;
using System.Text;
using System.Data;
using System.Linq;
using System.Collections;
using FastJSON;
using System.Reflection;

namespace DingTalkOrgSync
{
    static class Program
    {
        public static string AccessToken = "";
        public static string Appkey = "dingmfn1n4i7hoeg9ofm";
        public static string Appsecret = "3fy8B6NK-mIpmFTpbsX1yfSZrISdkKCIwq2-oM8YXO3jGNn5VIvrHnzoT21Wkm6R";
        public static string DeptSQL = @" with cte as  (
 select OUName,Code, OUID,
 ISNULL(ParentOUID,0) AS ParentOUID,OrderIndex  from BPMSysOUs A where ParentOUID=1
 union all
 select K.OUName,K.Code,K.OUID,ISNULL(K.ParentOUID,0) AS ParentOUID,K.OrderIndex from BPMSysOUs K inner join cte c on c.OUID = k.ParentOUID
 )
 select OUName, a.OUID,ParentOUID,OrderIndex,ISNULL(b.DDID,'')AS DDID from cte  A
 LEFT JOIN APP_ORGSYNC_DEPTBPM2DD  B ON A.OUID=B.OUID";
        public static string UserSQL = @"with aa as( SELECT B.DisplayName,A.UserAccount,B.Mobile,B.EMail,OUID,B.HRID,
 (SELECT TOP 1 LeaderTitle FROM BPMSysOUMembers WHERE UserAccount = A.UserAccount) LeaderTitle
   FROM  BPMSysOUMembers A INNER JOIN BPMSysUsers B
ON A.UserAccount=B.Account
 WHERE B.DisplayName IS NOT NULL AND B.Mobile IS NOT NULL AND Disabled = 0)
select DisplayName as Name,UserAccount as Userid,Mobile,EMail,HRID,
  stuff((select ';'+CONVERT(nvarchar(50),OUID) from aa
 where a.UserAccount=UserAccount for xml path('')),1,1,'') as OUID,LeaderTitle
 from aa as a group by DisplayName, UserAccount, Mobile, EMail, LeaderTitle, HRID";
        public static String connectionString = "Data Source=(local);Initial Catalog=BPMDB_58;User ID=sa;Password=user01";

        static void Main(string[] args)
        {
            OapiGettokenResponse response = GetAccessToken();
            DBUtil_APP.connectionString = connectionString;
            if (response.Errcode == 0)
            {
                AccessToken = response.AccessToken;
                OrgSync();
                UserSync();


            }
        }
        /// <summary>
        /// 同步部门
        /// </summary>
        public static void OrgSync()
        {

            OapiDepartmentListResponse responsedep = GetDepList();
            List<OapiDepartmentListResponse.DepartmentDomain> deptlist = responsedep.Department;
            DataTable dt = GetDepData();
            CreateUpdateDep(dt, deptlist);//执行创建更新
            DeleteDep(dt, deptlist);//执行删除
        }
        /// <summary>
        /// 同步人员
        /// </summary>
        public static void UserSync()
        {
            OapiDepartmentListResponse responsedep = GetDepList();
            List<OapiDepartmentListResponse.DepartmentDomain> deptlist = responsedep.Department;
            DataTable dt = GetUserData();
            CreateUpdateUser(dt);//执行创建更新
            DeleteUser(dt, deptlist);//执行删除
        }
        /// <summary>
        /// 获取AccessToken
        /// </summary>
        /// <returns></returns>
        public static OapiGettokenResponse GetAccessToken()
        {
            DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/gettoken");
            OapiGettokenRequest request = new OapiGettokenRequest();
            request.Appkey = Appkey;
            request.Appsecret = Appsecret;
            request.SetHttpMethod("GET");
            OapiGettokenResponse response = client.Execute(request);
            return response;
        }
        /// <summary>
        /// 获取部门列表
        /// </summary>
        /// <returns></returns>
        public static OapiDepartmentListResponse GetDepList()
        {
            DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/department/list");
            OapiDepartmentListRequest request = new OapiDepartmentListRequest();
            request.Id = "1";
            request.SetHttpMethod("GET");
            OapiDepartmentListResponse response = client.Execute(request, AccessToken);
            return response;
        }
        /// <summary>
        /// 获取部门数据源
        /// </summary>
        /// <returns></returns>
        public static DataTable GetDepData()
        {
            string sql = DeptSQL;
            return DBUtil_APP.Query(sql).Tables[0];
        }
        /// <summary>
        /// 执行创建和更新部门
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="deptlist"></param>
        public static void CreateUpdateDep(DataTable dt, List<OapiDepartmentListResponse.DepartmentDomain> deptlist)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                long DDID = Convert.ToInt32(dt.Rows[i]["DDID"]);//部门ID
                string Parentid = Convert.ToString(dt.Rows[i]["ParentOUID"]);//父级部门ID
                string Name = Convert.ToString(dt.Rows[i]["OUName"]);//部门名称
                string Order = Convert.ToString(dt.Rows[i]["OrderIndex"]);//排序
                int OUID = Convert.ToInt32(dt.Rows[i]["OUID"]);//部门ID
                string ddParentid = GETParentID(Parentid);
                if (deptlist != null)
                {
                    List<OapiDepartmentListResponse.DepartmentDomain> newlist = deptlist.Where(x => x.Id == DDID).ToList();
                    if (newlist != null)//存在执行更新
                    {
                        OapiDepartmentUpdateRequest DeptInfo = new OapiDepartmentUpdateRequest();
                        DeptInfo.Id = DDID;
                        DeptInfo.Parentid = ddParentid;
                        DeptInfo.Name = Name;
                        DeptInfo.Order = Order;
                        OapiDepartmentUpdateResponse response = UpdateDep(DeptInfo);
                        if (response.Errcode == 0)
                        {
                          

                        }
                        else
                        {
                           
                        }
                    }
                }
                else//不存在执行创建
                {
                    OapiDepartmentCreateRequest DeptInfo = new OapiDepartmentCreateRequest();
                    DeptInfo.Parentid = ddParentid;
                    DeptInfo.Name = Name;
                    DeptInfo.Order = Order;
                    OapiDepartmentCreateResponse response = CreateDep(DeptInfo);
                    if (response.Errcode == 0)
                    {
                       
                        BPM2DD(OUID, response.Id);
                    }
                    else
                    {
                       
                    }
                }
            }


        }
        /// <summary>
        /// 执行删除部门
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="deptlist"></param>
        public static void DeleteDep(DataTable dt, List<OapiDepartmentListResponse.DepartmentDomain> deptlist)
        {
            for (int i = 0; i < deptlist.Count; i++)
            {
                long id = deptlist[i].Id;
                if (dt.Select("DDID='" + id + "'").Length == 0)
                {
                    OapiDepartmentDeleteRequest deptinfo = new OapiDepartmentDeleteRequest();
                    deptinfo.SetHttpMethod("GET");
                    deptinfo.Id = Convert.ToString(id);
                    OapiDepartmentDeleteResponse response = DeleteDep(deptinfo);

                    if (response.Errcode == 0)
                    {
                        DELETEBPM2DD(id);
                    }
                }
            }


        }
        /// <summary>
        /// 部门更新
        /// </summary>
        /// <returns></returns>
        public static OapiDepartmentUpdateResponse UpdateDep(OapiDepartmentUpdateRequest deptinfo)
        {
            DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/department/update");
            OapiDepartmentUpdateResponse response = client.Execute(deptinfo, AccessToken);
            return response;
        }
        /// <summary>
        /// 部门创建
        /// </summary>
        /// <returns></returns>
        public static OapiDepartmentCreateResponse CreateDep(OapiDepartmentCreateRequest deptinfo)
        {
            DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/department/create");
            OapiDepartmentCreateResponse response = client.Execute(deptinfo, AccessToken);
            return response;
        }

        /// <summary>
        /// 部门删除
        /// </summary>
        /// <returns></returns>
        public static OapiDepartmentDeleteResponse DeleteDep(OapiDepartmentDeleteRequest deptinfo)
        {
            DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/department/delete");
            OapiDepartmentDeleteResponse response = client.Execute(deptinfo, AccessToken);
            return response;
        }
        /// <summary>
        /// 更新部门中间表
        /// </summary>
        /// <returns></returns>
        public static void BPM2DD(int id, long ddid)
        {

            string sql = @"DELETE APP_ORGSYNC_DEPTBPM2DD WHERE OUID='" + id + "'; INSERT APP_ORGSYNC_DEPTBPM2DD values('" + id + "','" + ddid + "','" + DateTime.Now.ToString() + "')";
            DBUtil_APP.ExecuteSqlWithGoUseTran(sql);

        }
        /// <summary>
        ///获取父级ID
        /// </summary>
        /// <returns></returns>
        public static string GETParentID(string id)
        {
            if (id == "1")
            {
                return "1";
            }
            else
            {
                string sql = @"select  DDID from APP_ORGSYNC_DEPTBPM2DD WHERE OUID='" + id + "';";
                return Convert.ToString(DBUtil_APP.GetSingle(sql));

            }


        }
        /// <summary>
        /// 删除部门中间表
        /// </summary>
        /// <returns></returns>
        public static void DELETEBPM2DD(long id)
        {

            string sql = @"DELETE APP_ORGSYNC_DEPTBPM2DD WHERE DDID='" + id + "';";
            DBUtil_APP.ExecuteSqlWithGoUseTran(sql);

        }
        /// <summary>
        /// 获取人员数据源
        /// </summary>
        /// <returns></returns>
        public static DataTable GetUserData()
        {

            string sql = UserSQL;
            return DBUtil_APP.Query(sql).Tables[0];
        }

        /// <summary>
        /// 获取人员列表
        /// </summary>
        /// <returns></returns>
        public static OapiUserSimplelistResponse GetUserList(long DepartmentId)
        {
            DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/user/simplelist");
            OapiUserSimplelistRequest request = new OapiUserSimplelistRequest();
            request.DepartmentId = DepartmentId;
            request.SetHttpMethod("GET");
            OapiUserSimplelistResponse response = client.Execute(request, AccessToken);
            return response;
        }

        /// <summary>
        /// 执行创建和更新人员
        /// </summary>
        /// <param name="dt"></param>
        /// <param name="deptlist"></param>
        public static void CreateUpdateUser(DataTable dt)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                string OUID = Convert.ToString(dt.Rows[i]["OUID"]);
                string Userid = Convert.ToString(dt.Rows[i]["Userid"]);//账号
                string Name = Convert.ToString(dt.Rows[i]["Name"]);//姓名
                string Mobile = Convert.ToString(dt.Rows[i]["Mobile"]);//手机号
                string EMail = Convert.ToString(dt.Rows[i]["EMail"]);//邮箱
                string Position = Convert.ToString(dt.Rows[i]["LeaderTitle"]);//职位
                string jobnumber = Convert.ToString(dt.Rows[i]["HRID"]);//工号
                string[] allouid = OUID.Split(';');
                bool allc = false;
                List<long> departments = new List<long>();
                for (int j = 0; j < allouid.Length; j++)
                {
                    string ddid = GETParentID(allouid[j]);
                    departments.Add(Convert.ToInt32(ddid));
                    if (IsExists(Userid, ddid))
                    {
                        allc = true;
                    }
                }
                if (allc)//存在执行更新
                {
                    OapiUserUpdateRequest upr = new OapiUserUpdateRequest();
                    upr.Userid = Userid;
                    upr.Name = Name;
                    upr.Email = EMail;
                    upr.Mobile = Mobile;
                    upr.Position = Position;
                    upr.Jobnumber = jobnumber;
                    upr.Department = departments;
                    UpdateUser(upr);

                }
                else//不存在执行创建
                {
                    OapiUserCreateRequest cpr = new OapiUserCreateRequest();
                    cpr.Userid = Userid;
                    cpr.Name = Name;
                    cpr.Email = EMail;
                    cpr.Mobile = Mobile;
                    cpr.Position = Position;
                    cpr.Jobnumber = jobnumber;
                    cpr.Department = JSON.ToJSON(departments);
                    CreateUser(cpr);
                }
            }
        }
        /// <summary>
        /// 人员删除
        /// </summary>
        public static void DeleteUser(DataTable dt, List<OapiDepartmentListResponse.DepartmentDomain> deptlist)
        {
            List<OapiUserSimplelistResponse.UserlistDomain> mlist = ToDataList<OapiUserSimplelistResponse.UserlistDomain>(dt);
            for (int i = 0; i < deptlist.Count; i++)
            {
                long deptid = deptlist[i].Id;
                List<OapiUserSimplelistResponse.UserlistDomain> list = GetUserList(deptid).Userlist;

                if (list != null)
                {
                    if (list.Count > 0)
                    {
                        if (mlist != null)
                        {
                            List<OapiUserSimplelistResponse.UserlistDomain> dlist = list.Where(a => !mlist.Exists(t => a.Userid.Contains(t.Userid))).ToList();
                            for (int j = 0; j < dlist.Count; j++)
                            {
                                OapiUserDeleteRequest dur = new OapiUserDeleteRequest();
                                dur.Userid = dlist[j].Userid;
                                dur.SetHttpMethod("GET");
                                DeleteUser(dur);
                            }
                        }
                        else
                        {
                            for (int j = 0; j < list.Count; j++)
                            {
                                OapiUserDeleteRequest dur = new OapiUserDeleteRequest();
                                dur.Userid = list[j].Userid;
                                dur.SetHttpMethod("GET");
                                DeleteUser(dur);
                            }

                        }
                    }

                }

            }

        }

        /// <summary>
        /// DataTable转成List
        /// </summary>
        public static List<T> ToDataList<T>(this DataTable dt)
        {
            var list = new List<T>();
            var plist = new List<PropertyInfo>(typeof(T).GetProperties());

            if (dt == null || dt.Rows.Count == 0)
            {
                return null;
            }

            foreach (DataRow item in dt.Rows)
            {
                T s = Activator.CreateInstance<T>();
                for (int i = 0; i < dt.Columns.Count; i++)
                {
                    PropertyInfo info = plist.Find(p => p.Name == dt.Columns[i].ColumnName);
                    if (info != null)
                    {
                        try
                        {
                            if (!Convert.IsDBNull(item[i]))
                            {
                                object v = null;
                                if (info.PropertyType.ToString().Contains("System.Nullable"))
                                {
                                    v = Convert.ChangeType(item[i], Nullable.GetUnderlyingType(info.PropertyType));
                                }
                                else
                                {
                                    v = Convert.ChangeType(item[i], info.PropertyType);
                                }
                                info.SetValue(s, v, null);
                            }
                        }
                        catch (Exception ex)
                        {
                            throw new Exception("字段[" + info.Name + "]转换出错," + ex.Message);
                        }
                    }
                }
                list.Add(s);
            }
            return list;
        }

        /// <summary>
        /// 人员更新
        /// </summary>
        /// <returns></returns>
        public static OapiUserUpdateResponse UpdateUser(OapiUserUpdateRequest deptinfo)
        {
            DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/user/update");
            OapiUserUpdateResponse response = client.Execute(deptinfo, AccessToken);
            return response;
        }
        /// <summary>
        /// 人员创建
        /// </summary>
        /// <returns></returns>
        public static OapiUserCreateResponse CreateUser(OapiUserCreateRequest deptinfo)
        {
            DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/user/create");
            OapiUserCreateResponse response = client.Execute(deptinfo, AccessToken);
            return response;
        }
        /// <summary>
        /// 人员删除
        /// </summary>
        /// <returns></returns>
        public static OapiUserDeleteResponse DeleteUser(OapiUserDeleteRequest deptinfo)
        {
            DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/user/delete");
            OapiUserDeleteResponse response = client.Execute(deptinfo, AccessToken);
            return response;
        }

        /// <summary>
        /// 判断人员是否存在
        /// </summary>
        /// <returns></returns>
        public static bool IsExists(string userid, string ddid)
        {
            bool flag = false;
            OapiUserSimplelistResponse response = GetUserList(Convert.ToInt32(ddid));
            if (response.Userlist != null)
            {
                if (response.Userlist.Where(x => x.Userid == userid).ToList().Count > 0)
                {
                    flag = true;
                }
            }
            return flag;
        }

    }
}
