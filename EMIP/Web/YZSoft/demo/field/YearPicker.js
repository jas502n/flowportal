
Ext.define('YZSoft.demo.field.YearPicker', {
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
                    xclass: 'YZSoft.src.field.YearPicker',
                    label: '年度',
                    xdatabind: 'iDemoAppFields.YearPicker',
                    value: new Date()
                }, {
                    xclass: 'YZSoft.src.field.YearPicker',
                    label: '右对齐',
                    xdatabind: 'iDemoAppFields.YearPicker',
                    cls: ['yz-field-valuealign-right'],
                    value: new Date()
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});