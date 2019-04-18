using System;
using System.Web;
using System.Collections.Generic;
using System.Text;
using System.Web.Configuration;
using System.Data;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using BPM;
using BPM.Client;
using BPM.Client.Security;
using YZSoft.Web.DAL;
using YZSoft.Apps;

namespace YZSoft.Services.REST.Mobile.Apps
{
    public class DailyReportHandler : YZServiceHandler
    {
        public virtual DailyReportCollection GetUserReportsByMonth(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = request.GetString("account", YZAuthHelper.LoginUserAccount);
            DateTime month = request.GetDateTime("month");

            DailyReportCollection rv;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    rv = DailyReportManager.GetReports(provider, cn, account, month.Year, month.Month);
                }
            }

            return this.ConvertToMonthDayResult(month, rv);
        }

        public virtual object TryGetReport(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = request.GetString("account", YZAuthHelper.LoginUserAccount);
            DateTime date = request.GetDateTime("date");

            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    return new
                    {
                        report = DailyReportManager.TryGetReport(provider, cn, account, date)
                    };
                }
            }
        }

        public virtual object GetTeamReports(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string myaccount = request.GetString("account", YZAuthHelper.LoginUserAccount);
            DateTime date = request.GetDateTime("date");

            BPMObjectNameCollection accounts = new BPMObjectNameCollection();
            accounts.Add(myaccount);

            using (BPMConnection bpmcn = new BPMConnection())
            {
                bpmcn.WebOpen();

                MemberCollection positions = OrgSvr.GetUserPositions(bpmcn, myaccount);
                foreach (Member position in positions)
                {
                    DirectXSCollection xss = position.GetDirectXSs(bpmcn);
                    foreach (DirectXS xs in xss)
                    {
                        if (!accounts.Contains(xs.UserAccount))
                            accounts.Add(xs.UserAccount);
                    }
                }

                DailyReportCollection rv = new DailyReportCollection();
                foreach (string account in accounts)
                {
                    DailyReport dailyReport;

                    using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                    {
                        using (IDbConnection cn = provider.OpenConnection())
                        {
                            dailyReport = DailyReportManager.TryGetReport(provider, cn, account, date);

                            if (dailyReport == null)
                            {
                                dailyReport = new DailyReport();
                                dailyReport.Account = account;
                                dailyReport.Date = date;
                            }

                            rv.Add(dailyReport);
                        }
                    }

                    User user = User.TryGetUser(bpmcn, account);
                    dailyReport["ShortName"] = user == null ? "" : user.ShortName;
                }

                return rv;
            }
        }

        protected virtual DailyReportCollection ConvertToMonthDayResult(DateTime month, DailyReportCollection reports)
        {
            DailyReportCollection rv = new DailyReportCollection();
            DateTime today = DateTime.Today;
            int days;
            
            if (today.Year == month.Year &&
                today.Month == month.Month)
                days = today.Day;
            else
                days = DateTime.DaysInMonth(month.Year, month.Month);

            for (int i = days; i > 0; i--)
            {
                DailyReport report = reports.TryGetItem(month.Year, month.Month, i);
                if (report == null)
                {
                    report = new DailyReport();
                    report.IsEmpty = true;
                    report.ItemID = -i;
                    report.TaskID = -1;
                    report.Date = new DateTime(month.Year, month.Month, i);
                }
                rv.Add(report);

                report["Day"] = i;
            }

            return rv;
        }
    }
}