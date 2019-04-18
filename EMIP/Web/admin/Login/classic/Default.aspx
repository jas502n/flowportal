<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="YZSoft_Login_Default" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link href="style/login.css" rel="stylesheet" type="text/css" />
    <asp:literal runat="server" id='_litLoginCss'></asp:literal>
    <script src="javascript/ext-base-debug.js" type="text/javascript"></script>
    <script src="javascript/login.js" type="text/javascript"></script>
    <!--<script src="../ExtJS/Scripts/ext-all-debug.js" type="text/javascript"></script>-->
    <!--[if IE 6]>
    <script type="text/javascript" src="javascript/png.js"></script>
    <script type="text/javascript">
        DD_belatedPNG.fix('.main, .pointContainer table td, .pointContainer .pointer')
    </script>
    <![endif]-->
    <script type="text/javascript">
        function newElement(tagName, attributes){
	        if(tagName.indexOf("<")==0){
		        var object=document.createElement("SPAN")
		        object.innerHTML=tagName
		        object=object.childNodes[0]
	        }else{
		        var object=document.createElement(tagName)
	        }
	        if(attributes){
		        for(var i in attributes){
			        object.setAttribute(i, attributes[i])
			        object[i]=attributes[i]
		        }
	        }
	        return object;
        }

        function ShowErrorTip(text){
            alert(text);
	        //document.getElementById("_spnErrorTip").innerHTML=text;
	        //document.getElementById("_lnkHelp").style.display = "none";
	        //setTimeout(function(){document.getElementById("_spnErrorTip").innerHTML="";document.getElementById("_lnkHelp").display="";},3000);
        }

        function LoginSubmit(type){
	        document.getElementById("_btnLogin").blur();
	        if(!document.getElementById("_txtPositionId").value){
	            if (FactoryData.length != 0){
		            alert(Strings.SelPos);
		            ShowErrorTip(Strings.SelPosTip);
		            return false;
		        }
		        else{
		            document.getElementById("_txtPositionId").value = '0';
		        }
		    }
		    if (type == 'BPM') {
		        if (!document.getElementById("_txtUserId").value) {
		            ShowErrorTip(Strings.EnterAccountTip);
		            document.getElementById("_txtUserId").focus();
		            document.getElementById("_txtUserId").select();
		            return false;
		        }
		        if (!document.getElementById("_txtPassword").value && 1 == 2) {
		            ShowErrorTip(Strings.EnterPwdTip);
		            document.getElementById("_txtPassword").focus();
		            document.getElementById("_txtPassword").select();
		            return false;
		        }
		        document.getElementById("_btnLogin").disabled = true;
		        document.getElementById("_imgWait").style.display = "";
		    }

            var param = {            
                action:'login',
                type:type,
                uid:document.getElementById("_txtUserId").value,
                pwd:document.getElementById("_txtPassword").value,
                posid:document.getElementById("_txtPositionId").value,
                dcp:(new Date()).getTime()
            };
            var url = 'default.aspx';
            url = Ext.urlAppend(url, Ext.urlEncode(param));

            Ext.lib.Ajax.request('GET', url, {
                success: function (response) {
                    var result = Ext.decode(response.responseText);
                    if (result.success) {
                        var cp = new CookieProvider({
                            expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 180)) //180 days
                        });
                        cp.set("dLogin.PositionId", document.getElementById("_txtPositionId").value);
                        cp.set("dLogin.UserId", document.getElementById("_txtUserId").value);

                        var tourl = returnUrl;
                        if (FactoryData.length != 0)
                            tourl += (tourl.indexOf("?") == -1 ? "?" : "&") + "site=" + document.getElementById("_txtPositionId").value;

                        window.location.replace(tourl);

                        /*缓冲加载
                        if (window.parent && window.parent.YZLoader && window.parent.YZLoader.status) {
                        window.parent.YZLoader.login();
                        }
                        else {
                        window.location.replace(tourl);
                        }
                        */
                    }
                    else {
                        ShowErrorTip(result.text);
                        document.getElementById("_btnLogin").disabled = false;
                        document.getElementById("_imgWait").style.display = "none";
                    }
                },
                failure: function (response) {
                    ShowErrorTip(Strings.HttpErr);
                    document.getElementById("_btnLogin").disabled = false;
                    document.getElementById("_imgWait").style.display = "none";
                }
            }, {}, {});

	        return false
        }

        var FactoryData=[];
        for(var i=0; i<_FactoryData.length; i++){
	        var has=false;
	        for(var o=0; o<FactoryData.length; o++){
		        if(FactoryData[o].position.x==_FactoryData[i].MapX && FactoryData[o].position.y==_FactoryData[i].MapY){
			        has=true;
			        FactoryData[o].list.push({id:_FactoryData[i].ID+"", name:_FactoryData[i].Name});
			        break;
		        }
	        }
	        if(!has){
		        FactoryData.push({position:{x:_FactoryData[i].MapX, y:_FactoryData[i].MapY}, list:[{id:_FactoryData[i].ID+"", name:_FactoryData[i].Name}]});
	        }
        }

        var MainStep=0;	// 0:检测浏览器, 1:检测控件, 2:选择登录地点, 3:登录表单
        function GotoMainStep(step){
	        var i=0;
	        while(document.getElementById("divMainStep"+i)){
		        document.getElementById("divMainStep"+i).style.display="none";
		        i++;
	        }
	        MainStep=step;
	        switch(step){
		        case 0:
			        CheckBrowser();
			        break;
		        case 1:
			        CheckActiveX();
			        break;
		        case 2:
			        StartPoint();
			        break;
		        case 3:
			        StartLogin();
			        break;
	        }
	        document.getElementById("divMainStep").style.display="";
	        return false;
        }

        function CheckBrowser() {
	        var browserName,
                browserPass = false,
                userAgent = navigator.userAgent.toLowerCase();
            
	        switch(true){
	            case Ext.isIE:
	                browserPass = window.atob ? true : false;
	                browserName = "IE";
	                break;
		        case Ext.isOpera:
			        browserName=Strings.BrowserNameOpera;
			        break;
		        case Ext.isSafari:
		            browserPass = true;
			        browserName=Strings.BrowserNameSafari;
			        break;
		        case Ext.isChrome:
		            browserPass = true;
			        browserName=Strings.BrowserNameGoogle;
			        break;
		        case Ext.isGecko:
			        browserPass=true;
			        browserName=Strings.BrowserNameFirefox;
			        break;
		        default:
			        browserName=Strings.BrowserNameOther;
			        break;
			}

	        if(!browserPass){
		        document.getElementById("spnBrowserName").innerHTML=browserName;
		        document.getElementById("pSystemCheckText").innerHTML=String.format(Strings.BrowserWarning,
		            navigator.userAgent.toLowerCase().indexOf("Windows NT 5.1".toLowerCase())!=-1?'Windows XP':
		            (navigator.userAgent.toLowerCase().indexOf("Windows NT 5.2".toLowerCase())!=-1?'Windows 2003':
		            (navigator.userAgent.toLowerCase().indexOf("Windows NT 6.0".toLowerCase())!=-1?'Windows Vista':
		            (navigator.userAgent.toLowerCase().indexOf("Windows NT 6.1".toLowerCase())!=-1?'Windows 7':
		            Strings.Unknow))),
		            navigator.userAgent.toLowerCase().indexOf("Wow64".toLowerCase())!=-1?'64':'32');
        		    
		        document.getElementById("divMainStep0").style.display="";
		        IECheckSwitch();
	        }else{
		        GotoMainStep(1);
	        }
        }
        function IECheckSwitch(download){
	        if(download){
		        document.getElementById("divIETip").style.display="none";
		        document.getElementById("divIEDownload").style.display = "";
	        }else{
		        document.getElementById("divIETip").style.display="";
		        document.getElementById("divIEDownload").style.display="none";
	        }
	        return false
        }
        function CheckActiveX(){
	        if(!CheckActiveXMoudle() && Ext.isIE){
		        GotoActiveXStep(0);
		        document.getElementById("divMainStep1").style.display="";
	        }else{
		        GotoMainStep(2);
	        }
        }
        function RecheckActiveX(){
	        if(!CheckActiveXMoudle()){
		        GotoActiveXStep(3);
	        }else{
		        GotoActiveXStep(4);
	        }
	        return false
        }

        var IsXForm = false	// 用来告诉下面的控件, 这只是一个检测而已
        function CheckActiveXMoudle(){
            return true;
	        try{
		        var ActiveX = new ActiveXObject("XFormShell.XFormShell.1");
		        return true;
	        }catch(e){
		        return false;
	        }
        }
        var ActiveXStep;
        var IntervalActiveXCheck, ActiveXCheckCount=0;
        function GotoActiveXStep(step){
	        var i=0;
	        while(document.getElementById("pActiveXStep"+i)){
		        document.getElementById("pActiveXStep"+i).style.display = "none";
		        i++;
	        }
	        ActiveXStep=step;
	        document.getElementById("pActiveXStep"+ActiveXStep).style.display = "";
	        switch(step){
		        case 0:
			        break;
		        case 1:
			        window.location.replace("download/ActiveXInstall.rar");
			        ActiveXCheckCount=0;
			        clearInterval(IntervalActiveXCheck);
			        IntervalActiveXCheck=setInterval(function(){
				        if(CheckActiveXMoudle()){
					        clearInterval(IntervalActiveXCheck);
					        GotoActiveXStep(4);
				        }else if(ActiveXCheckCount>=10){
					        GotoActiveXStep(2);
				        }
				        ActiveXCheckCount++;
			        },1000)
			        break;
		        case 2:
			        break;
		        case 3:
        			
			        break;
		        case 4:
			        break;
	        }
	        return false
        }
        function StartPoint(){
            if (FactoryData.length != 0){
	            document.getElementById("divMainStep2").style.display = "";
	            InitMap(FactoryData);
            }
            else{
		        GotoMainStep(3);
            }
        }
        function StartLogin(){
	        document.getElementById("divMainStep3").style.display = "";
	        if(!document.getElementById("_txtUserId").value){
	            var cp = new CookieProvider();
	            document.getElementById("_txtUserId").value = cp.get("dLogin.UserId","");
            }

            if (!document.getElementById("_txtPassword").disabled){
	            setTimeout(function(){
		            document.getElementById("_txtPassword").focus();
		            document.getElementById("_txtPassword").select();
		            if(!document.getElementById("_txtUserId").value)
		                document.getElementById("_txtUserId").focus();
	            },10);
	        }
        }

        var _PointSize=12;	// 点的大小, 用于计算中心点

        var PositionData, PositionDataFlat;
        var PointerContainer, PointerSelected;
        var ListContainerBox, ListContainer;
        var ListContainerBoxSelected, ListContainerSelected;

        function InitMap(data){
	        if(PointerContainer)
	            return
	        PointerContainer=document.getElementById("divPointerContainer");
	        ListContainer=document.getElementById("tabListContainer");
	        ListContainerBox=document.getElementById("tabListContainerBox");
	        ListContainerSelected=document.getElementById("tabListContainerSelected");
	        ListContainerBoxSelected=document.getElementById("tabListContainerBoxSelected");
        	
	        PositionDataFlat={};
	        for(var i=0; i<data.length; i++){
		        var point=newElement("SPAN",{id:"List_"+i ,className:"pointer", onclick:PointerClick, onmouseover:PointerOver, onmouseout:PointerOut, __dataNode:data[i]});
		        point.style.left=data[i].position.x-_PointSize/2+"px";
		        point.style.top=data[i].position.y-_PointSize/2+"px";
		        PointerContainer.appendChild(point);
		        for(var o=0; o<data[i].list.length; o++){
			        PositionDataFlat[data[i].list[o].id]=data[i].list[o];
			        PositionDataFlat[data[i].list[o].id].pid=i;
		        }
	        }
        	
	        //-------- 自动选择厂 ---------------
            var cp = new CookieProvider();
	        var pId=cp.get("dLogin.PositionId","");
	        if  (pId && PositionDataFlat[pId] && document.getElementById("List_"+PositionDataFlat[pId].pid)){
		        PointerOver(document.getElementById("List_"+PositionDataFlat[pId].pid));
		        PointerClick(document.getElementById("List_"+PositionDataFlat[pId].pid));
		        if(document.getElementById("Pointer_"+pId))
		            ListSelect(pId)
	        }
        }

        function PointerClick(obj){
	        obj=obj||this;
	        if(PointerSelected==obj){
		        PointerClose();
		        return;
	        }
	        ListContainerSelected.innerHTML=ListContainer.innerHTML.replace(/(Pointer_\d+)/g,"Show_$1");
	        ListContainerBoxSelected.style.top=ListContainerBox.style.top;
	        ListContainerBoxSelected.style.left=ListContainerBox.style.left;
	        ListContainerBox.className="";
	        ListContainerBoxSelected.className="selected";
        	
	        if(PointerSelected){
		        PointerSelected.className="pointer";
	        }
	        PointerSelected=obj;
	        PointerSelected.className="pointer selected";
        	
	        var first=ListContainerSelected.childNodes[0];
	        if(first)
	            ListSelect(first.id.replace(/.*(\d+?)$/,"$1"));
        }
        function PointerClose(){
	        PointerSelected.className="pointer";
	        ListContainerBoxSelected.className="";
	        PointerSelected=null;
	        document.getElementById("_txtPositionId").value="";
	        GotoMainStep(2);
        }
        function PointerOver(obj){
	        if(obj && obj.toString().indexOf("MouseEvent")!=-1)
	            obj=null;
	        obj=obj||this;
	        if(PointerSelected==obj)
	            return
	        var list="";
	        for(var i=0; i<obj.__dataNode.list.length; i++){
		        list+=String.format('<a id="Pointer_{0}" href="###" onclick="return ListSelect(\'{0}\')">{1}</a>',obj.__dataNode.list[i].id, obj.__dataNode.list[i].name);
	        }
	        ListContainer.innerHTML=list;
	        ListContainerBox.className="hide";
	        ListContainerBox.style.top=obj.__dataNode.position.y-ListContainerBox.offsetHeight-10+"px";
	        ListContainerBox.style.left=obj.__dataNode.position.x-ListContainerBox.offsetWidth+ListContainerBox.offsetWidth/2+"px";
        	
	        ListContainerBox.className="hover";
        }
        function PointerOut(obj){
	        obj=obj||this;
	        ListContainerBox.className="";
        }

        var LastListSelected;
        function ListSelect(id){
	        if(MainStep==2 || MainStep==3){
		        document.getElementById("spnPositionName").innerHTML="&nbsp;-&nbsp;" + PositionDataFlat[id].name;
		        if(LastListSelected)LastListSelected.className="";
		        LastListSelected=document.getElementById("Show_Pointer_"+id);
		        LastListSelected.className="selected";
		        document.getElementById("_txtPositionId").value=id;
		        GotoMainStep(3);
	        }
	        return false;
        }

        function document_loaded(){
            GotoMainStep(0);

            //js预加载
            //setTimeout(function () {
            //    if(window.parent && window.parent.YZLoader && window.parent.YZLoader.cache)
            //        window.parent.YZLoader.cache();
            //}, 50);
        }

        function setCookie(name, value){
            var argv = arguments,
                argc = arguments.length,
                expires = (argc > 2) ? argv[2] : null,
                path = (argc > 3) ? argv[3] : '/',
                domain = (argc > 4) ? argv[4] : null,
                secure = (argc > 5) ? argv[5] : false;
            
            document.cookie = name + "=" +
                escape(value) +
                ((expires === null) ? "" : ("; expires=" + expires.toUTCString())) +
                ((path === null) ? "" : ("; path=" + path)) +
                ((domain === null) ? "" : ("; domain=" + domain)) +
                ((secure === true) ? "; secure" : "");
        }

        function changeLanguage(lcid) {    
            setCookie("yz-lcid", lcid, new Date(9999,0,1,0,0,0));
            window.location.reload(true);
        }
    </script>
