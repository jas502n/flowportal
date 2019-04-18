//nocheck resource
var cfgSiteDomain
//-------------------------------------- 浏览器检测 --------------------------------------------
var Browser={
	isIE:(navigator.appVersion.indexOf("MSIE")!=-1),
	isIE6:(navigator.appVersion.indexOf("MSIE")!=-1&&navigator.appVersion.substr(navigator.appVersion.indexOf("MSIE"),10).replace(/[^\d.]/g,"").indexOf("6.")!=-1),
	isIE7:(navigator.appVersion.indexOf("MSIE")!=-1&&navigator.appVersion.substr(navigator.appVersion.indexOf("MSIE"),10).replace(/[^\d.]/g,"").indexOf("7.")!=-1),
	isIE8:(navigator.appVersion.indexOf("MSIE")!=-1&&navigator.appVersion.substr(navigator.appVersion.indexOf("MSIE"),10).replace(/[^\d.]/g,"").indexOf("8.")!=-1),
	isIE9:(navigator.appVersion.indexOf("MSIE")!=-1&&navigator.appVersion.substr(navigator.appVersion.indexOf("MSIE"),10).replace(/[^\d.]/g,"").indexOf("9.")!=-1),
	isOpera:navigator.userAgent.indexOf("Opera")!=-1,
	isSafari:navigator.appVersion.indexOf("Safari")!=-1 && navigator.userAgent.indexOf("Chrome")==-1,
	isFirefox:navigator.userAgent.indexOf("Firefox")!=-1,
	isCamino:navigator.userAgent.indexOf("Camino")!=-1,
	isChrome:navigator.userAgent.indexOf("Chrome")!=-1,
	isMozilla:navigator.userAgent.indexOf("Gecko/")!=-1
}
if(Browser.isIE6)document.execCommand("BackgroundImageCache", false, true)
if(Browser.isIE){
	(function(){if(!/*@cc_on!@*/0)return;var e = "abbr,article,aside,audio,canvas,datalist,details,eventsource,figure,footer,header,hgroup,mark,menu,meter,nav,output,progress,section,time,video".split(','),i=e.length;while(i--){document.createElement(e[i])}})()
}
//--------------------------------------- 扩展对象 ---------------------------------------------
String.prototype.toTrim=function(){
	return this.replace(/^\s+|\s+$/g,"")
}
String.prototype.toNumber=function(){
	var n=this.match(/\d+/)
	if(n) return parseInt(n,10)
	else return 0
}
String.prototype.toDate=function(){
	var d=this.split(/\D+/)
	if(d[1])d[1]--
	d=eval("new Date("+d.join(",")+")")
	if(isNaN(d))d=new Date()
	return d
}
String.prototype.toHTML=function(){
	return this.htmlFilter().replace(/\r\n|\r|\n/g,"<br/>").replace(/\s/g,"&nbsp;")
}
String.prototype.toAttribute=function(){
	return this.htmlFilter().replace(/\r\n|\r|\n/g,"&#13;&#10;").replace(/\s/g,"&nbsp;")
}
String.prototype.removeBlank=function(){
	return this.replace(/^[\s　]*/mg,"").replace(/[\s　]*$/mg,"").replace(/^[\s　]*$/mg,"")
}
String.prototype.toContent=function(){
	return this.removeBlank().htmlFilter().replace(/^([^\r\n]+)/mg,"<p>$1</p>").replace(/\r\n|\r|\n/g,"").replace(/\s/g,"&nbsp;")
}
String.prototype.htmlFilter=function(){
	return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")
}
String.prototype.toURL=function(){
	return encodeURIComponent(this)
}
String.prototype.fromURL=function(){
	return decodeURIComponent(this)
}
String.prototype.toURLAnsi=function(){
	return escape(this)
}
String.prototype.toSafeString=function(){
	return this.replace(/\\/g,"\\\\").replace(/\r\n|\r|\n/g,"\\r\\n").replace(/"/g,"\\\"").replace(/'/g,"\\'").replace(/\bscript\b/ig,"\\x73cript")
}
String.prototype.toSafeContent=function(){
	return this.replace(/<\/*a[^>]*>/ig,"").replace(/<script/ig,"<&#83;cript").replace(/<style/ig,"<&#83;tyle").replace(/\bon/ig,"&#79;n")
}
String.prototype.fix=function(length, esp){
	if(this.replace(/[^\x00-\xff]/g,"dd").length<=length)return this
	if(esp!="")esp=esp||"..."
	if(length<esp.length)esp=""
	length-=esp.length
	var text = this.substr(0,length)
	while(text.replace(/[^\x00-\xff]/g,"dd").length>length){
		text=text.substr(0,text.length-1)
	}
	return text+esp
}
String.prototype.toSBC=function(str){
	var str=this
	var result = ''
	for (i=0;i<str.length;i++){
		code=str.charCodeAt(i)
		if (code>=65281&&code<=65373){
			result+=String.fromCharCode(str.charCodeAt(i) - 65248)
		}else if(code==12288){
			result+=String.fromCharCode(str.charCodeAt(i) - 12288 + 32)
		}else{
			result+=str.charAt(i)
		}
	}
	return result
}
String.prototype.contentFix=function(){
	var s=this
	s=s.replace(/<([a-z]+) *[^>]*>[ 　]*<\/\1[^>]*>/ig,"")	// 空标签

	var tagRemove=["div","script","a","object","noscript","param","embed","html","head","title","body","meta"]
	for(var i=0; i<tagRemove.length; i++){
		s=s.replace(eval("/<\\/*"+tagRemove[i]+" *[^>]*>/ig"),"")	// 特定标签
	}
	var attRemove=["class","id","on[a-z]+"]
	for(var i=0; i<attRemove.length; i++){
		s=s.replace(eval("/(<[^>]+)"+attRemove[i]+"=[\"' ]*[^\"' >]*[\"' ]*([^>]*>)/ig"),"$1$2")	// 特定属性

	}
	s=s.replace(/style="TEXT-INDENT: 2em"/ig,"")	// 缩进Style
	s=s.replace(/(\s{2,})/g," ")    // 多余空格
	s=s.replace(/　/g,"")    // 全角空格(一般用于段落缩进)
	s=s.replace(/<br[^>]*>(\s|&nbsp;)*/ig,"</P>\r\n<P>")	// 分段
	return s
}
String.fromChar=function(char, num){
	var result=""
	for(var i=0; i<num; i++){
		result+=char
	}
	return result
}
String.prototype.format=function(){
	var str=this
	for(var i=0; i<arguments.length; i++){
		str=str.replace(eval("/\\{"+i+"\\}/g"),arguments[i])
	}
	return str
}
Date.prototype.toString=function(){
	return new String(this.getFullYear()+"-0"+(this.getMonth()+1)+"-0"+this.getDate()+" 0"+this.getHours()+":0"+this.getMinutes()+":0"+this.getSeconds()).replace(/(\D)0(\d{2})/g,"$1$2")
}
Date.prototype.addYear=function(year){
	return new Date(this.setFullYear(this.getFullYear()+parseInt(year)))
}
Date.prototype.addMonth=function(month){
	return new Date(this.setMonth(this.getMonth()+parseInt(month)))
}
Date.prototype.addDate=function(date){
	return new Date(this.setDate(this.getDate()+parseInt(date)))
}
Date.prototype.addHours=function(hour){
	return new Date(this.setHours(this.getHours()+parseInt(hour)))
}
Date.prototype.addMinutes=function(minute){
	return new Date(this.setMinutes(this.getMinutes()+parseInt(minute)))
}
Date.prototype.addSeconds=function(second){
	return new Date(this.setSeconds(this.getSeconds()+parseInt(second)))
}
Date.prototype.toSimple=function(){
	return this.toString().replace(/-/g,".")
}
Number.prototype.checkSum=function(number){
	return (this^number)==(this-number)
}
Number.prototype.toIp=function(){
	var ip=this.toString(16).split("")
	for(var o=0; o<ip.length; o=o+2){
		ip[o]=parseInt(ip[o]+ip[o+1],16)
		ip[o+1]=""
	}
	ip=ip.join(".").replace(/\.+/g,".").replace(/^\.|\.$/g,"")
	return ip
}
Number.prototype.minMax=function(v1,v2){
	if(v1>v2){
		var v3=v1
		v1=v2
		v2=v3
	}
	if(this<v1)return v1
	if(this>v2)return v2
	return this
}
Number.prototype.toSize=function(){
	var dw=["KB","MB","GB","TB"]
	var result=(this/1024).toFixed(2)+" "+dw[0]
	for(var i=0; i<dw.length; i++){
		var c=(this/Math.pow(1024,i+1)).toFixed(2)
		if(c<1)return result
		result=c+" "+dw[i]
	}
	return result
}
Array.prototype.remove=function(object) { // 给数组附加一个删除对象的函数
	for(var i=0; i<this.length; i++){
		if(this[i] === object){
			return this.splice(i,1)
		}
	}
}
//----------------------------------------- DOM ------------------------------------------------
$=function(objName){
	if(typeof objName == "string") return instanceObject(document.getElementById(objName))
	else return instanceObject(document.getElementById(objName)||objName)
}
$$=function(tagName, className, parentNode){
	parentNode=parentNode||(this==window?document:this)
	var searchTag
	tagName=tagName||""
	if(!tagName || tagName.indexOf("|")!=-1){
		searchTag="*"
	}else{
		searchTag=tagName
	}
	var result=[]
	var element=parentNode.getElementsByTagName(searchTag)
	for(var i=0; i<element.length; i++){
		if(!className || (className && (" "+element[i].className+" ").indexOf(" "+className+" ")!=-1)){
			if(tagName.indexOf("|")==-1 || ("|"+tagName+"|").indexOf("|"+element[i].tagName+"|")!=-1){
				result.push($(element[i]))
			}
		}
	}
	return result
}
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
	return $(object)
}
function instanceObject(){
	for(var i=0; i<arguments.length; i++){
		if(arguments[i]){
			if(!arguments[i].addEventListener)		arguments[i].addEventListener=addEvent
			if(!arguments[i].removeEventListener)	arguments[i].removeEventListener=removeEvent
			if(!arguments[i].show)								arguments[i].show=objectShow
			if(!arguments[i].hide)								arguments[i].hide=objectHide
			if(!arguments[i].getAbsPosition)			arguments[i].getAbsPosition=getAbsPosition
			if(!arguments[i].getInnerText)				arguments[i].getInnerText=getInnerText
			if(!arguments[i].$$)									arguments[i].$$=$$
			if(!arguments[i].insertAfter)					arguments[i].insertAfter=insertAfter
		}
	}
	return arguments[0]
}
function getInnerText(){
	return this.innerText||this.textContent
}
function addEvent(sEvent,func){
	return this.attachEvent("on"+sEvent,func)
}
function removeEvent(sEvent, func){
	return this.detachEvent("on"+sEvent,func);
}
function objectShow(){
	this.style.display=""
}
function objectHide(){
	this.style.display="none"
}
function eventTarget(evt){ // 根据事件返回源对象

	return evt.target||evt.srcElement
}
function insertAfter(newElement,targetElement){
	var parent=targetElement.parentNode;
	if (parent.lastChild==targetElement){
		parent.appendChild(newElement);
	} else {
		parent.insertBefore(newElement,targetElement.nextSibling);
	}
}
function getAbsPosition(){
	var object=this
	var x=0, y=0
	do{
		x+=object.offsetLeft
		y+=object.offsetTop
	}while(object=object.offsetParent);
	return {x:x, y:y}
}
$(window).addEventListener("resize",IELayoutFix,true)
function IELayoutFix(){
	if(Browser.isIE6){
		document.body.style.zoom=0.9999999
		document.body.style.zoom=1
	}
}

