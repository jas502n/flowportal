
Ext.define('YZSoft.form.validator.Custom', {
    extend: 'YZSoft.form.validator.Abstract',
    config: {
        fn: null
    },

    doValidate: function (field, row) {
        var me = this,
            fn = me.getFn(),
            form = row.viewmodel.form,
            value = field.getValue();

        if (fn)
            return fn(field, row, form);
    }
});