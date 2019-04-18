
if (Ext.os.is.Android) {
    Ext.require('YZSoft.src.ux.FieldScroller');
}

Ext.Loader.syncRequire('YZSoft.src.xform.FormContainer');

Ext.define('Ext.util.Base64', {
    singleton: true,

    /**
     * @private
     */
    _str: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    /**
     * Encodes given string in to base64 formatted string
     * @param input
     * @return {string}
     */
    encode: function (input) {
        var me = this;
        var output = '', chr1, chr2, chr3, enc1, enc2, enc3, enc4,
            i = 0;

        input = me._utf8_encode(input);
        var len = input.length;

        while (i < len) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                me._str.charAt(enc1) + me._str.charAt(enc2) +
                me._str.charAt(enc3) + me._str.charAt(enc4);

        }

        return output;
    },

    /**
     * Decodes given base64 formatted string
     * @param input
     * @return {string}
     */
    decode: function (input) {
        var me = this;
        var output = '',
            chr1, chr2, chr3,
            enc1, enc2, enc3, enc4,
            i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        var len = input.length;

        while (i < len) {

            enc1 = me._str.indexOf(input.charAt(i++));
            enc2 = me._str.indexOf(input.charAt(i++));
            enc3 = me._str.indexOf(input.charAt(i++));
            enc4 = me._str.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = me._utf8_decode(output);

        return output;
    },

    /**
     * @private
     * UTF-8 encoding
     */
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = '',
            n = 0,
            len = string.length;

        for (; n < len; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    /**
     * @private
     * UTF-8 decoding
     */
    _utf8_decode: function (utftext) {
        var string = '',
            i = 0,
            c = 0,
            c3 = 0,
            c2 = 0,
            len = utftext.length;

        while (i < len) {
            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }

        return string;
    }
});


YZSoft = {
    clientVersion: '2.01',
    setting: {
        delay: {
            moduleSlide: 300,
            pressedDelay: 10,
            sendMessage: 250,
            storeLoad: 125,
            request: 500,
            loadMaskDefault: 500
        },
        pageSize: {
            defaultSize: 20
        }
    }
};

(function () {
    function show() {
        switch (this.type) {
            case 'error':
            case 'http':
                Ext.Msg.show({
                    title: this.title || RS.$('YZStrings.All_MsgTitle_Error'),
                    message: this.msg,
                    buttons: [{
                        text: RS.$('All__OK'),
                        flex: 1,
                        cls: 'yz-button-flat yz-button-action-hot',
                        itemId: 'ok'
                    }],
                    icon: Ext.Msg.ERROR
                });
                break;
            case 'responseError':
                break;
            case 'customError':
                Ext.Msg.show({
                    title: this.title || RS.$('YZStrings.All_Warning'),
                    message: this.msg,
                    buttons: [{
                        text: RS.$('All__OK'),
                        flex: 1,
                        cls: 'yz-button-flat yz-button-action-hot',
                        itemId: 'ok'
                    }],
                    icon: this.icon || Ext.Msg.ERROR
                });

                break;
            case 'native':
                var errmsg = Ext.String.format(RS.$('YZStrings.All_JSErr_Msg'), this.msg, this.url, this.line);
                //YZSoft.alert(errmsg);有的时候显不出来，比如在流程库界面加一句错误的代码
                alert(errmsg);
                break;
            default:
                Ext.Msg.show({
                    title: this.title || RS.$('YZStrings.All_MsgTitle_Error'),
                    message:this.msg,
                    buttons: [{
                        text: RS.$('All__OK'),
                        flex: 1,
                        cls: 'yz-button-flat yz-button-action-hot',
                        itemId: 'ok'
                    }],
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

            Ext.Logger && Ext.Logger.warn(err);

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

    Ext.Logger && Ext.Logger.warn(Ext.String.format('[Uncatch Error!!!] {0}, url:{1}, line:{2}', message, url, line));

    var err;

    if (error)
        err = error.show ? error : YZSoft.Error.fromNativeError(error, url, line);
    else
        err = YZSoft.Error.parse(message, url, line);

    err.show();
    return true;
};

Number.prototype.toFileSize = function (space) {
    var dw = ['KB', 'MB', 'GB', 'TB']
    var result = Math.ceil(this / 1024) + (space !== false ? ' ' : '') + dw[0]
    for (var i = 1; i < dw.length; i++) {
        var c = (this / Math.pow(1024, i + 1)).toFixed(2)
        if (c < 1) return result
        result = c + (space !== false ? ' ':'') + dw[i]
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

Ext.apply(Ext.String, {
    boundsCheck: function (s, other) {
        if (s === null || s === undefined || other === null || other === undefined) {
            return false;
        }

        return other.length <= s.length;
    },

    startsWith: function (s, start, ignoreCase) {
        var me = this,
            result = me.boundsCheck(s, start);

        if (result) {
            if (ignoreCase) {
                s = s.toLowerCase();
                start = start.toLowerCase();
            }
            result = s.lastIndexOf(start, 0) === 0;
        }
        return result;
    }
});

Ext.define('YZSoft.override.scroll.Scroller', {
    override: 'Ext.scroll.Scroller',
    config: {
        momentumEasing: {
            momentum: {
                acceleration: 30,
                friction: 0.5
            },

            bounce: {
                acceleration: 30,
                springTension: 0.3
            },

            minVelocity: 1
        },

        /**
        * @cfg bounceEasing
        * @private
        */
        bounceEasing: {
            duration: 300
        }
    }

});

Ext.apply(YZSoft, {
    //resolve client url
    //obj - classname or object
    $url: function (obj, url) {
        if (arguments.length == 1)
            return YZSoft.$url('YZSoft$Server', obj);

        var className = Ext.isString(obj) ? obj : Ext.getClassName(obj),
            classPath = Ext.Loader.getPath(className),
            index = classPath.lastIndexOf('/');

        var rv = index != -1 ? classPath.substring(0, index + 1) : '';
        return rv + url;
    },

    //将url转换为绝对路径
    $abs: function (url) {
        var a = YZSoft.getAbsoluteUrlHyperlink = YZSoft.getAbsoluteUrlHyperlink || document.createElement('a');
        a.href = url;
        return a.href;
    }
});

Ext.apply(Ext.Loader, {
    getPath: function (className) {
        var path = '',
            paths = this.config.paths,
            prefix = this.getPrefix(className);

        if (prefix.length > 0) {
            if (prefix === className) {
                return paths[prefix];
            }

            path = paths[prefix];
            className = className.substring(prefix.length + 1);
        }
        else {
            var names = className.split('.');
            if (names.length >= 1) {
                prefix = names[0];
                if (prefix != 'YZSoft$Server') {
                    className = className.substring(prefix.length + 1);
                    path = YZSoft.$url(prefix);
                }
            }
        }

        if (path.length > 0) {
            path += '/';
        }

        return path.replace(/\/\.\//g, '/') + className.replace(/\./g, "/") + '.js';
    }
});

YZSoft.$1 = function (val) {
    if (val)
        val = val.replace(/(\r\n|\n\r|\n|\r)/g, '<br/>');
    return val;
};

YZSoft.Globalization = {
};

Ext.apply(YZSoft.Globalization, {
    JSLangInit: {
        localInit: function () {
            Ext.util.Format.defaultDateFormat = 'Y-m-d';
            Ext.picker.Date.prototype.config.yearFrom = 1800;
            Ext.picker.Date.prototype.config.yearTo = (new Date().getFullYear()) + 30;
            Ext.picker.Date.prototype.config.slotOrder = ['year', 'month', 'day'];

            if (Ext.MessageBox) {
                Ext.MessageBox.OK.text = Ext.MessageBox.OKCANCEL[1].text = $rs.AllOK;
                Ext.MessageBox.CANCEL.text = Ext.MessageBox.OKCANCEL[0].text = $rs.AllCancel;
                Ext.MessageBox.YES.text = Ext.MessageBox.YESNO[1].text = $rs.AllYes;
                Ext.MessageBox.NO.text = Ext.MessageBox.YESNO[0].text = $rs.AllNo;
            }
        },

        serverIndicated: function () {
            Ext.Date.dayNames = [
                RS.$('All__WeekDayName0'),
                RS.$('All__WeekDayName1'),
                RS.$('All__WeekDayName2'),
                RS.$('All__WeekDayName3'),
                RS.$('All__WeekDayName4'),
                RS.$('All__WeekDayName5'),
                RS.$('All__WeekDayName6')
            ];

            Ext.Date.dayNamesZ = [
                RS.$('All__WeekDayName10'),
                RS.$('All__WeekDayName11'),
                RS.$('All__WeekDayName12'),
                RS.$('All__WeekDayName13'),
                RS.$('All__WeekDayName14'),
                RS.$('All__WeekDayName15'),
                RS.$('All__WeekDayName16')
            ],

            Ext.Date.monthNames = [
                RS.$('All__MonthName1'),
                RS.$('All__MonthName2'),
                RS.$('All__MonthName3'),
                RS.$('All__MonthName4'),
                RS.$('All__MonthName5'),
                RS.$('All__MonthName6'),
                RS.$('All__MonthName7'),
                RS.$('All__MonthName8'),
                RS.$('All__MonthName9'),
                RS.$('All__MonthName10'),
                RS.$('All__MonthName11'),
                RS.$('All__MonthName12')
            ];

            if (Ext.MessageBox) {
                Ext.MessageBox.OK.text = Ext.MessageBox.OKCANCEL[1].text = RS.$('All__OK');
                Ext.MessageBox.CANCEL.text = Ext.MessageBox.OKCANCEL[0].text = RS.$('All__Cancel');
                Ext.MessageBox.YES.text = Ext.MessageBox.YESNO[1].text = RS.$('All__Yes');
                Ext.MessageBox.NO.text = Ext.MessageBox.YESNO[0].text = RS.$('All__No');
            }

            Ext.picker.Date.prototype.postfix = {
                Year: RS.$('All__Year'),
                Month: RS.$('All__Month'),
                Day: RS.$('All__Day')
            };

            Ext.apply(Ext.Date.formatCodes, {
                g: "(this.getHours() == 0 ? 0 :((this.getHours() % 12) ? this.getHours() % 12 : 12))",
                a: "(this.getHours() < 12 ? RS.$('All__AM') : RS.$('All__PM'))",
                A: "(this.getHours() <= 7 ? RS.$('All__DayLE7') : (this.getHours() <= 11 ? RS.$('All__DayLE11'):(this.getHours() <= 13 ? RS.$('All__DayLE13'):(this.getHours() <= 17 ? RS.$('All__DayLE17'):RS.$('All__DayG17')))))",
                L: "Ext.Date.dayNamesZ[this.getDay()]",
                Q: "Ext.String.leftPad(Ext.Date.add(this,Ext.Date.DAY,6).getMonth() + 1, 2, '0')",
                q: "Ext.String.leftPad(Ext.Date.add(this,Ext.Date.DAY,6).getDate(), 2, '0')"
            });

            YZSoft.DateExtras.formats = [
                { hours: 1.5, fmt: RS.$('All__DateFmt_Hours') },
                { days: 0, fmt: RS.$('All__DateFmt_Days0') },
                { days: 1, fmt: RS.$('All__DateFmt_Days1') },
                { days: 2, fmt: RS.$('All__DateFmt_Days2') },
                { weeks: 0, fmt: RS.$('All__DateFmt_Weeks0') },
                { weeks: 1, fmt: RS.$('All__DateFmt_Weeks1') },
                { months: 0, fmt: RS.$('All__DateFmt_Months0') },
                { years: 0, fmt: RS.$('All__DateFmt_Years0') },
                { fmt: RS.$('All__DateFmt_fmt') }
            ];
        }
    }
});

YZSoft.Globalization.JSLangInit.localInit();

if (navigator.notification) {
    window.alert = function (message, title) {
        navigator.notification.alert(message, null, title || $rs.Warning, $rs.AllOK);
    }
}

RS = {
    Cache: {},
    $: function (strfullname, defaultString) { //获得字符串，例如：RS['YZStrings.All_TopMenu_Workflow']
        //空字符串
        if (!strfullname)
            return '';

        var idx = strfullname.indexOf('.'), //字符串格式必需为 Assembly.Perfix_*,Perfix代表下载粒度,系统一次下载相同Perfix的字符串
            assembly,
            strname;

        if (idx == -1) {
            assembly = 'YZMobile';
            strname = strfullname;
        }
        else {
            assembly = strfullname.substring(0, idx);
            strname = strfullname.substring(idx + 1);
        }

        var idx = strname.indexOf('_');
        if (idx == -1) {
            alert(Ext.String.format('{0}\nIncorrent string name, String name format should be:\nAssembly.Perfix_*', strfullname));
            return '';
        }

        var namespace = strname.substring(0, idx);

        RS.Cache[assembly] = RS.Cache[assembly] || {};
        var assemblyData = RS.Cache[assembly];
        var spaceData = assemblyData[namespace];

        //命名空间不存在，则加载
        if (!spaceData && spaceData !== false) {
            url = YZSoft.$url('YZSoft.Services.REST/core/Globalization.ashx');
            Ext.Ajax.request({
                method: 'GET',
                disableCaching: true,
                async: false,
                params: { method: 'GetString', assembly: assembly, namespace: namespace, lcid: YZSoft.LoginUser ? YZSoft.LoginUser.LCID : '' },
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
    clearErrors: function () {
        var assembly;
        for (assembly in RS.Cache) {
            var assemblyData = RS.Cache[assembly],
                namespace;

            for (namespace in assemblyData) {
                if (assemblyData[namespace] === false)
                    delete assemblyData[namespace];
            }
        }
    }
};

YZSoft.util = {};
YZSoft.util.xml = {
    xmlNodeNameEncode: function (value) {
        return !value ? value : String(value).replace(/@/g, "_x0040_").replace(/:/g, "_x003A_").replace('$', "_x0024_");
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
        else if (typeof d == "number") {
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

YZSoft.Ajax = {
    errMessageFromResponse: function (response) {
        return response.responseText || $rs.AllHTTPERR;
    },

    request: function (config) {
        config = config || {};

        if (config.delay === true)
            config.delay = YZSoft.setting.delay.request;

        if (config.waitMsg) {
            if (Ext.isString(config.waitMsg))
                config.waitMsg = { message: config.waitMsg };

            if (config.waitMsg.autoClose !== false)
                config.waitMsg.autoClose = true;

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
                        action.result.errorMessage = Ext.String.htmlDecode(action.result.errorMessage);

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

                    if (me.failure)
                        me.failure.call(me.scope || me, {
                            config: me,
                            result: {
                                exception: true,
                                httperr: true,
                                errorMessage: YZSoft.Ajax.errMessageFromResponse(response)
                            }
                        });
                }, tick, this);
            }
        });

        return Ext.Ajax.request(cfg);
    }
};

YZSoft.Ajax.RFC = YZSoft.Ajax.request;

//scorollEnd改进->增加新行后直接调用scrollEnd系统得到的高度没算新行
Ext.define('YZSoft.override.scroll.Scroller', {
    override: 'Ext.scroll.Scroller',

    scrollToEnd: function () {
        var me = this,
            dom = me.getElement().dom,
            size = {
                x: dom.offsetWidth,
                y: dom.offsetHeight
            },
            oldSize = me.getSize();

        if (size.x != oldSize.x || size.y != oldSize.y)
            me.setSize(size);

        me.callParent(arguments);
    }

    //    refreshMaxPosition: function (value, oldValue) {
    //        if (value && oldValue && value.x == oldValue.x && value.y == oldValue.y)
    //            return;

    //        this.callParent(arguments);
    //    }
});

//config loadDelay : load是否要delay，true或数值，数值表示delay时间例如2000，起到缓load的作用
Ext.define('YZSoft.override.Store', {
    override: 'Ext.data.Store',

    constructor: function (config) {
        this.callParent(arguments);
        this.loadDelay = config.loadDelay;

        if (this.loadDelay === true)
            this.loadDelay = YZSoft.setting.delay.storeLoad;
    },

    load: function (options) {
        this.beginTime = new Date();
        this.callParent(arguments);
    },

    onProxyLoad: function (operation) {
        if (this.fireEvent('proxyload', operation) === false)
            return;

        var tick = this.loadDelay ? this.loadDelay - Ext.Date.getElapsed(this.beginTime) : 0;

        if (operation.config.delay !== false && tick > 0)
            Ext.defer(this.onProxyLoad, tick, this, [operation]);
        else
            this.callParent(arguments);
    }
});

//TextField改进->回车不触发action事件
Ext.define('YZSoft.override.field.Text', {
    override: 'Ext.field.Text',

    initialize: function () {
        var me = this;

        me.callParent();

        me.getComponent().input.on({
            scope: me,
            keypress: 'onKeyPress'
        });
    },

    onKeyPress: function (e) {
        var me = this;

        if (e.browserEvent.keyCode == 13) {
            me.fireAction('action', [me, e]);
        }
    }
});

YZSoft.DateExtras = {
    formats: [
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
            if (f.func(date, now, f))
                return Ext.Date.format(date, f.fmt);
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

//支持定时自动关闭的mask
//Ext.Viewport.mask({ message: 'aaa', delay: true, scope:me, fn: function () { } });
//支持后绑定store
//bindMask(store);
Ext.define('YZSoft.override.Container', {
    override: 'Ext.Container',

    applyMasked: function (mask) {
        var me = this;

        if (Ext.isObject(mask)) {
            mask.xtype = mask.xtype || 'loadmask';
        }

        var loadMask = me.callParent(arguments);

        if (Ext.isObject(mask) && mask.delay) {
            if (mask.delay === true)
                mask.delay = YZSoft.setting.delay.loadMaskDefault;

            mask.defer = Ext.defer(function () {
                loadMask.hide();
                if (mask.fn)
                    mask.fn.call(mask.scope);
            }, mask.delay)
        }

        return loadMask;
    },

    bindMask: function (store) {
        var me = this,
            loadMask = me.getMasked(),
            mask = loadMask.initialConfig;

        mask.beginTime = new Date();

        if (mask.defer)
            clearTimeout(mask.defer);

        store.on({
            single: true,
            load: function () {
                var tick = mask.delay ? mask.delay - Ext.Date.getElapsed(mask.beginTime) : 0

                Ext.defer(function () {
                    me.unmask();
                    if (mask.fn)
                        mask.fn.call(mask.scope);
                }, tick);
            }
        });
    }
});

Ext.define('YZSoft.override.dataview.DataView', {
    override: 'Ext.dataview.DataView',

    onBeforeLoad: function (store, opts) {
        var me = this,
            mask = opts && opts.config && opts.config.mask,
            loadingText = this.getLoadingText();

        if (mask === false)
            return;

        mask = mask || loadingText;

        if (mask && this.isPainted()) {
            if (!Ext.isObject(mask)) {
                mask = {
                    message: mask === true ? '' : mask
                };
            }

            mask.xtype = mask.xtype || 'loadmask';
            me.setMasked(mask);
            me.hideEmptyText();
        }
    },

    getElement: function (rec) {
        var me = this,
            item = me.getItemAt(me.getStore().indexOf(rec));

        if (Ext.isElement(item))
            item = Ext.get(item);

        if (item && item.isComponent)
            item = item.renderElement;

        return item;
    }
});

Ext.define('YZSoft.Anim', {
    override: 'Ext.Anim',

    run: function (el, config) {
        el = Ext.get(el);
        config = config || {};

        var me = this,
            style = el.dom.style,
            property,
            after = config.after;

        if (me.running[el.id]) {
            me.onTransitionEnd(null, el, {
                config: config,
                after: after
            });
        }

        config = this.initConfig(el, config);

        if (this.disableAnimations) {
            for (property in config.to) {
                if (!config.to.hasOwnProperty(property)) {
                    continue;
                }
                style[property] = config.to[property];
            }
            this.onTransitionEnd(null, el, {
                config: config,
                after: after
            });
            return me;
        }

        el.un('transitionend', me.onTransitionEnd, me);

        style.webkitTransitionDuration = '0ms';
        for (property in config.from) {
            if (!config.from.hasOwnProperty(property)) {
                continue;
            }
            style[property] = config.from[property];
        }

        setTimeout(function () {
            // If this element has been destroyed since the timeout started, do nothing
            if (!el.dom) {
                return;
            }

            // If this is a 3d animation we have to set the perspective on the parent
            if (config.is3d === true) {
                el.parent().setStyle({
                    // See https://sencha.jira.com/browse/TOUCH-1498
                    '-webkit-perspective': '1200',
                    '-webkit-transform-style': 'preserve-3d'
                });
            }

            style.webkitTransitionDuration = config.duration + 'ms';
            style.webkitTransitionProperty = 'all';
            style.webkitTransitionTimingFunction = config.easing;

            // Bind our listener that fires after the animation ends
            el.on('transitionend', me.onTransitionEnd, me, {
                config: config,
                after: after
            });

            for (property in config.to) {
                if (!config.to.hasOwnProperty(property)) {
                    continue;
                }
                style[property] = config.to[property];
            }
        }, config.delay || 5);

        me.running[el.id] = config;
        return me;
    },

    onTransitionEnd: function (ev, el, o) {
        var me = this,
            el = Ext.get(el);

        if (this.running[el.id] === undefined) {
            return;
        }

        el.un('transitionend', me.onTransitionEnd, me);

        var style = el.dom.style,
            config = o.config,
            me = this,
            property;

        if (config.autoClear) {
            for (property in config.to) {
                if (!config.to.hasOwnProperty(property) || config[property] === false) {
                    continue;
                }
                style[property] = '';
            }
        }

        style.webkitTransitionDuration = null;
        style.webkitTransitionProperty = null;
        style.webkitTransitionTimingFunction = null;

        if (config.is3d) {
            el.parent().setStyle({
                '-webkit-perspective': '',
                '-webkit-transform-style': ''
            });
        }

        if (me.config.after) {
            me.config.after.call(config, el, config);
        }

        if (o.after) {
            o.after.call(config.scope || me, el, config);
        }

        delete me.running[el.id];
    }
});

Ext.define('YZSoft.override.Format', {
    override: 'Ext.util.Format',
    decimalSeparator: '.',
    currencyPrecision: 2,
    currencyAtEnd: false,
    formatFns: {},

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
    },

    /**
    * Formats the passed number according to the passed format string.
    *
    * The number of digits after the decimal separator character specifies the number of
    * decimal places in the resulting string. The *local-specific* decimal character is
    * used in the result.
    *
    * The *presence* of a thousand separator character in the format string specifies that
    * the *locale-specific* thousand separator (if any) is inserted separating thousand groups.
    *
    * By default, "," is expected as the thousand separator, and "." is expected as the decimal separator.
    *
    * Locale-specific characters are always used in the formatted output when inserting
    * thousand and decimal separators. These can be set using the {@link #thousandSeparator} and
    * {@link #decimalSeparator} options.
    *
    * The format string must specify separator characters according to US/UK conventions ("," as the
    * thousand separator, and "." as the decimal separator)
    *
    * To allow specification of format strings according to local conventions for separator characters, add
    * the string `/i` to the end of the format string. This format depends on the {@link #thousandSeparator} and
    * {@link #decimalSeparator} options. For example, if using European style separators, then the format string
    * can be specified as `'0.000,00'`. This would be equivalent to using `'0,000.00'` when using US style formatting.
    *
    * Examples (123456.789):
    * 
    * - `0` - (123457) show only digits, no precision
    * - `0.00` - (123456.79) show only digits, 2 precision
    * - `0.0000` - (123456.7890) show only digits, 4 precision
    * - `0,000` - (123,457) show comma and digits, no precision
    * - `0,000.00` - (123,456.79) show comma and digits, 2 precision
    * - `0,0.00` - (123,456.79) shortcut method, show comma and digits, 2 precision
    * - `0.####` - (123,456.789) Allow maximum 4 decimal places, but do not right pad with zeroes
    * - `0.00##` - (123456.789) Show at least 2 decimal places, maximum 4, but do not right pad with zeroes
    *
    * @param {Number} v The number to format.
    * @param {String} formatString The way you would like to format this text.
    * @return {String} The formatted number.
    */
    number: function (v, formatString) {
        var me = this;

        if (!formatString) {
            return v;
        }
        if (isNaN(v)) {
            return '';
        }

        var formatFn = me.formatFns[formatString];

        // Generate formatting function to be cached and reused keyed by the format string.
        // This results in a 100% performance increase over analyzing the format string each invocation.
        if (!formatFn) {

            var originalFormatString = formatString,
                comma = me.thousandSeparator,
                decimalSeparator = me.decimalSeparator,
                precision = 0,
                trimPart = '',
                hasComma,
                splitFormat,
                extraChars,
                trimTrailingZeroes,
                code, len;

            // The "/i" suffix allows caller to use a locale-specific formatting string.
            // Clean the format string by removing all but numerals and the decimal separator.
            // Then split the format string into pre and post decimal segments according to *what* the
            // decimal separator is. If they are specifying "/i", they are using the local convention in the format string.
            if (formatString.substr(formatString.length - 2) === '/i') {
                // In a vast majority of cases, the separator will never change over the lifetime of the application.
                // So we'll only regenerate this if we really need to
                if (!me.I18NFormatCleanRe || me.lastDecimalSeparator !== decimalSeparator) {
                    me.I18NFormatCleanRe = new RegExp('[^\\d\\' + decimalSeparator + '#]', 'g');
                    me.lastDecimalSeparator = decimalSeparator;
                }
                formatString = formatString.substr(0, formatString.length - 2);
                hasComma = formatString.indexOf(comma) !== -1;
                splitFormat = formatString.replace(me.I18NFormatCleanRe, '').split(decimalSeparator);
            } else {
                hasComma = formatString.indexOf(',') !== -1;
                splitFormat = formatString.replace(me.formatCleanRe, '').split('.');
            }
            extraChars = formatString.replace(me.formatPattern, '');

            if (splitFormat.length > 2) {
                //<debug>
                Ext.Error.raise({
                    sourceClass: "Ext.util.Format",
                    sourceMethod: "number",
                    value: v,
                    formatString: formatString,
                    msg: "Invalid number format, should have no more than 1 decimal"
                });
                //</debug>
            } else if (splitFormat.length === 2) {
                precision = splitFormat[1].length;

                // Formatting ending in .##### means maximum 5 trailing significant digits
                trimTrailingZeroes = splitFormat[1].match(me.hashRe);
                if (trimTrailingZeroes) {
                    len = trimTrailingZeroes[0].length;
                    // Need to escape, since this will be '.' by default
                    trimPart = 'trailingZeroes=new RegExp(Ext.String.escapeRegex(utilFormat.decimalSeparator) + "*0{0,' + len + '}$")';
                }
            }

            // The function we create is called immediately and returns a closure which has access to vars and some fixed values; RegExes and the format string.
            code = [
                'var utilFormat=Ext.util.Format,extNumber=Ext.Number,neg,absVal,fnum,parts' +
                    (hasComma ? ',thousandSeparator,thousands=[],j,n,i' : '') +
                    (extraChars ? ',formatString="' + formatString + '",formatPattern=/[\\d,\\.#]+/' : '') +
                    ',trailingZeroes;' +
                'return function(v){' +
                'if(typeof v!=="number"&&isNaN(v=extNumber.from(v,NaN)))return"";' +
                'neg=v<0;',
                'absVal=Math.abs(v);',
                'fnum=Ext.Number.toFixed(absVal, ' + precision + ');',
                trimPart, ';'
            ];

            if (hasComma) {
                // If we have to insert commas...

                // split the string up into whole and decimal parts if there are decimals
                if (precision) {
                    code[code.length] = 'parts=fnum.split(".");';
                    code[code.length] = 'fnum=parts[0];';
                }
                code[code.length] =
                    'if(absVal>=1000) {';
                code[code.length] = 'thousandSeparator=utilFormat.thousandSeparator;' +
                        'thousands.length=0;' +
                        'j=fnum.length;' +
                        'n=fnum.length%3||3;' +
                        'for(i=0;i<j;i+=n){' +
                            'if(i!==0){' +
                                'n=3;' +
                            '}' +
                            'thousands[thousands.length]=fnum.substr(i,n);' +
                        '}' +
                        'fnum=thousands.join(thousandSeparator);' +
                    '}';
                if (precision) {
                    code[code.length] = 'fnum += utilFormat.decimalSeparator+parts[1];';
                }

            } else if (precision) {
                // If they are using a weird decimal separator, split and concat using it
                code[code.length] = 'if(utilFormat.decimalSeparator!=="."){' +
                    'parts=fnum.split(".");' +
                    'fnum=parts[0]+utilFormat.decimalSeparator+parts[1];' +
                '}';
            }

            /*
            * Edge case. If we have a very small negative number it will get rounded to 0,
            * however the initial check at the top will still report as negative. Replace
            * everything but 1-9 and check if the string is empty to determine a 0 value.
            */
            code[code.length] = 'if(neg&&fnum!=="' + (precision ? '0.' + Ext.String.repeat('0', precision) : '0') + '") { fnum="-"+fnum; }';

            if (trimTrailingZeroes) {
                code[code.length] = 'fnum=fnum.replace(trailingZeroes,"");';
            }

            code[code.length] = 'return ';

            // If there were extra characters around the formatting string, replace the format string part with the formatted number.
            if (extraChars) {
                code[code.length] = 'formatString.replace(formatPattern, fnum);';
            } else {
                code[code.length] = 'fnum;';
            }
            code[code.length] = '};';

            formatFn = me.formatFns[originalFormatString] = Ext.functionFactory('Ext', code.join(''))(Ext);
        }
        return formatFn(v);
    }
});

Ext.define('YZSoft.override.picker.Picker', {
    override: 'Ext.picker.Picker',

    applyCancelButton: function(config) {
        if (config) {
            if (Ext.isBoolean(config)) {
                config = {};
            }

            if (typeof config == "string") {
                config = {
                    text: config
                };
            }

            Ext.applyIf(config, {
                align: 'left',
                text: RS.$('All__Cancel')
            });
        }

        return Ext.factory(config, 'Ext.Button', this.getCancelButton());
    },

    applyDoneButton: function(config) {
        if (config) {
            if (Ext.isBoolean(config)) {
                config = {};
            }

            if (typeof config == "string") {
                config = {
                    text: config
                };
            }

            Ext.applyIf(config, {
                cls:'yz-button-done',
                ui: 'action',
                align: 'right',
                text: RS.$('All__Done')
            });
        }

        return Ext.factory(config, 'Ext.Button', this.getDoneButton());
    }
});

Ext.define('YZSoft.override.picker.Slot', {
    override: 'Ext.picker.Slot',

    onScrollEnd: function(scroller, x, y) {
        var me = this,
            store = this.getStore(),
            record;

        me.callParent(arguments);

        record = store.getAt(this.selectedIndex);
        if (record)
            me.select(record);
    }
});

Ext.define('YZSoft.override.SegmentedButton', {
    override: 'Ext.SegmentedButton',

    getValue: function () {
        var me = this,
            btns = me.getPressedButtons(),
            values = [];

        Ext.each(btns, function (btn) {
            if ('value' in btn.config)
                values.push(btn.config.value);
        });

        if (me.getAllowMultiple())
            return values;
        else
            return values.join('');
    },

    setValue: function (value) {
        var me = this,
            items = me.getItems().items,
            btns = [];

        values = (value instanceof Array) ? value : (value == null) ? [] : [value];

        Ext.each(items, function (item) {
            var buttonValue = item.config.value;
            if (Ext.Array.contains(values, buttonValue))
                btns.push(item);
        });

        me.setPressedButtons(btns);
    }
});

Ext.define('YZSoft.override.MessageBox', {
    override: 'Ext.MessageBox',
    show: function (initialConfig) {
        if (initialConfig && initialConfig.message && Ext.isString(initialConfig.message))
            initialConfig.message = YZSoft.$1(initialConfig.message);

        this.callParent(arguments);
    },

    alert: function (title, message, fn, scope) {
        Ext.Msg.show({
            title: title,
            message: message,
            hideOnMaskTap: true,
            buttons: [{
                text: RS.$('All__YesISee'),
                flex: 1,
                cls: 'yz-button-flat yz-button-action-hot',
                itemId: 'ok'
            }],
            scope: scope,
            fn: fn
        });
    },

    onClick: function (button) {
        if (button) {
            var config = button.config.userConfig || {},
                initialConfig = button.getInitialConfig(),
                prompt = this.getPrompt();

            if (typeof config.fn == 'function') {
                button.disable();
                this.on({
                    hiddenchange: function () {
                        config.fn.call(
                            config.scope || null,
                            initialConfig.itemId || initialConfig.text,
                            prompt ? prompt.getValue() : null,
                            config
                        );

                        if (!button.isDestroyed) //added by qml
                            button.enable();
                    },
                    single: true,
                    scope: this
                });
            }

            if (config.input) {
                config.input.dom.blur();
            }
        }

        this.hide();
    }
});


Ext.define('YZSoft.override.Select', {
    override: 'Ext.field.Select',
    config: {
        usePicker:true
    }
});

Ext.define('YZSoft.override.Text', {
    override: 'Ext.field.Text',

    updateReadOnly: function(newReadOnly) {
        this.callParent(arguments);
        this[newReadOnly ? 'addCls':'removeCls']('yz-field-readonly');
    }
});

Ext.define('YZSoft.override.slider.Toggle', {
    override: 'Ext.slider.Toggle',
    config: {
        animation: false
    },

    onThumbDragEnd: function (thumb, e) {
        var me = this;

        me.callParent(arguments);

        var index = me.getThumbIndex(thumb),
            newValue = me.getValue()[index],
            oldValue = me.dragStartValue;

        if (oldValue !== newValue)
            me.fireEvent('changemanual', me, thumb, newValue, oldValue);
    },

    onTap: function (e) {
        var me = this;

        if (me.isDisabled() || me.getReadOnly()) {
            return;
        }

        var thumb = me.getThumb(0),
            oldValue = me.getValue()[0],
            newValue;

        me.callParent(arguments);

        newValue = me.getValue()[0];

        if (oldValue !== newValue) {
            me.fireEvent('changemanual', me, thumb, newValue, oldValue);
        }
    }
});

Ext.define('YZSoft.override.field.Toggle', {
    override: 'Ext.field.Toggle',

    initialize: function () {
        var me = this,
            component = me.getComponent();

        me.callParent();

        component.on({
            scope: me,
            changemanual: 'onChangeManual'
        });
    },

    onChangeManual: function (thumb, newValue, oldValue) {
        var me = this;

        me.fireEvent('changemanual', me, thumb, newValue, oldValue);
    }
});

Ext.define('YZSoft.src.overrides.dom.Element', {
    override: 'Ext.dom.Element',

    /**
    * Shakes an element left to right or up and down. Shaking decreases until the element settles back into its original position.
    * Usage:
    *<pre><code>
    // default: shake left to right (x) five times with an excitement level of 2
    el.shake();
    // custom: shake up and down 10 times with an excitement level of 4
    el.shake({ direction: 'y', shakes: 10, excitement: 4 });
    </code></pre>
    * @param {Object} options (optional) Object literal with any of the Shake config options (direction of 'x' or 'y', shakes, and excitement)
    * @return {Ext.Element} The Element
    */
    shake: function (o) {
        o = Ext.applyIf(o || {}, {
            shakes: 3,
            excitement: 1,
            direction: 'x',
            duration: 50
        });

        var me = this,
            dom = me.dom,
            c = o.direction.toUpperCase(),
            translateAttr = (c == 'X') ? 'translateX' : 'translateY',
            savedTransform = dom.style.transform,
            s = o.shakes,
            r = s * 2,
            e = o.excitement * 2,
            animArg = {}, anim;

        animArg = {
            autoClear: false,
            duration: o.duration,
            easing: 'ease-out',
            to: {
            },
            after: function () {
                if (--r > 0)
                    animFn();
                else {
                    dom.style.transform = savedTransform;
                    if (o.callback)
                        o.callback.call(o.scope || me);
                }
            }
        };

        function animFn() {
            animArg.to.transform = Ext.String.format('{0}({1}px)', translateAttr, (r & 1) ? -(s-- * e) : +(s * e));
            anim = Ext.create('Ext.Anim', animArg);
            anim.run(me);
        }

        animFn();
        return me;
    }
});

Ext.define('YZSoft.override.scroll.Scroller', {
    override: 'Ext.scroll.Scroller',

    refreshMaxPosition: function () {
        var me = this,
            config = me.config || {};

        if (config.align != 'bottom') {
            me.callParent(arguments);
            return;
        }

        var size = me.getSize(),
            containerSize = me.getContainerSize();

        me.minPosition = {
            x: Math.min(0, containerSize.x - size.x),
            y: Math.min(0, containerSize.y - size.y)
        };

        me.fireEvent('minpositionchange', me, me.minPosition);

        me.maxPosition = {
            x: 0,
            y: 0
        };

        me.fireEvent('maxpositionchange', me, me.maxPosition);
    },

    getAnimationEasing: function (axis, e) {
        var me = this,
            config = me.config || {},
            easing = me.callParent(arguments),
            minPosition = me.getMinPosition()[axis],
            maxPosition = me.getMaxPosition()[axis];

        if (easing && easing.config.momentum && config.align == 'bottom') {
            easing.setConfig({
                minMomentumValue: 0,
                maxMomentumValue: -minPosition
            });
        }

        return easing;
    },

    onAxisDrag: function (axis, delta) {
        if (!this.isAxisEnabled(axis)) {
            return;
        }

        var flickStartPosition = this.flickStartPosition,
            flickStartTime = this.flickStartTime,
            lastDragPosition = this.lastDragPosition,
            dragDirection = this.dragDirection,
            old = this.position[axis],
            min = this.getMinPosition()[axis],
            max = this.getMaxPosition()[axis],
            start = this.startPosition[axis],
            last = lastDragPosition[axis],
            current = start - delta,
            lastDirection = dragDirection[axis],
            restrictFactor = this.getOutOfBoundRestrictFactor(),
            startMomentumResetTime = this.getStartMomentumResetTime(),
            now = Ext.Date.now(),
            distance;

        if (current < min) {
            distance = current - min;
            current = min + distance * restrictFactor;
        }
        else if (current > max) {
            distance = current - max;
            current = max + distance * restrictFactor;
        }

        if (current > last) {
            dragDirection[axis] = 1;
        }
        else if (current < last) {
            dragDirection[axis] = -1;
        }

        if ((lastDirection !== 0 && (dragDirection[axis] !== lastDirection))
                || (now - flickStartTime[axis]) > startMomentumResetTime) {
            flickStartPosition[axis] = old;
            flickStartTime[axis] = now;
        }

        lastDragPosition[axis] = current;
    }
});

Ext.define('YZSoft.override.tab.Panel', {
    override: 'Ext.tab.Panel',

    applyTabBar: function (tabBar) {
        if (tabBar && tabBar.isComponent) {
            tabBar.isSeparate = true;

            tabBar.on({
                order: 'before',
                scope: this,
                activetabchange: 'doTabChange'
            });
            return tabBar;
        }
        else {
            return this.callParent(arguments);
        }
    },

    updateTabBar: function (newTabBar) {
        if (newTabBar.isSeparate)
            return;

        this.callParent(arguments);
    }
});

Ext.define('YZSoft.override.data.Model', {
    override: 'Ext.data.Model',
    config: {
        useCache:false
    }
});

Ext.define('YZSoft.override.data.Connection', {
    override: 'Ext.data.Connection',

    onStateChange: function (request) {
        if (request.xhr && request.xhr.readyState == 4) {
            this.clearTimeout(request);
            this.onComplete(request);
            this.cleanup(request);
        }
    }
});

Ext.define('YZSoft.override.navigation.View', {
    override: 'Ext.navigation.View',

    push: function () {
        var me = this,
            activeItem = me.getActiveItem();

        if (!activeItem) {
            me.callParent(arguments);
            return;
        }

        activeItem.on({
            single:true,
            hide: function () {
                Ext.Viewport.unmask();
            }
        });

        Ext.Viewport.mask({
            xtype: 'mask',
            transparent: true
        });

        me.callParent(arguments);
    },

    pop: function () {
        var me = this,
            activeItem = me.getActiveItem();

        if (!activeItem) {
            me.callParent(arguments);
            return;
        }

        activeItem.on({
            single: true,
            hide: function () {
                Ext.Viewport.unmask();
            }
        });

        Ext.Viewport.mask({
            xtype: 'mask',
            transparent: true
        });

        me.callParent(arguments);
    }
});

Ext.define('YZSoft.override.layout.Default', {
    override: 'Ext.layout.Default',

    insertBodyItem: function (item) {
        var me = this,
            container = me.container.setUseBodyElement(true),
            bodyDom = container.bodyElement.dom;

        if (item.getZIndex() === null) {
            item.setZIndex(me.getTopZIndex(container, item));
        }

        bodyDom.insertBefore(item.element.dom, bodyDom.firstChild);
        return me;
    },

    getTopZIndex: function (container, item) {
        var me = this,
            index = container.indexOf(item),
            items = container.getItems().items,
            topZIndex = (index + 1) * 2;

        for (i = 0; i < index; i++) {
            var item = items[i],
                zIndex = item.getZIndex() || 0;

            if (item.isHidden())
                continue;

            topZIndex = Math.max(topZIndex, zIndex + 2)
        }

        return topZIndex;
    }
});

Ext.apply(YZSoft, {
    delay: function (ms) {
        var startTime, endTimes, s;
        var d = new Date();
        startTime = d.getTime();
        while (true) {
            d = new Date();
            endTime = d.getTime();
            s = (endTime - startTime);
            if (s >= ms)
                break;
        }
    },

    showPhase: function () {
        var phases = application.phases,
            ln = phases.length,
            i, items = [], item1, item2;

        for (i = 1; i < ln; i++) {
            item1 = phases[i - 1];
            item2 = phases[i];
            items.push(Ext.String.format('{0}->{1} {2}ms', item1.phase, item2.phase, Ext.Date.getElapsed(item1.time, item2.time)));
        }

        item1 = phases[0];
        item2 = phases[ln - 1];
        items.push(Ext.String.format('{0}->{1} {2}ms', item1.phase, item2.phase, Ext.Date.getElapsed(item1.time, item2.time)));

        alert(items.join('\n'));
    },

    showjs: function () {
        var jss = application.js,
            items = [], i = 0;

        Ext.each(jss, function (js) {
            items.push(Ext.String.format('{0}:{1} {2}ms', i++, js.url, Ext.Date.getElapsed(js.begin, js.finish)));
        });

        alert(items.join('\n'));
    },

    showashx: function () {
        var ashxs = application.ashx,
            items = [], i = 0;

        Ext.each(ashxs, function (ashx) {
            items.push(Ext.String.format('{0}:{1} {2}ms', i++, ashx.url, Ext.Date.getElapsed(ashx.begin, ashx.finish)));
        });

        alert(items.join('\n'));
    }
});

//chrome65 登录后无法点击问题修正
Ext.define('YZSoft.override.fx.runner.CssTransition', {
    override: 'Ext.fx.runner.CssTransition',

    run: function (animations) {
        this.getTestElement();
        this.callParent(arguments);
    }
});

//模板不支持中文字段
Ext.define('YZSoft.override.XTemplateCompiler', {
    override: 'Ext.XTemplateCompiler',
    tagRe: /([\w-\.\#\$\u0100-\uffff]+)(?:\:([\w\.]*)(?:\((.*?)?\))?)?(\s?[\+\-\*\/]\s?[\d\.\+\-\*\/\(\)]+)?/
});

Ext.apply(Ext.Array, {
    findBy: function (array, fn, scope) {
        var i = 0,
            len = array.length;

        for (; i < len; i++) {
            if (fn.call(scope || array, array[i], i)) {
                return array[i];
            }
        }
        return null;
    }
});

Ext.define('YZSoft.override.field.DatePicker', {
    override: 'Ext.field.DatePicker',

    constructor: function (config) {
        this.callParent(arguments);
        this.addCls('yz-field-date');
    }
});

Ext.define('YZSoft.override.field.Input', {
    override: 'Ext.field.Input',

    getTemplate: function () {
        var items = [{
                reference: 'input',
                spellcheck: false,
                tag: this.tag
            },{
                reference: 'mask',
                classList: [this.config.maskCls]
            },{
                reference: 'clearIcon',
                cls: 'x-clear-icon'
            }
        ];

        return items;
    }
});


//for debug
//Ext.define('YZSoft.override.Component', {
//    override: 'Ext.Component',

//    updateZIndex: function (zIndex) {
//        this.callParent(arguments);
//    }
//});

//var devicePixelRatio = window.devicePixelRatio || 1;
//alert(devicePixelRatio);

//alert(Ext.getBody().getAttribute('class'));