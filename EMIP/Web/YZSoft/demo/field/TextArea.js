
Ext.define('YZSoft.demo.field.TextArea', {
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
                    xclass: 'Ext.field.TextArea',
                    label: '多行文本',
                    xdatabind: 'iDemoAppFields.TextArea',
                    value: '多行文本'
                }, {
                    xclass: 'Ext.field.TextArea',
                    label: '5行',
                    maxRows: 5,
                    xdatabind: 'iDemoAppFields.TextArea',
                    value: '多行文本'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});