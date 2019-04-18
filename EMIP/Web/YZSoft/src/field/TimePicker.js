Ext.define('YZSoft.src.field.TimePicker', {
    extend: 'Ext.field.DatePicker',
    xtype: 'yztimefield',
    config: {
        dateFormat: 'Y-m-d H:i'
    },

    getPicker: function () {
        var picker = this._picker,
            value = this.getValue();

        if (picker && !picker.isPicker) {
            picker = Ext.factory(picker, 'YZSoft.src.picker.Time');
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
