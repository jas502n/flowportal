using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Application_index : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //缓冲加载时注释以下行
        if (!YZAuthHelper.IsAuthenticated)
        {

            Response.Redirect("~/admin/login/2018/Default.aspx",true);


            //System.Web.Security.FormsAuthentication.RedirectToLoginPage();
            //return;
        }
    }
}