
Ext.define('YZSoft.demo.field.Checkbox', {
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
                    xclass: 'Ext.field.Checkbox',
                    label: '多选1',
                    xdatabind: 'iDemoAppFields.Checkbox1',
                    value: 'Yes',
                    checked: false
                }, {
                    xclass: 'Ext.field.Checkbox',
                    label: '多选2',
                    xdatabind: 'iDemoAppFields.Checkbox2',
                    value: true,
                    checked: true
                }]
            }, {
                xtype: 'fieldset',
                padding: '0',
                items: [{
                    xclass: 'Ext.field.Checkbox',
                    label: '绑定到1个字段',
                    xdatabind: 'iDemoAppFields.Checkbox3',
                    value: 'A',
                    checked: true
                }, {
                    xclass: 'Ext.field.Checkbox',
                    label: '绑定到1个字段',
                    xdatabind: 'iDemoAppFields.Checkbox3',
                    value: 'B',
                    checked: true
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    $validate: function (args) {
        var me = this,
            formInfo = args.formInfo,
            formData = args.formData;

        return Ext.encode(formData);
    }
});