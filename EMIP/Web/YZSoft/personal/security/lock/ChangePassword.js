
Ext.define('YZSoft.personal.security.lock.ChangePassword', {
    extend: 'Ext.Container',
    config: {
        successMask: null,
        style: 'background-color:#f0f3f5;',
        layout: {
            type: 'vbox',
            align: 'stretch'
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

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

        me.pnl1 = Ext.create('YZSoft.personal.security.lock.PasswordContainer', {
            caption: RS.$('All_ScreenLock_EnterOrgPassword')
        });

        me.pnl1.edtPassword.on({
            fullinputed: function (password) {
                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
                    params: {
                        Method: 'ValidateScreenLockPassword',
                        password: password
                    },
                    success: function (action) {
                        if (!action.result) {
                            me.pnl1.edtPassword.element.shake({
                                direction: 'x',
                                shakes: 3,
                                excitement: 1,
                                duration: 30,
                                callback: function () {
                                    me.pnl1.edtPassword.clear();
                                }
                            });

                            return;
                        }

                        me.showPanel2(password);
                    },
                    failure: function (action) {
                        Ext.Msg.alert(RS.$('All__Title_ValidationFailed'), action.result.errorMessage);
                    }
                });
            }
        });

        me.navView = Ext.create('Ext.navigation.View', {
            flex: 1,
            navigationBar: false,
            layout: {
                animation: {
                    duration: 300,
                    easing: 'ease-out',
                    type: 'slide',
                    direction: 'left'
                }
            },
            items: [me.pnl1]
        });

        me.keyboard = Ext.create('YZSoft.src.panel.SoftKeyboardTel', {
            listeners: {
                keyclick: function (keycode) {
                    me.navView.getActiveItem().edtPassword.fireEvent('keyclick', keycode);
                }
            }
        });

        cfg = {
            items: [me.titleBar, me.navView, me.keyboard]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    showPanel2: function (password) {
        var me = this;

        me.pnl2 = Ext.create('YZSoft.personal.security.lock.PasswordContainer', {
            caption: RS.$('All_ScreenLock_EnterNewPassword')
        });

        me.pnl2.edtPassword.on({
            fullinputed: function (newpassword1) {
                me.showPanel3(password, newpassword1);
            }
        });

        me.navView.push(me.pnl2);
    },

    showPanel3: function (password, newpassword1) {
        var me = this;

        me.pnl3 = Ext.create('YZSoft.personal.security.lock.PasswordContainer', {
            caption: RS.$('All_ScreenLock_ConfirmNewPassword')
        });

        me.pnl3.edtPassword.on({
            fullinputed: function (newpassword2) {
                if (newpassword2 != newpassword1) {
                    me.pnl2.edtPassword.clear();
                    me.pnl2.setErrorMessage(RS.$('All_ScreenLock_NewPasswordNotMatch'));
                    me.navView.pop();
                    return;
                }

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
                    params: {
                        Method: 'ChangeScreenLockPassword',
                        oldPassword: password,
                        newPassword: newpassword2
                    },
                    waitMsg: {
                        message: RS.$('All_ScreenLock_ChangePassword_Mask'),
                        autoClose: false
                    },
                    delay: true,
                    success: function (action) {
                        Ext.Viewport.mask(Ext.apply({
                            cls: 'yz-mask-success',
                            message: RS.$('All_ScreenLock_ChangePassword_Mask_Success'),
                            delay: true,
                            fn: function () {
                                if (me.config.fn)
                                    me.config.fn.call(me.scope || me, me);
                            }
                        }, me.getSuccessMask()));
                    },
                    failure: function (action) {
                        Ext.Msg.alert(RS.$('All_ScreenLock_ChangePassword_Title_Failed'), action.result.errorMessage);
                    }
                });
            }
        });

        me.navView.push(me.pnl3);
    }
});