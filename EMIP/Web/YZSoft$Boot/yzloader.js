Ext.applyIf(String, {
    Equ: function (str1, str2) {
        if (Ext.isString(str1) && Ext.isString(str2))
            return ((str1 || '').toLowerCase() == (str2 || '').toLowerCase());
        else
            return str1 == str2;
    }
});

Ext.apply(Ext.Loader, {
    JSCache: !application.debug,
    JSVersion: application.JSVersion,

    loadScriptFile: function (url, onLoad, onError, scope, synchronous) {
        window.yzEvalScriptFile = url;
        Ext.Loader.loadScriptFileNew(url, onLoad, onError, scope, synchronous);
        delete window.yzEvalScriptFile;
    },

    loadScriptFileNew: function (url, onLoad, onError, scope, synchronous) {
        var me = this,
            isFileLoaded = this.isFileLoaded,
            scriptElements = this.scriptElements,
            noCacheUrl = Ext.String.urlAppend(url, '_dc=' + ((!application.debug && me.JSCache) ? me.JSVersion : (+new Date()))),
            beginTime = new Date(),
            xhr, status, content, onScriptError, onLoadFn;

        if (isFileLoaded[url]) {
            return this;
        }

        scope = scope || this;

        this.isLoading = true;

        onLoadFn = function () {
            application.js = application.js || [];
            application.js.push({
                url: url,
                begin: beginTime,
                finish: new Date()
            });

            if (onLoad)
                onLoad.call(scope);
        };

        if (!synchronous) {
            onScriptError = function () {
                //<debug error>
                onError.call(scope, "Failed loading '" + url + "', please verify that the file exists", synchronous);
                //</debug>
            };

            if (!Ext.isReady && Ext.onDocumentReady) {
                Ext.onDocumentReady(function () {
                    if (!isFileLoaded[url]) {
                        scriptElements[url] = me.injectScriptElement(noCacheUrl, onLoadFn, onScriptError, scope);
                    }
                });
            }
            else {
                scriptElements[url] = this.injectScriptElement(noCacheUrl, onLoadFn, onScriptError, scope);
            }
        }
        else {
            if (typeof XMLHttpRequest != 'undefined') {
                xhr = new XMLHttpRequest();
            } else {
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }

            try {
                xhr.open('GET', noCacheUrl, false);
                xhr.send(null);
            }
            catch (e) {
                //<debug error>
                onError.call(this, "Failed loading synchronously via XHR: '" + url + "'; It's likely that the file is either " +
                                       "being loaded from a different domain or from the local file system whereby cross origin " +
                                       "requests are not allowed due to security reasons. Use asynchronous loading with " +
                                       "Ext.require instead.", synchronous);
                //</debug>
            }

            status = (xhr.status == 1223) ? 204 : xhr.status;
            content = xhr.responseText;

            if ((status >= 200 && status < 300) || status == 304 || (status == 0 && content.length > 0)) {
                // Debugger friendly, file names are still shown even though they're eval'ed code
                // Breakpoints work on both Firebug and Chrome's Web Inspector
                Ext.globalEval(content + "\n//@ sourceURL=" + url);
                onLoadFn();
            }
            else {
                //<debug>
                onError.call(this, "Failed loading synchronously via XHR: '" + url + "'; please " +
                                       "verify that the file exists. " +
                                       "XHR status code: " + status, synchronous);
                //</debug>
            }

            // Prevent potential IE memory leak
            xhr = null;
        }
    }
});


