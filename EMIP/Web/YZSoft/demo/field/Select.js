
Ext.define('YZSoft.demo.field.Select', {
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
                    xclass: 'YZSoft.src.field.Select',
                    label: '选择',
                    xdatabind: 'iDemoAppFields.Select',
                    table: 'YZMDLeavingType',
                    valueField: 'TypeCode',
                    displayField: 'Name',
                    orderBy: 'OrderIndex',
                    value: 'Annual'
                }, {
                    xclass: 'YZSoft.src.field.Select',
                    label: '右对齐',
                    xdatabind: 'iDemoAppFields.Select',
                    cls: ['yz-field-valuealign-right'],
                    table: 'YZMDLeavingType',
                    valueField: 'TypeCode',
                    displayField: 'Name',
                    orderBy: 'OrderIndex',
                    value: 'Annual'
                }/*, {
                    xclass: 'YZSoft.src.field.Select',
                    label: '右对齐',
                    xdatabind: 'iDemoAppFields.Select',
                    cls: ['yz-field-valuealign-right'],
                    table: 'YZMDLeavingType',
                    valueField: '值',
                    displayField: '类型',
                    orderBy: 'OrderIndex',
                    value: 'Annual'
                }*/]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});