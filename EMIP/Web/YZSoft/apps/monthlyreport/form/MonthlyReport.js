
Ext.define('YZSoft.apps.monthlyreport.form.MonthlyReport', {
    extend: 'Ext.form.Panel',
    config: {
        date: null,
        cls: ['yz-form']
    },

    constructor: function (config) {
        var me = this,
            task = config && config.formInfo && config.formInfo.task,
            cfg, leavingTypes;

        config = config || {};

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
                    xclass: 'YZSoft.src.field.MonthPicker',
                    label: RS.$('All__MonthNo'),
                    dateFormat:RS.$('All__DataFMT_MonthInYear'),
                    readOnly: true,
                    xdatabind: 'iMonthlyReport.Date',
                    cls: ['yz-field-valuealign-right', 'yz-field-notrigger'],
                    value: Ext.Date.clearTime(config.date || new Date())
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xtype: 'textareafield',
                    label: RS.$('MonthlyReport_Done'),
                    labelAlign: 'top',
                    padding: '3 0',
                    xdatabind: 'iMonthlyReport.Done',
                    maxRows: 3
                }, {
                    xtype: 'textareafield',
                    label: RS.$('MonthlyReport_UndoneJob'),
                    labelAlign: 'top',
                    padding: '3 0',
                    xdatabind: 'iMonthlyReport.Undone',
                    maxRows: 3
                }, {
                    xtype: 'textareafield',
                    label: RS.$('MonthlyReport_CoordinateJob'),
                    labelAlign: 'top',
                    padding: '3 0',
                    xdatabind: 'iMonthlyReport.Coordinate',
                    maxRows: 3
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xtype: 'textareafield',
                    label: RS.$('All__Comments'),
                    placeHolder: RS.$('All__PlaceHolder_Comments'),
                    labelAlign: 'top',
                    padding: '3 0',
                    xdatabind: 'iMonthlyReport.Comments',
                    maxRows: 5
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xclass: 'YZSoft.src.field.ImageAttachment',
                    label: RS.$('All__Attachments'),
                    xdatabind: 'iMonthlyReport.Attachments'
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
            iMonthlyReport = formData['iMonthlyReport'];

        if (Ext.isEmpty(iMonthlyReport[0].Done) &&
            Ext.isEmpty(iMonthlyReport[0].DONE)) //Oracle
            return RS.$('MonthlyReport_Validate_Done');
    }
});