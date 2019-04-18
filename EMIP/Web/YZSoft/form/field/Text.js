
Ext.define('YZSoft.form.field.Text', {
    extend: 'Ext.field.Text',
    mixins: [
        'YZSoft.form.field.mixins.TextBase'
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

        //me.on({
        //    scope:me,
        //    blur: 'onBlur',
        //    focus: 'onFocus'
        //});
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

    applyValue: function (newValue) {
        var me = this,
            formattedValue = me.focused ? newValue : me.getFormattedValue(newValue);

        return formattedValue;
    },

    onBlur: function () {
        if (this.id2text)
            return;

        var me = this,
            value = me.getValue();

        me.focused = false;
        me.setValue(value);
    },

    onFocus: function () {
        if (this.id2text)
            return;

        var me = this,
            value = me.getValue();

        me.focused = true;
        me.setValue(value);
    },

    setValue: function (value) {
        var me = this;

        if (!me.id2text) {
            return me.callParent(arguments);
        }
        else {
            me._realValue = value;
            return me.callParent(arguments);
        }
    },

    getValue: function () {
        var me = this;

        if (!me.id2text)
            return me.removeFormat(me.callParent(arguments));
        else
            return me._realValue;
    }
});