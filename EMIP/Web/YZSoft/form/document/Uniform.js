
Ext.define('YZSoft.form.document.Uniform', {
    extend: 'Ext.Evented',

    statics: {
        parseVarName: function (varname) {
            var me = this,
                index,names, len;

            if (!varname)
                return;

            names = varname.split('.');
            len = names.length;

            if (len == 0)
                return;

            if (len == 1) {
                return {
                    isVar: true,
                    columnName: varname
                };
            }

            var tableName = names[len - 2],
                columnName = names[len - 1],
                column;

            if (tableName) {
                index = tableName.indexOf(':');
                if (index != -1)
                    tableName = tableName.substr(index + 1);
            }

            return {
                isColumn: true,
                tableName: tableName,
                columnName: columnName
            };
        }
    },

    constructor: function (config) {
        var me = this;

        Ext.apply(me, config);
        me.callParent([config]);

        me.src.blockItems = me.getBlockTree(me.src);
    },

    getAllFormulars: function () {
        var me = this,
            formulars = {};

        Ext.Object.each(me.src.components, function (compid, comp) {
            var attrs = comp.attrs,
                express = attrs && attrs.express,
                xdatabind = attrs && attrs.xdatabind;

            if (express) {
                if (!xdatabind)
                    xdatabind = attrs.xdatabind = Ext.id(null, '$$$var');

                formulars[xdatabind] = express;
            }
        });

        return formulars;
    },

    getBlockTree: function (item) {
        var me = this,
            citems;

        citems = me.getBlockFields(item);
        Ext.each(citems, function (citem) {
            if (me.isGrid(citem))
                citem.blockItems = me.getBlockTree(citem);
        });

        return citems;
    },

    getAllFields: function (item, matchFn, breakFn) {
        var me = this,
            components = me.src.components,
            fields = [],
            item;

        var getFields = function (itemid) {
            item = components[itemid];

            if (matchFn(item))
                fields.push(item);

            if (!breakFn || !breakFn(item))
                Ext.each(item.items, getFields);
        };

        Ext.each(item.items, getFields);
        return fields;
    },

    isGrid: function (item) {
        return item.ctype == 'grid';
    },

    getBlockFields: function (item) {
        var me = this;

        return me.getAllFields(item, function (item) {
            return true;
        }, function (item) {
            return me.isGrid(item);
        });
    },

    getBlockVars: function (blockItems) {
        var me = this,
            vars = [],
            xdatabind;

        Ext.each(blockItems, function (item) {
            xdatabind = item.attrs.xdatabind;
            if (xdatabind) {
                $var = me.self.parseVarName(xdatabind);
                if ($var.isVar)
                    vars.push($var.columnName);
            }
        });

        return vars;
    }
});
