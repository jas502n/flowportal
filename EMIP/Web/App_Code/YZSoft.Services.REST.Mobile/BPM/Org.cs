using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;

namespace YZSoft.Services.REST.Mobile.BPM
{
    public class OrgHandler : YZServiceHandler
    {
        public virtual JObject GetUsers(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string keyword = request.GetString("keyword", null);
            bool position = request.GetBool("position", false);

            //获得数据
            UserCollection users = new UserCollection();
            int rowcount;
            JObject rv = new JObject();

            //将数据转化为Json集合
            JArray children = new JArray();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                users = OrgSvr.SearchUser(cn, keyword,100);
                users.Sort(new UserCompare());
                rowcount = users.Count;

                foreach (User user in users)
                {
                    JObject item = new JObject();
                    children.Add(item);

                    item["Name"] = user.DisplayName;
                    item["Account"] = user.Account;
                    item["HRID"] = user.HRID;
                    item["ShortName"] = user.ShortName;
                    item["group"] = YZPinYinHelper.GetShortPinyin(user.ShortName.Substring(0, 1)).ToUpper();

                    //item["Mobile"] = user.Mobile;
                    //item["HomePhone"] = user.HomePhone;
                    //item["OfficePhone"] = user.OfficePhone;
                    //item["Mail"] = user.EMail;

                    if (position)
                    {
                        JArray jMembers = new JArray();
                        item["positions"] = jMembers;
                        MemberCollection members = OrgSvr.GetUserPositions(cn, user.Account);
                        foreach (Member member in members)
                        {
                            JObject jMember = new JObject();
                            jMembers.Add(jMember);

                            jMember["LeaderTitle"] = member.LeaderTitle;
                            jMember["Level"] = member.Level;
                            jMember["OUName"] = member.GetParentOU(cn).Name;
                        }
                    }
                }
            }

            rv[YZJsonProperty.children] = children;
            rv[YZJsonProperty.total] = rowcount;

            return rv;
        }

