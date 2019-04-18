Ext.define('YZSoft.src.field.DatePicker', {
    extend: 'Ext.field.DatePicker',
    xtype: 'yzdatefield',
    config: {
        useNativePicker: true,
        dateFormat: 'Y-m-d'
    },

    getValue: function () {
        var value = this.callParent(arguments);

        if (Ext.isDate(value))
            Ext.Date.clearTime(value);

        return value;
    },

    getPicker: function () {
        var picker = this._picker,
            value = this.getValue();

        if (picker && !picker.isPicker) {
            picker = Ext.factory(picker, 'YZSoft.src.picker.Date');
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
    },

    onFocus: function (e) {
        var me = this,
            useNativePicker = me.getUseNativePicker(),
            datePicker = window.plugins && window.plugins.datePicker;

        if (!useNativePicker || !datePicker) {
            me.callParent();
            return;
        }

        var success = function (res) {
            me.setValue(res);
        };

        var fail = function (e) {
            console.log("DateTimePicker: error occurred or cancelled: " + e);
        };

        try {
            var options = {
                androidTheme: datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
                date: me.getValue() || new Date(),
                mode: 'date'
            };
            datePicker.show(options, success, fail);

        } catch (ex) {
            fail(ex);
        }
    }
});
