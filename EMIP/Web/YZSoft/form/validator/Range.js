
Ext.define('YZSoft.form.validator.Range', {
    extend: 'YZSoft.form.validator.Abstract',
    requires: [
        'YZSoft.src.viewmodel.bindable.Express'
    ],
    config: {
        dataType: 'Number', //String,Number,Date
        minValue:null,
        minValueExpress: null,
        maxValue: null,
        maxValueExpress:null
    },

    doValidate: function (field, row) {
        var me = this,
            value = field.getValue(),
            dataType = me.getDataType(),
            minValue = me.getMinValue(),
            maxValue = me.getMaxValue(),
            minValueExpress = me.getMinValueExpress(),
            maxValueExpress = me.getMaxValueExpress();

        if (minValueExpress)
            minValue = YZSoft.src.viewmodel.bindable.Express.evaluate(row, minValueExpress);

        if (maxValueExpress)
            maxValue = YZSoft.src.viewmodel.bindable.Express.evaluate(row, maxValueExpress);

        value = me.convertValue(value, dataType);

        if (minValue !== null)
            minValue = me.convertValue(minValue, dataType);

        if (maxValue !== null)
            maxValue = me.convertValue(maxValue, dataType);

        if (minValue !== null) {
            if (value < minValue)
                return false;
        }

        if (maxValue !== null) {
            if (value > maxValue)
                return false;
        }
    }
});