        public virtual object GetUserCommonInfo(HttpContext context)
        {
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                return UserCommonInfo.FromAccount(cn, uid);
            }
        }

        public virtual JObject UserFromUIDs(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JArray jPost = request.GetPostData<JArray>();
            BPMObjectNameCollection uids = jPost.ToObject<BPMObjectNameCollection>();
            JObject rv = new JObject();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (string uid in uids)
                {
                    User user = User.TryGetUser(cn, uid);

                    //已删除和禁用的用户不显示
                    if (user == null || user.Disabled)
                        continue;

                    rv[uid] = JObject.FromObject(user);
                }
            }

            return rv;
        }

        public virtual JArray MemberFromUIDs(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            JArray jPost = request.GetPostData<JArray>();
            BPMObjectNameCollection uids = jPost.ToObject<BPMObjectNameCollection>();
            JArray rv = new JArray();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                foreach (string uid in uids)
                {
                    User user = User.TryGetUser(cn, uid);

                    //已删除和禁用的用户不显示
                    if (user == null || user.Disabled)
                        continue;

                    Member member = OrgSvr.TryGetMemberFromAccount(cn, user.Account);
                    if (member == null)
                        member = new Member();

                    rv.Add(this.Serialize(member, user));
                }
            }

            return rv;
        }

        public virtual object GetCompanyContactInfo(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string uid = request.GetString("uid");

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                User user = User.FromAccount(cn, uid);
                UserCommonInfo userCommonInfo = UserCommonInfo.FromAccount(cn, uid);
                MemberCollection members = OrgSvr.GetUserPositions(cn, user.Account);
                SupervisorCollection supervisors = new SupervisorCollection();

                foreach (Member member in members)
                {
                    supervisors.AddRange(member.GetSupervisors(cn));
                }

                JArray jMembers = new JArray();
                foreach (Member member in members)
                {
                    JObject jMember = new JObject();
                    jMembers.Add(jMember);

                    jMember["LeaderTitle"] = member.LeaderTitle;
                    jMember["Level"] = member.Level;
                    jMember["OUName"] = member.GetParentOU(cn).Name;
                }

                JArray jSupervisors = new JArray();
                foreach (Supervisor supervisor in supervisors)
                {
                    JObject jSupervisor = new JObject();
                    jSupervisors.Add(jSupervisor);

                    jSupervisor["Account"] = supervisor.UserAccount;
                    jSupervisor["ShortName"] = YZStringHelper.GetUserShortName(supervisor.UserAccount,supervisor.UserFullName);
                    jSupervisor["FGYWs"] = supervisor.FGYWEnabled ? supervisor.FGYWs.ToStringList(','):"";
                }

                return new
                {
                    user = user,
                    userCommonInfo = userCommonInfo,
                    positions = jMembers,
                    supervisors = jSupervisors
                };
            }
        }

        public virtual object GetPersonalInfo(HttpContext context)
        {
            string uid = YZAuthHelper.LoginUserAccount;

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();

                UserCommonInfo userCommonInfo = UserCommonInfo.FromAccount(cn, uid);
                User user = User.FromAccount(cn, uid);
                MemberCollection members = OrgSvr.GetUserPositions(cn, uid);

                JArray jMembers = new JArray();
                foreach (Member member in members)
                {
                    JObject jMember = new JObject();
                    jMembers.Add(jMember);

                    jMember["LeaderTitle"] = member.LeaderTitle;
                    jMember["Level"] = member.Level;
                    jMember["OUName"] = member.GetParentOU(cn).Name;
                }

                return new
                {
                    user = user,
                    userCommonInfo = userCommonInfo,
                    positions = jMembers
                };
            }
        }

        private object GetChildOUs(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string path = request.GetString("path", null);

            OUCollection parents = new OUCollection();
            OUCollection ous = new OUCollection();
            JArray children = new JArray();

            using (BPMConnection cn = new BPMConnection())
            {
                cn.WebOpen();
                if (String.IsNullOrEmpty(path))
                {
                    ous = cn.GetRootOUs();
                    parents = new OUCollection();
                }
                else
                {
                    OU ou = OU.FromFullName(cn, path);
                    parents = this.GetAllParentOU(cn, ou);
                    ous = OU.GetChildren(cn, path);

                    foreach (OU cou in ous)
                    {
                    }
                }

                foreach (OU ou in ous)
                {
                    JObject jou = this.Serialize(ou);
                    OUCollection cous = OU.GetChildren(cn, ou.FullName);
                    jou["isLeaf"] = cous.Count >= 1 ? false : true;

                    children.Add(jou);
                }
            }

            return new
            {
                parents = parents,
                children = children
            };
        }

        private OUCollection GetAllParentOU(BPMConnection cn, OU ou)
        {
            OUCollection ous = new OUCollection();

            while (ou != null)
            {
                ous.Insert(0, ou);
                ou = ou.GetParentOU(cn);
            }

            OUCollection roots = cn.GetRootOUs();
            if (roots.Count > 1)
            {
                ous.Insert(0, new OU()
                {
                    IsRootOU = true,
                    Name = "组织",
                    FullName = ""
                });
            }

            return ous;
        }

        protected virtual JObject Serialize(OU ou)
        {
            JObject rv = new JObject();

            rv["Name"] = ou.Name;
            rv["Code"] = ou.Code;
            rv["FullName"] = ou.FullName;
            rv["Level"] = ou.OULevel;
            rv["SID"] = ou.SID;

            JObject jExtAttrs = new JObject();
            rv["ExtAttrs"] = jExtAttrs;

            foreach (string attrName in ou.ExtAttrNames)
                jExtAttrs[attrName] = Convert.ToString(ou[attrName]);

            return rv;
        }

        protected virtual JObject Serialize(Member member, User user)
        {
            JObject item = new JObject();
            item["Account"] = user.Account;
            item["SID"] = user.SID;
            item["DisplayName"] = user.DisplayName;
            item["MemberFullName"] = member.FullName;
            item["LeaderTitle"] = member.LeaderTitle;
            item["Department"] = member.Department;
            item["Description"] = user.Description;
            item["Sex"] = user.Sex == Sex.Unknown ? "" : user.Sex.ToString();
            item["Birthday"] = YZStringHelper.DateToStringL(user.Birthday);
            item["HRID"] = user.HRID;
            item["DateHired"] = YZStringHelper.DateToStringL(user.DateHired);
            item["Office"] = user.Office;
            item["CostCenter"] = user.CostCenter;
            item["OfficePhone"] = user.OfficePhone;
            item["HomePhone"] = user.HomePhone;
            item["Mobile"] = user.Mobile;
            item["EMail"] = user.EMail;
            item["WWWHomePage"] = user.WWWHomePage;
            item["ShortName"] = user.ShortName;
            item["FriendlyName"] = user.FriendlyName;

            foreach (string attrName in user.ExtAttrNames)
                item[attrName] = Convert.ToString(user[attrName]);

            item["User"] = JObject.FromObject(user);
            item["Member"] = JObject.FromObject(member);

            return item;
        }
    }

    public class UserCompare : System.Collections.Generic.IComparer<User>
    {
        public int Compare(User x, User y)
        {
            if (x == null)
            {
                if (y == null)
                    return 0;
                else
                    return -1;
            }
            else
            {
                if (y == null)
                {
                    return 1;
                }
                else
                {
                    int value = x.Account.CompareTo(y.Account);
                    return value;
                }
            }
        }
    }
}