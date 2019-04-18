
Ext.define('YZSoft.src.field.picker.Checkbox', {
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

    initialize: function () {
        var me = this,
            store = me.getStore(),
            valueField = me.getValueField(),
            displayField = me.getDisplayField(),
            value = me.getValue(),
            items = [];

        me.callParent(arguments);

        me.btnCancel = Ext.create('Ext.Button', {
            text: RS.$('All__Cancel'),
            align: 'left',
            handler: function () {
                me.hide();
            }
        });

        me.btnOK = Ext.create('Ext.Button', {
            text: RS.$('All__Done'),
            align: 'right',
            ui: 'action',
            cls: ['yz-button-done'],
            handler: function () {
                me.onOK();
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            items: [me.btnCancel, me.btnOK]
        });

        store.each(function (record) {
            items.push({
                xclass: 'Ext.field.Checkbox',
                label: record.get(displayField),
                value: record.get(valueField),
                scope: me,
                record: record
            });
        });

        me.form = Ext.create('Ext.form.Panel', {
            scrollable: null,
            cls: ['yz-form'],
            style:'background-color:#fff;',
            padding: '3 10',
            layout: {
                type: 'vbox',
                align:'stretch'
            },
            items: items
        });

        me.setItems([me.titleBar, me.form]);
    },

    setValue: function (value) {
        var me = this,
            value = value && value.picker,
            values = (value || '').toString().split(','),
            form = me.form;

        form.items.each(function (radio) {
            radio[me.containsValue(values, radio.getValue()) ? 'check' : 'uncheck']();
        });
    },

    containsValue: function (values, value) {
        if (!values || !value)
            return false;

        for (var i = 0; i < values.length; i++) {
            if (String.Equ(values[i], value))
                return true;
        }

        return false;
    },

    onOK: function (radio) {
        var me = this,
            records = [];

        me.form.items.each(function (checkbox) {
            if (checkbox.isChecked())
                records.push(checkbox.config.record)
        });

        me.hide();
        me.fireEvent('change', me, records);
    }
});