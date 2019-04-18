
Ext.define('YZSoft.form.validator.Compare', {
    extend: 'YZSoft.form.validator.Abstract',
    requires: [
        'YZSoft.src.viewmodel.bindable.Express'
    ],
    config: {
        dataType: 'Number', //String,Number,Date
        valuetoCompare:null,
        valueToCompareExpress: null,
        operator:'Equal'
    },

    doValidate: function (field, row) {
        var me = this,
            value = field.getValue(),
            dataType = me.getDataType(),
            valuetoCompare = me.getValuetoCompare(),
            valueToCompareExpress = me.getValueToCompareExpress(),
            operator = me.getOperator();

        if (valueToCompareExpress)
            valuetoCompare = YZSoft.src.viewmodel.bindable.Express.evaluate(row, valueToCompareExpress);

        value = me.convertValue(value, dataType);

        if (valuetoCompare !== null)
            valuetoCompare = me.convertValue(valuetoCompare, dataType);

        if (valuetoCompare !== null) {
            switch (operator) {
                case 'NotEqual':
                    return (value != valuetoCompare);
                case 'GreaterThan':
                    return (value > valuetoCompare);
                case 'GreaterThanEqual':
                    return (value >= valuetoCompare);
                case 'LessThan':
                    return (value < valuetoCompare);
                case 'LessThanEqual':
                    return (value <= valuetoCompare);
                case 'DataTypeCheck':
                    return true;
                default:
                    return (value == valuetoCompare);
            }
        }
    }
});