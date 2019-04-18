
Ext.define('YZSoft.demo.FormFields', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.FieldSet',
        'YZSoft.src.ux.GlobalStore'
    ],
    config: {
        cls: 'yz-form',
        style: 'background-color:#f3f5f9',
        scrollable: {
            direction: 'vertical',
            indicators: false
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            items: [{
                xtype: 'fieldset',
                padding: '0',
                items: [{
                    xclass: 'Ext.field.Text',
                    label: RS.$('DemoFields_Type_TextBox'),
                    xdatabind: 'iDemoAppFields.Text',
                    value: 'Text'
                }, {
                    xclass: 'Ext.field.Number',
                    label: RS.$('DemoFields_Type_Number'),
                    xdatabind: 'iDemoAppFields.Number',
                    value: '12.34'
                }, {
                    xclass: 'Ext.field.TextArea',
                    label: RS.$('DemoFields_Type_TextArea'),
                    maxRows: 5,
                    xdatabind: 'iDemoAppFields.TextArea',
                    value: 'TextArea'
                }, {
                    xclass: 'YZSoft.src.field.DatePicker',
                    label: RS.$('All__Date'),
                    xdatabind: 'iDemoAppFields.DatePicker',
                    value: new Date()
                }, {
                    xclass: 'YZSoft.src.field.Select',
                    label: RS.$('DemoFields_Type_Select'),
                    cls: 'yz-field-valuealign-right',
                    table: 'YZMDLeavingType',
                    valueField: 'TypeCode',
                    displayField: 'Name',
                    orderBy: 'OrderIndex',
                    xdatabind: 'iDemoAppFields.Select'
                }, {
                    xclass: 'YZSoft.src.field.ImageAttachment',
                    xdatabind: 'iDemoAppFields.ImageAttachment',
                    value: '201707210014'
                }, {
                    xclass: 'YZSoft.src.field.Attachment',
                    xdatabind: 'iDemoAppFields.Attachment',
                    value: '201706010001,201706010002,201611300001,201507210120,201507210118'
                }]
            }, {
                xtype: 'fieldset',
                padding: '0',
                items: [{
                    xclass: 'Ext.field.Checkbox',
                    label: RS.$('DemoFields_Type_Checkbox1'),
                    value: 'Yes',
                    xdatabind: 'iDemoAppFields.Checkbox1',
                    checked: false
                }, {
                    xclass: 'Ext.field.Checkbox',
                    label: RS.$('DemoFields_Type_Checkbox2'),
                    value: true,
                    xdatabind: 'iDemoAppFields.Checkbox2',
                    checked: false
                }]
            }, {
                xtype: 'fieldset',
                padding: '0',
                items: [{
                    xclass: 'Ext.field.Radio',
                    label: RS.$('DemoFields_Type_Radio1'),
                    name: 'Radio1',
                    xdatabind: 'iDemoAppFields.Radio',
                    value: 'A',
                    checked: true
                }, {
                    xclass: 'Ext.field.Radio',
                    name: 'Radio1',
                    xdatabind: 'iDemoAppFields.Radio',
                    label: RS.$('DemoFields_Type_Radio2'),
                    value: 'B'
                }, {
                    xclass: 'Ext.field.Radio',
                    name: 'Radio1',
                    xdatabind: 'iDemoAppFields.Radio',
                    label: RS.$('DemoFields_Type_Radio3'),
                    value: 'C'
                }]
            }, {
                xtype: 'fieldset',
                padding: '0',
                items: [{
                    xclass: 'Ext.field.Toggle',
                    label: RS.$('DemoFields_Type_Toggle1'),
                    xdatabind: 'iDemoAppFields.Toggle1',
                    value: true
                }, {
                    xclass: 'Ext.field.Toggle',
                    label: RS.$('DemoFields_Type_Toggle2'),
                    xdatabind: 'iDemoAppFields.Toggle2',
                    value: false
                }]
            }, {
                xtype: 'fieldset',
                padding: '0',
                items: [{
                    xclass: 'YZSoft.src.field.YearPicker',
                    label: RS.$('DemoFields_Type_YearPicker'),
                    xdatabind: 'iDemoAppFields.YearPicker',
                    value: new Date()
                }, {
                    xclass: 'YZSoft.src.field.MonthPicker',
                    label: RS.$('DemoFields_Type_MonthPicker'),
                    xdatabind: 'iDemoAppFields.MonthPicker',
                    value: new Date()
                }, {
                    xclass: 'YZSoft.src.field.WeekPicker',
                    label: RS.$('DemoFields_Type_WeekPicker'),
                    xdatabind: 'iDemoAppFields.WeekPicker',
                    value: new Date()
                }, {
                    xclass: 'YZSoft.src.field.TimePicker',
                    label: RS.$('DemoFields_Type_TimePicker'),
                    xdatabind: 'iDemoAppFields.TimePicker',
                    value: Ext.Date.add(Ext.Date.clearTime(new Date()), Ext.Date.HOUR, 8),
                    picker: {
                        minuteScale: 15
                    }
                }]
            }, {
                xtype: 'fieldset',
                padding: '0',
                items: [{
                    xclass: 'YZSoft.src.field.ExpandIconSelect',
                    label: RS.$('DemoFields_Type_ExpandIconSelect'),
                    xdatabind: 'iDemoAppFields.ExpandIconSelect',
                    store: YZSoft.src.ux.GlobalStore.getExpenseTypeStore(),
                    autoSelect: true,
                    expended: false
                }, {
                    xclass: 'YZSoft.src.field.Users',
                    label: RS.$('DemoFields_Type_Users'),
                    xdatabind: 'iDemoAppFields.Users'
                }, {
                    xclass: 'YZSoft.src.field.Users',
                    label: RS.$('DemoFields_Type_UsersSingle'),
                    singleSelection: true,
                    xdatabind: 'iDemoAppFields.SingleUser'
                }]
            }, {
                xtype: 'fieldset',
                padding: '0',
                items: [{
                    xclass: 'Ext.field.Email',
                    label: RS.$('DemoFields_Type_Email'),
                    xdatabind: 'iDemoAppFields.Email'
                }, {
                    xclass: 'Ext.field.Password',
                    label: RS.$('DemoFields_Type_Password'),
                    xdatabind: 'iDemoAppFields.Password'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    $getFormData: function (form, formInfo) {
        var me = this,
            data;

        data = me.callParent(arguments);

        /*额外处理数据*/
        return data;
    }
});