
Ext.define('YZSoft.src.viewmodel.bindable.Filter', {
    extend: 'YZSoft.src.viewmodel.bindable.Abstract',

    statics: {
        getFilter: function (row, filter, returnkeyvalue) {
            var ofilter,
                rv = {}, filter;

            ofilter = Ext.create('YZSoft.src.viewmodel.bindable.Filter', row, filter);
            filter = ofilter.getCurrentFilter(ofilter.getLastValue());

            if (returnkeyvalue) {
                Ext.Object.each(filter, function (key, value) {
                    rv[key] = value.value;
                })
            }
            else {
                rv = Ext.clone(filter);
            }

            ofilter.destroy();
            return rv;
        }
    },

    constructor: function (row, filter, config) {
        var me = this,
            viewmodel = row.viewmodel,
            cfg;

        cfg = {
            row: row,
            filter: filter,
            tokens: me.parseTokens(row, filter)
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    parseTokens: function (row, filter) {
        var me = this,
            tokens = [],
            varname,token;

        Ext.Object.each(filter, function (key, filterItem) {
            token = null;

            if (filterItem.token) {
                token = filterItem.token;
            }
            else if (filterItem.field) {
                token = row.lookupDependencyUp(filterItem.field);
                if (!token)
                    YZSoft.Error.raise(RS.$('All_ViewModel_Filter_InvalidDepency'), filterItem.field);
            }

            if (token) {
                filterItem.index = tokens.length;
                tokens.push(token);
            }
        });

        return tokens;
    },

    onDataChanged: function (newValues) {
        var me = this,
            filter = me.getCurrentFilter(newValues);

        me.fireEvent('filterchanged', filter);
    },

    getCurrentFilter: function (newValues) {
        var me = this,
            rv = {},
            value = {};

        Ext.Object.each(me.filter, function (key, filterItem) {
            if ('value' in filterItem) {
                value = {
                    value: filterItem.value
                };
            }
            else if ('afterBind' in filterItem) {
                value = {
                    afterBind: true,
                    value: filterItem.afterBind
                };
            }
            else if ('index' in filterItem) {
                value = {
                    value: newValues[filterItem.index]
                };
            }
            else {
                value = {
                    value: ''
                };
            }

            rv[key] = Ext.apply({
                op: filterItem.op
            },value);
        });

        return rv;
    },

    destroy: function () {
        this.callParent(arguments);
    }
});