YZLoader = {
    documentHead: typeof document != 'undefined' && (document.head || document.getElementsByTagName('head')[0]),

    init: function () {
        //0.5边框支持
        var devicePixelRatio = window.devicePixelRatio || 1,
            ratio = Math.round(devicePixelRatio);

        if (ratio >= 2) {
            document.documentElement.classList.add('retina');

            document.documentElement.classList.add('retina' + ratio);
            if (ratio >= 4)
                document.documentElement.classList.add('retinamax');

            //var el = document.createElement('div');
            //el.style.border = '.5px solid transparent';
            //document.body.appendChild(el);
            //var height = el.offsetHeight;
            //document.body.removeChild(el);

            if (Ext.os.is.iOS) {
                document.documentElement.classList.add('halfpx');
            }
            else {
                document.documentElement.classList.add('ratio');
                document.documentElement.classList.add('ratio' + ratio);
                if (ratio >= 4)
                    document.documentElement.classList.add('ratiomax');
            }
        }

        if (application.isApp)
            document.documentElement.classList.add('yz-app');

        if (application.isApp && Ext.os.is.iOS) {
            application.statusbarOverlays = true;
            document.documentElement.classList.add('yz-statusbar-overlays');
        }

        //document.documentElement.classList.add('halfpx');
        //document.documentElement.classList.add('ratio');
        //document.documentElement.classList.add('ratio3');
    },

    $url: function (obj, url) {
        if (arguments.length == 1)
            return YZLoader.$url('YZSoft$Server', obj);

        var className = Ext.isString(obj) ? obj : Ext.getClassName(obj),
            classPath = Ext.Loader.getPath(className),
            index = classPath.lastIndexOf('/');

        var rv = index != -1 ? classPath.substring(0, index + 1) : '';
        return rv + url;
    },

    loadCss: function (url, onLoad, onError, scope) {
        var me = this,
            noCacheUrl = Ext.String.urlAppend(url, '_dc=' + ((!application.debug && Ext.Loader.JSCache) ? Ext.Loader.JSVersion : (+new Date()))),
            link = document.createElement('link');

        var onLoadFn = function () {
            me.cleanupListeners(link);
            onLoad.call(scope);
        };

        var onErrorFn = function () {
            me.cleanupListeners(link);
            if (onError)
                onError.call(scope);
        };

        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = noCacheUrl;
        link.onload = onLoadFn;
        link.onerror = onErrorFn;
        link.onreadystatechange = function () {
            if (this.readyState === 'loaded' || this.readyState === 'complete') {
                onLoadFn();
            }
        };

        me.documentHead.appendChild(link);
        return link;
    },

    loadScript: function (url, onLoad, onError, scope) {
        var me = this,
            script = document.createElement('script');

        var onLoadFn = function () {
            me.cleanupListeners(script);
            onLoad.call(scope);
        };

        var onErrorFn = function () {
            me.cleanupListeners(script);
            if (onError)
                onError.call(scope);
        };

        script.type = 'text/javascript';
        script.src = url;
        script.onload = onLoadFn;
        script.onerror = onErrorFn;
        script.onreadystatechange = function () {
            if (this.readyState === 'loaded' || this.readyState === 'complete') {
                onLoadFn();
            }
        };

        me.documentHead.appendChild(script);
        return script;
    },

    cleanupListeners: function (script, remove) {
        script.onload = null;
        script.onerror = null;
        script.onreadystatechange = null;
    },

    getCookie: function (name) {
        var parts = document.cookie.split('; '),
            len = parts.length,
            item, i, ret;

        // In modern browsers, a cookie with an empty string will be stored:
        // MyName=
        // In older versions of IE, it will be stored as:
        // MyName
        // So here we iterate over all the parts in an attempt to match the key.
        for (i = 0; i < len; ++i) {
            item = parts[i].split('=');
            if (item[0] === name) {
                ret = item[1];
                return ret ? unescape(ret) : '';
            }
        }
        return null;
    }
};

