<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="YZSoft_Login_2018_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
    <link rel="shortcut icon" type="image/ico" href="../../../favicon.ico" />
    <link href="css/login.css" rel="stylesheet" type="text/css" />
    <asp:literal runat="server" id='_litLoginCss'></asp:literal>
    <link href="css/jquery.fancybox.min.css" rel="stylesheet" type="text/css" />
    <script src="js/jquery-3.2.1.min.js" type="text/javascript"></script>
    <script src="js/jquery.browser.min.js" type="text/javascript"></script>
    <script src="js/jquery.cookie.js" type="text/javascript"></script>
    <script src="js/jquery.fancybox.min.js" type="text/javascript"></script>
    <script src="js/jsencrypt.min.js" type="text/javascript"></script>
    <script type="text/javascript">
        function htmlDecode(value) {
            if (value) {
                return $('<div />').html(value).text();
            } else {
                return '';
            }
        }

        application = {
            root: '<%=this.ResolveUrl("~/")%>',
            returnUrl: htmlDecode('<%=HttpUtility.HtmlEncode(YZUtility.EncodeJsString(this.ReturnUrl))%>'),
            logoutType: '<%=YZAuthHelper.BPMLogoutType%>',
            ntOnly: <%=this.NtOnly.ToString().ToLower()%>,
            strings: {
                enterAccount: '<%=YZUtility.EncodeJsString(Resources.YZStrings.Aspx_Login_EnterAccountTip)%>',
                browserWarn: '<%=YZUtility.EncodeJsString(Resources.YZStrings.Aspx_Login_Step0_Msg)%>'
            }
        }
    </script>
    <script src="js/login.js?v=1.1" type="text/javascript"></script>
</head>
<body>
    <div class="outter-wrap">
        <div class="inner-wrap">
            <div class="topbar-wrap">
                <div class="logo"></div>
                <div class="lang-wrap">
                    <%=this.LanguageSwitchHtml%>
                </div>
            </div>
            <div class="login-panel-bg"></div>
            <div class="login-panel" runat="server" id="_pnlLogin">
                <div class="head"></div>
                <div class="tip">&nbsp;</div>
                <div class="yz-input yzglyph uid">
                    <input type="text"  runat="server" id="_txtUid" autocomplete="off" />
                </div>
                <div class="yz-input yzglyph pwd">
                    <input type="password" runat="server" id="_txtPwd" autocomplete="off" />
                </div>
                <div class="btn-wrap">
                    <div runat="server" id="_btnLogin" class="yz-btn login"></div>
                    <div runat="server" id="_btnLoginNT" class="yz-btn loginnt"></div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
