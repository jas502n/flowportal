
Ext.define('YZSoft.request.forms.Leaving', {
    extend: 'YZSoft.form.Form',

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
                    xclass: 'YZSoft.form.field.Select',
                    label: RS.$('Leaving_Type'),
                    xdatabind: 'iDemoLeaving.LeaveType',
                    cls: 'yz-field-valuealign-right',
                    datasource: {
                        tableName: 'YZMDLeavingType',
                        orderBy: 'OrderIndex'
                    },
                    valueField: 'TypeCode',
                    displayField: 'Name'
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xclass: 'YZSoft.form.aspx.field.TimePicker',
                    label: RS.$('All__StartTime'),
                    xdatabind: 'iDemoLeaving.LeaveFrom',
                    cls: 'yz-field-valuealign-right',
                    value: Ext.Date.add(Ext.Date.clearTime(new Date()), Ext.Date.HOUR, 8),
                    picker: {
                        minuteScale: 15
                    }
                }, {
                    xclass: 'YZSoft.form.aspx.field.TimePicker',
                    label: RS.$('All__EndTime'),
                    xdatabind: 'iDemoLeaving.LeaveTo',
                    cls: 'yz-field-valuealign-right',
                    value: Ext.Date.add(Ext.Date.clearTime(new Date()), Ext.Date.HOUR, 18),
                    picker: {
                        minuteScale: 15
                    }
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xclass: 'YZSoft.form.field.Text',
                    label: RS.$('Leaving_Days'),
                    xdatabind: 'iDemoLeaving.Days',
                    $validators: [{
                        xclass: 'YZSoft.form.validator.Required',
                        //validationGroup: null,
                        disableExpress: 'iDemoLeaving.LeaveType=="Sick"',
                        errorMessage: RS.$('Leaving_EnterDays')
                    }]
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xclass: 'YZSoft.form.field.TextArea',
                    padding: '10 0',
                    label: RS.$('Leaving_Reason'),
                    xdatabind: 'iDemoLeaving.Comments',
                    maxRows: 5
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xclass: 'YZSoft.form.field.ImageAttachment',
                    xdatabind: 'iDemoLeaving.Attachments'
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
            iDemoLeaving = formData['iDemoLeaving'];

        //if (Ext.isEmpty(iDemoLeaving[0].Days) &&
        //    Ext.isEmpty(iDemoLeaving[0].DAYS))  //Oracle
        //    return RS.$('Leaving_EnterDays');

        return me.callParent(arguments);
    }
});