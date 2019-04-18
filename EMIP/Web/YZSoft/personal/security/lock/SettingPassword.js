
Ext.define('YZSoft.personal.security.lock.SettingPassword', {
    extend: 'Ext.Container',
    config: {
        successMask:null,
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
            caption: RS.$('All_ScreenLock_EnterPassword')
        });

        me.pnl1.edtPassword.on({
            fullinputed: function (password1) {
                me.pnl2 = Ext.create('YZSoft.personal.security.lock.PasswordContainer', {
                    caption: RS.$('All_ScreenLock_EnterPasswordAgain')
                });

                me.pnl2.edtPassword.on({
                    fullinputed: function (password2) {
                        if (password2 != password1) {
                            me.pnl1.edtPassword.clear();
                            me.pnl1.setErrorMessage(RS.$('All_ScreenLock_NewPasswordNotMatch'));
                            me.navView.pop();
                            return;
                        }

                        YZSoft.Ajax.request({
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
                            params: {
                                Method: 'InitScreenLock',
                                password: password2
                            },
                            waitMsg: {
                                message: RS.$('All_ScreenLock_SetPassword_Mask'),
                                autoClose: false
                            },
                            delay: true,
                            success: function (action) {
                                YZSoft.LoginUser.ScreenLock = true;

                                Ext.Viewport.mask(Ext.apply({
                                    cls: 'yz-mask-success',
                                    message: RS.$('All_ScreenLock_SetPassword_Success'),
                                    delay: true,
                                    fn: function () {
                                        if (me.config.fn)
                                            me.config.fn.call(me.scope || me, me);
                                    }
                                }, me.getSuccessMask()));
                            },
                            failure: function (action) {
                                Ext.Msg.alert(RS.$('All_ScreenLock_SetPassword_Title_Failed'), action.result.errorMessage);
                            }
                        });
                    }
                });

                me.navView.push(me.pnl2);
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
    }
});