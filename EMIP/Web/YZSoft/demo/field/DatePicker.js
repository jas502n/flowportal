
Ext.define('YZSoft.demo.field.DatePicker', {
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
                    label: '日期',
                    xdatabind: 'iDemoAppFields.DatePicker',
                    value: new Date()
                }, {
                    xclass: 'YZSoft.src.field.DatePicker',
                    label: '右对齐',
                    xdatabind: 'iDemoAppFields.DatePicker',
                    cls: ['yz-field-valuealign-right'],
                    value: new Date()
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});