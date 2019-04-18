
var YZSoft = YZSoft || {};

Ext.apply(YZSoft,{
    version: '1.0.0',
    versionDetail: {
        major: 1,
        minor: 0,
        patch: 0
    },
    modules: {
        BPA: true
    }
});

//String.format = Ext.String.format;

YZSoft.trimRightRegex = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
String.prototype.trimRight = function () {
    if (string) {
        string = string.replace(YZSoft.trimRightRegex, '');
    }
    return string || '';
};

Number.prototype.toFixedSaved = Number.prototype.toFixed;
Number.prototype.toFixed = function (column) {
    column = column || 0;
    var pow = Math.pow(10, column);
    return (Math.round(this * pow) / pow).toFixedSaved(column);
};

YZSoft.Debug = function (v) {
}

YZSoft.clipboard = {};

YZModules = {};

//Ext.useShims = Ext.useShims || Ext.isIE; style null错误

Ext.apply(YZSoft, {
    os: {
        isMobile: Ext.os.is.iOS || Ext.os.is.Android
    }
});

YZSoft.EnvSetting = {
    checkboxSelection: false,
    dlgAnimate: false,
    timeout: {
        loadReportData: 180000,
        formAction: 3000
    },
    navigater: {
        width: YZSoft.theme == 'classic' ? 140:200
    },
    form:{
        collapseCommentsPanel:true
    },
    storeFirstLoadMask:{ loadMask: {delay: false} },
    delay: {
        ajaxPost: 300,
        ajaxPost_x: 500,
        ajaxPost_xx: 800,
        ajaxPost_xxx: 1200,
        ajaxPostInform: 500,
        ajaxPostInform_x: 800,
        ajaxPostInform_xx: 1000,
        ajaxPostInform_xxx: 1200,
        storeLoad: 220,
        storeLoadDelay: 200,
        storeLoadDelay_x: 500,
        storeLoadDelay_xx: 800,
        storeLoadDelay_xxx: 1200
    },
    msgTextArea: {
        growMin: 80,
        growMax: 160
    },
    PageSize: {
        defaultSize: 20,
        BPM: {
            drafts: 20,
            historyMyPosted: 20,
            historyMyProcessed: 20,
            historyAllAccessable: 20,
            myTask: 20,
            shareTask: 20
        },
        BPMAdmin: {
            onlineUsers: 20,
            systemUsers: 20,
            processUsage: 20,
            stepHandlingTime: 20,
            userHandlingTime: 20,
            handlingTimeDetail: 20,
            stepTimeout: 20,
            userTimeout: 20,
            timeoutDetail: 20,
            appLog: 20
        }
    },
    BPM: {
        TaskTrace: {
            expandAnimate: true,
            collapseAnimate: true
        },
        Form: {
            WindowModel: 'Dialog', //Window - 在新窗体中打开表单，Tab - 内容窗口中增加一个Tab，Dialog - 打开div + iframe窗体对话框，ModelessDialog - 无模式对话框，ModalDialog - 模式对话框
            DlgSize: {
                Width: 836,
                Height: 600
            }
        },
        FormApplication: {
            WindowModel: 'Dialog', //Window - 在新窗体中打开表单，Tab - 内容窗口中增加一个Tab，Dialog - 打开div + iframe窗体对话框，ModelessDialog - 无模式对话框，ModalDialog - 模式对话框
            DlgSize: {
                Width: 836,
                Height: 600
            }
        },
        DataBrowserWnd: {
            DlgSize: {
                Width: 600,
                Height: 420
            }
        },
        Render: {
            TaskStateMergeStep: true
        }
    },
    Excel: {
        allowExportAll: false,
        maxExportPages: 100
    },
    IM: {
        delay: {
            sendMessage: 250
        }
    },
};

YZSoft.WellKnownSID = {
    Administrators : 'S_GS_B639EB43-67D7-42fb-BD2E-B754BB11915B',
    Everyone : 'S_GS_90674E5E-AC3C-4032-9EDF-7477F2247542',
    EnterpriseManagerUsers : 'S_GS_D7DF3159-4621-4781-B558-9DDC65DA4253',
    OrganizationManagerUsers : 'S_GS_D3DF3828-25DC-464b-8CE6-55E0086DFAD3',
    SystemReportUsers : 'S_GS_4EE27F53-EF71-4732-A0F0-BFCBE888B3A9',
    SA: '9864A43A-876C-46e6-829B-A7223D8B6B76'
};

YZSoft.WellKnownRSID = {
    OrganizatonRoot: '1CCFE783-7FBF-4582-B2F3-CE11F57917E7',
    ProcessRoot: '7CBB72A3-1731-4212-8C5C-9C4E0C86FE31',
    FormRoot: '036F6F25-A004-4109-962F-AD9F0A8F516A',
    ExtServerRoot: '7F14F3D7-70F7-491b-BECB-4DFC6E8BBFD3',
    SecurityGroupRoot: '11ED19A5-89CC-4940-A40B-E53FF74B0C62',
    TimeSheetRoot: '6C2E89F5-6E5D-48c0-95B9-8E0A9B4DDB0B',
    TimeManagerRoot: '84DA1440-C927-4528-A249-4D49D32B01B8',
    ReportRoot: '45D14DE0-13F1-47de-80D5-CBE657BD39C9',
    SecurityResourceRoot: 'F8ADAB36-3C91-47b9-992A-67E198690843',
    AdminWebSiteRoot: 'B278947A-2AD1-42b2-815D-D2CD25DCBC58',
    AdminWebSiteCurStatus: '4EF94F7D-97BA-423d-B73F-04572566E562',
    AdminWebSiteLog: '95BF78B1-BC9E-4c98-A2B7-787E8CCAA96F',
    AdminWebSiteSystemUsage: '5D68E69E-D256-43c1-834C-614DA97E9805',
    AdminWebSiteProcessPerformance: '007490A7-00B6-4d4c-A25A-732187317597',
    FormApplicationRoot: '79A6D413-827D-4dfa-AEA3-4C64CA715975',
    BPASiteRoot: 'EE5117DF-FCAF-4814-AD17-32497EB0092D',
    BPALibraryRoot: '19E802FB-605A-4BD6-B5D9-3501CE842966',
    BPADocumentRoot: 'CC94E14F-9702-469C-9FC6-16763700FE5A',
    BPAGroupRoot: '06DFA056-80E9-48E2-9C2A-ED34EB40A65D',
    BPAAdminRoot: '01EC8CE8-CCCC-4196-93B3-A598813902E4',
    BPAAdminTemplates: 'B52100EA-081B-483C-92D0-46AA00C3B025',
    BPAAdminGroup: '09C6D1E5-F9F9-4E51-AAA2-4DC2DC17F09D',
    BPAAdminSecurity: 'FE9BD49A-416D-4E67-9505-84CF6DFF353D',
    BPAHelp: 'DDE2A259-8702-4FA5-86B0-9EA73FA1B6C0',
    BPARecycleBin: '6B86A356-485B-4439-AE75-B5FC3A251775'
};

Ext.apply(YZSoft, {
    //resolve client url
    //obj - classname or object
    $url: function (obj, url) {
        if (arguments.length == 1)
            return YZSoft.$url('YZSoft', obj);

        var className = Ext.isString(obj) ? obj : Ext.getClassName(obj),
            classPath = Ext.Loader.getPath(className),
            index = classPath.lastIndexOf('/');

        var rv = index != -1 ? classPath.substring(0, index + 1) : '';
        return rv + url;
    },

    //将url转换为绝对路径
    getAbsoluteUrl: function (url) {
        var a = YZSoft.getAbsoluteUrlHyperlink = YZSoft.getAbsoluteUrlHyperlink || document.createElement('a');
        a.href = url;
        return a.href;
    },

    getAbsoluteRootUrl: function () {
        var url = YZSoft.getAbsoluteUrl(YZSoft.$url('YZSoft')),
            indexSlash = url.lastIndexOf("/"),
            rootUrl = url.substr(0, indexSlash) + "/";

        return rootUrl;
    },

    testExternal: function (reg, type) {
        var external = window.external || {};

        for (var i in external) {
            if (reg.test(type ? external[i] : i)) {
                return true;
            }
        }

        return false;
    },

    getChromiumType: function _getChromiumType() {
        var REG_APPLE = /^Apple/;

        if (Ext.isIE || typeof window.scrollMaxX !== 'undefined' || REG_APPLE.test(window.navigator.vendor || '')) {
            return '';
        }

        var _track = 'track' in document.createElement('track'),
            webstoreKeysLength = window.chrome && window.chrome.webstore ? Object.keys(window.chrome.webstore).length : 0;

        // 搜狗浏览器
        if (YZSoft.testExternal(/^sogou/i, 0)) {
            return 'sogou';
        }

        // 猎豹浏览器
        if (YZSoft.testExternal(/^liebao/i, 0)) {
            return 'liebao';
        }

        // chrome
        if (window.clientInformation && window.clientInformation.permissions) {
            return 'chrome';
        }

        if (_track) {
            // 360极速浏览器
            // 360安全浏览器
            return webstoreKeysLength > 1 ? '360ee' : '360se';
        }

        return '';
    }
});

userInfo = {};
Ext.Ajax.request({
    async: false,
    url: YZSoft.$url('Default.aspx'),
    params: {
        Method: 'GetLoginUserInfo'
    },
    success: function (response) {
        var result = Ext.decode(response.responseText);
        if (result.success)
            YZSoft.LoginUser = userInfo = result.userInfo;
        else
            alert(result.errorMessage);
    },
    failure: function (response) {
        alert(Ext.String.format('Access url({0}) failed, Reason:{1}\r\n', 'Default.aspx', response.responseText));
    }
});

Ext.define('YZSoft.Flash', {
    singleton: true,

    check: function () {
        var me = this;

        if (me.flash)
            return me.flash;

        var hasFlash = 0, //是否安装了flash
            flashVersion = 0; //flash版本

        if (document.all) {
            try {
                var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                if (swf) {
                    hasFlash = 1;
                    VSwf = swf.GetVariable('$version');
                    flashVersion = parseInt(VSwf.split(' ')[1].split(',')[0]);
                }
            }
            catch (exp) {
            }
        } else {
            if (navigator.plugins && navigator.plugins.length > 0) {
                var swf = navigator.plugins['Shockwave Flash'];
                if (swf) {
                    hasFlash = 1;
                    var words = swf.description.split(' ');
                    for (var i = 0; i < words.length; ++i) {
                        if (isNaN(parseInt(words[i])))
                            continue;
                        flashVersion = parseInt(words[i]);
                    }
                }
            }
        }
        me.flash = { support: hasFlash, version: flashVersion };
        return me.flash;
    }
});

Ext.define('YZSoft.override.String', {
    override: 'Ext.String',

    formatHtml: function () {
        var args = [];

        for (var i = 0, l = arguments.length; i < l; i++) {
            if( i== 0)
                args.push(RS.$1(arguments[0]));
            else
                args.push(YZSoft.HttpUtility.htmlEncode(arguments[i],true));
        }

        return Ext.String.format.apply(this, args);
    }
});

