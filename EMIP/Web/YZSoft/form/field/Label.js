
Ext.define('YZSoft.form.field.Label', {
    extend: 'Ext.field.Field',
    mixins: [
        'YZSoft.form.field.mixins.Base',
        'YZSoft.form.field.mixins.Format',
        'YZSoft.form.field.mixins.Value2Display'
    ],
    config: {
        labelWidth: 100,
        format: {
            perfix: '',
            thousandSeparator: false,
            decimal:-1
        },
        datasource: null,
        filterColumn: null,
        displayColumn: null,
        datamap: null
    },

    constructor: function (config) {
        var me = this,
            config = config || {};

        me.callParent(arguments);

        if (config.datasource && !config.xdatabind)
            me.autoBind = true;
    },

    applyFormat: function (format) {
        if (!format) {
            return {
                isValid: false
            };
        }

        format = Ext.apply({
            perfix: '',
            thousandSeparator: false,
            decimal: -1
        }, format)

        format.isValid = format.perfix || format.thousandSeparator || format.decimal != -1;
        return format;
    },

    updateValue: function (value) {
        var me = this,
            formattedValue = me.getFormattedValue(value);

        me.getComponent().setHtml(formattedValue);
        me.fireEvent('change', value);
    },

    setDisplayText: function (text) {
        this.getComponent().setHtml(text);
    }
});