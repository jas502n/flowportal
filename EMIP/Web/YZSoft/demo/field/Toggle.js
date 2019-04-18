
Ext.define('YZSoft.demo.field.Toggle', {
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
                    xclass: 'Ext.field.Toggle',
                    label: '开关1',
                    xdatabind: 'iDemoAppFields.Toggle1',
                    value: true
                }, {
                    xclass: 'Ext.field.Toggle',
                    label: '开关2',
                    xdatabind: 'iDemoAppFields.Toggle2',
                    value: false
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});