Ext.define('YZSoft.src.field.MonthPicker', {
    extend: 'Ext.field.DatePicker',
    xtype: 'yzmonthfield',
    config: {
        dateFormat: 'Y/m'
    },

    getValue: function () {
        var value = this.callParent(arguments);

        if (Ext.isDate(value)) {
            Ext.Date.clearTime(value);
            value.setDate(1);
        }

        return value;
    },

    getPicker: function () {
        var picker = this._picker,
            value = this.getValue();

        if (picker && !picker.isPicker) {
            picker = Ext.factory(picker, 'YZSoft.src.picker.Month');
            if (value != null) {
                picker.setValue(value);
            }
        }

        picker.on({
            scope: this,
            change: 'onPickerChange',
            hide: 'onPickerHide'
        });

        this._picker = picker;

        return picker;
    }
});
