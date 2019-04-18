/*********************************************************************/
//本示例演示了表单项动态隐藏功能
//选中"年假" ------  日期输入项隐藏
//选中其他   ------  日期输入项显示
/*********************************************************************/
/*--------------------增加按钮，点击启动本表单演示--------------------
{
    xtype: 'button',
    text: '动态隐藏',
    iconCls: 'yz-glyph yz-glyph-e974',
    handler: function () {
        var pnl = Ext.create('YZSoft.form.Post', {
            title: '动态隐藏',
            processName: '$移动表单控件',
            form: {
                xclass: 'YZSoft.demo.HideShow'
            },
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
    }
}
---------------------------------------------------------------------*/

Ext.define('YZSoft.demo.HideShow', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.FieldSet'
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
                    xclass: 'YZSoft.src.field.DatePicker',
                    label: RS.$('All__Date'),
                    xdatabind: 'iDemoAppFields.DatePicker',
                    name: 'datePicker',    //1.指定组件名称
                    value: new Date()
                }, {
                    xclass: 'YZSoft.src.field.Select',
                    label: RS.$('DemoFields_Type_Select'),
                    cls: 'yz-field-valuealign-right',
                    table: 'YZMDLeavingType',
                    valueField: 'TypeCode',
                    displayField: 'Name',
                    orderBy: 'OrderIndex',
                    xdatabind: 'iDemoAppFields.Select',
                    name: 'typeSelect',   //2.指定组件名称
                    listeners: {          //3.添加事件监听
                        scope: me,
                        change: 'updateStatus'
                    }
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    //4.处理状态更新
    updateStatus: function () {
        var me = this,
            fields = me.getFields(),
            newValue = fields.typeSelect.getValue();

        fields.datePicker[newValue == 'Annual' ? 'hide' : 'show'](); //年假-Annual 调休-Overtime
    },

    //5.加载表单数据后调用状态更新
    $setFormData: function () {
        var me = this;

        me.callParent(arguments);
        me.updateStatus();
    }
});