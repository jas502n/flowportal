
Ext.define('YZSoft.personal.security.bind.SMSValidate', {
    extend: 'Ext.Container',
    config: {
        vcodeSendtoPhoneNumber:null,
        iddcode: null,
        phoneNumber: null,
        validateItemGUID: null,
        validationExtAction: null,
        waitMask: null,
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
        config = config || {};

        var me = this,
            vcodeSendtoPhoneNumber = config.vcodeSendtoPhoneNumber,
            cfg,message;

        message = vcodeSendtoPhoneNumber ? Ext.String.format(RS.$('All_Bind_Validation_Desc_FMT'),vcodeSendtoPhoneNumber) : RS.$('All_Bind_Validation_Desc');

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

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnCancel]
        });

        me.edtValidate = Ext.create('Ext.field.Text', {
            component: {
                type: 'tel'
            },
            label: RS.$('All_Bind_ValidationCode'),
            placeHolder: RS.$('All_Bind_Validation_PlaceHolder'),
            maxLength: 6,
            listeners: {
                scope: me,
                keyup: 'updateStatus',
                change: 'updateStatus'
            }
        });

        me.btnValidate = Ext.create('Ext.Button', {
            margin: '25 10 0 10',
            cls: ['yz-button-flat', 'yz-button-sumbit'],
            text: RS.$('All__OK'),
            scope: me,
            handler: 'onValidate'
        });

        cfg = {
            defaults: {
            },
            items: [me.titleBar, {
                xtype: 'component',
                padding: '25 15',
                tpl: [
                    '<div class="yz-comments yz-comments-size-m yz-align-hcenter">{message}</div>',
                ],
                data: {
                    message: message
                }
            }, {
                xtype: 'container',
                cls: ['yz-form', 'yz-form-readonly-gray'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'textfield',
                    label: RS.$('All_Bind_PhoneNumber'),
                    readOnly: true,
                    value: Ext.String.format('+{0} {1}', config.iddcode, me.formatTel(config.phoneNumber))
                }, me.edtValidate]
            }, me.btnValidate]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateStatus();

        Ext.mainWin.getActiveItem().on({
            single: true,
            hide: function () {
                Ext.defer(function () {
                    if (!Ext.os.is.iOS)
                        me.edtValidate.focus();
                }, 10);
            }
        });
    },

    formatTel: function (phoneNumber) {
        phoneNumber = (phoneNumber || '').toString();

        if (phoneNumber.length > 4)
            return this.formatTel(phoneNumber.substring(0, phoneNumber.length - 4)) + ' ' + phoneNumber.substring(phoneNumber.length - 4);

        return phoneNumber;
    },

    onValidate: function () {
        var me = this,
            validateItemGUID = me.getValidateItemGUID(),
            validationExtAction = me.getValidationExtAction() || '',
            validateCode = (me.edtValidate.getValue() || '').toString();

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
            params: {
                Method: 'SMSValidation',
                validateItemGUID: validateItemGUID,
                validateCode: validateCode,
                action: validationExtAction,
                iddcode: me.getIddcode(),
                phoneNumber: me.getPhoneNumber()
            },
            waitMsg: Ext.apply({
                message: RS.$('All_Bind_Validation_Mask'),
                autoClose: false
            }, me.getWaitMask()),
            delay: true,
            success: function (action) {
                Ext.Viewport.mask(Ext.apply({
                    cls: 'yz-mask-success',
                    message: RS.$('All_Bind_Validation_Mask_Success'),
                    delay: true,
                    fn: function () {
                        if (me.config.fn)
                            me.config.fn.call(me.scope || me, me);
                    }
                }, me.getSuccessMask()));
            },
            failure: function (action) {
                Ext.Msg.alert(RS.$('All__Title_ValidationFailed'), action.result.errorMessage);
            }
        });
    },

    updateStatus: function () {
        var me = this,
            validateCode = (me.edtValidate.getValue() || '').toString();

        me.btnValidate.setDisabled(validateCode.length != 6);
    }
});
