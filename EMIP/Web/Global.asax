<%@ Application Language="C#" ClassName="BPMApplication"%>
<%@ Import namespace="BPM" %>
<%@ Import namespace="BPM.Client" %>
<%@ Import namespace="System.Web.Configuration" %>
<%@ Import namespace="System.IO" %>
<%@ Import namespace="System.Collections.Generic" %>
<%@ Import namespace="System.Globalization" %>
<%@ Import namespace="YZSoft" %>

<script runat="server">
    void Application_Start(object sender, EventArgs e)
    {
        YZSoft.WebApplication.Init();
        YZSoft.Web.Push.MessageBus.Init();
    }
    
    void Application_PreRequestHandlerExecute(object sender, EventArgs e)
    {
        HttpCookie cookie = Request.Cookies["yz-lcid"];
        int lcid;
        bool cultureSetted = false;
        if (cookie != null && !string.IsNullOrEmpty(cookie.Value) && Int32.TryParse(cookie.Value, out lcid))
        {
            try
            {
                System.Threading.Thread.CurrentThread.CurrentUICulture = new CultureInfo(lcid);
                cultureSetted = true;
            }
            catch (Exception)
            {
            }
        }

        if (!cultureSetted)
        {
            if (Request.UserLanguages != null)
            {
                System.Threading.Thread.CurrentThread.CurrentUICulture = YZCultureInfoParse.Parse(Request.UserLanguages, YZCultureInfoParse.DefauleCultureInfo);
            }
        }

        System.Threading.Thread.CurrentThread.CurrentCulture = new CultureInfo(1033);
    }
       
</script>