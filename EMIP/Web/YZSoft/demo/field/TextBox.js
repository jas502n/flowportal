
Ext.define('YZSoft.demo.field.TextBox', {
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
                    xclass: 'Ext.field.Text',
                    label: '单行文本',
                    xdatabind: 'iDemoAppFields.Text',
                    value: '单行文本'
                }, {
                    xclass: 'Ext.field.Text',
                    label: '右对齐',
                    xdatabind: 'iDemoAppFields.Text',
                    cls: ['yz-field-valuealign-right'],
                    value: '单行文本'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});