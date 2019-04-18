
Ext.define('YZSoft.personal.setting.OutOfOffice', {
    extend: 'Ext.form.Panel',
    config: {
        style: 'background-color:#f0f3f5;',
        scrollable: null,
        layout: {
            type: 'vbox',
            slign: 'stretch'
        },
        cls: ['yz-form', 'yz-form-dark']
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

        me.btnSave = Ext.create('Ext.Button', {
            text: RS.$('All__Save'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
            handler: function () {
                me.save();
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnSave]
        });

        cfg = {
            items: [me.titleBar, {
                xclass: 'Ext.form.FieldSet',
                margin: '10 0 0 0',
                padding: 0,
                defaults: {
                    labelWidth: '60%',
                    xtype: 'radiofield',
                    name: 'state',
                    listeners: {
                        scope: this,
                        check: function () {
                            var vs = me.getValues();
                            me.getComponent('dateFieldset').setDisabled(vs.state != 'Period');
                        }
                    }
                },
                items: [{
                    value: 'InOffice',
                    label: RS.$('All_OutOfOffice_StatusInOffice')
                }, {
                    value: 'Out',
                    label: RS.$('All_OutOfOffice_StatusOut')
                }, {
                    value: 'Period',
                    label: RS.$('All_OutOfOffice_StatusPeriod')
                }]
            }, {
                xtype: 'component',
                padding: '15 15 10 15',
                tpl: [
                    '<div class="yz-comments yz-comments-size-m">{text}</div>',
                ],
                data: {
                    text:RS.$('All_OutOfOffice_Period')
                }
            }, {
                id: 'dateFieldset',
                xclass: 'Ext.form.FieldSet',
                margin: 0,
                padding: 0,
                defaults: {
                    xclass: 'YZSoft.src.field.TimePicker',
                    cls:['yz-field-valuealign-right'],
                    labelWidth: '30%',
                    picker: {
                        minuteScale: 15
                    }
                },
                items: [{
                    name: 'DateFrom',
                    label: RS.$('All_OutOfOffice_StartDate')
                }, {
                    name: 'DateTo',
                    label: RS.$('All_OutOfOffice_EndDate')
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.loadForm();
    },

    loadForm: function () {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/User.ashx'),
            params: {
                Method: 'GetOutOfOffice'
            },
            success: function (action) {
                me.setValues(action.result);
            },
            failure: function (action) {
            }
        });
    },

    save: function (args) {
        var me = this,
            vs = me.getValues();

        if (vs.state == 'Period') {
            if (!vs.DateFrom) {
                Ext.Msg.alert(RS.$('All__Title_Information'), RS.$('All_OutOfOffice_ValidateStartDate'));
                return;
            }

            if (!vs.DateTo) {
                Ext.Msg.alert(RS.$('All__Title_Information'), RS.$('All_OutOfOffice_ValidateEndDate'));
                return;
            }

            if (vs.DateTo <= vs.DateFrom) {
                Ext.Msg.alert(RS.$('All__Title_Information'), RS.$('All_OutOfOffice_ValidateEndLTStart'));
                return;
            }
        }

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/User.ashx'),
            params: Ext.apply({
                Method: 'SetOutOfOffice'
            },vs),
            waitMsg: {
                message: RS.$('All__Saving'),
                autoClose: false
            },
            delay: true,
            success: function (action) {
                Ext.Viewport.mask({
                    cls: 'yz-mask-success',
                    message: RS.$('All__Saving_Mask_Succeed'),
                    delay: true,
                    fn: function () {
                        if (me.config.fn)
                            me.config.fn.call(me.scope || me, me);
                    }
                });
            },
            failure: function (action) {
                Ext.Msg.alert(RS.$('All__MsgTitleFailed'), Ext.String.format(RS.$('All_OutOfOffice_SaveFailed'), rv.errorMessage | ''));
            }
        });
    }
});