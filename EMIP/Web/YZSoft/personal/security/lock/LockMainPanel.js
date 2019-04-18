Ext.define('YZSoft.personal.security.lock.LockMainPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.button.ListButton'
    ],
    config: {
        togProtectConfig: null,
        togTouchUnlockConfig: null,
        style: 'background-color:#f0f3f5;',
        scrollable: {
            direction: 'vertical',
            indicators: false
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        config = config || {};

        me.btnBack = Ext.create('Ext.Button', {
            text: RS.$('All__Back'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack]
        });

        me.togScreenLock = Ext.create('Ext.field.Toggle', Ext.apply({
            label: RS.$('All_ScreenLock_EnableScreenLock'),
            labelWidth: '60%',
            padding: '6 10 6 15',
            value: false
        }, config.togProtectConfig));

        me.togTouchUnlock = Ext.create('Ext.field.Toggle', Ext.apply({
            label: RS.$('All_ScreenLock_EnableTouchIDUnLock'),
            labelWidth: '60%',
            padding: '6 10 6 15',
            value: false
        }, config.togTouchUnlockConfig));

        me.btnChangePassword = Ext.create('YZSoft.src.button.ListButton', {
            bborder: true,
            iconGoCls: 'yz-glyph yz-glyph-e904',
            text: RS.$('All_ScreenLock_ChangePassword'),
            handler: function () {
                var pnl = Ext.create('YZSoft.personal.security.lock.ChangePassword', {
                    title: RS.$('All_ScreenLock_ChangePassword_Title'),
                    back: function () {
                        Ext.mainWin.pop();
                    },
                    fn: function () {
                        Ext.mainWin.pop();
                    }
                });

                Ext.mainWin.push(pnl);
            }
        });

        me.btnForgetPassword = Ext.create('YZSoft.src.button.ListButton', {
            iconGoCls: 'yz-glyph yz-glyph-e904',
            text: RS.$('All_ScreenLock_ForgetPassword'),
            handler: function () {
                var dlg = Ext.create('YZSoft.src.panel.PasswordValidate', {
                    message: Ext.String.format(RS.$('All__ValidatePassword_Message_FMT'), RS.$('All__MobileAppName')),
                    fn: function (pnl, password) {
                        dlg.hide();

                        var resetPanel = Ext.create('YZSoft.personal.security.lock.ResetPassword', {
                            title: RS.$('All_ScreenLock_ResetPassword'),
                            userPassword: password,
                            successMask: {
                                delay: 800
                            },
                            back: function () {
                                Ext.mainWin.pop();
                            },
                            fn: function () {
                                Ext.mainWin.pop();
                            }
                        });
                        Ext.mainWin.push(resetPanel);
                    },
                    listeners: {
                        order: 'after',
                        hide: function () {
                            this.destroy();
                        }
                    }
                });

                Ext.Viewport.add(dlg);
                dlg.show();
            }
        });

        cfg = {
            defaults: {
                defaults: {
                    padding: '11 10 11 15'
                }
            },
            items: [me.titleBar, {
                xtype: 'component',
                padding: '10 15',
                tpl: [
                    '<div class="yz-comments yz-comments-size-m">{text}</div>'
                ],
                data: {
                    text: RS.$('All_ScreenLock_ApplyTo')
                }
            }, {
                xtype: 'container',
                cls: ['yz-form', 'yz-form-dark', 'yz-container-border-top', 'yz-container-border-bottom', 'yz-list-button-container-left15'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.togScreenLock]
            }, {
                xtype: 'component',
                padding: '10 15 20 15',
                tpl: [
                    '<div class="yz-comments yz-comments-size-m">{text}</div>'
                ],
                data: {
                    text: Ext.String.format(RS.$('All_ScreenLock_Desc'), RS.$('All__MobileAppName'))
                }
            }, {
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-form', 'yz-form-dark', 'yz-container-border-top', 'yz-container-border-bottom', 'yz-list-button-container-left15'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.togTouchUnlock]
            }, {
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-container-border-top', 'yz-container-border-bottom', 'yz-list-button-container-left15'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.btnChangePassword, me.btnForgetPassword]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.togScreenLock.getComponent().on({
            scope: me,
            changemanual: 'onScreenLockToggleChange'
        });

        me.togTouchUnlock.getComponent().on({
            scope: me,
            changemanual: 'onTouchUnlockChange'
        });

        me.on({
            show: function () {
                me.loadForm();
            }
        });
    },

    onScreenLockToggleChange: function (cmp, thumb, newvalue, oldValue) {
        var me = this,
            pnl;

        if (newvalue == 0) {
            pnl = Ext.create('YZSoft.personal.security.lock.ValidatePassword', {
                title: RS.$('All_ScreenLock_EnterPassword'),
                back: function () {
                    cmp.setValue(1);
                    Ext.mainWin.pop();
                },
                fn: function () {
                    YZSoft.Ajax.request({
                        url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
                        params: {
                            method: 'CloseScreenLock'
                        },
                        success: function (action) {
                            YZSoft.LoginUser.ScreenLock = false;
                            Ext.mainWin.pop();
                        },
                        failure: function (action) {
                            Ext.Msg.alert(RS.$('All__Title_OperationFailed'), action.result.errorMessage);
                        }
                    });
                }
            });

            Ext.mainWin.push(pnl);
        }
        else {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
                params: {
                    method: 'OpenScreenLock'
                },
                success: function (action) {
                    YZSoft.LoginUser.ScreenLock = true;
                },
                failure: function (action) {
                    Ext.Msg.alert(RS.$('All__Title_OperationFailed'), action.result.errorMessage);
                }
            });
        }
    },

    onTouchUnlockChange: function (cmp, thumb, newvalue, oldValue) {
        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
            params: {
                method: 'SetTouchUnlock',
                value: newvalue
            },
            success: function (action) {
                YZSoft.LoginUser.TouchUnlock = !!newvalue;
            },
            failure: function (action) {
                Ext.Msg.alert(RS.$('All__Title_OperationFailed'), action.result.errorMessage);
            }
        });
    },

    loadForm: function () {
        var me = this;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Org.ashx'),
            params: {
                method: 'GetUserCommonInfo'
            },
            success: function (action) {
                me.togScreenLock.setValue(action.result.ScreenLock);
                me.togTouchUnlock.setValue(action.result.TouchUnlock);
                YZSoft.LoginUser.TouchUnlock = action.result.TouchUnlock;
            }
        });
    }
});
