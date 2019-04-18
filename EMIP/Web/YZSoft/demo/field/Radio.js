
Ext.define('YZSoft.demo.field.Radio', {
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
                    xclass: 'Ext.field.Radio',
                    name: 'Radio1',
                    label: '单选1',
                    xdatabind: 'iDemoAppFields.Radio',
                    value: 'A'
                }, {
                    xclass: 'Ext.field.Radio',
                    name: 'Radio1',
                    label: '单选2',
                    xdatabind: 'iDemoAppFields.Radio',
                    value: 'B',
                    checked: true
                }, {
                    xclass: 'Ext.field.Radio',
                    name: 'Radio1',
                    label: '单选3',
                    xdatabind: 'iDemoAppFields.Radio',
                    value: 'C'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});