(function(){//闭包，保护全局变量   
var fns=[]
window.onDomReady = function(fn){fns.push(fn)}   
function runFns(){for(var i=0;i<fns.length;i++)fns[i]()}   
if(document.addEventListener){document.addEventListener("DOMContentLoaded",runFns,false)}      
else {
document.onreadystatechange = function(){if(document.readyState == "interactive"){runFns()}}}   
})()

$(document)


function debug(obj){
	var o=""
	for(var i in obj)o += i + "=" + obj[i] + "<br/>" 
	if(!$("debugBox"))document.body.appendChild(newElement("DIV", {id:"debugBox"}))
	$("debugBox").innerHTML = o
}

//---------------------------------- Bookmark/Homepage -----------------------------------------
function addBookmark(title, url) {
    if (!url) url = window.location.href
    if (!title) title = window.document.title
	try{
	    if (window.sidebar) {
	        window.sidebar.addPanel(title, url, "")
	    } else if (Browser.isIE && window.external) {
	        window.external.AddFavorite(url, title)
	    } else { 
	        alert("本操作暂不支持您的浏览器, 请您手动添加到收藏夹/书签.")
	        return false
	    }
		return true
	}catch(e){}
}
function setHomepage(url){
    if (!url) url = window.locathon.href
    if (document.all) {
		document.body.style.behavior='url(#default#homepage)'
		document.body.setHomePage(url)
		return true
	}else if (window.sidebar){
		if(window.netscape){
			try{  
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
			}catch(e){ 
				alert("很抱歉, 该操作被浏览器拒绝. \n\n如果想启用该功能, 请在地址栏内输入 \"about:config\",\n然后将项 \"signed.applets.codebase_principal_support\" 值改为 \"true\".")
				return false
			}
		} 
		var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch)
		prefs.setCharPref('browser.startup.homepage',url)
		return true
	}
	alert("本操作暂不支持您的浏览器, 请您手动设为首页.")
}

