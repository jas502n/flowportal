
Ext.define('YZSoft.src.viewmodel.Schema', {

    constructor: function (config) {
        var me = this;

        Ext.apply(me, config);

        Ext.Object.each(me.tables, function (tableName, table) {
            table.TableName = tableName;
            Ext.Object.each(table.Columns, function (columnName, column) {
                column.parentTable = table;
            });
        });
    },

    findTable: function (tableName) {
        var me = this;

        for (var tableName1 in me.tables) {
            if (String.Equ(tableName1, tableName))
                return me.tables[tableName1];
        }
    },

    findColumn: function (tableName, columnName) {
        var me = this,
            table = me.findTable(tableName);

        if (table) {
            for (var columnName1 in table.Columns) {
                if (String.Equ(columnName1, columnName))
                    return table.Columns[columnName1];
            }
        }
    },

    marginExpresses: function (formulars) {
        var me = this,
            viewmodel = me.viewmodel,
            $var,table,column;

        Ext.Object.each(formulars, function (xdatabind, express) {
            $var = viewmodel.parseVar(xdatabind);

            if (!$var.isVar) {
                table = me.findTable($var.tableName);
                column = table && table.Columns[$var.columnName];

                if (column)
                    column.express = express;
            }
        });
    }
});
