
Ext.define('YZSoft.form.validator.RegExp', {
    extend: 'YZSoft.form.validator.Abstract',
    config: {
        regex:null
    },

    doValidate: function (field, row) {
        var me = this,
            regex = me.getRegex(),
            value = field.getValue();

        if (regex) {
            var rx = new RegExp(regex),
                matches = rx.exec(value);

            return (matches != null && value == matches[0]);
        }
    }
});