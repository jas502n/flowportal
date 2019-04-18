
Ext.define('YZSoft.apps.dailyreport.form.DailyReport', {
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
                    xclass: 'YZSoft.src.field.DatePicker',
                    label: RS.$('All__Date'),
                    readOnly: true,
                    xdatabind: 'iDailyReport.Date',
                    cls: ['yz-field-valuealign-right', 'yz-field-notrigger'],
                    value: Ext.Date.clearTime(config.date || new Date())
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xtype: 'textareafield',
                    label: RS.$('DeilyReport_Done'),
                    labelAlign: 'top',
                    padding: '3 0',
                    xdatabind: 'iDailyReport.Done',
                    maxRows: 3
                }, {
                    xtype: 'textareafield',
                    label: RS.$('DeilyReport_UndoneJob'),
                    labelAlign: 'top',
                    padding: '3 0',
                    xdatabind: 'iDailyReport.Undone',
                    maxRows: 3
                }, {
                    xtype: 'textareafield',
                    label: RS.$('DeilyReport_CoordinateJob'),
                    labelAlign: 'top',
                    padding: '3 0',
                    xdatabind: 'iDailyReport.Coordinate',
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
                    xdatabind: 'iDailyReport.Comments',
                    maxRows: 5
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xclass: 'YZSoft.src.field.ImageAttachment',
                    label: RS.$('All__Attachments'),
                    xdatabind: 'iDailyReport.Attachments'
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
            iDailyReport = formData['iDailyReport'];

        if (Ext.isEmpty(iDailyReport[0].Done) &&
            Ext.isEmpty(iDailyReport[0].DONE)) //Oracle
            return RS.$('DailyReport_Validate_Done');
    }
});