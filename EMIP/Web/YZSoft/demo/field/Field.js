
Ext.define('YZSoft.demo.field.Field', {
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
                    xclass: 'Ext.field.Field',
                    label: '文字显示',
                    xdatabind: 'iDemoAppFields.TextArea',
                    html: 'ABC'
                }, {
                    xclass: 'Ext.field.Field',
                    label: '右对齐',
                    xdatabind: 'iDemoAppFields.TextArea',
                    cls: ['yz-field-valuealign-right'],
                    html: '移动组件'
                }, {
                    xclass: 'Ext.field.Field',
                    label: '自适应高度',
                    xdatabind: 'iDemoAppFields.TextArea',
                    html: '自适应高度自适应高度自适应高度自适应高度自适应高度自适应高度自适应高度自适应高度自适应高度自适应高度自适应高度自适应高度自适应高度自适应高度自适应高度'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});