RS = {
    $: function (strfullname, defaultString) { //获得字符串，例如：RS['All_TopMenu_Workflow']
        //空字符串
        if (!strfullname)
            return '';

        var idx = strfullname.indexOf('.'), //字符串格式必需为 Assembly.Perfix_*,Perfix代表下载粒度,系统一次下载相同Perfix的字符串
            assembly,
            strname;

        if (idx == -1) {
            assembly = 'YZStrings';
            strname = strfullname;
        }
        else {
            assembly = strfullname.substring(0, idx);
            strname = strfullname.substring(idx + 1);
        }

        idx = strname.indexOf('_');
        if (idx == -1) {
            alert(Ext.String.format('{0}\nIncorrent string name, String name format should be:\nAssembly.Perfix_*', strfullname));
            return '';
        }

        var namespace = strname.substring(0, idx);

        RS[assembly] = RS[assembly] || {};
        var assemblyData = RS[assembly];
        var spaceData = assemblyData[namespace];

        //命名空间不存在，则加载
        if (!spaceData && spaceData !== false) {
            Ext.log({}, Ext.String.format('Load Resource assembly: {0}, namespace: {1}, trigger: {2}', assembly, namespace, strfullname));
            var url = YZSoft.$url('YZSoft.Services.REST/core/Globalization.ashx');

            Ext.Ajax.request({
                method: 'GET',
                disableCaching: true,
                async: false,
                params: { method:'GetString', assembly: assembly, namespace: namespace, lcid: userInfo ? userInfo.LCID : '' },
                url: url,
                success: function (response) {
                    var result = Ext.decode(response.responseText);
                    if (result.success)
                        assemblyData[namespace] = result.strings;
                    else {
                        assemblyData[namespace] = false;
                        alert(Ext.String.format('{0}\nLoad string resource failed!\nReason:\n{1}', strfullname, result.errorMessage));
                    }
                },
                failure: function (response) {
                    assemblyData[namespace] = false;
                    alert(Ext.String.format('Access url({0}) failed, Reason:{1}\r\n', url, response.responseText));
                }
            });
        }

        spaceData = assemblyData[namespace];
        if (spaceData) //命名空间已存在
            return spaceData[strname] === undefined ? (defaultString === undefined ? ('Miss Resources : ' + strfullname) : defaultString) : spaceData[strname];
        else //命名空间加载失败
            return defaultString === undefined ? ('Miss Resources : ' + strfullname) : defaultString;
    },
    $1: function (val) {
        if (val)
            val = val.replace(/(\r\n|\n\r|\n|\r)/g, '<br/>');
        return val;
    }
};

YZSoft.MemberProperties = [
    { propName: '.UserAccount', type: 'String' },
    { propName: '.LeaderTitle', type: 'String' },
    { propName: '.Department', type: 'String' }
],

YZSoft.UserProperties = [
    { propName: '.Account', type: 'String' },
    { propName: '.Birthday', type: 'DateTime' },
    { propName: '.CostCenter', type: 'String' },
    { propName: '.DateHired', type: 'DateTime' },
    { propName: '.Description', type: 'String' },
    { propName: '.DisplayName', type: 'String' },
    { propName: '.EMail', type: 'String' },
    { propName: '.HomePhone', type: 'String' },
    { propName: '.HRID', type: 'String' },
    { propName: '.Mobile', type: 'String' },
    { propName: '.Office', type: 'String' },
    { propName: '.OfficePhone', type: 'String' },
    { propName: '.Sex.ToString()', type: 'String' },
    { propName: '.WWWHomePage', type: 'String' },
    { propName: Ext.String.format('["{0}"]', RS.$('All_ExtAttr')), type: 'String' }
],

Ext.define('YZSoft.CodeHelper', {
    singleton: true,

    isWellFormatedUIString: function (text) {
        return YZSoft.Utility.isString(text);
    },

    isInteger: function (text) {
        for (var i = 0, n = text.length; i < n; i++) {
            var ch = text[i];
            if (ch < '0' || ch > '9')
                return false;
        }

        return true;
    },

    isDecimal: function (text) {
        var dotFind = false;
        for (var i = 0, n = text.length; i < n; i++) {
            var ch = text[i];
            if (ch < '0' || ch > '9') {
                if (!dotFind && ch == '.')
                    dotFind = true;
                else
                    return false;
            }
        }

        return true;
    },

    isCode: function (text) {
        var me = this;

        if (me.isInteger(text) ||
            me.isDecimal(text) ||
            YZSoft.CodeHelper.isWellFormatedUIString(text))
            return false;

        if (text.indexOf('.') != -1 ||
            text.indexOf('new') != -1 ||
            Ext.String.startsWith(text, 'Initiator') ||
            Ext.String.startsWith(text, 'CurStep') ||
            Ext.String.startsWith(text, 'LoginUser') ||
            Ext.String.startsWith(text, 'FormDataSet'))
            return true;
        else
            return false;
    },

    getUIString: function (value) {
        var text;

        if (Ext.isString(value))
            text = '"' + value + '"';
        else if (Ext.isObject(value))
            text = value.CodeText;
        else
            text = value;

        return text;
    },

    changeType: function (text, tagType, allowCode, force) {
        var me = this,
            text = Ext.String.trim(text || '');

        if (!text)
            return null;

        if (Ext.String.startsWith(text, 'return'))
            return { CodeText: text };

        switch (tagType) {
            case 'Decimal':
            case 'Double':
            case 'Single':
                if (me.isDecimal(text))
                    return Number(text);
                return (allowCode && me.isCode(text)) ? { CodeText: text} : (force ? { CodeText: text} : null);
            case 'Int16':
            case 'Int32':
            case 'Int64':
            case 'SByte':
            case 'UInt16':
            case 'UInt32':
            case 'UInt64':
            case 'Byte':
                if (me.isInteger(text))
                    return Number(text);
                return (allowCode && me.isCode(text)) ? { CodeText: text} : (force ? { CodeText: text} : null);
            case 'Boolean':
                if (text == '0' || String.Equ(text, 'false'))
                    return false;

                if (text == '1' || String.Equ(text, 'true'))
                    return true;

                return (allowCode && me.isCode(text)) ? { CodeText: text} : true;
            case 'DateTime':
                return (allowCode && me.isCode(text)) ? { CodeText: text} : (force ? { CodeText: text} : null);
            case 'String':
                if (YZSoft.CodeHelper.isWellFormatedUIString(text))
                    return text.substr(1, text.length - 2);

                if (allowCode && me.isCode(text))
                    return { CodeText: text };

                return text;
            case 'Binary':
                return (allowCode && me.isCode(text)) ? { CodeText: text} : (force ? { CodeText: text} : null);
            default:
                return (allowCode && me.isCode(text)) ? { CodeText: text} : (force ? { CodeText: text} : null);
        }
    }
});

Ext.define('YZSoft.Enum', {
    singleton: true,
    DATA: {},

    //BPM.ParticipantLeaderType
    VTOS: function (enumName, value) {
        if (!this.DATA[enumName]) {
            this.request(enumName);
        }

        if (this.DATA[enumName])
            return this.DATA[enumName].VTOS[value];
    },

    STOV: function (enumName, string) {
        if (!this.DATA[enumName]) {
            this.request(enumName);
        }

        if (this.DATA[enumName])
            return this.DATA[enumName].STOV[string];
    },

    request: function (enumName) {
        var me = this,
            url = YZSoft.$url('YZSoft.Services.REST/MDM/Enum.ashx');

        Ext.Ajax.request({
            method: 'GET',
            async: false,
            params: { method: 'GetEnumDefine', enumName: enumName },
            url: url,
            success: function (response) {
                var result = Ext.decode(response.responseText);

                if (result.success) {
                    var data = me.DATA[enumName] = {
                        VTOS: result.data,
                        STOV: {}
                    };

                    for (var v in data.VTOS) {
                        var s = data.VTOS[v];
                        data.STOV[s] = Number(v);
                    }
                }
                else
                    alert(Ext.String.format('{0}\nLoad enum failed!\nReason:\n{1}', enumName, result.errorMessage));
            },
            failure: function (response) {
                alert(Ext.String.format('Access url({0}) failed, Reason:{1}\r\n', url, response.responseText));
            }
        });
    }
});

