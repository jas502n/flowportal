
Ext.define('YZSoft$Boot.login.Panel', {
    extend: 'Ext.Container',
    requires: [
        'Ext.device.Connection',
        'YZSoft$Boot.login.ServerPicker',
        'YZSoft$Boot.login.ServerSelect',
        'YZSoft$Boot.src.ExpandSelect',
        'YZSoft$Boot.src.Select',
        'YZSoft$Boot.src.InputExt',
        'Ext.device.Communicator',
        'Ext.device.communicator.Default',
        'Ext.device.connection.Abstract',
        'Ext.device.connection.Cordova'
    ],
    config: {
        loginRequestConfig: null,
        padding: '0 16 10 16',
        selectServer: true,
        serverUrl: null
    },

    constructor: function (config) {
        var me = this,
            strservers, servers = [], uid, server, haslogin;

        me.btnScan = Ext.create('Ext.Button', {
            top: application.statusbarOverlays ? 22 : 10,
            right: 0,
            width: 32,
            height: 32,
            padding: 3,
            text: '扫一扫',
            icon: YZLoader.$url('YZSoft$Local', 'YZSoft$Boot/images/scan.png'),
            cls: ['yzlg-button-login', 'yzlg-button-scan'],
            scope: me,
            handler: 'onScanClick'
        });

        me.banner = Ext.create('Ext.Container', {
            cls: 'logo-cnt',
            //html: '<div class="logo"></div>',
            items: [{
                xtype: 'component',
                html: '<div class="logo"></div>'
            }, me.btnScan]
        });

        if (localStorage) {
            try {
                strservers = localStorage.getItem('servers');
                Ext.Array.each(strservers ? Ext.decode(strservers) : [], function (server) {
                    if (server.url)
                        servers.push(server);
                });
                uid = localStorage.getItem('uid');
                haslogin = localStorage.getItem('haslogin');
            }
            catch (exp) {
                servers = [];
                uid = '';
            }
        }

        server = (servers && servers[0]) || { url: '' };

        me.server = Ext.create('YZSoft$Boot.login.ServerSelect', {
            cls: 'server',
            label: '&#59719;',
            labelWidth: '32px',
            clearIcon: false,
            autoComplete: false,
            placeHolder: $rs.placeholderUrl,
            hidden: config.selectServer === false,
            store: {
                fields: ['url'],
                data: servers
            },
            value: server.url
        });

        me.uid = Ext.create('Ext.field.Text', {
            cls: 'uid',
            label: '&#59721;',
            labelWidth: '32px',
            clearIcon: true,
            autoComplete: false,
            placeHolder: $rs.placeholderAccount,
            value: uid
        });

        me.pwd = Ext.create('Ext.field.Password', {
            cls: 'pwd',
            label: '&#59720;',
            labelWidth: '32px',
            clearIcon: true,
            autoComplete: false,
            placeHolder: $rs.placeholderPassword
        });

        me.vcode = Ext.create('Ext.field.Text', {
            component: {
                type: 'tel'
            },
            cls: 'vcode',
            flex: 1,
            margin: 0,
            clearIcon: false,
            placeHolder: $rs.placeholderVCode
        });

        me.btnSendVCode = Ext.create('Ext.Button', {
            text: $rs.txtSendVCode,
            cls: ['yzlg-button-login', 'yzlg-button-sendvcode'],
            scope: me,
            handler: 'onSendVClodeClick'
        });

        me.cmpSendTo = Ext.create('Ext.Component', {
            tpl: $rs.txtVCodeSendTo,
            cls: 'yzlg-cmp-sendto',
            hidden: true,
            data: {
                phoneNumber: ''
            }
        });

        me.cntValidate = Ext.create('Ext.Container', {
            margin: '16 0 0 32',
            hidden: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'end'
                },
                items: [me.vcode, me.btnSendVCode]
            }, me.cmpSendTo]
        });

        me.btnLogin = Ext.create('Ext.Button', {
            margin: '30 0 0 0',
            cls: ['yzlg-button-login'],
            text: $rs.txtLogin,
            disabled: false,
            handler: function (btn, e) {
                e.stopEvent();

                var enterUrl = me.server.getValue(),
                    uid = (me.uid.getValue() || '').trim(),
                    vcode = (me.vcode.getValue() || '').trim(),
                    err;

                if (application.isApp && !Ext.device.Connection.isOnline()) {
                    err = $rs.msgNoConnection;
                }
                else if (!me.server.isHidden() && !enterUrl) {
                    err = $rs.validateEmptyUrl;
                }
                else if (!uid) {
                    err = $rs.validateEmptyUid;
                }
                else if (!me.cntValidate.isHidden() && !vcode) {
                    err = $rs.validateEmptyVCode;
                }

                if (err) {
                    Ext.Msg.show({
                        cls: 'yzlg-messagebox',
                        message: err,
                        hideOnMaskTap: true,
                        buttons: [{
                            text: $rs.YesISee,
                            flex: 1,
                            cls: 'yzlg-button-flat yzlg-button-action-hot',
                            itemId: 'ok'
                        }]
                    });
                    return;
                }

                me.login();
            }
        });

        me.btnTrial = Ext.create('Ext.Button', {
            text: $rs.txtTrial,
            cls: ['yzlg-button-login', 'yzlg-button-trial'],
            iconCls: ['yzlg-glyph', 'yzlg-glyph-e94d'],
            iconAlign: 'right',
            handler: function (btn, e) {
                e.stopEvent();

                if (!me.server.isHidden()) {
                    var err;

                    if (!Ext.device.Connection.isOnline()) {
                        err = $rs.msgNoConnection;
                    }

                    if (err) {
                        Ext.Msg.show({
                            cls: 'yzlg-messagebox',
                            message: err,
                            hideOnMaskTap: true,
                            buttons: [{
                                text: $rs.YesISee,
                                flex: 1,
                                cls: 'yzlg-button-flat yzlg-button-action-hot',
                                itemId: 'ok'
                            }]
                        });
                        return;
                    }
                }

                me.loginTrial();
            }
        });

        var cfg = {
            cls: ['yzlg-container-login'],
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.banner, me.server, me.uid, me.pwd, me.cntValidate, me.btnLogin, { flex: 1 }, {
                xtype: 'container',
                margin: '0 0 20 0',
                hidden: !!haslogin || !application.trialUrl,
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                items: [me.btnTrial]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            show: function () {
                if (navigator.splashscreen) {
                    Ext.defer(function () {
                        navigator.splashscreen.hide();
                    }, 0);
                }
            }
        });
    },

    parseUrl: function (url) {
        url = url || '';

        var me = this,
            urllow = (url || '').toLowerCase(),
            ch;

        if (urllow.indexOf('http://') !== 0 && urllow.indexOf('https://') !== 0)
            url = 'http://' + url;

        ch = url.charAt(url.length - 1);
        if (ch == '/' || ch == '\\')
            url = url.substr(0, url.length - 1);

        return url;
    },

    login: function () {
        var me = this,
            selectServer = me.getSelectServer() !== false,
            serverUrl = me.getServerUrl(),
            enterUrl = me.server.getValue(),
            url = serverUrl || (enterUrl || '').trim(),
            loginRequestConfig = me.getLoginRequestConfig(),
            uid = (me.uid.getValue() || '').trim(),
            pwd = me.pwd.getValue(),
            vcode = (me.vcode.getValue() || '').trim(),
            ch, urllow;

        if ((selectServer && !url) || !uid)
            return;

        if (selectServer || serverUrl) {
            url = me.parseUrl(url);
            Ext.Loader.setPath({
                YZSoft$Server: url + '/YZSoft$Server'
            });
        }

        Ext.Loader.syncRequire('YZSoft$Boot.src.Device');

        YZLoader.Ajax.request({
            url: YZLoader.$url('YZSoft.Services.REST.Mobile/core/Auth.ashx'),
            params: {
                method: 'GetPublicKey'
            },
            waitMsg: {
                cls: 'yzl-loadmask',
                message: $rs.loadingAuth,
                autoClose: false
            },
            success: function (action) {
                debugger;
                var keyInfo = action.result,
                    encrypt = new JSEncrypt();

                encrypt.setPublicKey(keyInfo.publicKey);
                YZLoader.Ajax.request(Ext.apply({
                    method: 'POST',
                    timeout: 8000,
                    url: YZLoader.$url('YZSoft.Services.REST.Mobile/core/Auth.ashx'),
                    delay: 300,
                    params: {
                        Method: 'Login',
                        uid: encrypt.encrypt(uid),
                        pwd: encrypt.encrypt(pwd),
                        lang: YZLoader.Globalization.getLang(),
                        isapp: application.isApp,
                        cordova: YZSoft$Boot.src.Device.cordova,
                        name: YZSoft$Boot.src.Device.name,
                        model: YZSoft$Boot.src.Device.model,
                        platform: YZSoft$Boot.src.Device.platform,
                        uuid: YZSoft$Boot.src.Device.uuid,
                        version: YZSoft$Boot.src.Device.version,
                        manufacturer: YZSoft$Boot.src.Device.manufacturer,
                        isVirtual: YZSoft$Boot.src.Device.isVirtual,
                        serial: YZSoft$Boot.src.Device.serial,
                        validationPanelShow: !me.cntValidate.isHidden(),
                        smsGuid: me.smsGUID,
                        vcode: vcode,
                        keystore: keyInfo.keystore
                    },
                    success: function (action) {
                        me.mask({
                            xtype: 'mask',
                            transparent: true
                        });

                        Ext.defer(function () {
                            me.unmask();
                        }, 30000);

                        me.clearTimer();
                        me.saveLoginInfo(url, uid, pwd);
                        me.setLoginFlag();

                        if (me.config.fn)
                            me.config.fn.call(me.scope, action.result, url);
                    },
                    failure: function (action) {
                        Ext.Viewport.unmask();

                        if (action.result.needSmsValidation) {
                            me.cntValidate.setHidden(false);
                            return;
                        }

                        Ext.Msg.show({
                            cls: 'yzlg-messagebox',
                            title: $rs.titleLoginFailed,
                            message: action.result.errorMessage,
                            hideOnMaskTap: true,
                            buttons: [{
                                text: $rs.YesISee,
                                flex: 1,
                                cls: 'yzlg-button-flat yzlg-button-action-hot',
                                itemId: 'ok'
                            }]
                        });
                    }
                }, loginRequestConfig));
            },
            failure: function (action) {
                Ext.Msg.show({
                    cls: 'yzlg-messagebox',
                    title: $rs.titleLoginFailed,
                    message: action.result.errorMessage,
                    hideOnMaskTap: true,
                    buttons: [{
                        text: $rs.YesISee,
                        flex: 1,
                        cls: 'yzlg-button-flat yzlg-button-action-hot',
                        itemId: 'ok'
                    }]
                });
            }
        });
    },

    loginTrial: function () {
        var me = this,
            url = application.trialUrl;

        Ext.Loader.setPath({
            YZSoft$Server: url + '/YZSoft$Server'
        });

        Ext.Loader.syncRequire('YZSoft$Boot.src.Device');

        YZLoader.Ajax.request({
            method: 'POST',
            timeout: 8000,
            url: YZLoader.$url('YZSoft.Services.REST.Mobile/core/Auth.ashx'),
            waitMsg: {
                cls: 'yzl-loadmask',
                message: $rs.loadingLoginTrialServer,
                autoClose: false
            },
            delay: 300,
            params: {
                Method: 'LoginTrial',
                isapp: application.isApp,
                lang: YZLoader.Globalization.getLang(),
                cordova: YZSoft$Boot.src.Device.cordova,
                name: YZSoft$Boot.src.Device.name,
                model: YZSoft$Boot.src.Device.model,
                platform: YZSoft$Boot.src.Device.platform,
                uuid: YZSoft$Boot.src.Device.uuid,
                version: YZSoft$Boot.src.Device.version,
                manufacturer: YZSoft$Boot.src.Device.manufacturer,
                isVirtual: YZSoft$Boot.src.Device.isVirtual,
                serial: YZSoft$Boot.src.Device.serial,
                validationPanelShow: !me.cntValidate.isHidden()
            },
            success: function (action) {
                me.mask({
                    xtype: 'mask',
                    transparent: true
                });

                Ext.defer(function () {
                    me.unmask();
                }, 30000);

                if (me.config.fn)
                    me.config.fn.call(me.scope, action.result, url);
            },
            failure: function (action) {
                Ext.Msg.show({
                    cls: 'yzlg-messagebox',
                    title: $rs.titleLoginFailed,
                    message: action.result.errorMessage,
                    hideOnMaskTap: true,
                    buttons: [{
                        text: $rs.YesISee,
                        flex: 1,
                        cls: 'yzlg-button-flat yzlg-button-action-hot',
                        itemId: 'ok'
                    }]
                });
            }
        });
    },

    saveLoginInfo: function (url, uid, pwd) {
        var me = this,
            newServers = [];

        try {
            newServers.push({
                url: url
            });

            servers = localStorage.getItem('servers');
            servers = servers ? Ext.decode(servers) : [];
            Ext.Array.each(servers, function (server) {
                if (!String.Equ(server.url, url))
                    newServers.push(server);
            });

            localStorage.setItem('servers', Ext.encode(newServers));
            localStorage.setItem('uid', uid);
            localStorage.setItem('pwd', pwd);
            localStorage.setItem('logout', 'false');
        }
        catch (exp) {
        }
    },

    setLoginFlag: function () {
        try {
            localStorage.setItem('haslogin', 'y');
        }
        catch (exp) {
        }
    },

    onScanClick: function () {
        var me = this;

        cordova.plugins.barcodeScanner.scan(function (result) {
            if (result.cancelled)
                return;

            me.server.getComponent().setValue(result.text);
        }, function () {
        }, {
            successEnterRight: true,
            prompt: $rs.barcodeScanPrompt
        });
    },

    onSendVClodeClick: function () {
        var me = this,
            selectServer = me.getSelectServer() !== false,
            serverUrl = me.getServerUrl(),
            enterUrl = me.server.getValue(),
            url = serverUrl || (enterUrl || '').trim(),
            uid = me.uid.getValue(),
            btnSend = me.btnSendVCode,
            err;

        me.uid.getValue();

        if (!Ext.device.Connection.isOnline()) {
            err = $rs.msgNoConnection;
        }
        else if (!me.server.isHidden() && !enterUrl) {
            err = $rs.validateEmptyUrl;
        }
        else if (!uid) {
            err = $rs.validateEmptyUid;
        }

        if (err) {
            Ext.Msg.show({
                cls: 'yzlg-messagebox',
                message: err,
                hideOnMaskTap: true,
                buttons: [{
                    text: $rs.YesISee,
                    flex: 1,
                    cls: 'yzlg-button-flat yzlg-button-action-hot',
                    itemId: 'ok'
                }]
            });
            return;
        }

        me.clearTimer();

        if (selectServer || serverUrl) {
            url = me.parseUrl(url);
            Ext.Loader.setPath({
                YZSoft$Server: url + '/YZSoft$Server'
            });
        }

        YZLoader.Ajax.request({
            url: YZLoader.$url('YZSoft.Services.REST.Mobile/core/Auth.ashx'),
            params: {
                Method: 'SendLoginValidationCode',
                uid: uid
            },
            waitMsg: {
                cls: 'yzl-loadmask',
                message: $rs.loadingSendVCode,
                autoClose: true
            },
            delay: 500,
            success: function (action) {
                me.startTimer();
                me.updateLeaveTime();
                me.smsGUID = action.result.ItemGUID;

                me.cmpSendTo.setData({
                    phoneNumber: action.result.PhoneNumber
                });
                me.cmpSendTo.setHidden(false);
            },
            failure: function (action) {
                Ext.Msg.show({
                    cls: 'yzlg-messagebox',
                    title: $rs.titleSendVCodeFailed,
                    message: action.result.errorMessage,
                    hideOnMaskTap: true,
                    buttons: [{
                        text: $rs.YesISee,
                        flex: 1,
                        cls: 'yzlg-button-flat yzlg-button-action-hot',
                        itemId: 'ok'
                    }]
                });
                btnSend.setText($rs.txtSendVCode);
            }
        });
    },

    updateLeaveTime: function () {
        var me = this,
            now = new Date(),
            leaveSecond = Ext.Date.getElapsed(now, me.expireTime),
            btnSend = me.btnSendVCode;

        if (now < me.expireTime) {
            btnSend.setText(Ext.String.format($rs.txtResendVCode, Math.ceil(leaveSecond / 1000)));
        }
        else {
            me.clearTimer();
            btnSend.setText($rs.txtSendVCode);
        }
    },

    startTimer: function (expireTime) {
        var me = this;

        me.expireTime = Ext.Date.add(new Date(), Ext.Date.SECOND, 60);
        me.timer = setInterval(function () {
            me.updateLeaveTime();
        }, 100);
    },

    clearTimer: function () {
        var me = this;

        if (me.timer) {
            clearInterval(me.timer);
            delete me.timer;
        }
    }
});