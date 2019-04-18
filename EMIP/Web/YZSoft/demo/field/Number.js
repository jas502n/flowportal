
Ext.define('YZSoft.demo.field.Number', {
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
                    xclass: 'Ext.field.Number',
                    label: '数值输入',
                    xdatabind: 'iDemoAppFields.Number',
                    value: '12.34'
                }, {
                    xclass: 'Ext.field.Number',
                    label: '右对齐',
                    xdatabind: 'iDemoAppFields.Number',
                    cls: ['yz-field-valuealign-right'],
                    value: '12.34'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});