
Ext.define('YZSoft.demo.field.WeekPicker', {
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
                    xclass: 'YZSoft.src.field.WeekPicker',
                    label: '周',
                    xdatabind: 'iDemoAppFields.WeekPicker',
                    value: new Date()
                }, {
                    xclass: 'YZSoft.src.field.WeekPicker',
                    label: '右对齐',
                    xdatabind: 'iDemoAppFields.WeekPicker',
                    cls: ['yz-field-valuealign-right'],
                    value: new Date()
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});