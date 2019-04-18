
Ext.define('YZSoft.src.panel.PasswordValidate', {
    extend: 'Ext.Panel',

    config: {
        title: null,
        message: null,
        cls: ['yz-msgbox', 'yz-msgbox-pwdvalidate'],
        modal: true,
        centered: true,
        width: 260
    },

    constructor: function (config) {
        var me = this;

        me.edtPassword = Ext.create('Ext.field.Password', {
            cls: 'yz-field-rect'
        });

        me.btnOK = Ext.create('Ext.Button', {
            text: RS.$('All__OK'),
            cls: 'yz-button-flat yz-button-dlg-default',
            flex: 1,
            handler: function () {
                var password = me.edtPassword.getValue();

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Auth.ashx'),
                    params: {
                        Method: 'ValidateCurrentUserPassword',
                        password: password
                    },
                    waitMsg: {
                        message: RS.$('All__Validation_Mask'),
                        transparent:true,
                        autoClose: true,
                        target:me
                    },
                    delay: true,
                    success: function (action) {
                        var pass = action.result.pass;

                        if (!pass) {
                            Ext.Msg.alert(null, RS.$('All__PasswordValidate_FailMessage'));
                            return;
                        }

                        if (me.config.fn)
                            me.config.fn.call(me.scope || me, me, password);
                    },
                    failure: function (action) {
                        Ext.Msg.alert(RS.$('All__Title_ValidationFailed'), action.result.errorMessage);
                    }
                });
            }
        });

        me.btnCancel = Ext.create('Ext.Button', {
            text: RS.$('All__Cancel'),
            cls: 'yz-button-flat yz-button-dlg-normal',
            flex: 1,
            handler: function () {
                me.hide();
            }
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'component',
                tpl: [
                    '<div class="yz-align-hvcenter yz-title">{title}</div>'
                ],
                data: {
                    title: config.title || ''
                }
            }, {
                xtype: 'component',
                tpl: [
                    '<div class="yz-align-hvcenter yz-message">{message}</div>'
                ],
                data: {
                    message: config.message || ''
                }
            }, me.edtPassword, {
                docked: 'bottom',
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [me.btnCancel, { xtype: 'spacer', width: 20 }, me.btnOK]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});