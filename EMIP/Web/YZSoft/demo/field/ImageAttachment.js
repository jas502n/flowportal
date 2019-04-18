
Ext.define('YZSoft.demo.field.ImageAttachment', {
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
                    xclass: 'YZSoft.src.field.ImageAttachment',
                    xdatabind: 'iDemoAppFields.Attachment',
                    value: '201611300001,201707210014'
                }, {
                    xclass: 'YZSoft.src.field.ImageAttachment',
                    label: '设计图纸',
                    xdatabind: 'iDemoAppFields.ImageAttachment',
                    value: '201611300001'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});