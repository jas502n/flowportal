
Ext.define('YZSoft.demo.field.TimePicker', {
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
                    xclass: 'YZSoft.src.field.TimePicker',
                    label: '时间选择',
                    xdatabind: 'iDemoAppFields.TimePicker',
                    value: Ext.Date.add(Ext.Date.clearTime(new Date()), Ext.Date.HOUR, 8)
                }, {
                    xclass: 'YZSoft.src.field.TimePicker',
                    label: '15分钟为单位',
                    xdatabind: 'iDemoAppFields.TimePicker',
                    value: Ext.Date.add(Ext.Date.clearTime(new Date()), Ext.Date.HOUR, 8),
                    picker: {
                        minuteScale: 15
                    }
                }, {
                    xclass: 'YZSoft.src.field.TimePicker',
                    label: '右对齐',
                    xdatabind: 'iDemoAppFields.TimePicker',
                    cls: ['yz-field-valuealign-right'],
                    value: Ext.Date.add(Ext.Date.clearTime(new Date()), Ext.Date.HOUR, 8)
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});