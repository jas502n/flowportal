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
    public class MonthlyReportHandler : YZServiceHandler
    {
        public virtual MonthlyReportCollection GetUserReportsByYear(HttpContext context)
        {
            YZRequest request = new YZRequest(context);
            string account = request.GetString("account", YZAuthHelper.LoginUserAccount);
            int year = request.GetInt32("year");

            MonthlyReportCollection rv;
            using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
            {
                using (IDbConnection cn = provider.OpenConnection())
                {
                    rv = MonthlyReportManager.GetReports(provider, cn, account, year);
                }
            }

            return this.ConvertToYearMonthResult(year, rv);
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
                        report = MonthlyReportManager.TryGetReport(provider, cn, account, date)
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

                MonthlyReportCollection rv = new MonthlyReportCollection();
                foreach (string account in accounts)
                {
                    MonthlyReport monthlyReport;

                    using (IYZDbProvider provider = YZDbProviderManager.DefaultProvider)
                    {
                        using (IDbConnection cn = provider.OpenConnection())
                        {
                            monthlyReport = MonthlyReportManager.TryGetReport(provider, cn, account, date);

                            if (monthlyReport == null)
                            {
                                monthlyReport = new MonthlyReport();
                                monthlyReport.Account = account;
                                monthlyReport.Date = date;
                            }

                            rv.Add(monthlyReport);
                        }
                    }

                    User user = User.TryGetUser(bpmcn, account);
                    monthlyReport["ShortName"] = user == null ? "" : user.ShortName;
                }

                return rv;
            }
        }

        protected virtual MonthlyReportCollection ConvertToYearMonthResult(int year, MonthlyReportCollection reports)
        {
            MonthlyReportCollection rv = new MonthlyReportCollection();
            DateTime today = DateTime.Today;
            int months;

            if (today.Year == year)
                months = today.Month;
            else
                months = 12;

            for (int i = months; i > 0; i--)
            {
                MonthlyReport report = reports.TryGetItem(year, i);
                if (report == null)
                {
                    report = new MonthlyReport();
                    report.IsEmpty = true;
                    report.ItemID = -i;
                    report.TaskID = -1;
                    report.Date = new DateTime(year, i, 1);
                }
                rv.Add(report);

                report["Month"] = i;
            }

            return rv;
        }
    }
}