//--------------------------------------- JSON ---------------------------------------------

if(!this.JSON){this.JSON={};}  
(function(){function f(n){return n<10?'0'+n:n;}  
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+  
f(this.getUTCMonth()+1)+'-'+  
f(this.getUTCDate())+'T'+  
f(this.getUTCHours())+':'+  
f(this.getUTCMinutes())+':'+  
f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}  
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}  
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}  
if(typeof rep==='function'){value=rep.call(holder,key,value);}  
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}  
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}  
v=partial.length===0?'[]':gap?'[\n'+gap+  
partial.join(',\n'+gap)+'\n'+  
mind+']':'['+partial.join(',')+']';gap=mind;return v;}  
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}  
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+  
mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}  
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}  
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}  
return str('',{'':value});};}  
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}  
return reviver.call(holder,key,value);}  
cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+  
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}  
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}  
throw new SyntaxError('JSON.parse');};}}());  


//---------------------------------------- Cookie ----------------------------------------------
var Cookie={
	set:function(key, value, expires){
		var root = ""
		var base = ""
		var newCookie=""
		if(!value){
			value = ""
			expires = "1986-7-21 00:00:00"
		}
		if(key.indexOf(".")!=-1){
			var rootName=key.substr(0,key.indexOf("."))
			var subName =key.substr(key.indexOf(".")+1)
			root = Cookie.__getRecursion(document.cookie, rootName, 0)
			if(root){
				root = String(root).split("&")
				for(i=0;i <root.length; i++){
					var cName = root[i].substr(0, root[i].indexOf("="))
					var cValue = root[i].substr(root[i].indexOf("=")+1)
					if (cName != subName){
						base += cName + "=" + encodeURIComponent(cValue) + "&"
					}
				}
			}else{
				base = ""	
			}
			newCookie = rootName + "=" + base + subName + "=" + encodeURIComponent(value)
		}else{
			newCookie = key + "=" + encodeURIComponent(value)
		}
		if(typeof expires == "string")expires=expires.toDate()
		if(expires)expires = "; expires=" + expires.toGMTString()
		else expires=""
		document.cookie = newCookie + expires + "; "+(cfgSiteDomain?("domain=."+cfgSiteDomain+"; "):"")+"path=/"
	},
	get:function(key){
		return this.__getRecursion(document.cookie, key, 0)
	},
	__getRecursion:function(string, key, level){ //获取Cookie递归函数
		key = key.split(".")
		if(level==0){
			string = string.split(";")
		}else{
			string = string.split("&")
		}
		for(var i=0;i<string.length;i++){
			var cName = string[i].substr(0, string[i].indexOf("=")).replace(/\s/,"")
			var cValue = string[i].substr(string[i].indexOf("=") + 1)
			if(cName == key[level]){
				if(!key[level+1]){
					return String(decodeURIComponent(cValue.replace(/\+/g," ")))
				}else{
					return Cookie.__getRecursion(cValue, key.join("."), level+1)
				}
			}
		}
		return
	}
}


