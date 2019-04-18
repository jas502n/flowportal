Ext.define('YZSoft.personal.security.SecurityMainPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.button.ListButton'
    ],
    config: {
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

        me.btnProtect = Ext.create('YZSoft.src.button.ListButton', {
            iconGoCls: ['yz-glyph', 'yz-account-protect', 'yz-account-protected'],
            text: RS.$('All_Security_Bind'),
            desc: RS.$('All_Bind_Disabled'),
            handler: function () {
                var userCommonInfo = me.userCommonInfo;

                if (!userCommonInfo)
                    return;

                if (userCommonInfo.PhoneBindNumber) {
                    var pnl = Ext.create('YZSoft.personal.security.protect.ProtectPanel', {
                        title: RS.$('All_Bind_Final_Title'),
                        togProtectConfig: {
                            value: userCommonInfo.AppLoginProtect
                        },
                        back: function () {
                            Ext.mainWin.pop();
                        }
                    });
                    Ext.mainWin.push(pnl);
                }
                else {
                    var welcomePanel, phoneNumberPanel, validatePanel, protectPanel;

                    welcomePanel = Ext.create('YZSoft.personal.security.bind.BindWelcome', {
                        title: RS.$('All_Bind_Welcome_Title'),
                        cancel: function () {
                            Ext.mainWin.pop();
                        },
                        fn: function () {
                            phoneNumberPanel = Ext.create('YZSoft.personal.security.bind.PhoneNumber', {
                                title: RS.$('All_Bind_Welcome_Title'),
                                cancel: function (pnl) {
                                    Ext.mainWin.pop(2);
                                },
                                fn: function (pnl, data) {
                                    validatePanel = Ext.create('YZSoft.personal.security.bind.SMSValidate', {
                                        title: RS.$('All_Bind_Validation_Title'),
                                        iddcode: data.iddcode,
                                        phoneNumber: data.phoneNumber,
                                        validateItemGUID: data.validateItemGUID,
                                        validationExtAction: 'bindandprotect',
                                        cancel: function () {
                                            Ext.mainWin.pop(3);
                                        },
                                        fn: function () {
                                            protectPanel = Ext.create('YZSoft.personal.security.protect.ProtectPanel', {
                                                title: RS.$('All_Bind_Final_Title'),
                                                togProtectConfig: {
                                                    value: true
                                                },
                                                back: function () {
                                                    Ext.mainWin.pop(4);
                                                }
                                            });

                                            Ext.mainWin.push(protectPanel);
                                        }
                                    });

                                    Ext.mainWin.push(validatePanel);
                                }
                            });

                            Ext.mainWin.push(phoneNumberPanel);
                        }
                    });
                    Ext.mainWin.push(welcomePanel);
                }
            }
        });

        me.btnBind = Ext.create('YZSoft.src.button.ListButton', {
            bborder: true,
            iconGoCls: 'yz-glyph yz-glyph-e904',
            text: RS.$('All_Security_ChangeBindPhone'),
            handler: function () {
                var userCommonInfo = me.userCommonInfo;

                if (!userCommonInfo)
                    return;

                if (userCommonInfo.PhoneBindNumber) {
                    var welcomePanel, phoneNumberPanel, validatePanel;
                    welcomePanel = Ext.create('YZSoft.personal.security.bind.ChangeWelcome', {
                        title: RS.$('All_Bind_Change_Title'),
                        phoneNumber: userCommonInfo.PhoneBindNumber,
                        back: function () {
                            Ext.mainWin.pop();
                        },
                        fn: function () {
                            phoneNumberPanel = Ext.create('YZSoft.personal.security.bind.PhoneNumber', {
                                title: RS.$('All_Bind_NewPhone_Title'),
                                iddCode: userCommonInfo.PhoneBindIDDCode,
                                phoneNumber: userCommonInfo.PhoneBindNumber,
                                cancel: function () {
                                    Ext.mainWin.pop(2);
                                },
                                fn: function (pnl, data) {
                                    validatePanel = Ext.create('YZSoft.personal.security.bind.SMSValidate', {
                                        title: RS.$('All_Bind_Validation_Title'),
                                        vcodeSendtoPhoneNumber: userCommonInfo.PhoneBindNumber,
                                        iddcode: data.iddcode,
                                        phoneNumber: data.phoneNumber,
                                        validateItemGUID: data.validateItemGUID,
                                        validationExtAction: 'changebind',
                                        successMask: {
                                            message: RS.$('All_Bind_ChangedPhone_Mask_Success'),
                                            delay: 800
                                        },
                                        cancel: function () {
                                            Ext.mainWin.pop(3);
                                        },
                                        fn: function () {
                                            Ext.mainWin.pop(3);
                                        }
                                    });

                                    Ext.mainWin.push(validatePanel);
                                }
                            });

                            Ext.mainWin.push(phoneNumberPanel);
                        }
                    });
                    Ext.mainWin.push(welcomePanel);
                }
                else {
                    var welcomePanel, phoneNumberPanel, validatePanel;

                    welcomePanel = Ext.create('YZSoft.personal.security.bind.BindWelcome', {
                        title: RS.$('All_Bind_Welcome_Title'),
                        promptText: RS.$('All_Bind_Welcome_BindValue'),
                        cancel: function () {
                            Ext.mainWin.pop();
                        },
                        fn: function () {
                            phoneNumberPanel = Ext.create('YZSoft.personal.security.bind.PhoneNumber', {
                                title: RS.$('All_Bind_Welcome_Title'),
                                cancel: function (pnl) {
                                    Ext.mainWin.pop(2);
                                },
                                fn: function (pnl, data) {
                                    validatePanel = Ext.create('YZSoft.personal.security.bind.SMSValidate', {
                                        title: RS.$('All_Bind_Validation_Title'),
                                        iddcode: data.iddcode,
                                        phoneNumber: data.phoneNumber,
                                        validateItemGUID: data.validateItemGUID,
                                        validationExtAction: 'bindandprotect',
                                        successMask: {
                                            message: RS.$('All_Bind_Mask_Success'),
                                            delay: 800
                                        },
                                        cancel: function () {
                                            Ext.mainWin.pop(3);
                                        },
                                        fn: function () {
                                            Ext.mainWin.pop(3);
                                        }
                                    });

                                    Ext.mainWin.push(validatePanel);
                                }
                            });

                            Ext.mainWin.push(phoneNumberPanel);
                        }
                    });
                    Ext.mainWin.push(welcomePanel);
                }
            }
        });

        me.btnChangePassword = Ext.create('YZSoft.src.button.ListButton', {
            iconGoCls: 'yz-glyph yz-glyph-e904',
            text: RS.$('All_Security_SignInPassword'),
            handler: function () {
                var dlg = Ext.create('YZSoft.src.panel.PasswordValidate', {
                    title: RS.$('All_ChangePassword_Validate_Title'),
                    message: Ext.String.format(RS.$('All_ChangePassword_Validate_Message_FMT'), RS.$('All__MobileAppName')),
                    fn: function (pnl, password) {
                        dlg.hide();

                        var changePanel = Ext.create('YZSoft.personal.security.password.Change', {
                            title: RS.$('All_ChangePassword_Change_Title'),
                            orgPassword: password,
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
                        Ext.mainWin.push(changePanel);
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

        me.btnScreenLock = Ext.create('YZSoft.src.button.ListButton', {
            iconGoCls: 'yz-glyph yz-glyph-e904',
            text: RS.$('All_Security_ScreenLock'),
            desc: RS.$('All_ScreenLock_Off'),
            handler: function () {
                var userCommonInfo = me.userCommonInfo;

                if (!userCommonInfo)
                    return;

                if (userCommonInfo.ScreenLockPassword) {
                    var pnl = Ext.create('YZSoft.personal.security.lock.LockMainPanel', {
                        title: RS.$('All_ScreenLockPanel_Title'),
                        togProtectConfig: {
                            value: userCommonInfo.ScreenLock
                        },
                        togTouchUnlockConfig: {
                            value: userCommonInfo.TouchUnlock
                        },
                        back: function () {
                            Ext.mainWin.pop();
                        }
                    });

                    Ext.mainWin.push(pnl);
                }
                else {
                    var settingPwdPanel, lockMainPanel;

                    settingPwdPanel = Ext.create('YZSoft.personal.security.lock.SettingPassword', {
                        title: RS.$('All_ScreenLock_SettingPassword_Title'),
                        back: function () {
                            Ext.mainWin.pop();
                        },
                        fn: function () {
                            lockMainPanel = Ext.create('YZSoft.personal.security.lock.LockMainPanel', {
                                title: RS.$('All_ScreenLockPanel_Title'),
                                togProtectConfig: {
                                    value: true
                                },
                                togTouchUnlockConfig: {
                                    value: true
                                },
                                back: function () {
                                    Ext.mainWin.pop(2);
                                }
                            });

                            Ext.mainWin.push(lockMainPanel);
                        }
                    });

                    Ext.mainWin.push(settingPwdPanel);
                }
            }
        });

        cfg = {
            defaults: {
                defaults: {
                    padding: '11 10 11 15'
                }
            },
            items: [me.titleBar, {
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-container-border-top', 'yz-container-border-bottom', 'yz-list-button-container-left15'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.btnProtect]
            }, {
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-container-border-top', 'yz-container-border-bottom', 'yz-list-button-container-left15'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.btnBind, me.btnChangePassword]
            }, {
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-container-border-top', 'yz-container-border-bottom', 'yz-list-button-container-left15'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.btnScreenLock]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            show: function () {
                me.loadForm();
            }
        });
    },

    loadForm: function () {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Org.ashx'),
            params: {
                method: 'GetUserCommonInfo'
            },
            success: function (action) {
                var protect = action.result.AppLoginProtect,
                    phoneNumber = action.result.PhoneBindNumber,
                    screenlock = action.result.ScreenLock && action.result.ScreenLockPassword;

                me.userCommonInfo = action.result;
                me.btnProtect.iconGoElement[protect ? 'addCls' : 'removeCls']('yz-account-protected');
                me.btnProtect.setDesc(protect ? RS.$('All_Bind_Enabled') : RS.$('All_Bind_Disabled'));
                me.btnBind.setText(phoneNumber ? RS.$('All_Security_ChangeBindPhone') : RS.$('All_Security_BindPhone'));
                me.btnScreenLock.setDesc(screenlock ? RS.$('All_ScreenLock_On') : RS.$('All_ScreenLock_Off'));
            }
        });
    }
});
