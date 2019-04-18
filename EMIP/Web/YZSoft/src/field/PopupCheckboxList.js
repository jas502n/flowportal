
Ext.define('YZSoft.src.field.PopupCheckboxList', {
    extend: 'Ext.field.Select',
    requires: [
    ],
    config: {
    },

    getPhonePicker: function () {
        var me = this,
            config = me.getDefaultPhonePickerConfig();

        if (!me.picker) {
            me.picker = Ext.create('YZSoft.src.field.picker.Checkbox', Ext.apply({
                valueField: me.getValueField(),
                displayField: me.getDisplayField(),
                store: me.getStore(),
                listeners: {
                    scope: me,
                    change: 'onPickerChange'
                }
            }, config));
        }

        return me.picker;
    },

    onPickerChange: function (picker, records) {
        var me = this;

        me.setValue(records);
    },

    applyValue: function (value) {
        var me = this,
            records = value,
            values,record;

        if (!Ext.isArray(value)) {
            if (value != undefined && !value.isModel) {
                values = (value || '').toString().split(',');
                records = [];
                for (var i = 0; i < values.length; i++) {
                    record = me.callParent([values[i]]);
                    if (record !== undefined)
                        records.push(record);
                }
            }
        }

        return records;
    },

    updateValue: function (newValue, oldValue) {
        var me = this;

        me.records = newValue;

        if (Ext.isArray(newValue)) {
            var newValues = [],
                newValueItem;

            for (var i = 0; i < newValue.length; i++) {
                newValueItem = newValue[i];
                newValues.push((newValueItem && newValueItem.isModel) ? newValueItem.get(me.getDisplayField()) : '');
            }

            newValue = newValues.join(',');
        }
        else {
            newValue = (newValue && newValue.isModel) ? newValue.get(this.getDisplayField()) : '';
        }

        Ext.field.Text.prototype.updateValue.apply(me, [newValue]);
    },

    getValue: function () {
        var me = this,
            records = me.records;

        if (Ext.isArray(records)) {
            var values = null,
                record;

            for (var i = 0; i < records.length; i++) {
                record = records[i];
                if (record && record.isModel){
                    values = values || [];
                    values.push(record.get(this.getValueField()));
                }
            }

            return values === null ? null:values.join(',');
        }
        else {
            return me.callParent(arguments);
        }
    }
});
