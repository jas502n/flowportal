<%@ Page Language="C#" AutoEventWireup="true" CodeFile="wechat.aspx.cs" Inherits="wechat" %>

<!DOCTYPE HTML>
<html manifest="">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name = "format-detection" content = "telephone=no" />
    <title></title>
    <script type="text/javascript">
        window.onerror = function (message, url, lineNo) {
            url = window.yzEvalScriptFile || url;
            delete window.yzEvalScriptFile;
            alert('line:' + lineNo + ',' + url + '\n' + message);
        };

        application = {
            debug: false,
            JSVersion: '5.80a.003',
            wechat: true,
            captureVideo: false,
            taskSocial: false,
            phases: [],
            pushPhase: function (phaseName) {
                application.phases.push({
                    phase: phaseName,
                    time: new Date()
                });
            },
            startApp: <asp:literal runat="server" id='_litApp'></asp:literal>
        };

        application.pushPhase('index start');
    </script>
    <style type="text/css">
         /**
         * Example of an initial loading indicator.
         * It is recommended to keep this as minimal as possible to provide instant feedback
         * while other resources are still being loaded for the first time
         */
        html, body {
            height: 100%;
            background-color: #fff;
        }
        
        #appLoadingIndicator {
            position: absolute;
            top: 50%;
            margin-top: -57px;
            text-align: center;
            width: 100%;
            height: 115px;
            display: none;
        }

        #appLoadingIndicator .bg 
        {
            display:inline-block;
            background-image:url(YZSoft$Boot/images/welcome.png);
            height:115px;
            width:152px;
            background-size: contain;
            background-repeat:no-repeat;
        }
        
        .yz-app #appLoadingIndicator{
            display:none;
        }
    </style>
    <!-- The line below must be kept intact for Sencha Command to build your application -->
    <!--<link rel="stylesheet" href="http://cache.amap.com/lbs/static/main.css?v=1.0"/>-->
    <!--<script type="text/javascript" src="http://cache.amap.com/lbs/static/es5.min.js"></script>-->
    <!--<script type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=ecd458f7499e18a34d31f4f82ed70b0d"></script>-->
    <!--<script type="text/javascript" src="http://cache.amap.com/lbs/static/addToolbar.js"></script>-->
    <!--<script type="text/javascript" src="YZSoft/src/AMap/maps1.js?v=1.3&key=ecd458f7499e18a34d31f4f82ed70b0d"></script>-->

    <script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
    <script id="microloader" type="text/javascript" src=".sencha/app/microloader/development.js?_dc=5.70.006"></script>
   
     <%--   <script src="assets/jSignature/libs/jquery.js" type="text/javascript"></script>
    <script src="assets/jSignature/libs/jSignature.min.js" type="text/javascript"></script>--%>

</head>
<body>
    <div id="appLoadingIndicator">
        <div class="bg"></div>
        <div></div>
        <div></div>
    </div>
</body>
</html>