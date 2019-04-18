
Ext.define('YZSoft.src.viewmodel.Table', {
    extend: 'Ext.Evented',

    constructor: function (config) {
        var me = this;

        Ext.apply(me, config);
        me.callParent([config]);

        Ext.Object.each(me.Columns, function (columnName, columnCfg) {
            me.Columns[columnName] = Ext.create('YZSoft.src.viewmodel.Column', Ext.apply(columnCfg, {
                viewmodel: me.viewmodel,
                parentTable: me
            }));
        });

        for (var i = 0; i < me.Rows.length; i++) {
            me.Rows[i] = Ext.create('YZSoft.src.viewmodel.Row', {
                isBlockRoot: me.IsRepeatable || me.isRoot,
                data: me.Rows[i],
                viewmodel: me.viewmodel,
                parentTable: me
            });
        }
    },

    addColumn: function (config) {
        var me = this,
            viewmodel = me.viewmodel,
            column,express,$var;

        column = me.Columns[config.ColumnName] = Ext.create('YZSoft.src.viewmodel.Column', Ext.apply(config, {
            viewmodel: me.viewmodel,
            parentTable: me
        }));

        if (column.isVar) {
            express = viewmodel.formulars[column.ColumnName];
            if (express)
                column.express = express;

            $var = viewmodel.$varMaps[column.ColumnName];
            if (!$var) {
                viewmodel.$varMaps[column.ColumnName] = {
                    isVar: true,
                    tableName: me.TableName,
                    columnName: column.ColumnName

                }
            }
            else {
                $var.tableName = me.TableName;
            }
        }

        return column;
    },

    indexOfRow: function (row) {
        return Ext.Array.indexOf(this.Rows, row);
    },

    getDefaultRowData: function () {
        var me = this,
            data = {};

        Ext.Object.each(me.Columns, function (columnName, column) {
            if ('mapValue' in column)
                data[columnName] = column.mapValue;
            else if (column.DefaultValue !== null && column.DefaultValue !== undefined)
                data[columnName] = column.DefaultValue;
        });

        return data;
    },

    createNewRow: function (data) {
        var me = this,
            row;

        data = Ext.apply(me.getDefaultRowData(), data);

        row = Ext.create('YZSoft.src.viewmodel.Row', {
            isBlockRoot: true,
            data: data,
            viewmodel: me.viewmodel,
            parentTable: me
        });

        return row;
    },

    addRow: function (data, dirty) {
        var me = this,
            dirty = !!dirty,
            row = me.createNewRow(data);

        if (dirty)
            row.setDirty(true);

        me.Rows.push(row);
        me.fireEvent('addrow', me.Rows.length - 1, row);

        me.viewmodel.lastdataversion++;
        me.viewmodel.scheduleUpdateTask();
    },

    removeRowAt: function (index) {
        var me = this,
            row;

        if (index < me.Rows.length && index >= 0) {
            row = me.Rows[index];
            Ext.Array.erase(me.Rows, index, 1);
            me.fireEvent('removerow', row);
            row.destroy();

            me.viewmodel.lastdataversion++;
            me.viewmodel.scheduleUpdateTask();

            return row;
        }

        return false;
    },

    removeRow: function (row) {
        var me = this;

        return me.removeRowAt(me.indexOfRow(row));
    },

    removeAllRows: function (index) {
        var me = this,
            i;

        for (i = me.Rows.length - 1 ; i >= 0; i--) {
            me.removeRowAt(i);
        }
    },

    doMap: function (objects, map, appendModel) {
        this['doMap' + appendModel](data, map);
    },

    doMapAppend: function (objects, map) {
        var me = this,
            drow;

        Ext.each(objects, function (obj) {
            drow = me.mapToRowData(obj, map);
            me.addRow(drow, true);
        });
    },

    doMapClearAndAppend: function (objects, map) {
        var me = this;

        me.removeAllRows();
        me.doMapAppend(objects, map);
    },

    doMapRemoveEmptyRow: function (objects, map) {
        var me = this,
            row;

        for (var i = me.Rows.length-1; i >= 0 ; i--) {
            row = me.Rows[i];

            if (row.isDBRow() || row.getDirty())
                break;

            me.removeRowAt(i);
        }

        me.doMapAppend(objects, map);
    },

    mapToRowData: function (obj, map) {
        var me = this,
            drow = {},
            viewmodel = me.viewmodel,
            $var, tableName, column;

        Ext.Object.each(map, function (field, mapto) {
            $var = Ext.isString(mapto) ? viewmodel.parseVar(mapto) : mapto;
            tableName = $var.tableName;

            if (tableName == me.TableName && me.Columns[$var.columnName])
                drow[$var.columnName] = obj[field];
        });

        return drow;
    }
});