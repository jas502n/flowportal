
Ext.define('YZSoft.personal.security.lock.ValidatePassword', {
    extend: 'Ext.Container',
    config: {
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

        me.pnlPassword = Ext.create('YZSoft.personal.security.lock.PasswordContainer', {
            caption: RS.$('All_ScreenLock_EnterPassword'),
            flex: 1
        });

        me.pnlPassword.edtPassword.on({
            fullinputed: function (password) {
                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
                    params: {
                        Method: 'ValidateScreenLockPassword',
                        password: password
                    },
                    success: function (action) {
                        if (!action.result) {
                            me.pnlPassword.edtPassword.element.shake({
                                direction: 'x',
                                shakes: 3,
                                excitement: 1,
                                duration: 30,
                                callback: function () {
                                    me.pnlPassword.edtPassword.clear();
                                }
                            });

                            return;
                        }

                        if (me.config.fn)
                            me.config.fn.call(me.scope || me, me);
                    },
                    failure: function (action) {
                        Ext.Msg.alert(RS.$('All__Title_ValidationFailed'), action.result.errorMessage);
                    }
                });
            }
        });

        me.keyboard = Ext.create('YZSoft.src.panel.SoftKeyboardTel', {
        });

        me.pnlPassword.edtPassword.relayEvents(me.keyboard, ['keyclick']);

        cfg = {
            items: [me.titleBar, me.pnlPassword, me.keyboard]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});