
Ext.define('YZSoft.request.forms.Expense', {
    extend: 'YZSoft.form.Form',
    requires: [
        'YZSoft.src.ux.GlobalStore'
    ],

    constructor: function (config) {
        var me = this,
            task = config && config.formInfo && config.formInfo.task,
            cfg, leavingTypes;

        cfg = {
            defaults: {
                padding: 0,
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
                margin:0,
                items: [{
                    xclass: 'YZSoft.form.field.Text',
                    label: RS.$('Expense_Reason'),
                    xdatabind: 'iDemoExpense.Title'
                }, {
                    xclass: 'YZSoft.form.field.Text',
                    label: RS.$('Expense_Amount'),
                    xdatabind: 'iDemoExpense.Amount',
                    express: 'sum(iDemoExpenseDetail.Amount)'
                }]
            }, {
                xclass: 'YZSoft.form.grid.Repeater',
                addButton: {
                    text:RS.$('Expense_AddRecord')
                },
                repeaterItemConfig: {
                    title:RS.$('Expense_RecordTitle')
                },
                template: [{
                    xtype: 'fieldset',
                    defaults: {
                        labelWidth: 80
                    },
                    items: [{
                        xclass: 'YZSoft.form.field.DatePicker',
                        label: RS.$('Expense_Date'),
                        xdatabind: 'iDemoExpenseDetail.Date',
                        cls: 'yz-field-valuealign-right',
                        value: Ext.Date.clearTime(new Date())
                    }, {
                        xclass: 'YZSoft.form.field.Select',
                        label: RS.$('Expense_Project'),
                        xdatabind: 'iDemoExpenseDetail.ProjectCode',
                        cls: 'yz-field-valuealign-right',
                        datasource: {
                            tableName: 'YZMDProjects',
                            orderBy: 'OrderIndex'
                        },
                        valueField: 'ProjectCode',
                        displayField: 'ProjectName'
                    }, {
                        xclass: 'YZSoft.src.field.ExpandIconSelect',
                        label: RS.$('Expense_Type'),
                        xdatabind: 'iDemoExpenseDetail.TypeCode',
                        store: YZSoft.src.ux.GlobalStore.getExpenseTypeStore(),
                        autoSelect: false,
                        expended: false
                    }, {
                        xclass: 'YZSoft.form.field.Text',
                        label: RS.$('Expense_ItemAmount'),
                        xdatabind: 'iDemoExpenseDetail.Amount'
                    }, {
                        xclass: 'YZSoft.form.field.Text',
                        label: RS.$('Expense_ItemComments'),
                        xdatabind: 'iDemoExpenseDetail.Comments',
                        express: 'iDemoExpenseDetail.TypeCode'
                    }]
                }],
                listeners: {
                    scope:me,
                    delete: 'updateAmount'
                }
            }, {
                xtype: 'fieldset',
                items: [{
                    xclass: 'YZSoft.form.field.TextArea',
                    padding: '10 0',
                    label: RS.$('All__Comments'),
                    xdatabind: 'iDemoExpense.Comments',
                    maxRows: 5
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xclass: 'YZSoft.form.field.ImageAttachment',
                    xdatabind: 'iDemoExpense.Attachments'
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
            iDemoExpense = formData['iDemoExpense'];

//        if (Ext.isEmpty(iDemoExpense[0].Days))
//            return RS.$('Leaving_EnterDays');

        return me.callParent(arguments);
    }
});