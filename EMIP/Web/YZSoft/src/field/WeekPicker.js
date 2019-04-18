Ext.define('YZSoft.src.field.WeekPicker', {
    extend: 'Ext.field.DatePicker',
    xtype: 'yzweekfield',
    config: {
        dateFormat: 'Y/m/d-Q/q'
    },

    getValue: function () {
        var value = this.callParent(arguments);

        if (Ext.isDate(value)) {
            Ext.Date.clearTime(value);
        }

        return value;
    },

    applyValue: function (value) {
        value = this.callParent([value]);
        return Ext.Date.getWeekFirstDate(value);
    },

    getPicker: function () {
        var picker = this._picker,
            value = this.getValue();

        if (picker && !picker.isPicker) {
            picker = Ext.factory(picker, 'YZSoft.src.picker.Week');
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
