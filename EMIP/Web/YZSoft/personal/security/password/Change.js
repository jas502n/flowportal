
Ext.define('YZSoft.personal.security.password.Change', {
    extend: 'Ext.Container',
    config: {
        orgPassword:null,
        successMask:null,
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

        me.btnSubmit = Ext.create('Ext.Button', {
            text: RS.$('All__Finished'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
            scope: me,
            handler: 'onSubmitClick'
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnSubmit]
        });

        me.edtPassword = Ext.create('Ext.field.Password', {
            placeHolder: RS.$('All_ChangePassword_PlaceHolder_EnterNewPassword')
        });

        me.edtCfm = Ext.create('Ext.field.Password', {
            placeHolder: RS.$('All_ChangePassword_PlaceHolder_ConfirmNewPassword')
        });

        cfg = {
            items: [me.titleBar, {
                xtype: 'component',
                padding: '15 15 15 10',
                tpl: [
                    '<div class="yz-comments yz-align-hcenter yz-textalign-center">{message}</div>',
                ],
                data: {
                    message: Ext.String.format(RS.$('All_ChangePasword_Message'), RS.$('All__MobileAppName'))
                }
            }, {
                xtype: 'container',
                cls: ['yz-form', 'yz-form-dark'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.edtPassword, me.edtCfm]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onSubmitClick: function () {
        var me = this,
            pwd = me.edtPassword.getValue() || '',
            pwdCfm = me.edtCfm.getValue() || '';

        if (pwd != pwdCfm) {
            Ext.Msg.alert(null, RS.$('All_ChangePasword_NewPasswordNotMatch'));
            return;
        }

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Auth.ashx'),
            params: {
                Method: 'ChangePassword',
                orgPassword: me.getOrgPassword(),
                newPassword: pwd
            },
            waitMsg: {
                message: RS.$('All_ChangePasword_Mask'),
                autoClose: false
            },
            delay: true,
            success: function (action) {
                Ext.Viewport.mask(Ext.apply({
                    cls: 'yz-mask-success',
                    message: RS.$('All_ChangePasword_Mask_Success'),
                    delay: true,
                    fn: function () {
                        if (me.config.fn)
                            me.config.fn.call(me.scope || me, me);
                    }
                },me.getSuccessMask()));
            },
            failure: function (action) {
                Ext.Msg.alert(RS.$('All_ChangePassword_Title_Failed'), action.result.errorMessage);
            }
        });
    }
});
