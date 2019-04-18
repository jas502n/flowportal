
Ext.define('YZSoft.demo.field.MonthPicker', {
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
                    xclass: 'YZSoft.src.field.MonthPicker',
                    label: '月度',
                    xdatabind: 'iDemoAppFields.MonthPicker',
                    value: new Date()
                }, {
                        xclass: 'YZSoft.src.field.MonthPicker',
                    label: '右对齐',
                    xdatabind: 'iDemoAppFields.MonthPicker',
                    cls: ['yz-field-valuealign-right'],
                    value: new Date()
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});