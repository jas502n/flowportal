
Ext.define('YZSoft.demo.field.Attachment', {
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
                    xclass: 'YZSoft.src.field.Attachment',
                    xdatabind: 'iDemoAppFields.ImageAttachment',
                    value: '201706010002,201611300001,201507210120,201507210118'
                }, {
                    xclass: 'YZSoft.src.field.Attachment',
                    label: '设计图纸',
                    xdatabind: 'iDemoAppFields.ImageAttachment',
                    value: '201706010002,201611300001'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});