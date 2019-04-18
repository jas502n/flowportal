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
    public class WeeklyReportHandler : YZServiceHandler
    {
        public virtual WeeklyReportCollection GetUserReportsByYear(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = request.GetString("account", YZAuthHelper.LoginUserAccount);
            int year = request.GetInt32("year");

            WeeklyReportCollection rv;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    rv = WeeklyReportManager.GetReports(provider, cn, account, year);
                }
            }

            return this.ConvertToYearWeekResult(year, rv);
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
                        report = WeeklyReportManager.TryGetReport(provider, cn, account, date)
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

                WeeklyReportCollection rv = new WeeklyReportCollection();
                foreach (string account in accounts)
                {
                    WeeklyReport weeklyReport;

                    using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                    {
                        using (IDbConnection cn = provider.OpenConnection())
                        {
                            weeklyReport = WeeklyReportManager.TryGetReport(provider, cn, account, date);

                            if (weeklyReport == null)
                            {
                                weeklyReport = new WeeklyReport();
                                weeklyReport.Account = account;
                                weeklyReport.Date = date;
                            }

                            rv.Add(weeklyReport);
                        }
                    }

                    User user = User.TryGetUser(bpmcn, account);
                    weeklyReport["ShortName"] = user == null ? "" : user.ShortName;
                }

                return rv;
            }
        }

        protected virtual WeeklyReportCollection ConvertToYearWeekResult(int year, WeeklyReportCollection reports)
        {
            WeeklyReportCollection rv = new WeeklyReportCollection();
            DateTime today = DateTime.Today;
            int weeks;

            if (today.Year == year)
                weeks = YZDateHelper.GetWeekOfYear(today);
            else
                weeks = YZDateHelper.WeeksInYear(year);

            DateTime firstDate = YZDateHelper.GetWeekFirstDate(year, weeks);
            DateTime lastDate = firstDate.AddDays(6);

            for (int i = weeks; i > 0; i--)
            {
                WeeklyReport report = reports.TryGetItem(firstDate, lastDate);
                if (report == null)
                {
                    report = new WeeklyReport();
                    report.IsEmpty = true;
                    report.ItemID = -i;
                    report.TaskID = -1;
                    report.Date = lastDate;
                }
                rv.Add(report);

                report["Week"] = i;
                report["FirstDate"] = firstDate;
                report["LastDate"] = lastDate;

                firstDate = firstDate.AddDays(-7);
                lastDate = lastDate.AddDays(-7);
            }

            return rv;
        }
    }
}