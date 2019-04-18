
Ext.define('YZSoft.form.field.Checkbox', {
    extend: 'Ext.field.Checkbox',
    mixins: [
        'YZSoft.form.field.mixins.Base'
    ],
    config: {
        readOnly: false
    },

    constructor: function (config) {
        var me = this,
            config = config || {};

        me.callParent(arguments);

        if (!config.xdatabind)
            me.autoBind = true;
    },

    updateReadOnly: function (newValue) {
        this[newValue ? 'addCls' : 'removeCls']('yz-field-readonly');
    },

    getSubmitValue: function () {
        var me = this,
            allCheckbox = me.getSameGroupFields(),
            value;

        if (allCheckbox.length >= 2) {
            var values = [];

            Ext.each(allCheckbox, function (checkbox) {
                if (!checkbox.isCheckbox)
                    return;

                if (checkbox.isChecked()) {
                    value = checkbox.getValue();

                    if (Ext.isEmpty(value))
                        value = checkbox.config && checkbox.config.itemid;

                    values.push(value);
                }
            });

            value = values.join(',');
        }
        else {
            value = me.isChecked() ? 1 : 0;
        }

        return value;
    },

    setFormValue: function (value) {
        var me = this,
            allCheckbox = me.getSameGroupFields(),
            values = (value || '').toString().split(',');

        if (allCheckbox.length >= 2) {
            Ext.each(allCheckbox, function (checkbox) {
                if (!checkbox.isCheckbox)
                    return;

                var id = checkbox.config && checkbox.config.itemid,
                    checkvalue = checkbox.getValue(),
                    check = false;

                if (Ext.isEmpty(checkvalue)) {
                    checkvalue = id;
                    Ext.Logger && Ext.Logger.warn(Ext.String.format(RS.$('All_Uniform_Checkbox_MissValue'), id));
                }

                check = me.containsValue(values, checkvalue);
                checkbox[check ? 'check' : 'uncheck']();
            });
        }
        else {
            var check = !(!value || String.Equ(value, '0') || String.Equ(value, 'off') || String.Equ(value, 'false'));

            me[check ? 'check' : 'uncheck']();
        }
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

    getSameGroupFields: function () {
        var me = this,
            binding = me.bindings && me.bindings.value;

        return binding ? binding.getAllFields():[me];
    }
});