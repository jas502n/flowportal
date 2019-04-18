
Ext.define('YZSoft.form.validator.Required', {
    extend: 'YZSoft.form.validator.Abstract',
    config: {
    },

    doValidate: function (field, row) {
        var me = this,
            value = field.getValue();

        if (Ext.isEmpty(value))
            return false;
    }
});