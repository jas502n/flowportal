using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Runtime.Serialization.Json;
using System.Runtime.Serialization;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Data;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using BPM.Client.Notify;
using YZSoft.Web.DAL;
using YZSoft.Web.Org;

namespace YZSoft.Services.REST.BPM
{
    public class EmployeeHandler : YZServiceHandler
    {
        public virtual object GetEmployeeInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = request.GetString("account");
            bool includeDisabledUser = request.GetBool("includeDisabledUser",false);

            User user;
            List<object> rvPositions = new List<object>();
            List<object> supervisors = new List<object>();
            List<object> directXSs = new List<object>();
            List<object> roles = new List<object>();
            object[] groups;
            
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                
                user = User.FromAccount(cn, account);

                MemberCollection positions = OrgSvr.GetUserPositions(cn,account);
                foreach (Member member in positions)
                {
                    rvPositions.Add(
                        new
                        {
                            ou = member.GetParentOU(cn).GetFriendlyFullName(cn),
                            LeaderTitle = member.LeaderTitle,
                            Level = member.Level
                        }
                    );

                    supervisors.AddRange(OrgManager.GetSupervisors(cn, member.FullName, includeDisabledUser));
                    directXSs.AddRange(OrgManager.GetDirectXSs(cn, member.FullName, includeDisabledUser));
                    roles.AddRange(OrgManager.GetRoles(cn, member.FullName));
                }

                groups = OrgManager.GetGroups(cn, account);
            }

            return new {
                user = user,
                positions = rvPositions,
                supervisors = supervisors,
                directxss = directXSs,
                roles = roles,
                groups = groups
            };
        }

        public virtual void CheckUser(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            bool addtoRecently = request.GetBool("addtoRecently", true);
            int count = request.GetInt32("Count", 0);
            List<string> uids = new List<string>();
            List<string> members = new List<string>();
            for (int i = 0; i < count; i++)
            {
                string uid = request.GetString("uid" + i.ToString());
                uids.Add(uid);

                string memberfullname = request.GetString("member" + i.ToString(), null);
                members.Add(memberfullname);
            }

            List<string> errUsers = new List<string>();
            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (string uid in uids)
                {
                    User user = User.TryGetUser(cn, uid);
                    if (user == null)
                        continue;

                    if (user.Disabled)
                        errUsers.Add(user.FriendlyName);
                }
            }

            if (errUsers.Count != 0)
                throw new Exception(String.Format(Resources.YZStrings.Aspx_Contains_DisabledUser, String.Join(";", errUsers.ToArray())));

            IYZDbProvider provider = YZDbProviderManager.DefaultProvider;
            using (IDbConnection cn = provider.OpenConnection())
            {
                string uid = YZAuthHelper.LoginUserAccount;
                for (int i = 0; i < members.Count; i++)
                {
                    string account = uids[i];
                    string memberFullName = members[i];

                    if (String.IsNullOrEmpty(memberFullName))
                        continue;

                    OrgManager.AddRecentlyUser(cn, uid, account, memberFullName);
                }
            }
        }
    }
}