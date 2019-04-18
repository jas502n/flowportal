
Ext.define('YZSoft.form.validator.Abstract', {
    extend: 'Ext.Evented',
    requires: [
        'YZSoft.src.viewmodel.bindable.Express'
    ],
    config: {
        validationGroup: null,
        errorMessage: null,
        disableExpress: null
    },
    isValidator: true,
    doValidate: Ext.emptyFn,

    isValidationGroupMatch: function (validationGroup) {
        var me = this,
            controlGroup = me.getValidationGroup() || '',
            validationGroups = (validationGroup || '').split(/[;,]/);

        for (var i = 0; i < validationGroups.length; i++) {
            if (String.Equ(controlGroup, validationGroups[i]))
                return true;
        }
    },

    evaluateDisableExpress: function (row) {
        var me = this,
            disableExpress = me.getDisableExpress();

        if (!disableExpress)
            return false;

        return YZSoft.src.viewmodel.bindable.Express.evaluate(row, disableExpress);
    },

    $validate: function (field, validationGroup, row, viewmodel, formData) {
        var me = this,
            databind = field.bindings && field.bindings.value,
            groupMatch = me.isValidationGroupMatch(validationGroup),
            errorMessage = me.getErrorMessage() || RS.$('All__Validation_Failed'),
            value = field.getValue();

        //若绑定到不可修改字段忽略验证
        if (databind && databind.column.Writeable === false)
            return;

        if (!groupMatch)
            return;

        if (me.evaluateDisableExpress(row))
            return;

        if (me.doValidate(field, row) === false)
            return errorMessage;
    },

    convertValue: function (value, dataType) {
        var rv = null;

        switch (dataType) {
            case 'Number':
                rv = Number(value);
                rv = isNaN(rv) ? null : rv;
                break;
            case 'String':
                if (Ext.isDate(value))
                    rv = Ext.Date.format(value, 'Y-m-d H:i:s');
                else
                    rv = Ext.isEmpty(value) ? '' : value.toString();
                break;
            case 'Date':
                if (Ext.isDate(value))
                    rv = value;
                else {
                    rv = Date.parse(value);
                    rv = isNaN(rv) ? null : new Date(rv);
                }
                break;
        }

        return rv;
    }
});