(function () {
    function show() {
        switch (this.type) {
            case 'error':
            case 'http':
                Ext.Msg.show({
                    title: this.title || RS.$('All_MsgTitle_Error'),
                    msg: YZSoft.HttpUtility.htmlEncode(this.msg,true),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
                break;
            case 'responseError':
                break;
            case 'customError':
                Ext.Msg.show({
                    title: this.title || RS.$('All_Warning'),
                    msg: YZSoft.HttpUtility.htmlEncode(this.msg,true),
                    buttons: Ext.Msg.OK,
                    icon: this.icon || Ext.MessageBox.ERROR
                });

                break;
            case 'native':
                var errmsg = Ext.String.format(RS.$('All_JSErr_Msg'), this.msg, this.url, this.line);
                //YZSoft.alert(errmsg);有的时候显不出来，比如在流程库界面加一句错误的代码
                alert(errmsg);
                break;
            default:
                Ext.Msg.show({
                    title: this.title || RS.$('All_MsgTitle_Error'),
                    msg: YZSoft.HttpUtility.htmlEncode(this.msg,true),
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
                break;
        }
    };

    YZSoft.Error = function (config) {
        if (Ext.isString(config))
            config = { type: 'error', msg: config };

        var error = new Error(Ext.encode(config));

        Ext.apply(error, config);
        Ext.apply(error, { show: show });

        return error;
    };

    Ext.apply(YZSoft.Error, {
        raise: function (err) {
            err = err || {};
            if (Ext.isString(err)) {
                var args = Ext.toArray(arguments, 1);
                args.splice(0, 0, err);
                err = {
                    type: 'error',
                    msg: Ext.String.format.apply(undefined, args)
                };
            }

            var me = this,
            method = me.raise.caller,
            msg, name;

            if (method) {
                if (!err.sourceMethod && (name = method.$name)) {
                    err.sourceMethod = name;
                }
                if (!err.sourceClass && (name = method.$owner) && (name = name.$className)) {
                    err.sourceClass = name;
                }
            }

            Ext.log(err);

            throw new YZSoft.Error(err);
        },

        parse: function (message, url, line) {
            var err;
            var msg = message || '';

            if (msg.substring(0, 8) == 'Error: {') //safari
                msg = msg.substring(7);

            if (msg.substring(0, 17) == 'Uncaught Error: {') //chrome
                msg = msg.substring(16);

            if (msg.length != 0 && msg.charAt(0) == '{') {
                err = Ext.decode(msg);
                err.url = err.url || url;
                err.line = err.line || line;
            }
            else {
                err = {
                    type: 'native',
                    msg: msg,
                    url: url,
                    line: line
                };
            }

            return new YZSoft.Error(err);
        },

        fromNativeError: function (err, url, line) {
            var err = {
                type: 'native',
                msg: err.message,
                url: url,
                line: line
            };

            return new YZSoft.Error(err);
        }
    });
})();

window.onerror = function (message, url, line, column, error) {
    url = YZSoft.errorUrl || url;
    delete YZSoft.errorUrl;

    Ext.log({level:'warn'},Ext.String.format('[Uncatch Error!!!] {0}, url:{1}, line:{2}', message, url, line));

    var err;

    if (error)
        err = error.show ? error : YZSoft.Error.fromNativeError(error, url, line);
    else
        err = YZSoft.Error.parse(message, url, line);

    err.show();
    return true;
};

YZSoft.NameChecker = {
    ObjectNameReg: /^[^\\\/:*?"<>|]+$/,
    //文件名规则:/^[^\\\/:*?"<>|]+$/,
    //http://www.cnblogs.com/wenanry/archive/2010/09/06/1819552.html

    IsValidObjectName: function (str) {
        if (YZSoft.NameChecker.ObjectNameReg.test(str))
            return true;
        else
            return Ext.String.format(RS.$('All_ObjectNameIncludeInvalidChar'), '\\\/:*?"<>|');
    }
};

$objname = YZSoft.NameChecker.IsValidObjectName;

YZSoft.selection = (function () {
    var rs;
    if (YZSoft.EnvSetting && YZSoft.EnvSetting.checkboxSelection)
        rs = 'Ext.selection.CheckboxModel';
    else
        rs = 'Ext.selection.RowModel';

    return {
        rowSelectionXClass: rs
    };
} ());

YZSoft.alert = function (message, title, fn, scope) {
    if (Ext.isFunction(title)) {
        scope = fn;
        fn = title;
        title = '';
    }

    if (Ext.isIE) {
        alert(message);
        if (fn)
            fn.call(scope);
    }
    else
    //Ext.Msg.alert(title || RS.$('All_Alert_Title'), RS.$1(message), fn, scope);
        Ext.Msg.show({
            title: title || RS.$('All_Alert_Title'),
            msg: YZSoft.HttpUtility.htmlEncode(message,true),
            icon: Ext.Msg.INFO,
            buttons: Ext.Msg.OK,
            fn: function () {
                if (fn)
                    fn.call(scope);
            }
        });
};

Ext.define('YZSoft.override.dom.Element', {
    override: 'Ext.dom.Element',

    //wait - {msg:'已保存',delay:500} or '已保存'
    unmask: function (wait, fn, scope) {
        var me = this,
            wait = Ext.isString(wait) ? { msg: wait} : (wait || {})

        if (wait.msg && wait.delay == undefined)
            wait.delay = true;

        if (!wait.delay) {
            me.callParent();
            if (fn)
                fn.call(scope);
            return;
        }

        if (wait.delay === true)
            wait.delay = YZSoft.EnvSetting.delay.ajaxPostInform;
        else if (Ext.isString(wait.delay))
            wait.delay = YZSoft.EnvSetting.delay['ajaxPostInform_' + wait.delay];

        var data = me.getData(),
            maskEl = data.maskEl

        var msgel = maskEl.down('div.x-mask-msg-text');

        if (wait.msg)
            msgel.update(wait.msg);

        maskEl.addCls('yz-mask-msg-ok');

        Ext.defer(me.unmask, wait.delay, me, [{}, fn, scope]);
    }
});

Ext.define('YZSoft.override.Component', {
    override: 'Ext.Component',

    unmask: function (wait, fn, scope) {
        (this.getMaskTarget() || this.el).unmask(wait, fn, scope);
    }
});

Ext.define('YZSoft.override.LoadMask', {
    override: 'Ext.LoadMask',

    constructor: function () {
        this.callParent(arguments);
    },

    setText: function (msg, onceOnly) {
        if (onceOnly !== false)
            this.msgsaved = this.msg;

        this.msg = msg;
    },

    onBeforeLoad: function (store, operation, eOpts) {
        var opt = operation ? operation.config : this.store.lastOptions;

        if (opt) {
            if (opt.mbox || opt.loadMask === false)
                return;

            if (opt.loadMask && opt.loadMask.msg)
                this.setText(opt.loadMask.msg, true);
        }

        this.callParent(arguments);
    },

    afterShow: function () {
        this.callParent(arguments);

        if (this.msgsaved) {
            this.msg = this.msgsaved;
            delete this.msgsaved;
        }
    }
});

Ext.define('YZSoft.override.data.operation.Operation', {
    override: 'Ext.data.operation.Operation',

    execute: function () {
        this.beginTime = Ext.Date.now();
        this.callParent(arguments);
    },

    triggerCallbacks: function (secondTime) {
        var me = this,
            operation = me;

        if (secondTime) {
            me.callParent(arguments);
            return;
        }

        if (operation.config && operation.config.mbox) {
            var mbox = operation.config.mbox;

            if (mbox.isHidden())
                me.callParent(arguments);
            else {
                mbox.on({
                    single: true,
                    scope: this,
                    hide: function () {
                        me.triggerCallbacks(true);
                    }
                });
            }
            return;
        };

        var loadDelay = false;

        if (operation.config && operation.config.loadMask && operation.config.loadMask.delay) {
            if (Ext.isString(operation.config.loadMask.delay))
                loadDelay = YZSoft.EnvSetting.delay['storeLoadDelay_' + operation.config.loadMask.delay];
            else
                loadDelay = operation.config.loadMask.delay === true ? YZSoft.EnvSetting.delay.storeLoadDelay : operation.config.loadMask.delay;
        }

        if ((operation.config && operation.config.loadMask === false) ||
            (operation.config && operation.config.loadMask && operation.config.loadMask.delay === false)) {
        }
        else {
            if (!loadDelay)
                loadDelay = me.loadDelay === true ? YZSoft.EnvSetting.delay.storeLoad : me.loadDelay;
        }

        var tick = loadDelay ? loadDelay - Ext.Date.getElapsed(me.beginTime) : 0;
        if (tick > 0)
            Ext.defer(me.triggerCallbacks, tick, me, [true]);
        else
            me.callParent(arguments);
    }
});

//config loadDelay : load是否要delay，true或数值，数值表示delay时间例如2000，起到缓load的作用
Ext.define('YZSoft.override.Store', {
    override: 'Ext.data.Store',

    load: function (options) {
        this.beginTime = Ext.Date.now();
        this.callParent(arguments);

        if (this.getProxy() && this.getProxy().lastRequest && this.getProxy().lastRequest.getParams)
            this.lastParams = this.getProxy().lastRequest.getParams();
    },

    reload: function () {
        if (this.lastOptions && 'loadMask' in this.lastOptions)
            delete this.lastOptions.loadMask;

        if (this.lastOptions && 'mbox' in this.lastOptions)
            delete this.lastOptions.mbox;

        if (this.lastOptions && 'callback' in this.lastOptions)
            delete this.lastOptions.callback;

        this.callParent(arguments);
    }
});

Ext.define('YZSoft.Ajax', {
    extend: 'Ext.data.Connection',
    singleton: true,
    autoAbort: false,

    errMessageFromResponse: function (config, response) {
        return Ext.String.format(RS.$('All_Ajax_HttpFail_Msg'), config.url) + (response.responseText || '');
    },

    regularMsg: function (wait, defaultDelay) {
        wait = Ext.isString(wait) ? { msg: wait} : (wait || {});

        if (wait.msg && wait.delay == undefined)
            wait.delay = true;

        if (wait.delay) {
            if (wait.delay === true)
                wait.delay = YZSoft.EnvSetting.delay[defaultDelay];
            else if (Ext.isString(wait.delay))
                wait.delay = YZSoft.EnvSetting.delay[defaultDelay + '_' + wait.delay];
        }

        wait.autoClose = wait.autoClose !== false ? true : false;

        return wait;
    },

    //config.waitMsg - {msg:'正在保存',delay:500} or '正在保存'
    //config.waitMsgOK - {msg:'已保存',delay:500} or '已保存'
    request: function (config) {
        var wait = config.waitMsg = this.regularMsg(config.waitMsg, 'ajaxPost'),
            waitok = config.waitMsgOK = this.regularMsg(config.waitMsgOK, 'ajaxPostInform'),
            tag;

        if (wait.msg) {
            tag = wait.target = wait.target || Ext.getBody();
            wait.beginTime = Ext.Date.now();

            tag.mask(wait.msg);
        }

        var cfg = {
            method: 'GET',
            disableCaching: true
        };

        Ext.apply(cfg, config);

        Ext.apply(cfg, {
            url: config.url,
            success: function (response) {
                var tick = wait.msg ? wait.delay - Ext.Date.getElapsed(wait.beginTime) : 0,
                    action, fail, success1, success2;

                if (config.requestend)
                    config.requestend.call(config.scope || config);

                action = {
                    result: Ext.decode(response.responseText),
                    responseText: response.responseText
                };

                if (action.result.success === false) {
                    action.result.errorMessage = Ext.String.htmlDecode(action.result.errorMessage);

                    fail = function () {
                        if (wait.target)
                            wait.target.unmask();

                        if (config.failure)
                            config.failure.call(config.scope || config, action);
                        else
                            YZSoft.Error.raise(action.result.errorMessage);
                    };

                    Ext.defer(fail, tick);
                    return;
                }

                success2 = function () {
                    if (config.success)
                        config.success.call(config.scope || config, action);
                };

                success1 = function () {
                    if (wait.target && wait.autoClose)
                        wait.target.unmask(waitok, success2);
                    else
                        success2();
                };

                Ext.defer(success1, tick);
            },
            failure: function (response) {
                if (config.requestend)
                    config.requestend.call(config.scope || config);

                var tick = wait.msg ? wait.delay - Ext.Date.getElapsed(wait.beginTime) : 0;
                
                var fail = function () {
                    if (wait.target)
                        wait.target.unmask();

                    var errorMessage = Ext.String.format(RS.$('All_Ajax_HttpFail_Msg'), config.url) + (response.status == 404 ? response.statusText: (response.responseText || ''));

                    if (config.exception === false && config.failure) {
                        action = {
                            result: {
                                exception: true,
                                errorMessage: errorMessage
                            },
                            responseText: response.responseText
                        };

                        config.failure.call(config.scope || config, {
                            response: response
                        });
                    }
                    else {
                        YZSoft.alert(errorMessage, function () {
                            if (config.exception) {
                                var action = {
                                    result: Ext.decode(response.responseText),
                                    responseText: response.responseText
                                };
                                config.exception.call(config.scope || config, action);
                            }
                        });
                    }
                };

                Ext.defer(fail, tick);
            }
        });

        this.callParent([cfg]);
    }
});

Ext.define('YZZoft.override.data.JsonStore', {
    override: 'Ext.data.JsonStore',

    constructor: function (config) {
        this.callParent(arguments);

        proxy = this.getProxy();
        proxy.on('exception', this.loadexcetion, this);
    },

    getUniName: function (fieldName, prefix, seed, increment, prefixAsName) {
        var me = this,
            seed = (!seed && seed !== 0) ? 1 : seed,
            increment = increment ? increment : 1;

        if (prefixAsName) {
            var index = me.findBy(function (rec) {
                if (rec.get(fieldName) == prefix)
                    return true;
            });

            if (index == -1)
                return prefix;
        }

        for (var i = seed; ; i += increment) {
            var name = prefix + i;

            var index = me.findBy(function (rec) {
                if (rec.get(fieldName) == name)
                    return true;
            });

            if (index == -1)
                return name;
        }
    },

    //throw err会引起panel layout错误(layout不更新)
    loadexcetion: function (store, response, operation, eOpts) {
        var err;

        try {
            err = Ext.decode(response.responseText || {errorMessage:''});
        }
        catch (exp) {
            Ext.log.warn(Ext.String.format(RS.$('All_JsonDecodeError'), store.url, response.responseText));
            return;
        }

        Ext.log.warn(Ext.String.format(RS.$('All_StoreLoadException'), store.url, err.errorMessage));
    }
});

/*********已整理**********/

Ext.define('Ext.locale.view.Table', {
    override: 'Ext.view.Table',
    loadingText: RS.$('All_Loading')
});

Ext.define('Ext.locale.Date', {
    override: 'Ext.Date',
    monthNames: [
       RS.$('All_Month1'),
       RS.$('All_Month2'),
       RS.$('All_Month3'),
       RS.$('All_Month4'),
       RS.$('All_Month5'),
       RS.$('All_Month6'),
       RS.$('All_Month7'),
       RS.$('All_Month8'),
       RS.$('All_Month9'),
       RS.$('All_Month10'),
       RS.$('All_Month11'),
       RS.$('All_Month12')
    ],
    dayNames:[
       RS.$('All_Week7Short'),
       RS.$('All_Week1Short'),
       RS.$('All_Week2Short'),
       RS.$('All_Week3Short'),
       RS.$('All_Week4Short'),
       RS.$('All_Week5Short'),
       RS.$('All_Week6Short'),
       RS.$('All_Week7Short')
    ],
    dayNamesZ: [
        RS.$('All__WeekDayName10'),
        RS.$('All__WeekDayName11'),
        RS.$('All__WeekDayName12'),
        RS.$('All__WeekDayName13'),
        RS.$('All__WeekDayName14'),
        RS.$('All__WeekDayName15'),
        RS.$('All__WeekDayName16')
    ]
});

Ext.define('Ext.locale.DatePicker', {
    override: 'Ext.DatePicker',
    todayText: RS.$('All_Today'),
    nextText: RS.$('All_NextMonth'),
    prevText: RS.$('All_PrevMonth'),
    okText: RS.$('All_OK'),
    cancelText: RS.$('All_Cancel'),
    format: 'Y-m-d'
});

Ext.define('Ext.locale.form.field.Date', {
    override:'Ext.form.field.Date',
    format:'Y-m-d'
});

Ext.define('Ext.locale.toolbar.Paging', {
    override: 'Ext.toolbar.Paging',
    beforePageText: RS.$('All_Paging_BeforePageText'),
    afterPageText: RS.$('All_PagingToolbar_afterPageText'),
    firstText: RS.$('All_Paging_FirstText'),
    prevText: RS.$('All_PagingToolbar_prevText'),
    nextText: RS.$('All_PagingToolbar_nextText'),
    lastText: RS.$('All_PagingToolbar_lastText'),
    refreshText: RS.$('All_Refresh'),
    displayMsg: RS.$('All_PagingToolbar_displayMsg'),
    emptyMsg: RS.$('All_PagingToolbar_emptyMsg')
});

Ext.define('Ext.locale.window.MessageBox', {
    override:'Ext.window.MessageBox',
    buttonText: {
        ok: RS.$('All_OK'),
        cancel: RS.$('All_Cancel'),
        yes: RS.$('All_Yes'),
        no: RS.$('All_No')
    }
});

Ext.define('Ext.locale.Ext.grid.property.HeaderContainer', {
    override: 'Ext.grid.property.HeaderContainer',
    nameText: RS.$('All_Property_Name'),
    valueText: RS.$('All_Property_Value'),
    dateFormat: 'Y-m-d'
});

if (Ext.grid.GridView) {
    Ext.apply(Ext.grid.GridView.prototype, {
        sortAscText: RS.$('All_SortAsc'),
        sortDescText: RS.$('All_SortDesc'),
        columnsText: RS.$('All_Columns')
    });
}


//日期扩展
Ext.apply(Ext.Date.formatCodes, {
    g: "(this.getHours() == 0 ? 0 :((this.getHours() % 12) ? this.getHours() % 12 : 12))",
    a: "(this.getHours() < 12 ? RS.$('All__AM') : RS.$('All__PM'))",
    A: "(this.getHours() <= 7 ? RS.$('All__DayLE7') : (this.getHours() <= 11 ? RS.$('All__DayLE11'):(this.getHours() <= 13 ? RS.$('All__DayLE13'):(this.getHours() <= 17 ? RS.$('All__DayLE17'):RS.$('All__DayG17')))))",
    L: "Ext.Date.dayNamesZ[this.getDay()]",
    Q: "Ext.String.leftPad(Ext.Date.add(this,Ext.Date.DAY,6).getMonth() + 1, 2, '0')",
    q: "Ext.String.leftPad(Ext.Date.add(this,Ext.Date.DAY,6).getDate(), 2, '0')"
});

YZSoft.DateExtras = {
    formats: [
        { hours: 1.5, fmt: RS.$('All__DateFmt_Hours') },
        { days: 0, fmt: RS.$('All__DateFmt_Days0') },
        { days: 1, fmt: RS.$('All__DateFmt_Days1') },
        { days: 2, fmt: RS.$('All__DateFmt_Days2') },
        { weeks: 0, fmt: RS.$('All__DateFmt_Weeks0') },
        { weeks: 1, fmt: RS.$('All__DateFmt_Weeks1') },
        { months: 0, fmt: RS.$('All__DateFmt_Months0') },
        { years: 0, fmt: RS.$('All__DateFmt_Years0') },
        { fmt: RS.$('All__DateFmt_fmt') }
    ],
    funcs: {
        hours: function (date, now) {
            if (date > now)
                return -1;

            return Ext.Date.getElapsed(date, now) / 1000 / 60 / 60;
        },
        days: function (date, now) {
            if (date > now)
                return -1;

            date = Ext.Date.clearTime(date, true);
            now = Ext.Date.clearTime(now, true);

            return Ext.Date.getElapsed(date, now) / 1000 / 60 / 60 / 24;
        },
        weeks: function (date, now) {
            if (date > now)
                return -1;

            date = Ext.Date.clearTime(date, true);
            now = Ext.Date.clearTime(now, true);

            date = Ext.Date.add(date, Ext.Date.DAY, -date.getDay());
            now = Ext.Date.add(now, Ext.Date.DAY, -now.getDay());

            return Ext.Date.getElapsed(date, now) / 1000 / 60 / 60 / 24 / 7;
        },
        months: function (date, now) {
            if (date > now)
                return -1;

            return (now.getFullYear() * 12 + now.getMonth()) - (date.getFullYear() * 12 + date.getMonth());
        },
        years: function (date, now) {
            if (date > now)
                return -1;

            return now.getFullYear() - date.getFullYear();
        }
    },

    toFriendlyString: function (date, formats) {
        var util = YZSoft.DateExtras,
            fs = formats || util.formats,
            funcs = util.funcs;

        if (!fs.processed) {
            fs.processed = true;

            for (var i = 0; i < fs.length; i++) {
                var f = fs[i];

                var funcName;
                for (funcName in f) {
                    if (funcName)
                        break;
                }
                if (funcName == 'fmt')
                    funcName = null;

                f.funcName = funcName;
                f.func = function (date, dateNow, me) {
                    if (!me.funcName)
                        return true;

                    var func = YZSoft.DateExtras.funcs[me.funcName];

                    if (!func)
                        return true;

                    var value = func(date, dateNow);
                    return (value != -1 && value <= me[me.funcName]);
                }
            }
        }

        var now = new Date();
        for (var i = 0; i < fs.length; i++) {
            var f = fs[i];
            if (f.func(date, now, f)) {
                return Ext.Date.format(date, f.fmt);
            }
        }
    },

    toElapsedString: function (minutes) {
        var day = Math.floor(minutes / 60 / 24),
            hours = Math.floor((minutes / 60) % 24),
            minutes = Math.ceil(minutes % 60),
            strHours = Ext.String.leftPad(hours, 2, '0'),
            strMinutes = Ext.String.leftPad(minutes, 2, '0');

        if (day)
            return Ext.String.format(RS.$('All__TimeSpanFormatDHM'), day, strHours, strMinutes);

        if (hours)
            return Ext.String.format(RS.$('All__TimeSpanFormatHM'), hours, strMinutes);

        return Ext.String.format(RS.$('All__TimeSpanFormatM'), minutes);
    },

    getWeekFirstDate: function (date) {
        //星期一为第一天  
        var weeknow = date.getDay();

        //因为是以星期一为第一天，所以要判断weeknow等于0时，要向前推6天。  
        weeknow = (weeknow == 0 ? (7 - 1) : (weeknow - 1));
        var daydiff = (-1) * weeknow;

        //本周第一天
        date = Ext.Date.add(date, Ext.Date.DAY, daydiff);
        return Ext.Date.clearTime(date);
    },

    getWeekFirstDateByWeekNo: function (year, month, week) {
        var firstDate = Ext.Date.getWeekFirstDate(new Date(year, month - 1, 1));
        return Ext.Date.add(firstDate, Ext.Date.DAY, (week - 1) * 7);
    },

    getWeekOfMonth: function (date) {
        var firstDate = Ext.Date.getWeekFirstDate(new Date(date.getFullYear(), date.getMonth(), 1)),
            days = Ext.Date.diff(firstDate, date, Ext.Date.DAY);

        return Math.floor(days / 7) + (days % 7 ? 1 : 0) + 1;
    }
};

Ext.apply(Ext.Date, YZSoft.DateExtras);

YZSoft.util = {};

YZSoft.util.hex = {
    encode: function (str) {
        str = String(str);

        var r = '';
        var e = str.length;
        var c = 0;
        var h;
        while (c < e) {
            h = str.charCodeAt(c++).toString(16);
            while (h.length < 3) h = '0' + h;
            r += h;
        }
        return r;
    },

    decode: function (str) {
        var r = '';
        var e = str.length;
        var s;
        while (e >= 0) {
            s = e - 3;
            r = String.fromCharCode('0x' + str.substring(s, e)) + r;
            e = s;
        }
        return r;
    }
};

YZSoft.util.xml = {
    xmlNodeNameEncode: function (value) {
        return !value ? value : String(value).replace(/@/g, '_x0040_').replace(/:/g, '_x003A_').replace('$', '_x0024_');
    },

    xmlValueEncode: function (value) {
        var rv = '';
        for (var i = 0; i < value.length; i++) {
            var ch = value.charAt(i);
            var code = ch.charCodeAt(0);
            var j = '<>"&\''.indexOf(ch);
            if (j != -1) {
                rv += '&' + ['lt', 'gt', 'quot', 'amp', 'apos'][j] + ';';
            }
            else if (code < 32 && code != 10 && code != 13) {
                //rv += '&#' + code + ';'; //忽略非打印字符，非打印字符是不会显示的会引起以后查询时的误解
            }
            else {
                rv += ch;
            }
        }
        return rv;
    },

    encode: function (nodename, jsondata, opt, deep) {
        var n = this.xmlNodeNameEncode(nodename);
        var d = jsondata;
        var hs = this.getHeadSpace(deep);
        if (!Ext.isDefined(d) || d === null) {
            return hs + this.encodeItem(n, '');
        }
        else if (Ext.isString(d)) {
            return hs + this.encodeItem(n, this.xmlValueEncode(d));
        }
        else if (typeof d == 'number') {
            return hs + this.encodeItem(n, d);
        }
        else if (Ext.isBoolean(d)) {
            return hs + this.encodeItem(n, d);
        }
        var vs = Ext.isArray(d) ? jsondata : [d];
        deep = deep || 0;
        var rv = [];
        if (deep == 0)
            rv.push('<?xml version="1.0"?>');
        if (vs.length == 0) {
            rv.push(hs + '<' + n + '>');
            rv.push(hs + '</' + n + '>');
        }
        else {
            for (var i = 0; i < vs.length; i++) {
                var v = vs[i];
                rv.push(hs + '<' + n + '>');

                for (var p in v) {
                    var pv = v[p];
                    rv.push(this.encode(p, pv, null, deep + 1));

                }
                rv.push(hs + '</' + n + '>');
            }
        }
        return rv.join('\r\n');
    },

    getHeadSpace: function (deep) {
        var spc = '';
        for (var i = 0; i < deep * 4; i++)
            spc += ' ';
        return spc;
    },

    encodeItem: function (p, v) {
        return '<' + p + '>' + v + '</' + p + '>';
    }
};

Ext.selectNode = function (selector, root, dom) {
    if (!root)
        return;

    return Ext.fly(root).down(selector, dom === false ? false : true);
};

Ext.findParent = function (selector, root, dom) {
    if (!root)
        return;

    return Ext.fly(root).up(selector, undefined, dom === false ? false : true);
};

Ext.define('YZSoft.override.MessageBox', {
    override: 'Ext.window.MessageBox',
    show: function (cfg) {
        var dlg = this.callParent(arguments);

        if (cfg.validateEmpty) {
            var textarea = dlg.textArea,
                okbtn = dlg.msgButtons[0];

            okbtn.setDisabled(!Ext.String.trim(textarea.getValue()));

            var change = function () {
                okbtn.setDisabled(!Ext.String.trim(textarea.getValue()));
            };

            var hide = function () {
                okbtn.setDisabled(false);

                textarea.un('change', change);
                dlg.un('hide', hide);
            };

            textarea.on('change', change);
            dlg.on('beforehide', hide);
        }

        return dlg;
    }
});

YZSoft.util.pad = function (n) {
    return n < 10 ? '0' + n : n;
};

Date.prototype.toString = function () {
    //return this.format('Y-m-d H:i:s');以下代码效率更高
    var pad = YZSoft.util.pad;
    return this.getFullYear() + '-' +
                pad(this.getMonth() + 1) + '-' +
                pad(this.getDate()) + ' ' +
                pad(this.getHours()) + ':' +
                pad(this.getMinutes()) + ':' +
                pad(this.getSeconds());
};

Ext.JSON.encodeDate = function (o) {
    return '"' + o.toString() + '"';
};

Number.prototype.toFileSize = function () {
    var dw = ['KB', 'MB', 'GB', 'TB']
    var result = Math.ceil(this / 1024) + ' ' + dw[0]
    for (var i = 1; i < dw.length; i++) {
        var c = (this / Math.pow(1024, i + 1)).toFixed(2)
        if (c < 1) return result
        result = c + ' ' + dw[i]
    }
    return result
}

Ext.applyIf(String, {
    Equ: function (str1, str2) {
        if (Ext.isString(str1) && Ext.isString(str2))
            return ((str1 || '').toLowerCase() == (str2 || '').toLowerCase());
        else
            return str1 == str2;
    }
});

Ext.apply(Ext.form.VTypes, {
    daterange: function (val, field) {
        var date = field.parseDate(val);

        if (!date) {
            return false;
        }

        if (field.startDateField) {
            var start = Ext.getCmp(field.startDateField);
            if (!start.maxValue || start.maxValue.getTime() != date.getTime()) {
                start.setMaxValue(date);
                start.validate();
            }
        }
        else if (field.endDateField) {
            var end = Ext.getCmp(field.endDateField);
            if (!end.minValue || end.minValue.getTime() != date.getTime()) {
                end.setMinValue(date);
                end.validate();
            }
        }
        return true;
    },

    password: function (val, field) {
        if (field.initialPassField) {
            var pwd = Ext.getCmp(field.initialPassField);
            return (val == pwd.getValue());
        }
        return true;
    },

    passwordText: RS.$('All_PwdCfm_Diff')
});

Ext.define('YZSoft.Utility', {
    singleton: true,

    isNumber: function (w) {
        if (Ext.isNumber(w))
            return true;

        if (!Ext.isString(w))
            return false;

        var l = w.length, d;

        for (var i = 0; i < l; i++) {
            if (!d && i >= 15) //超过16位
                return false;

            var c = w.charCodeAt(i);


            if (c == 46) {
                if (d) { return false; } else { d = true; }
            }
            else if (c < 48 || c > 57)
                return false;
        }
        return !(l == 0 || (!d && l != 1 && w.charCodeAt(0) == 48));
    },

    isString: function (w) {
        if (!Ext.isString(w))
            return false;

        w = Ext.String.trim(w);

        var l = w.length;
        if (l < 2)
            return false;

        var s = w.charAt(0),
            e = w.charAt(l - 1);

        return (s == e && (s == '\'' || s == '"'));
    },

    isConstant: function (w) {
        return this.isNumber(w) || this.isString(w);
    },

    getConstantValue: function (w) {
        if (this.isNumber(w))
            return Number(w);

        if (this.isString(w)){
            w = Ext.String.trim(w);
            return w.substr(1, w.length - 2);
        }

        return null;
    },

    combineDate: function (date, time) {
        if (!date || !time)
            return null;

        if (!Ext.isDate(date) || !Ext.isDate(time))
            return null;

        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
    }
});

YZSoft.HttpUtility = {
    htmlEncode: function (str, returnToBR) {
        var rv = Ext.util.Format.htmlEncode(str);
        if (returnToBR && rv)
            rv = rv.replace(/(\r\n|\n\r|\n|\r)/g, '<br/>');
        return rv;
    },

    htmlDecode: function (str) {
        var rv = Ext.util.Format.htmlDecode(str);
    },

    jsEncode: function (str) {
        var rv = '';
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            switch (c) {
                case '\"':
                    rv += "\\\"";
                    break;
                case '\'':
                    rv += "\\\'";
                    break;
                case '\\':
                    rv += "\\\\";
                    break;
                case '\b':
                    rv += "\\b";
                    break;
                case '\f':
                    rv += "\\f";
                    break;
                case '\n':
                    rv += "\\n";
                    break;
                case '\r':
                    rv += "\\r";
                    break;
                case '\t':
                    rv += "\\t";
                    break;
                default:
                    rv += c;
            }
        }
        return rv;
    },

    inlineJSEncode: function (str) {
        return YZSoft.HttpUtility.jsEncode(YZSoft.HttpUtility.htmlEncode(str));
    },

    parseKeyValue: function (str, splitchar, lowercaseName) {
        str = str || '';
        splitchar = splitchar || '';
        var splen = splitchar.length;
        var idx = str.indexOf(splitchar);
        var rv = {};
        if (idx == -1) {
            rv.key = '';
            rv.value = Ext.String.trim(str || '');
        }
        else {
            rv.key = Ext.String.trim(str.substring(0, idx) || '');
            rv.value = Ext.String.trim(str.substring(idx + splen));
        }

        if (lowercaseName)
            rv.key = rv.key.toLowerCase();

        return rv;
    },

    attrDecode: function (str) {
        if (!str || str.indexOf('&') == -1)
            return str;

        var chs = [];
        var count = str.length;
        for (var i = 0; i < count; i++) {
            var ch = str.charAt(i);
            if (ch == '&') {
                var index = str.indexOf('#', i);
                if (index != -1) {
                    var flag = str.substring(i + 1, index - i - 1).toLowerCase();
                    if (flag == 'amp') { chs.push("&"); i += 3; continue; }
                    if (flag == 'cln') { chs.push(":"); i += 3; continue; }
                    if (flag == 'sem') { chs.push(";"); i += 3; continue; }
                    if (flag == 'cma') { chs.push(","); i += 3; continue; }
                    if (flag == 'gt') { chs.push(">"); i += 2; continue; }
                }
            }

            chs.push(ch);
        }

        return chs.join('');
    } 
};

YZSoft.Render = {
    getUserDisplayName: function (account, displayName) {
        if (!displayName)
            return account;
        else
            return displayName + '(' + account + ')';
    },

    renderString: function (value) {
        value = (!value && value !== 0) ? '' : value;
        return YZSoft.HttpUtility.htmlEncode(value, true);
    },

    renderDataType: function (value) {
        return (value || {}).name || 'String';
    },

    renderUserName: function (account, displayName) {
        return YZSoft.HttpUtility.htmlEncode(YZSoft.Render.getUserDisplayName(account, displayName));
    },

    renderHandlingTime: function (minutes) {
        if (minutes == -1)
            return RS.$('All_HandlingTime_NoCal');

        var h = Math.floor(minutes / 60);
        var m = minutes % 60;

        var rv = '';
        if (h)
            rv += h + RS.$('All_UnitHour');

        if (m)
            rv += m + RS.$('All_UnitMinute');

        if (rv.length == 0)
            rv = RS.$('All_LTOneMinute');

        return rv;
    },

    renderDateYMD: function (date) {
        return Ext.Date.format(date, 'Y-m-d');
    },

    renderDateYMDHM: function (date) {
        return Ext.Date.format(date, 'Y-m-d H:i');
    },

    renderFileSize: function (size) {
        return size.toFileSize();
    },

    renderSIDType: function (value) {
        return RS.$('All_Enum_SIDType_' + value)
    },

    renderCode: function (value, encode) {
        if (encode !== false)
            encode = true;

        if (Ext.isString(value)) {
            return '"' + (encode ? YZSoft.HttpUtility.htmlEncode(value, false) : value) + '"';
        }
        else if (Ext.isObject(value)) {
            if (encode)
                return '<span class="yz-grid-cell-codetext">' + YZSoft.HttpUtility.htmlEncode(value.CodeText) + '</span>';
            else
                return value.CodeText;
        }
        else
            return value;
    }
};

Ext.define('YZSoft.Data.JsonLoader', {
    extend: Ext.util.Observable,
    constructor: function (config) {
        Ext.apply(this, config);
        this.callParent(config);
    },

    load: function (params) {
        Ext.Ajax.request({
            method: 'GET',
            disableCaching: true,
            async: false,
            url: this.url,
            params: this.params,
            scope: this,
            success: function (response) {
                this.json = Ext.util.JSON.decode(response.responseText);
                return this.json;
            }
        });
    }
});

/*
支持storeexception显示
showStoreErr: true,{cls:'my-grid-errmsg'} default false
*/
Ext.define('YZSoft.override.grid.Panel', {
    override: 'Ext.grid.Panel',
    bufferedRenderer: false,
    showStoreErr: false,
    errCls: 'yz-grid-errmsg',

    initComponent: function () {
        var me = this,
            store = me.getStore();

        me.callParent(arguments);

        if (me.showStoreErr && store) {
            var proxy = store.getProxy();
            proxy.on({
                exception: function (proxy, request, operation, eOpts) {
                    var reader = proxy.getReader();
                    if (reader)
                        me.onStoreErr(reader.rawData);
                }
            });

            store.on({
                beforeload: function () {
                    if (me.errEl)
                        me.errEl.hide();
                }
            });
        }
    },

    onStoreErr: function (data) {
        var me = this,
            errCfg = me.showStoreErr;

        if (!Ext.isObject(errCfg)) {
            errCfg = {
                cls: me.errCls,
                errorMessage: data.errorMessage
            }
        }

        me.showError(errCfg);
    },

    showError: function (errCfg) {
        var me = this;

        var html = Ext.String.format('<div class="{0} yz-grid-errmsg-default"><div class="yz-grid-errmsg-wrap"><div class="yz-grid-errmsg-text">{1}</div></div></div>',
            errCfg.cls,
            RS.$1(errCfg.errorMessage));

        if (!me.errEl) {
            me.errEl = Ext.get(Ext.core.DomHelper.insertHtml('beforeEnd', me.getView().getTargetEl().dom, html));
        }
        else {
            me.errEl.show();
            me.errEl.down('.yz-grid-errmsg-text', true).innerHTML = RS.$1(errCfg.errorMessage);
        }
    },

    destroy: function () {
        var me = this;
        if (me.errEl)
            me.errEl.destroy();
        me.callParent(arguments);
    },

    moveSelectionUp: function () {
        var sm = this.getSelectionModel(),
            store = this.getStore();

        if (sm && store) {
            for (var i = 1; i < store.getCount(); i++) {
                if (sm.isSelected(i)) {
                    var r = store.getAt(i);
                    store.removeAt(i);
                    store.insert(i - 1, r);

                    sm.select(i - 1, true);
                }
            }
        }
    },

    moveUp: function (records, step) {
        var records = Ext.isArray(records) ? records : [records],
            store = this.getStore();

        step = step || 1;

        if (store) {
            for (var i = step; i < store.getCount(); i++) {
                var r = store.getAt(i);
                if (Ext.Array.contains(records, r)) {
                    store.removeAt(i);
                    store.insert(i - step, r);
                }
            }

            this.getView().refresh();
        }
    },

    moveSelectionDown: function () {
        var sm = this.getSelectionModel();
        var store = this.getStore();

        if (sm && store) {
            for (var i = store.getCount() - 1; i >= 0; i--) {
                if (sm.isSelected(i)) {
                    var r = store.getAt(i);
                    store.removeAt(i);
                    store.insert(i + 1, r);

                    sm.select(i + 1, true);
                }
            }
        }
    },

    moveDown: function (records, step) {
        var records = Ext.isArray(records) ? records : [records],
            store = this.getStore();

        step = step || 1;

        if (store) {
            for (var i = store.getCount() - 1; i >= 0; i--) {
                var r = store.getAt(i);
                if (Ext.Array.contains(records, r)) {
                    store.removeAt(i);
                    store.insert(i + step, r);
                }
            }

            this.getView().refresh();
        }
    },

    removeAllSelection: function () {
        this.store.remove(this.getSelectionModel().getSelection());
    },

    canEdit: function () {
        var sm = this.getSelectionModel();
        return (sm && sm.getCount() == 1);
    },

    canDelete: function () {
        var sm = this.getSelectionModel();
        return (sm && sm.getCount() >= 1);
    },

    canMoveUp: function () {
        var sm = this.getSelectionModel();
        return (sm && sm.getCount() >= 1 && !sm.isSelected(0));
    },

    canMoveDown: function () {
        var sm = this.getSelectionModel(),
            store = this.getStore();
        return (sm && store && sm.getCount() >= 1 && !sm.isSelected(store.getCount() - 1));
    },

    addRecords: function (recs, select, equFn, useNewAdded) {
        if (!recs)
            return;

        var recs = Ext.isArray(recs) ? recs : [recs],
            select = select !== false,
            me = this,
            nrecs = [],
            addedrecs = [],
            model = me.store.getModel(),
            equFn = equFn || model.equFn;

        Ext.each(recs, function (rec) {
            rec = rec.data || rec;

            var nrec = null;
            if (equFn) {
                me.store.each(function (recStore) {
                    if (equFn.call(recStore, recStore.data, rec)) {
                        nrec = recStore;
                        return false;
                    }
                });
            }
            else {
                var nrec = me.store.getById(model.getIdFromData(rec));
            }

            if (!nrec) {
                nrec = me.store.add(rec)[0];
                addedrecs.push(nrec);
            }

            nrecs.push(nrec);
        });

        var rv = useNewAdded ? addedrecs : nrecs;
        if (select)
            me.getSelectionModel().select(rv);

        return rv;
    },

    syncRecords: function (srcStore, recs, select, equFn) {
        if (!recs)
            return;

        var recs = Ext.isArray(recs) ? recs : [recs],
            select = select !== false,
            me = this,
            removeRecs = [],
            tagStore = me.getStore(),
            model = tagStore.getModel(),
            equFn = equFn || model.equFn;

        tagStore.each(function (tagRec) {
            var srcRec = srcStore.getData().findBy(function (srcRec) {
                if (equFn)
                    return equFn.call(tagRec, srcRec.data, tagRec.data);
                else
                    return model.getIdFromData(srcRec.data) == tagRec.getId();
            });

            if (srcRec) {
                var rec = Ext.Array.findBy(recs, function (selRec) {
                    if (equFn)
                        return equFn.call(srcRec, srcRec.data, selRec.data);
                    else
                        return model.getIdFromData(srcRec.data) == model.getIdFromData(selRec.data);
                });

                if(!rec)
                    removeRecs.push(tagRec);
            }
        });

        tagStore.remove(removeRecs);
        recs = me.addRecords(recs, false, equFn, true);
        me.getSelectionModel().select(recs);
    }
});

Ext.define('YZSoft.ViewManager', {
    singleton: true,

    getTab: function (sender) {
        return sender.up('yz-tab-module');
    },

    getFuncView: function (sender) {
        return sender.up('yz-func-panel-cnt');
    },

    addView: function (sender, xclass, config) {
        var me = this,
            tab = me.getTab(sender),
            pnl;

        if (config.id) {
            config.id = tab.id + '-' + config.id;
            pnl = tab.getComponent(config.id);
        }

        if (pnl) {
            pnl.show();
        }
        else {
            config = Ext.apply(config, {
                closable: true,
                border: false
            });

            pnl = Ext.create(xclass, config);

            pnl.on({
                single: true,
                afterrender: function () {
                    if (this.onActivate) {
                        this.activateTime = 1;
                        this.onActivate.apply(this, [0])
                    }
                }
            });

            tab.add(pnl);
            tab.layout.setActiveItem(pnl);
        }

        return pnl
    },

    find: function (sender, id) {
        var me = this,
            tab = me.getTab(sender),
            pnl = tab.getComponent(id);

        if (pnl)
            return pnl;
    },

    add: function (sender, panel) {
        var me = this,
            tab = me.getTab(sender);

        tab.add(panel);
        tab.layout.setActiveItem(panel);
    },

    show: function (panel) {
        panel.show();
    }
});

Ext.define('YZSoft.override.window.Window', {
    override: 'Ext.window.Window',

    closeDialog: function () {
        if (this.autoClose !== false) {
            if (this.closeAction == 'hide')
                this.hide();
            else
                this.close();
        }

        if (this.fn)
            this.fn.apply(this.scope || this, arguments);
    }
});

YZSoft.UIHelper = {
    IsOptEnable: function (pnl, grid, permName, minSelection, maxSelection) {

        if (!Ext.isEmpty(permName)) {
            //模块权限
            if (!grid || (pnl && pnl.perm && Ext.isDefined(pnl.perm[permName]))) {
                if (!pnl.perm[permName])
                    return false;
            }
            else { //记录权限或未定义的权限
                var sm = grid.getSelectionModel();
                var recs = sm.getSelection() || [];

                for (var i = 0; i < recs.length; i++) {
                    if (!Ext.isObject(recs[i].data.perm)) //记录上未给出权限信息,开发过程中可能未定义权限，故允许请求的操作
                        break;

                    if (recs[i].data.perm[permName] !== true)  //当前记录不允许请求的权限
                        return false;
                }
            }
        }

        //权限允许的情况下检查选中项数量要求
        return YZSoft.UIHelper.IsOptEnableNoPerm(grid, minSelection, maxSelection);
    },

    IsOptEnableNoPerm: function (grid, minSelection, maxSelection) {
        minSelection = minSelection || 0;
        maxSelection = maxSelection || -1;

        //对是否选择无要求
        if (minSelection == 0 && maxSelection == -1)
            return true;

        var sm = grid.getSelectionModel();
        var recs = sm.getSelection() || [];

        //未满足最少选择项要求
        if (recs.length < minSelection)
            return false;

        //未满足最多选择项要求
        if (maxSelection != -1 && recs.length > maxSelection)
            return false;

        return true;
    }
};

/*****bug修正********/
Ext.define('YZSoft.override.LoadMask', {
    override: 'Ext.LoadMask',

    getStoreListeners: function (store) {

        //beforeLoad -> beforeload
        var rv = this.callParent(arguments);
        if (rv.beforeLoad) {
            rv.beforeload = rv.beforeLoad;
            delete rv.beforeLoad;
        }

        return rv;
    }
});

Ext.define('Ext.override.selection.Model', {
    override: 'Ext.selection.Model',

    reselect: function (selection) {
        if (!selection)
            return;

        var me = this,
            recs = me.getSelection(),
            model = me.store.getModel(),
            orecs = new Ext.util.MixedCollection(),
            nrecs = new Ext.util.MixedCollection();

        Ext.each(recs, function (rec) {
            orecs.add(rec.getId(), rec);
        });

        Ext.each(selection, function (data) {
            var id = model.getIdFromData(data);
            nrecs.add(id, data);
        });

        //delete selection
        Ext.each(recs, function (rec) {
            if (nrecs.indexOfKey(rec.getId()) == -1)
                me.deselect(rec);
        });

        //add new selection
        Ext.each(selection, function (data) {
            var id = model.getIdFromData(data);
            if (orecs.indexOfKey(id) == -1) {
                var rec = me.store.getById(id);
                if (rec)
                    me.select(rec);
            }
        });
    }
});

/*
store.load(operation) 支持同步加载
operation.async : false
*/
Ext.define('Ext.override.data.proxy.Server', {
    override: 'Ext.data.proxy.Server',

    buildRequest: function (operation) {
        var request = this.callParent(arguments);
        request.async = operation.config.async;
        return request;
    }
});

Ext.define('Ext.override.data.Request', {
    override: 'Ext.data.Request',

    getCurrentConfig: function () {
        var config = this.callParent(arguments);
        config.async = this.async;
        return config;
    }
});

/*
增加枚举类型支持(union存储)
example:
--YZSoft.BPM.src.model.Participant
    { name: 'LeaderType', yzenum: { type: 'BPM.ParticipantLeaderType', store: 'LParam1'} }
*/
Ext.define('Ext.override.data.Model', {
    override: 'Ext.data.Model',

    get: function (fieldName) {
        var field = this.getField(fieldName);
        if (field && field.yzenum) {
            var v = this.get(field.yzenum.store);
            return YZSoft.Enum.VTOS(field.yzenum.type, v);
        }

        return this.callParent(arguments);
    },

    set: function (fieldName, newValue, options) {
        var field = this.getField(fieldName),
            rv;
        if (field && field.yzenum) {
            var v = YZSoft.Enum.STOV(field.yzenum.type, newValue);
            rv = this.set(field.yzenum.store, v);
        }
        else
            rv = this.callParent(arguments);

        if (this.fireEvent)
            this.fireEvent(fieldName + 'changed', newValue);
    }
});

/*
config:
dateFormat :日期类型缺省Y-m-d
convert    :example:{Unknown:''}
emptyText  true 使用缺省值：<span style="color:#999">未设置</span>
*/
Ext.define('YZSoft.override.form.field.Display', {
    override: 'Ext.form.field.Display',
    dateFormat: 'Y-m-d',

    getDisplayValue: function () {
        var me = this,
            value = me.getRawValue();

        if (!me.renderer) {
            if (Ext.isDate(value))
                return Ext.Date.format(value, me.dateFormat);

            if (me.convert) {
                if (me.convert.hasOwnProperty(value))
                    return me.emptyConvert(me.convert[value]);
            }
        }

        return me.emptyConvert(me.callParent(arguments));
    },

    emptyConvert: function (display) {
        if (Ext.isEmpty(display) && this.emptyText) {
            if (this.emptyText === true)
                display = Ext.String.format('<span style="color:#999">{0}</span>',RS.$('All_DisplayFieldEmptyText'));
            else
                display = this.emptyText;
        }

        return display;
    }
});

Ext.define('YZSoft.override.grid.column.Check', {
    override: 'Ext.grid.column.Check',

    processEvent: function (type, view, cell, recordIndex, cellIndex, e, rec, row) {
        var disableDataIndex = this.disableDataIndex,
            rv;

        if (disableDataIndex) {
            var disabledSaved = this.disabled;
            this.disabled = rec.data[disableDataIndex] === true;

            rv = this.callParent(arguments);

            this.disabled = disabledSaved;
        }
        else {
            rv = this.callParent(arguments);
        }
        return rv;
    },

    renderer: function (value, p, rec) {
        var disableDataIndex = this.disableDataIndex,
            rv;

        if (disableDataIndex) {
            var disabledSaved = this.disabled;
            this.disabled = rec.data[disableDataIndex] === true;

            rv = this.defaultRenderer(value, p, rec);

            this.disabled = disabledSaved;
        }
        else {
            rv = this.defaultRenderer(value, p, rec);
        }
        return rv;
    }
});

Ext.define('YZSoft.override.Element', {
    override: 'Ext.Element',

    scrollIntoView: function (container, hscroll) {
        var c = Ext.getDom(container) || Ext.getBody().dom,
            el = this.dom,
            o = this.getOffsetsTo(c),
            l = o[0] + c.scrollLeft,
            t = o[1] + c.scrollTop,
            b = t + el.offsetHeight + 40,
            r = l + el.offsetWidth,
            ch = c.clientHeight,
            ct = parseInt(c.scrollTop, 10),
            cl = parseInt(c.scrollLeft, 10),
            cb = ct + ch,
            cr = cl + c.clientWidth;

        if (el.offsetHeight > ch || t < ct) {
            c.scrollTop = t;
        }
        else if (b > cb) {
            c.scrollTop = b - ch;
        }

        c.scrollTop = c.scrollTop;

        if (hscroll !== false) {
            if (el.offsetWidth > c.clientWidth || l < cl) {
                c.scrollLeft = l;
            }
            else if (r > cr) {
                c.scrollLeft = r - c.clientWidth;
            }
            c.scrollLeft = c.scrollLeft;
        }
        return this;
    }
});

/*
增加 spellcheck属性，缺省false
*/
Ext.define('YZSoft.override.form.field.Base', {
    override: 'Ext.form.field.Base',
    inputAttrTplExt: new Ext.XTemplate([
        'spellcheck="{spellcheck}"'
    ]),
    spellcheck: false,

    getSubTplData: function (fieldData) {
        var me = this,
            data = me.callParent(arguments);

        return Ext.apply(data, {
            inputAttrTpl: data.inputAttrTpl + ' ' + me.inputAttrTplExt.apply({
                spellcheck: me.spellcheck
            })
        });
    }
});

/*
lineArray true/false:value是line array
*/
Ext.define('YZSoft.override.form.field.TextArea', {
    override: 'Ext.form.field.TextArea',
    lineArray: false,

    setValue: function (value) {
        if (this.lineArray === true && Ext.isArray(value))
            value = value.join('\r\n');

        return this.callParent([value]);
    },

    getValue: function () {
        var val = this.callParent(arguments);

        if (this.lineArray === true)
            return (val || '').replace(/\r\n/g, '\n').split('\n');
        else
            return val;
    }
});

/*
config
clicksToEdit 3:模式3，当前行选中，鼠标单击后在规定时间内未发生双击启动编辑
             false:不启用点击编辑
editDelay - 编辑延时,缺省350
events:
beforeedit column editor将会接受到beforeedit事件
*/
Ext.define('YZSoft.override.grid.plugin.CellEditing', {
    override: 'Ext.grid.plugin.CellEditing',
    editDelay: 350,

    constructor: function (config) {
        var me = this;

        if (config.clicksToEdit === false) {
            Ext.apply(config, {
                triggerEvent: 'yzstartedit',
                clicksToEdit: 1
            });
        }

        me.callParent([config]);

        me.on({
            beforeedit: function (editor, context, eOpts) {
                var celleditor = editor.getEditor(context.record, context.column);
                return celleditor.field.fireEvent('beforeedit', context, editor);
            }
        });
    },

    initEditTriggers: function () {
        var me = this;

        if (me.clicksToEdit === 3)
            me.triggerEvent = 'yzcellstartedit'

        me.callParent(arguments);

        if (me.clicksToEdit === 3) {
            me.mon(me.view, 'beforecellclick', function (view, cell, colIdx, record, row, rowIdx, e) {
                if (me.grid.getSelectionModel().isRowSelected(record)) {
                    me.defer = Ext.defer(function () {
                        if (me.defer)
                            me.view.fireEvent('yzcellstartedit', view, cell, colIdx, record, row, rowIdx);
                    }, me.editDelay);
                }
            }, me);

            me.mon(me.view, 'celldblclick', function () {
                if (me.defer) {
                    clearTimeout(me.defer);
                    delete me.defer;
                }
            }, me);
        }
    }
});

Ext.define('YZSoft.override.form.Panel', {
    override: 'Ext.form.Panel',

    getValuesSubmit: function () {
        return this.getForm().getValues(false,false,false,true,true);
    }
});

Ext.define('YZSoft.override.form.CheckboxGroup', {
    override: 'Ext.form.CheckboxGroup',
    returnArray: false,

    getModelData: function () {
        if (this.returnArray) {
            var values = {},
                boxes = this.getBoxes(),
                b,
                bLen = boxes.length,
                box, name, inputValue, bucket;

            for (b = 0; b < bLen; b++) {
                box = boxes[b];
                name = box.getName();
                inputValue = box.inputValue;
                if (box.getValue()) {
                    if (values.hasOwnProperty(name)) {
                        bucket = values[name];
                        if (!Ext.isArray(bucket)) {
                            bucket = values[name] = [
                                    bucket
                                ];
                        }
                        bucket.push(inputValue);
                    } else {
                        values[name] = [inputValue];
                    }
                }
                else {
                    values[name] = values[name] || [];
                }
            }
            return values;
        }
        else
            return this.callParent(arguments);
    }
});

Ext.define('YZSoft.override.selection.TreeModel', {
    override: 'Ext.selection.TreeModel',

    selectByPhyPath: function (path, fn, deep) {
        var me = this,
            paths = path.split('/'),
            store = me.getStore(),
            deep = deep || 0,
            node = store.getRoot();

        for (var i = 2; i < paths.length; i++) {
            var text = paths[i],
                child = node.findChild('text', text);

            if (child) {
                if (i == paths.length - 1) {
                    var selected = me.isSelected(child);
                    me.select(child);
                    fn && fn(child, selected);
                    return child;
                }
                else {
                    node = child;
                    continue;
                }
            }
            else {
                //防止死循环，这加了，另一人删除了，就会变成死循环。
                if (deep > paths.length)
                    return;

                if (node.isExpanded()) {
                    store.load({
                        node: node,
                        callback: function () {
                            me.selectByPhyPath(path, fn, deep + 1);
                        }
                    });
                }
                else {
                    node.expand(false, function () {
                        me.selectByPhyPath(path, fn, deep + 1);
                    }, me);
                }
            }
        }
    }
});

Ext.define('YZSoft.override.grid.column.RowNumberer', {
    override: 'Ext.grid.column.RowNumberer',
    desc: false,

    defaultRenderer: function (value, metaData, record, rowIdx, colIdx, dataSource, view) {
        if (this.desc) {
            var rowspan = this.rowspan,
                page = dataSource.currentPage,
                result = view.store.getCount() - view.store.indexOf(record) - 1;

            if (metaData && rowspan) {
                metaData.tdAttr = 'rowspan="' + rowspan + '"';
            }

            return result + 1;
        }

        return this.callParent(arguments);
    }
});

YZSoft.SelUserDlg = {
    show: function () {
        var dlg = YZSoft.SelUserDlg = Ext.create('YZSoft.BPM.src.dialogs.SelUserDlg', {
            closeAction: 'hide'
        });

        dlg.show.apply(dlg, arguments);
    }
};

YZSoft.SelUsersDlg = {
    show: function () {
        var dlg = YZSoft.SelUsersDlg = Ext.create('YZSoft.BPM.src.dialogs.SelUsersDlg', {
            closeAction: 'hide'
        });

        dlg.show.apply(dlg, arguments);
    }
};

YZSoft.SelMemberDlg = {
    show: function () {
        var dlg = YZSoft.SelMemberDlg = Ext.create('YZSoft.BPM.src.dialogs.SelMemberDlg', {
            closeAction: 'hide'
        });

        dlg.show.apply(dlg, arguments);
    }
};

YZSoft.SelMembersDlg = {
    show: function () {
        var dlg = YZSoft.SelMembersDlg = Ext.create('YZSoft.BPM.src.dialogs.SelMembersDlg', {
            closeAction: 'hide'
        });

        dlg.show.apply(dlg, arguments);
    }
};

Ext.apply(YZSoft, {
    showSitemap: function (url) {
        var panel = Ext.create('YZSoft.src.panel.SiteMapPanel', {
            url: url,
            backPanel: YZSoft.frame.getLayout().getActiveItem()
        });
        YZSoft.frame.add(panel);
        YZSoft.frame.getLayout().setActiveItem(panel);
    }
});

//支持复杂类型,ComboBox value在Object类型下setValue无法选中值
Ext.define('YZSoft.override.form.field.ComboBox', {
    override: 'Ext.form.field.ComboBox',

    setValue: function (v) {
        if (this.value2Record)
            v = this.value2Record(this,v);
        this.callParent([v]);
    }
});

Ext.apply(YZSoft, {
    goto: function (moduleids) {
        moduleids = Ext.isArray(moduleids) ? moduleids : moduleids.split('/');

        var mainTab = YZSoft.mainTab,
            maintabid = moduleids[0],
            nodeid = moduleids[1],
            moduleid = moduleids[2];

        if (maintabid) {
            var activeModule = mainTab.setActiveTab(maintabid);

            if (nodeid) {
                activeModule.setActiveNode(nodeid, function (record) {
                    if (moduleid)
                        activeModule.setActiveTab(record, moduleid);
                });
            }
        }
    },
    logout: function () {
        var params = {
            action:'logout',
            ReturnUrl: window.location.href
        };
        window.location.href = Ext.String.urlAppend(YZSoft.loginUrl, Ext.Object.toQueryString(params));
    },
    changeuser: function () {
        window.location.href = Ext.String.format('{0}?action=changeuser', YZSoft.loginUrl);
    }
});

//支持自定义Class Namespace,例如 Demo、XYSoft,将使用和YZSoft并列的目录
Ext.define('YZSoft.override.Inventory', {
    override: 'Ext.Inventory',

    getPath: function (className) {
        var me = this,
            paths = me.paths,
            ret = '',
            prefix;

        if (className in paths) {
            ret = paths[className];
        } else {
            prefix = me.getPrefix(className);

            if (prefix) {
                className = className.substring(prefix.length + 1);
                ret = paths[prefix];
            }
            if (!prefix) {
                var names = className.split('.');
                if (names.length >= 1) {
                    prefix = names[0];
                    if (prefix != 'YZSoft') {
                        className = className.substring(prefix.length + 1);
                        ret = YZSoft.$url(prefix);
                    }
                }
            }

            if (ret)
                ret += '/';

            ret += className.replace(me.dotRe, '/') + '.js';
        }

        return ret;
    }
});

Ext.define('YZSoft.override.tree.Panel', {
    override: 'Ext.tree.Panel',

    expandTo: function (rec, options) {
        options = options || {};

        var me = this,
            index = 0,
            current = me.getRootNode(),
            view = me.getView(),
            callback = options.callback,
            scope = options.scope,
            path = [];

        while (rec) {
            path = Ext.Array.insert(path, 0, [rec]);
            rec = rec.parentNode;
        }

        expander = function (newChildren) {
            var node = this,
                len, i, value;

            // We've arrived at the end of the path.
            if (++index === path.length) {
                view.getSelectionModel().select(node);
                return Ext.callback(callback, scope || me, [true, node, view.getNode(node)]);
            }

            // Find the next child in the path if it's there and expand it.
            for (i = 0, len = newChildren ? newChildren.length : 0; i < len; i++) {
                var cnode = newChildren[i];
                if (cnode === path[index]) {
                    return cnode.expand(false, expander);
                }
            }

            // If we get here, there's been a miss along the path, and the operation is a fail.
            node = this;
            Ext.callback(callback, scope || me, [false, node, view.getNode(node)]);
        };
        current.expand(false, expander);
    }
});

Ext.define('YZSoft.override.Object', {
    override: 'Ext.Object',

    findAll: function (obj, fn, scope, result) {
        var me = this;

        result = result || [];

        if (Ext.isArray(obj)) {
            Ext.Array.each(obj, function (obj) {
                me.findAll(obj, fn, scope, result);
            });
        }
        else if (Ext.isSimpleObject(obj)) {
            if (fn.call(null, obj) === true) {
                result.push(obj);
            }
            else {
                for (property in obj) {
                    if (obj.hasOwnProperty(property))
                        me.findAll(obj[property], fn, scope, result);
                }
            }
        }

        return result;
    }
});

Ext.define('YZSoft.override.button.Button', {
    override: 'Ext.button.Button',
    config: {
        badgeText: null
    },
    _hasBadgeCls: 'yz-hasbadge',
    _noBadgeCls: 'yz-nobadge',
    afterTpl: [
        '<span id="{id}-badgeEl" data-ref="badgeEl" class="yz-badge">' +
            ' {badgeText}' +
        '</span>'
    ],

    initComponent: function () {
        var me = this,
            badgeText = me.badgeText;

        me[badgeText ? 'addCls' : 'removeCls'](me._hasBadgeCls);
        me[badgeText ? 'removeCls' : 'addCls'](me._noBadgeCls);

        me.callParent(arguments);
    },

    doToggle: function () {
        var me = this;

        if (me.enableToggle && me.allowDepress === false && me.pressed)
            me.fireEvent('clickOnPressedState', me);

        me.callParent(arguments);
    },

    getTemplateArgs: function () {
        var me = this,
            rv;

        rv = me.callParent(arguments);

        Ext.apply(rv, {
            badgeText: me.badgeText
        });

        return rv;
    },

    getAfterMarkup: function (values) {
        return this.getTpl('afterTpl').apply(values);
    },

    updateBadgeText: function (badgeText, oldText) {
        var me = this,
            badgeEl;

        badgeText = badgeText == null ? '' : String(badgeText);
        oldText = oldText || '';

        if (me.rendered) {
            me[badgeText ? 'addCls' : 'removeCls'](me._hasBadgeCls);
            me[badgeText ? 'removeCls' : 'addCls'](me._noBadgeCls);

            badgeEl = me.el.down('.yz-badge', true);
            badgeEl.innerHTML = badgeText;
        }
    }
});

Ext.define('YZSoft.override.draw.engine.Canvas', {
    override: 'Ext.draw.engine.Canvas',

    afterCachedConfig: function () {
        this.callParent(arguments);

        var me = this,
            i, ln = me.canvases.length;

        for (i = 0; i < ln; i++) {
            me.contexts[i] = null;
            me.canvases[i].destroy();
            me.canvases[i] = null;
        }
        me.contexts = [];
        me.canvases = [];
    }
});

Ext.define('YZSoft.override.form.field.ComboBox', {
    override: 'Ext.form.field.ComboBox',

    getGrowWidth: function () {
        var me = this,
            filters = [],
            rv;

        me.store.getFilters().each(function (filter) {
            filters.push(filter);
        });
        me.store.clearFilter(true);

        rv = me.callParent();

        me.store.addFilter(filters,true);
        return rv;
    }
});

Ext.define('YZSoft.override.Format', {
    override: 'Ext.util.Format',
    currencyPrecision: 2,
    currencyAtEnd: false,

    mediaDurationM: function (value) {
        var m = Math.floor(value / 60),
            s = Math.floor(value % 60),
            rv = '';

        if (m > 0) {
            rv += m + "'";
            s = Ext.String.leftPad(s, 2, '0');
        }

        rv += s + "''";
        return rv;
    },

    currency: function (v, currencySign, decimals, end) {
        var me = this,
            negativeSign = '',
            format = ",0",
            i = 0;

        me.currencySign = me.currencySign || RS.$('All__Currency_RMB');

        v = v - 0;
        if (v < 0) {
            v = -v;
            negativeSign = '-';
        }
        decimals = Ext.isDefined(decimals) ? decimals : me.currencyPrecision;
        format += (decimals > 0 ? '.' : '');
        for (; i < decimals; i++) {
            format += '0';
        }

        v = me.number(v, format);
        currencySign = currencySign === false ? '' : (currencySign || me.currencySign);

        if ((end || me.currencyAtEnd) === true) {
            return Ext.String.format("{0}{1}{2}", negativeSign, v, currencySign);
        } else {
            return Ext.String.format("{0}{1}{2}", negativeSign, currencySign, v);
        }
    }
});

//grid padding 时拖拉Indicator位置不对
Ext.define('YZSoft.override.view.DropZone', {
    override: 'Ext.view.DropZone',

    positionIndicator: function (node, data, e) {
        var me = this,
            view = me.view,
            pos = me.getPosition(e, node),
            overRecord = view.getRecord(node),
            draggingRecords = data.records,
            indicatorX, indicatorY;

        if (!Ext.Array.contains(draggingRecords, overRecord) && (
            pos === 'before' && !me.containsRecordAtOffset(draggingRecords, overRecord, -1) ||
            pos === 'after' && !me.containsRecordAtOffset(draggingRecords, overRecord, 1)
        )) {
            me.valid = true;

            if (me.overRecord !== overRecord || me.currentPosition !== pos) {

                indicatorX = Ext.fly(node).getX() - view.el.getX() - view.el.getPadding('l') - 1;
                indicatorY = Ext.fly(node).getY() - view.el.getY() - view.el.getPadding('t');

                if (pos === 'after') {
                    indicatorY += Ext.fly(node).getHeight();
                }
                // If view is scrolled using CSS translate, account for then when positioning the indicator
                if (view.touchScroll === 2) {
                    indicatorX += view.getScrollX();
                    indicatorY += view.getScrollY();
                }
                me.getIndicator().setWidth(Ext.fly(node).getWidth()).showAt(indicatorX, indicatorY);

                // Cache the overRecord and the 'before' or 'after' indicator.
                me.overRecord = overRecord;
                me.currentPosition = pos;
            }
        } else {
            delete me.currentPosition; //bug fix
            me.invalidateDrop();
        }
    },
});

//tree padding 时拖拉Indicator位置不对
Ext.define('YZSoft.override.tree.ViewDropZone', {
    override: 'Ext.tree.ViewDropZone',

    onNodeOver: function (node, dragZone, e, data) {
        var position = this.getPosition(e, node),
            returnCls = this.dropNotAllowed,
            view = this.view,
            targetNode = view.getRecord(node),
            indicator = this.getIndicator(),
            indicatorX, indicatorY;

        // auto node expand check
        this.cancelExpand();
        if (position === 'append' && !this.expandProcId && !Ext.Array.contains(data.records, targetNode) && !targetNode.isLeaf() && !targetNode.isExpanded()) {
            this.queueExpand(targetNode);
        }

        if (this.isValidDropPoint(node, position, dragZone, e, data)) {
            this.valid = true;
            this.currentPosition = position;
            this.overRecord = targetNode;

            indicator.setWidth(Ext.fly(node).getWidth());

            indicatorX = Ext.fly(node).getX() - view.el.getX() - view.el.getPadding('l');
            indicatorY = Ext.fly(node).getY() - view.el.getY() - view.el.getPadding('t') - 1;

            indicatorY = Ext.fly(node).getY() - Ext.fly(view.el).getY() - 1;

            // If view is scrolled using CSS translate, account for then when positioning the indicator
            if (view.touchScroll === 2) {
                indicatorX += view.getScrollX();
                indicatorY += view.getScrollY();
            }

            /*
             * In the code below we show the proxy again. The reason for doing this is showing the indicator will
             * call toFront, causing it to get a new z-index which can sometimes push the proxy behind it. We always 
             * want the proxy to be above, so calling show on the proxy will call toFront and bring it forward.
             */
            if (position === 'before') {
                returnCls = targetNode.isFirst() ? Ext.baseCSSPrefix + 'tree-drop-ok-above' : Ext.baseCSSPrefix + 'tree-drop-ok-between';
                indicator.showAt(indicatorX, indicatorY);
                dragZone.proxy.show();
            } else if (position === 'after') {
                returnCls = targetNode.isLast() ? Ext.baseCSSPrefix + 'tree-drop-ok-below' : Ext.baseCSSPrefix + 'tree-drop-ok-between';
                indicatorY += Ext.fly(node).getHeight();
                indicator.showAt(indicatorX, indicatorY);
                dragZone.proxy.show();
            } else {
                returnCls = Ext.baseCSSPrefix + 'tree-drop-ok-append';
                // @TODO: set a class on the parent folder node to be able to style it
                indicator.hide();
            }
        } else {
            this.valid = false;
        }

        this.currentCls = returnCls;
        return returnCls;
    }
});

//对Grid view拖拉，增加拖动事件
Ext.define('YZSoft.override.grid.ViewDropZone', {
    override: 'Ext.grid.ViewDropZone',

    onNodeOver: function (node, dragZone, e, data) {
        var me = this,
            view = me.view,
            targetRecord = view.getRecord(node);

        if (view.fireEvent('nodedragover', targetRecord, null, data, e) === false){
            me.invalidateDrop();
            return false;
        }

        return me.callParent(arguments);
    },

    onContainerOver: function (dd, e, data) {
        var me = this,
            view = me.view;

        if (view.fireEvent('containerdragover', data, e) === false) {
            me.invalidateDrop();
            return false;
        }

        return me.callParent(arguments);
    }
});

Ext.define('YZSoft.src.ux.GlobalEventHub', {
    extend: 'Ext.Evented',
    singleton: true
});

//防止canvas分裂
Ext.define('YZSoft.override.draw.engine.Canvas', {
    override: 'Ext.draw.engine.Canvas',
    splitThreshold: 1000000
});

//Ext.define('YZSoft.override.view.Table', {
//    override: 'Ext.view.Table',
//    enableTextSelection: true //qml99199允许选择grid中的文字
//});

//var chromiumType = YZSoft.getChromiumType();
//Ext.is360 = YZSoft.getChromiumType() === '360ee';
YZSoft.uploadMissCookie = Ext.isSafari || true;
