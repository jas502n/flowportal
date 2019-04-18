
Ext.define('YZSoft.src.field.picker.Radio', {
    extend: 'Ext.ActionSheet',
    config: {
        value: null,
        store: null,
        valueField: null,
        displayField: null,
        hideOnMaskTap: true,
        cls: ['x-picker', 'yz-picker'],
        showAnimation: {
            type: 'slideIn',
            duration: 250,
            easing: 'ease-out'
        },
        hideAnimation: {
            type: 'slideOut',
            duration: 250,
            easing: 'ease-in'
        }
    },

    setValue: function (value) {
        var me = this,
            value = value && value.picker,
            form = me.form;

        form.items.each(function (radio) {
            radio[radio.getValue() == value ? 'check' : 'uncheck']();
        });
    },

    initialize: function () {
        var me = this,
            store = me.getStore(),
            valueField = me.getValueField(),
            displayField = me.getDisplayField(),
            value = me.getValue(),
            items = [],
            groupName = Ext.id(null,'radiogroup');

        me.callParent(arguments);

        store.each(function (record) {
            items.push({
                xclass: 'Ext.field.Radio',
                name: groupName,
                label: record.get(displayField),
                value: record.get(valueField),
                scope: me,
                record: record,
                listeners: {
                    scope: me,
                    check: 'onCheck'
                }
            });
        });

        me.form = Ext.create('Ext.form.Panel', {
            scrollable: null,
            cls: ['yz-form'],
            style:'background-color:#fff;',
            padding:'3 10',
            layout: {
                type: 'vbox',
                align:'stretch'
            },
            items: items
        });

        me.setItems([me.form]);
    },

    onCheck: function (radio) {
        var me = this;

        me.hide();
        me.fireEvent('change', me, radio.config.record);
    }
});