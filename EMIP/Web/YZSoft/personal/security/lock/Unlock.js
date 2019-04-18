
Ext.define('YZSoft.personal.security.lock.Unlock', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.device.StatusBar'
    ],
    config: {
        cls: 'yz-screenlock-unlock',
        layout: {
            type: 'vbox',
            align: 'stretch'
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.cmpTrialPrompt = Ext.create('Ext.Component', {
            tpl: '<div style="font-size:14px;line-height:20px;color:#f0f0f0;padding-left:5px;padding-top:12px;text-align: center;">{title}</div>',
            data: {
                title: RS.$('All_ScreenUnlock_TrialInfo')
            },
            hidden: !YZSoft.LoginUser.Trial,
            top: 0,
            left:0,
            right:0
        });

        me.edtPassword = Ext.create('YZSoft.personal.security.lock.PasswordField', {
            passwordLength: 4,
            margin: '12 0 0 0'
        });

        me.keyboard = Ext.create('YZSoft.personal.security.lock.UnlockSoftKeyboard', {
        });

        me.edtPassword.relayEvents(me.keyboard, ['keyclick']);

        me.edtPassword.on({
            fullinputed: function (password) {
                if (YZSoft.LoginUser.Trial) {
                    if (me.config.fn)
                        me.config.fn.call(me.scope);

                    return;
                }

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
                    params: {
                        Method: 'ValidateScreenLockPassword',
                        password: password
                    },
                    success: function (action) {
                        if (!action.result) {
                            me.edtPassword.element.shake({
                                direction: 'x',
                                shakes: 3,
                                excitement: 1,
                                duration: 30,
                                callback: function () {
                                    me.edtPassword.clear();
                                }
                            });

                            return;
                        }

                        if (me.config.fn)
                            me.config.fn.call(me.scope);
                    },
                    failure: function (action) {
                        Ext.Msg.alert(RS.$('All__Title_ValidationFailed'), action.result.errorMessage);
                    }
                });
            }
        });

        cfg = {
            items: [{
                flex: 1
            }, {
                xtype: 'component',
                cls: ['yz-align-hvcenter', 'yz-screelock-unlock-caption'],
                tpl: [
                    RS.$('All_ScreenUnlock_Caption')
                ],
                data: {
                }
            }, me.edtPassword, {
                flex: 1,
                items: [me.cmpTrialPrompt]
            }, me.keyboard, {
                flex: 1
            }, {
                xtype: 'container',
                padding: '0 0 20 20',
                layout: {
                    type: 'hbox'
                },
                items: [{
                    xtype: 'button',
                    cls: ['yz-button-flat', 'yz-button-unlock-forgetpwd'],
                    text: RS.$('All_ScreenUnlock_ForgetPassword'),
                    scope: me,
                    handler: 'onForgetPwdClick'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            show: function () {
                me.statusBarStyle = YZSoft.src.device.StatusBar.style;
                YZSoft.src.device.StatusBar.styleLightContent();

                if (YZSoft.LoginUser.TouchUnlock)
                    me.showVerifyFingerprint();
            },
            hide: function () {
                YZSoft.src.device.StatusBar[me.statusBarStyle || 'styleDefault']();
            }
        });
    },

    reset: function () {
        this.edtPassword.clear();
    },

    showVerifyFingerprint: function () {
        var me = this;

        if (!Ext.os.is.iOS)
            return;

        if (window.plugins.touchid) {
            window.plugins.touchid.isAvailable(function () {
                window.plugins.touchid.verifyFingerprint(RS.$('All_ScreenUnlock_TouchUnlock_Prompt'), function (msg) {
                    if (me.config.fn)
                        me.config.fn.call(me.scope);
                },
                function () {
                });
            });
        }
    },

    onForgetPwdClick: function () {
        var me = this,
            lastParams = {}, //YZSoft$Boot.login.Panel.lastParams,
            pnl, dlg;

        dlg = Ext.Msg.show({
            message: Ext.String.format(RS.$('All_ScreenUnlock_ResignInAndClose'), RS.$('All__MobileAppName')),
            hideOnMaskTap: true,
            buttons: [{
                text: RS.$('All__Cancel'),
                flex: 1,
                cls: 'yz-button-flat yz-button-dlg-normal',
                itemId: 'cancel'
            }, { xtype: 'spacer', width: 12 }, {
                text: RS.$('All__ResignIn'),
                flex: 1,
                cls: 'yz-button-flat yz-button-dlg-default',
                itemId: 'ok'
            }],
            fn: function (btn) {
                if (btn != 'ok')
                    return;

                if (me.config.beforeRelogin)
                    me.config.beforeRelogin.call(me.scope);

                application.app.login({
                    loginRequestConfig: {
                        delay: true
                    },
                    fn: function (result) {
                        YZSoft.Ajax.request({
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
                            params: {
                                Method: 'ResetScreenLock'
                            },
                            success: function (action) {
                                YZSoft.LoginUser.ScreenLock = false;
                            }
                        });

                        if (me.config.relogin)
                            me.config.relogin.call(me.scope, result, url);
                    }
                });
            }
        });
    }
});