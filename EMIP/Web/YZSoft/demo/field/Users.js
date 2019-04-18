
Ext.define('YZSoft.demo.field.Users', {
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
                    xclass: 'YZSoft.src.field.Users',
                    xdatabind: 'iDemoAppFields.Users',
                    value: ['99199','77177']
                }, {
                    xclass: 'YZSoft.src.field.Users',
                    label: '单选',
                    xdatabind: 'iDemoAppFields.Users',
                    singleSelection: true,
                    value:'99199'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});