//------------------------------------- HttpRequest --------------------------------------------
function request(url,callBack,data){
	var httpRequest
	try{httpRequest = new XMLHttpRequest()}catch(e){
	try{httpRequest = new ActiveXObject("Msxml2.XMLHTTP")}catch(e){
	try{httpRequest = new ActiveXObject("Microsoft.XMLHTTP")}catch (e){
		alert("创建 HttpRequest 实例失败!")
		return false
	}}}
	function doBack(){
		if(httpRequest.status==200 || httpRequest.status==304){
			var returnValue
			var contentType=httpRequest.getResponseHeader("Content-Type").split(";")[0]
			if(contentType == "text/xml"){
				var xmlData=httpRequest.responseXML
				if(!isIE){removeWhiteSpaceNode(xmlData)}
				returnValue=xmlData
			}else if(contentType == "text/json"){
				try{
					returnValue=JSON.parse(httpRequest.responseText)
				}catch(e){returnValue=null}
			}else{
				returnValue=httpRequest.responseText
			}
			if(callBack)callBack(returnValue)
			return returnValue
		}else if((cfgDebug || Cookie.get("adm")) && httpRequest.status!=12029){
			
			var debugString="脚本: "+window.location.href+"\n"
			debugString+="请求: "+(data?"POST":"GET")+" "+url+"\n"
			if(data)debugString+="提交: "+dataString+"\n"
			debugString+="文档: "+httpRequest.getResponseHeader("Content-Type")+"\n"
			debugString+="状态: "+httpRequest.status+" "+httpRequest.statusText+"\n"
			debugString+="-------------------------------------------------------\n"+httpRequest.responseText
			alert(debugString)
		}
	}
	httpRequest.onreadystatechange=function(){ 
		if(httpRequest.readyState==4) doBack()
	}
	
	var dataString
	if(typeof(data)=="string"){
		dataString=data
	}else if(data){
		dataString=[]
		for(var i in data){
			dataString.push(i+"="+(data[i]||"").toString().toURL())
		}
		dataString=dataString.join("&")
	}
	url+=(url.indexOf("?")!=-1?"&":"?")+"__seed="+new Date().getTime()+"&__inajax=1"
	if(url.toLowerCase().indexOf("http://")==0){
		var domainTo = url.replace(/^http\:\/\/([^\/]+)\/*.*$/g,"$1")
		var domainFrom = window.location.href.replace(/^http\:\/\/([^\/]+)\/*.*$/g,"$1")
		if(domainTo!=domainFrom && false){	// 跨域代理
			if(String(url).indexOf("?")==-1){
				url=cfgAjaxProxy+"?__ajaxProxyTo="+url.toURL()
			}else{
				url=url.split("?")
				var ajaxTo=url[0]
				url.shift()
				var arrgs=url.join("?")
				url=cfgAjaxProxy+"?__ajaxProxyTo="+ajaxTo.toURL()+"&"+arrgs
			}
		}
	}
	httpRequest.open(data?"POST":"GET",url,callBack?true:false,null,null)
	if(data)httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
	try{
		httpRequest.send(dataString)
		if(!callBack)return doBack()
	}catch(e){}
}
function removeWhiteSpaceNode(node) {
	function findWhiteSpace(node) {
		for (i=0; i<node.childNodes.length; i++) {
			if(node.childNodes[i].nodeType == 3 && node.childNodes[i].data.match(/^[^\t\n\r ]*$/)){
				nodesToDelete.push(node.childNodes[i])
			}else if(node.childNodes[i].hasChildNodes()){
				findWhiteSpace(node.childNodes[i])
			}
		}
	}
	var nodesToDelete = Array();
	findWhiteSpace(node, 0);
	for(i=nodesToDelete.length-1;i>=0;i--) {
		nodesToDelete[i].parentNode.removeChild(nodesToDelete[i])
	}
}
//---------------------------------- AjaxPost --------------------------------------------------
function ajaxPost(form,callback){
	var fields=$(form).$$("TEXTAREA|INPUT|BUTTON|SELECT")
	var field=[]
	for(var i=0; i<fields.length; i++){
		if(fields[i].name && !fields[i].disabled){
			switch(fields[i].tagName){
				case "TEXTAREA":
				case "BUTTON":
				case "SELECT":
					field.push(fields[i].name.toURL()+"="+fields[i].value.toURL())
					break
				case "INPUT":
					switch(fields[i].type){
						case "text":
						case "password":
						case "button":
						case "submit":
						case "reset":
						case "hidden":
							field.push(fields[i].name.toURL()+"="+fields[i].value.toURL())
							break
						case "checkbox":
						case "radio":
							if(fields[i].checked){
								field.push(fields[i].name.toURL()+"="+(fields[i].value||"on").toURL())
							}
							break
					}
					break
			}
		}
	}
	var url=form.action
	field=field.join("&")
	if(form.method=="GET"){
		url=url.split("?")[0]+"?"+field
	}
	request(url,callback,form.method=="GET"?null:(field||{}))
}