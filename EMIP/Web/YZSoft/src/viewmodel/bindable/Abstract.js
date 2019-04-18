
Ext.define('YZSoft.src.viewmodel.bindable.Abstract', {
    extend: 'Ext.Evented',
    config: {
        convertValue:false
    },

    constructor: function (config) {
        var me = this;

        me.previous = null;

        Ext.apply(me, config);
        me.callParent([config]);
    },

    notify: function () {
        var me = this,
            previous = me.previous,
            lastValue = me.getLastValue();

        if (me.isDataChanged(previous, lastValue)) {
            me.onDataChanged(lastValue);
            me.previous = lastValue;
        }
    },

    getLastValue: function () {
        var me = this,
            values = [];

        Ext.each(me.tokens, function (token) {
            values.push(me.getTokenValue(token));
        });

        return values;
    },

    getTokenValue: function (token) {
        if (!token) //依赖项不存在时token为空
            return undefined;

        if (token.isRuntimeDependency)
            return this.getTokenValueRuntime(token);

        return token.row.get(token.column.ColumnName, this.getConvertValue())
    },

    getTokenValueRuntime: function (token) {
        if (token.isRuntimeDependency)
            return token.row.getRuntimeValue(token.var, this.getConvertValue());
    },

    isDataChanged: function (previous, lastValue) {
        var me = this;

        if (!previous)
            return true;

        if (previous.length != lastValue.length)
            return true;

        for (var i = 0; i < lastValue.length; i++) {
            var v1 = previous[i],
                v2 = lastValue[i];

            if (Ext.isArray(v1) && Ext.isArray(v2)) {
                if (me.isDataChanged(v1, v2))
                    return true;
            }
            else {
                if (v1 !== v2) {
                    return true;
                }
            }
        }
    }
});