</head>
<body onload="javascript:document_loaded();">
<div class="bg">
	<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="100%" height="100%" id="Internation">
		<param name="movie" value="style/ui/login_water.swf" />
		<param name="wmode" value="transparent" />
		<param name="menu" value="false" />
		<param name="scale" value="exactfit" />
	</object>
</div>
<table class="frame">
	<tr>
		<td>
            <div class="yz-login-lang-cnt">
                <asp:Literal ID="_litChangeLang" runat="server"></asp:Literal>
            </div>
		    <div class="main">
		        <div class="logo"></div>
				<div class="pointContainer" id="divPointerContainer">
					<table id="tabListContainerBoxSelected">
						<tr>
							<td class="c1">&nbsp;</td>
							<td class="c2">&nbsp;</td>
							<td class="c3">&nbsp;<strong class="close" onclick="PointerClose()"></strong></td>
						</tr>
						<tr>
							<td class="c4">&nbsp;</td>
							<td class="c5 list" id="tabListContainerSelected"></td>
							<td class="c6">&nbsp;</td>
						</tr>
						<tr>
							<td class="c7">&nbsp;</td>
							<td class="c8">&nbsp;</td>
							<td class="c9">&nbsp;</td>
						</tr>
					</table>
					<table id="tabListContainerBox">
						<tr>
							<td class="c1">&nbsp;</td>
							<td class="c2">&nbsp;</td>
							<td class="c3">&nbsp;</td>
						</tr>
						<tr>
							<td class="c4">&nbsp;</td>
							<td class="c5 list" id="tabListContainer"></td>
							<td class="c6">&nbsp;</td>
						</tr>
						<tr>
							<td class="c7">&nbsp;</td>
							<td class="c8">&nbsp;</td>
							<td class="c9">&nbsp;</td>
						</tr>
					</table>
				</div>
				<div class="login-bg"></div>
				<div class="login" id="divMainStep" style="display:none;">
					<div class="form" id="divMainStep3">
						<div class="title"><asp:Literal ID="_litBoxCaption" runat="server"></asp:Literal><span id="spnPositionName"></span></div>
						<form runat="server" action="Default.aspx?action=login" method="post" enctype="application/x-www-form-urlencoded">
							<table>
    							<tr>
									<td class="header"><asp:Literal ID="_litAccount" runat="server"></asp:Literal></td>
									<td>
                                        <asp:TextBox ID="_txtUserId" cssClass="input" runat="server"></asp:TextBox>
                                        <asp:HyperLink  NavigateUrl="javascript:;" ID="_lnkRegNewAccount" runat="server"></asp:HyperLink>
                                    </td>
								</tr>
								<tr>
									<td class="header">
									    <asp:Literal ID="_litPwd" runat="server"></asp:Literal>
									</td>
									<td>
                                        <asp:TextBox ID="_txtPassword" cssClass="input" runat="server" TextMode="Password"></asp:TextBox>
									    <asp:HyperLink  NavigateUrl="javascript:;" ID="_lnkForgotPwd" runat="server"></asp:HyperLink>
                                    </td>
								</tr>
								<tr>
									<td class="waitContainer">
									    <input name="_txtPositionId" type="hidden" id="_txtPositionId"/>
										<img id="_imgWait" src="style/ui/login_wait.gif" alt="" style="display:none;"/>
                                    </td>
									<td>
                                        <input type="submit" runat="server" id="_btnLogin" class="button longinbtnfp" value="Button" onclick="return LoginSubmit('BPM')"/>
                                        <input type="button" runat="server"  id="_btnNTLogin" class="button longinbtnnt" value="Button" onclick="return LoginSubmit('NT')"/>
										&nbsp; &nbsp;
										<a id="_lnkHelp" class="userguid" href="download/EndUserManual.doc" style="display:none">Help</a>
                                    </td>
								</tr>
							</table>
						</form>
					</div>
					<div class="tip" id="divMainStep2">
						<div class="title"><asp:Literal ID="_litStep2Caption" runat="server"></asp:Literal></div>
						<div class="content"><span class="arrorw">&#x74;</span><asp:Literal ID="_litStep2Msg" runat="server"></asp:Literal></div>
					</div>
					<div class="tip_activex" id="divMainStep1">
						<div class="title"><asp:Literal ID="_litStep1Caption" runat="server"></asp:Literal></div>
						<p class="content"><asp:Literal ID="_litStep1Msg" runat="server"></asp:Literal></p>
						<p class="content" id="pActiveXStep0"><asp:Literal ID="_litStep1InsCurStep0" runat="server"></asp:Literal> <span class="no"><asp:Literal ID="_litStep1NotInstalled" runat="server"></asp:Literal></span> &nbsp; | &nbsp; <a href="###" onclick="return GotoActiveXStep(1)"><asp:Literal ID="_litStep1InstallNow" runat="server"></asp:Literal> &raquo;</a></p>
						<p class="content" id="pActiveXStep1"><asp:Literal ID="_litStep1InsCurStep1" runat="server"></asp:Literal> <span class="yes"><asp:Literal ID="_litStep1Installing" runat="server"></asp:Literal></span> &nbsp; | &nbsp; <asp:Literal ID="_litStep1PlsWaiting" runat="server"></asp:Literal></p>
						<p class="content" id="pActiveXStep2"><asp:Literal ID="_litStep1InsCurStep2" runat="server"></asp:Literal> <span class="yes"><asp:Literal ID="_litStep1Installing1" runat="server"></asp:Literal></span> &nbsp; | &nbsp; <asp:Literal ID="_litStep1InstallFinished" runat="server"></asp:Literal>, <a href="###" onclick="return RecheckActiveX(1)"><asp:Literal ID="_litStep1CheckAgain" runat="server"></asp:Literal> &raquo;</a></p>
						<p class="content" id="pActiveXStep3"><asp:Literal ID="_litStep1InsCurStep3" runat="server"></asp:Literal> <span class="no"><asp:Literal ID="_litStep1InstallFailed" runat="server"></asp:Literal></span> &nbsp; | &nbsp; <a href="###" onclick="return GotoActiveXStep(1)"><asp:Literal ID="_litStep1Retry" runat="server"></asp:Literal> &raquo;</a></p>
						<p class="content" id="pActiveXStep4"><asp:Literal ID="_litStep1InsCurStep4" runat="server"></asp:Literal> <span class="yes"><asp:Literal ID="_litStep1InstallSucceed" runat="server"></asp:Literal></span> &nbsp; | &nbsp; <a href="###" onclick="return GotoMainStep(2)"><asp:Literal ID="_litStep1LoginContinue" runat="server"></asp:Literal> &raquo;</a></p>
						<p class="content skip"><a href="###" onclick="return GotoMainStep(2)"><asp:Literal ID="_litStep1Ignore" runat="server"></asp:Literal> &raquo;</a></p>
					</div>
					<div class="tip_ie" id="divMainStep0">
						<div class="title"><asp:Literal ID="_litStep0Caption" runat="server"></asp:Literal></div>
						<div id="divIETip" class="ieTip" style="display:none;">
							<p class="content"><asp:Literal ID="_litStep0Msg" runat="server"></asp:Literal> <a href="###" onclick="return GotoMainStep(1)"><asp:Literal ID="_litStep0Skip" runat="server"></asp:Literal> &raquo;</a></p>
							<a href="###" onclick="return IECheckSwitch(1)" class="getIE" style="display:none"><asp:Literal ID="_litStep0DownloadBrowser" runat="server"></asp:Literal></a>
                        </div>
						<div id="divIEDownload" class="ieDownload" style="display:none;">
						<p id="pSystemCheckText" class="content"><a href="###" onclick="return GotoMainStep(1)"><asp:Literal ID="_litStep0Skip1" runat="server"></asp:Literal> &raquo;</a></p>
						<table>
							<tr>
								<td>Windows XP</td>
								<td><asp:HyperLink ID="_downloadXP" runat="server" NavigateUrl="download/IE8-WindowsXP-x86-CHS.exe"></asp:HyperLink></td>
							</tr>
							<tr>
								<td>Windows Vista</td>
								<td><asp:HyperLink ID="_downloadVista" runat="server" NavigateUrl="download/IE8-WindowsVista-x86-CHS.exe"></asp:HyperLink></td>
							</tr>
							<tr>
								<td>Windows Server 2003</td>
								<td><asp:HyperLink ID="_download2003" runat="server" NavigateUrl="download/IE8-WindowsServer2003-x86-CHS.exe"></asp:HyperLink></td>
							</tr>
							<tr>
								<td>&nbsp;</td>
								<td><asp:HyperLink ID="_downloadMore" runat="server" NavigateUrl="http://windows.microsoft.com/zh-CN/internet-explorer/downloads/ie-8" target="_blank" cssClass="more"></asp:HyperLink></td>
							</tr>
						</table>
						</div>
					</div>
					<span class="errorTip" id="_spnErrorTip"></span>
				</div>
			</div>
		</td>
	</tr>
</table>
<span id="spnIE7BugFix" style="cursor: default; +cursor: pointer;"></span> 
</body>
</html>