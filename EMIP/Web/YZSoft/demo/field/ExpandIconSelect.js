
Ext.define('YZSoft.demo.field.ExpandIconSelect', {
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
                    xclass: 'YZSoft.src.field.ExpandIconSelect',
                    label: '图标选择',
                    xdatabind: 'iDemoAppFields.ExpandIconSelect',
                    store: YZSoft.src.ux.GlobalStore.getExpenseTypeStore()
                }, {
                    xclass: 'YZSoft.src.field.ExpandIconSelect',
                    label: '无初始选择项',
                    xdatabind: 'iDemoAppFields.ExpandIconSelect',
                    store: YZSoft.src.ux.GlobalStore.getExpenseTypeStore(),
                    autoSelect: false
                }, {
                    xclass: 'YZSoft.src.field.ExpandIconSelect',
                    label: '初始展开',
                    xdatabind: 'iDemoAppFields.ExpandIconSelect',
                    store: YZSoft.src.ux.GlobalStore.getExpenseTypeStore(),
                    expended: true
                }, {
                    xclass: 'YZSoft.src.field.ExpandIconSelect',
                    label: '值列显示列',
                    xdatabind: 'iDemoAppFields.ExpandIconSelect',
                    store: YZSoft.src.ux.GlobalStore.getExpenseTypeStore(),
                    valueField: 'Code',
                    displayField: 'Text'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});