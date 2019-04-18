
Ext.define('YZSoft.src.field.PopupRadioList', {
    extend: 'Ext.field.Select',
    requires: [
    ],
    config: {
    },

    getPhonePicker: function () {
        var me = this,
            config = me.getDefaultPhonePickerConfig();

        if (!me.picker) {
            me.picker = Ext.create('YZSoft.src.field.picker.Radio', Ext.apply({
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

    onPickerChange: function (picker, record) {
        var me = this;

        me.setValue(record);
    }
});
