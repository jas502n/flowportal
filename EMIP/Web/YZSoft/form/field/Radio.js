
Ext.define('YZSoft.form.field.Radio', {
    extend: 'Ext.field.Radio',
    mixins: [
        'YZSoft.form.field.mixins.Base'
    ],
    config: {
    },

    constructor: function (config) {
        var me = this,
            config = config || {};

        me.callParent(arguments);

        if (!config.xdatabind)
            me.autoBind = true;
    },

    getSubmitValue: function () {
        var me = this,
            allRadio = me.getSameGroupFields(),
            value = '';

        if (allRadio.length >= 2) {
            Ext.each(allRadio, function (radio) {
                if (!radio.isRadio)
                    return;

                if (radio.isChecked()) {
                    value = radio.getValue();

                    if (Ext.isEmpty(value))
                        value = radio.config && radio.config.itemid;

                    return false;
                }
            });
        }
        else {
            value = me.isChecked() ? 1 : 0;
        }

        return value;
    },

    setFormValue: function (value) {
        var me = this,
            allRadio = me.getSameGroupFields();

        if (allRadio.length >= 2) {
            Ext.each(allRadio, function (radio) {
                if (!radio.isRadio)
                    return;

                var id = radio.config && radio.config.itemid,
                    checkvalue = radio.getValue(),
                    check = false;

                if (Ext.isEmpty(checkvalue)) {
                    checkvalue = id;
                    Ext.Logger && Ext.Logger.warn(Ext.String.format(RS.$('All_Uniform_Radio_MissValue'), id));
                }

                check = String.Equ(checkvalue, value);
                radio[check ? 'check' : 'uncheck']();
            });
        }
        else {
            var check = !(!value || String.Equ(value, '0') || String.Equ(value, 'off') || String.Equ(value, 'false'));

            me[check ? 'check' : 'uncheck']();
        }
    },

    onMaskTap: function (component, e) {
        var me = this,
            allRadio = me.getSameGroupFields(),
            rv;

        rv = me.callParent(arguments);

        if (me.isChecked()) {
            Ext.each(allRadio, function (radio) {

                if (radio !== me)
                    radio.uncheck();
            });
        }

        return rv;
    },

    getSameGroupFields: function () {
        var me = this,
            binding = me.bindings && me.bindings.value;

        return binding ? binding.getAllFields() : [me];
    }
});