YZLoader.Ajax = {
    errMessageFromResponse: function (response) {
        var err = [];

        err.push($rs.AllHTTPERR);

        if (response.status)
            err.push('status:' + (response.status || ''));

        if (response.statusText)
            err.push('statusText:' + (response.statusText || ''));

        if (response.responseText)
            err.push('responseText:<br/>' + (response.responseText || ''));

        return err.join('<br/>');
    },

    request: function (config) {
        config = config || {};

        if (config.delay === true)
            config.delay = 500;

        if (config.waitMsg) {
            if (Ext.isString(config.waitMsg))
                config.waitMsg = { message: config.waitMsg };

            if (config.waitMsg.autoClose !== false)
                config.waitMsg.autoClose = true;

            config.waitMsg.xtype = config.waitMsg.xtype || 'loadmask';

            config.waitMsg.target = config.waitMsg.target || Ext.Viewport;
            config.waitMsg.target.mask(config.waitMsg);
        }

        var cfg = {
            method: 'GET',
            disableCaching: true
        };

        Ext.apply(cfg, config);

        Ext.apply(cfg, {
            scope: cfg,
            initConfig: config,
            beginTime: new Date(),
            success: function (response) {
                var me = this,
                    tick = me.delay ? me.delay - Ext.Date.getElapsed(me.beginTime) : 0;

                application.ashx = application.ashx || [];
                application.ashx.push({
                    url: config.url,
                    begin: me.beginTime,
                    finish: new Date()
                });

                Ext.defer(function () {
                    var me = this.initConfig;

                    if (me.requestend)
                        me.requestend.call(me.scope || me);

                    if (me.waitMsg && me.waitMsg.autoClose)
                        me.waitMsg.target.unmask();

                    var result;
                    try {
                        result = Ext.decode(response.responseText);
                    }
                    catch (err) {
                        alert(err + ':\n' + response.responseText);
                    }

                    var action = {
                        result: result,
                        config: me,
                        responseText: response.responseText
                    };

                    if (action.result.success === false) {
                        if (me.waitMsg && me.waitMsg.target.getMasked())
                            me.waitMsg.target.unmask();

                        if (me.failure)
                            me.failure.call(me.scope || me, action);
                    }
                    else {
                        if (me.success)
                            me.success.call(me.scope || me, action);
                    }
                }, tick, this);
            },
            failure: function (response) {
                var me = this,
                    tick = me.delay ? me.delay - Ext.Date.getElapsed(me.beginTime) : 0;

                Ext.defer(function () {
                    var me = this.initConfig;

                    if (me.requestend)
                        me.requestend.call(me.scope || me);

                    if (me.waitMsg && me.waitMsg.target.getMasked())
                        me.waitMsg.target.unmask();

                    if (me.exception) {
                        me.exception.call(me.scope || me, {
                            config: me,
                            result: {
                                exception: true,
                                httperr: true,
                                errorMessage: YZLoader.Ajax.errMessageFromResponse(response)
                            }
                        });
                    }
                    else if (me.failure) {
                        me.failure.call(me.scope || me, {
                            config: me,
                            result: {
                                exception: true,
                                httperr: true,
                                errorMessage: YZLoader.Ajax.errMessageFromResponse(response)
                            }
                        });
                    }
                }, tick, this);
            }
        });

        Ext.Ajax.request(cfg);
    }
};

