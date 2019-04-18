
Ext.define('YZSoft.src.viewmodel.bindable.Express', {
    extend: 'YZSoft.src.viewmodel.bindable.Abstract',
    config: {
        convertValue: true
    },

    statics: {
        evaluate: function (row, strexpress) {
            var oexpress,
                rv;

            oexpress = Ext.create('YZSoft.src.viewmodel.bindable.Express', row, strexpress);
            rv = oexpress.evaluate(oexpress.getLastValue());

            oexpress.destroy();
            return rv;
        }
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

    constructor: function (row, strexpress) {
        var me = this,
            viewmodel = row.viewmodel,
            express = viewmodel.$expresses[strexpress],
            vars,
            cfg;

        if (!express) {
            var parser = Ext.create('YZSoft.src.viewmodel.express.Parser', strexpress, viewmodel.form);

            express = viewmodel.$expresses[strexpress] = {
                parser: parser,
                vars: parser && parser.variables()
            }
        }

        vars = Ext.clone(express.vars);

        cfg = {
            row: row,
            express: strexpress,
            parser: express.parser,
            vars: vars,
            tokens: me.parseTokens(row, vars)
        };

        me.callParent([cfg]);
    },

    parseTokens: function (row, vars) {
        var me = this,
            tokens = [];

        Ext.each(vars, function ($var) {
            tokens.push(row.lookupDependency($var));
        });

        return tokens;
    },

    onDataChanged: function (newValues) {
        var me = this,
            result = me.evaluate(newValues);

        me.fireEvent('datachanged', result);
    },

    evaluate: function (newValues) {
        var me = this,
            vars = me.vars,
            v = {},
            i, j, $var, value,rv;

        for (i = 0; i < vars.length; i++) {
            $var = vars[i];
            value = newValues[i];

            if (Ext.isArray(value)) {
                for (j = 0; j < value.length; j++) {
                    value[j] = value[j] === undefined || value[j] === null ? '' : value[j];
                }
            }
            else{
                if (value === undefined || value === null)
                    value = '';
            }

            v[$var] = value;
        }

        rv = me.parser.evaluate(v);
        if (Ext.isArray(rv)) //express指向明细表时返回值为数组
            rv = rv.toString();

        return rv;
    },

    isValid: function () {
        return this.parser;
    }
});