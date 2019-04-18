
Ext.define('YZSoft.request.forms.Outside', {
    extend: 'Ext.form.Panel',
    config: {
        cls: ['yz-form']
    },

    constructor: function (config) {
        var me = this,
            task = config && config.formInfo && config.formInfo.task,
            cfg, leavingTypes;

        cfg = {
            defaults: {
                padding: '0',
                defaults: {
                    labelWidth: 80
                }
            },
            items: [{
                xtype: 'fieldset',
                hidden: !task,
                items: [{
                    xclass: 'YZSoft.form.FormHeader',
                    padding: '16 10 10 16',
                    task: task
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xtype: 'textfield',
                    label: RS.$('Outside_Type'),
                    xdatabind: 'iDemoOutside.Type'
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xclass: 'YZSoft.src.field.TimePicker',
                    label: RS.$('All__StartTime'),
                    xdatabind: 'iDemoOutside.From',
                    cls: 'yz-field-valuealign-right',
                    value: Ext.Date.add(Ext.Date.clearTime(new Date()), Ext.Date.HOUR, 8),
                    picker: {
                        minuteScale: 15
                    }
                }, {
                    xclass: 'YZSoft.src.field.TimePicker',
                    label: RS.$('All__EndTime'),
                    xdatabind: 'iDemoOutside.To',
                    cls: 'yz-field-valuealign-right',
                    value: Ext.Date.add(Ext.Date.clearTime(new Date()), Ext.Date.HOUR, 18),
                    picker: {
                        minuteScale: 15
                    }
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xtype: 'numberfield',
                    label: RS.$('Outside_Days'),
                    xdatabind: 'iDemoOutside.Days'
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xtype: 'textareafield',
                    padding: '10 0',
                    label: RS.$('Outside_Reason'),
                    xdatabind: 'iDemoOutside.Comments',
                    maxRows: 5
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xclass: 'YZSoft.src.field.ImageAttachment',
                    xdatabind: 'iDemoOutside.Attachments'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    $validate: function (args) {
        var me = this,
            formInfo = args.formInfo,
            formData = args.formData,
            validationGroup = args.validationGroup,
            iDemoOutside = formData['iDemoOutside'];

//        if (Ext.isEmpty(iDemoOutside[0].Days))
//            return RS.$('Leaving_EnterDays');
    }
});