YZLoader.Globalization = {
    jsStrings: {
        'en': {
            AllCancel: 'Cancel',
            AllNo: 'No',
            AllOK: 'OK',
            AllYes: 'Yes',
            AllDelete: 'Del',
            AllHTTPERR: 'HTTP Error',
            Warning: 'Warning',
            YesISee: 'OK',

            placeholderUrl: 'Server address',
            placeholderAccount: 'Account',
            placeholderPassword: 'Password',
            placeholderVCode: 'Verify code',

            txtSendVCode: 'Get Code',
            txtVCodeSendTo: 'Verification code sent to: {phoneNumber}',
            txtTrial: 'Trial',
            txtResendVCode: 'Resend ({0})',
            txtLogin: 'Sign In',

            validateEmptyUrl: 'Server address can not be empty',
            validateEmptyUid: 'Account can not be empty',
            validateEmptyVCode: 'Verify code can not be empty',

            loadingLoginTrialServer: 'Loading...',
            loadingSendVCode: 'Sending...',
            loadingAuth: 'Loading...',

            titleLoginFailed: 'Verification Failed',
            titleSendVCodeFailed: 'Failed',

            msgNoConnection: 'The device is not connected to the network!',

            barcodeScanPrompt: 'Align barcode within frame to scan'
        },
        'zh-chs': {
            AllCancel: '取消',
            AllNo: '否',
            AllOK: '确定',
            AllYes: '是',
            AllDelete: '删除',
            AllHTTPERR: 'HTTP错误',
            Warning: '提示',
            YesISee: '我知道了',

            placeholderUrl: '请输入服务器地址',
            placeholderAccount: '请输入账号',
            placeholderPassword: '请输入密码',
            placeholderVCode: '输入验证码',

            txtSendVCode: '获取短信验证码',
            txtVCodeSendTo: '验证码已发送到：{phoneNumber}',
            txtTrial: '快速体验',
            txtResendVCode: '重新发送({0})',
            txtLogin: '登录',

            validateEmptyUrl: '服务器地址不能为空',
            validateEmptyUid: '账号不能为空',
            validateEmptyVCode: '请输入验证码',

            loadingLoginTrialServer: '连接中...',
            loadingSendVCode: '正在发送...',
            loadingAuth: '正在登录...',

            titleLoginFailed: '登录失败',
            titleSendVCodeFailed: '发送失败',

            msgNoConnection: '设备未连接到网络！',

            barcodeScanPrompt: '请将条码置于取景框内扫描'
        },
        'zh-cht': {
            AllCancel: '取消',
            AllNo: '否',
            AllOK: '確定',
            AllYes: '是',
            AllDelete: '刪除',
            AllHTTPERR: 'HTTP錯誤',
            Warning: '提示',
            YesISee: '我知道了',

            placeholderUrl: '請輸入伺服器位址',
            placeholderAccount: '請輸入帳號',
            placeholderPassword: '請輸入密碼',
            placeholderVCode: '輸入驗證碼',

            txtSendVCode: '獲取短信驗證碼',
            txtVCodeSendTo: '驗證碼已發送到：{phoneNumber}',
            txtTrial: '快速體驗',
            txtResendVCode: '重新發送({0})',
            txtLogin: '登錄',

            validateEmptyUrl: '伺服器位址不能為空',
            validateEmptyUid: '帳號不能為空',
            validateEmptyVCode: '請輸入驗證碼',

            loadingLoginTrialServer: '連接中...',
            loadingSendVCode: '正在發送...',
            loadingAuth: '正在登錄...',

            titleLoginFailed: '登錄失敗',
            titleSendVCodeFailed: '發送失敗',

            msgNoConnection: '設備未連接到網路！',

            barcodeScanPrompt: '請將條碼置於取景框內掃描'
        }
    },
    langs: {
        'zh-cn': 'zh-chs',
        'zh-hk': 'zh-cht',
        'zh-mo': 'zh-cht',
        'zh-sg': 'zh-cht',
        'zh-tw': 'zh-cht'
    },
    lcids: {
        '2052': 'zh-chs',
        '1028': 'zh-cht',
        '1033': 'en'
    },

    getLang: function () {
        var lang = YZLoader.Globalization.lang;

        if (!lang) {
            var lcid;

            try {
                lcid = localStorage.getItem('yz-lcid');
            }
            catch (exp) {
            }

            if (lcid)
                lang = YZLoader.Globalization.lcids[lcid] || 'en';
            else
                lang = (navigator.language || navigator.browserLanguage).toLowerCase();

            YZLoader.Globalization.lang = lang;
        }

        return lang;
    },

    loadResource: function (lang, resourceName) {
        var gl = YZLoader.Globalization;

        if (lang in resourceName)
            return resourceName[lang];

        lang = gl.getParentLang(lang);
        if (!lang)
            return resourceName.en;

        return gl.loadResource(lang, resourceName);
    },

    getParentLang: function (lang) {
        return YZLoader.Globalization.langs[lang];
    }
};

$rs = YZLoader.Globalization.loadResource(YZLoader.Globalization.getLang(), YZLoader.Globalization.jsStrings);
//$rs = YZLoader.Globalization.loadResource('en', YZLoader.Globalization.jsStrings);



