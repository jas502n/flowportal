
Ext.define('YZSoft.personal.security.bind.PhoneNumber', {
    extend: 'Ext.Container',
    config: {
        style: 'background-color:#f0f3f5;',
        iddCode:null,
        phoneNumber:null,
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

        me.btnCancel = Ext.create('Ext.Button', {
            text: RS.$('All__Cancel'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.cancel)
                    me.config.cancel.call(me.scope || me, me);
            }
        });

        me.btnNext = Ext.create('Ext.Button', {
            text: RS.$('All__NextStep'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
            scope: me,
            handler: 'onNextClick'
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnCancel, me.btnNext]
        });

        me.selCountry = Ext.create('YZSoft.src.field.CountryPicker', {
            label: RS.$('All__Country'),
            value: '86',
            listeners: {
                change: function (field, value) {
                    me.edtPhoneNumber.setLabel('+' + value);
                    me.updateStatus();
                }
            }
        });

        me.edtPhoneNumber = Ext.create('Ext.field.Text', {
            component: {
                type: 'tel'
            },
            label: '+86',
            placeHolder: RS.$('All__PhoneNumber'),
            listeners: {
                scope: me,
                keyup: 'updateStatus',
                change: 'updateStatus'
            }
        });

        cfg = {
            defaults: {
            },
            items: [me.titleBar, {
                xtype: 'component',
                padding: '20 15 7 15',
                hidden: !config.phoneNumber,
                tpl: [
                    '<div class="yz-comments yz-comments-size-m yz-align-hcenter yz-textalign-center">{title}</div>',
                ],
                data: {
                    title: Ext.String.format(RS.$('All_Bind_NewPhone_Desc_FMT'), config.phoneNumber)
                }
            },{
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-form', 'yz-form-dark'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.selCountry, me.edtPhoneNumber]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();

        Ext.mainWin.getActiveItem().on({
            single: true,
            hide: function () {
                Ext.defer(function () {
                    if (!Ext.os.is.iOS)
                        me.edtPhoneNumber.focus();
                }, 10);
            }
        });
    },

    onNextClick: function () {
        var me = this,
            iddcodeOrg = me.getIddCode(),
            phoneNumberOrg = me.getPhoneNumber(),
            iddcodeNew = me.selCountry.getValue(),
            phoneNumberNew = me.edtPhoneNumber.getValue(),
            iddcodeSend = phoneNumberOrg ? iddcodeOrg : iddcodeNew,
            phoneNumberSend = phoneNumberOrg ? phoneNumberOrg : phoneNumberNew,
            pnl;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
            params: {
                Method: 'SendValidationCode',
                iddcode: iddcodeSend,
                phoneNumber: phoneNumberSend
            },
            waitMsg: {
                message: RS.$('All_Bind_SendValidationCode_Mask'),
                autoClose: false
            },
            delay: true,
            success: function (action) {
                Ext.Viewport.mask({
                    cls: 'yz-mask-success',
                    message: RS.$('All_Bind_SendValidationCode_Mask_Success'),
                    delay: true,
                    fn: function () {
                        if (me.config.fn) {
                            me.config.fn.call(me.scope || me, me, {
                                iddcode: iddcodeNew,
                                phoneNumber: phoneNumberNew,
                                validateItemGUID: action.result.ItemGUID
                            });
                        }
                    }
                });
            },
            failure: function (action) {
                Ext.Msg.alert(RS.$('All_Bind_SendValidationCode_Title_Failed'), action.result.errorMessage);
            }
        });
    },

    updateStatus: function () {
        var me = this,
            iddcode = me.selCountry.getValue(),
            tel = me.edtPhoneNumber.getValue();

        me.btnNext.setDisabled(!iddcode || !tel);
    }
});
