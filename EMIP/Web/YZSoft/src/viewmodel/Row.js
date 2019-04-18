
Ext.define('YZSoft.src.viewmodel.Row', {
    extend: 'Ext.Evented',
    requires: [
        'YZSoft.src.viewmodel.bindable.Express'
    ],
    isRow: true,
    config: {
        dirty:false
    },
    priority: {
        beforeinitialize: {
            enter:5,
            db:4,
            express:3,
            map:2,
            init:1,
            none:0
        },
        initialized: {
            enter:3,
            express:3,
            map:3,
            db:2,
            init:1,
            none:0
        }
    },

    constructor: function (config) {
        var me = this,
            viewmodel = config.viewmodel,
            parentTable = config.parentTable;

        Ext.apply(me, {
            expresses: {},
            tables: {},
            action: {}
        });

        Ext.apply(me, config);
        me.callParent([config]);

        Ext.Object.each(me.tables, function (tableName, tableCfg) {
            me.tables[tableName] = Ext.create('YZSoft.src.viewmodel.Table', Ext.apply(tableCfg, {
                viewmodel: me.viewmodel,
                parentRow: me
            }));
        });

        me.on({
            single: true,
            afterblockbind: function () {
                me.applyExpresses();
            }
        });
    },

    getBlockRootRow: function () {
        return this.isBlockRoot ? this : this.parentTable.parentRow;
    },

    copyTable: function (tableName) {
        var me = this,
            viewmodel = me.viewmodel,
            schema = viewmodel.schema,
            srcTablle = schema.tables[tableName],
            tableCfg;

        tableCfg = Ext.apply({
        }, srcTablle);

        Ext.Object.each(tableCfg.Columns, function (columnName, column) {
            tableCfg.Columns[columnName] = Ext.apply({}, column);
            delete tableCfg.Columns[columnName].parentTable;
        });

        tableCfg.Rows = [];

        Ext.each(srcTablle.Rows, function (srcRow) {
            if (!me.data.RelationRowGuid ||
                !srcRow.RelationParentRowGuid ||
                me.data.RelationRowGuid === srcRow.RelationParentRowGuid) {
                tableCfg.Rows.push(Ext.clone(srcRow));
            }
        });

        return me.tables[tableName] = Ext.create('YZSoft.src.viewmodel.Table', Ext.apply(tableCfg, {
            viewmodel: viewmodel,
            parentRow: me
        }));
    },

    createTemporaryTable: function (cfg) {
        var me = this,
            viewmodel = me.viewmodel,
            tableName = me.getNewTableName('$$$childtable'),
            tableCfg;

        tableCfg = Ext.apply({
            DataSource: '',
            TableName: tableName,
            isTemporary: true,
            IsRepeatable: true,
            AllowAddRecord: false,
            Columns: {
            },
            Rows: []
        },cfg);

        return me.tables[tableName] = Ext.create('YZSoft.src.viewmodel.Table', Ext.apply(tableCfg, {
            viewmodel: viewmodel,
            parentRow: me
        }));
    },

    lookupBlockCell: function ($var) {
        var me = this,
            table = me.lookupBlockTable($var.tableName),
            column = table && table.Columns[$var.columnName];

        if (column) {
            return {
                row: table === me.parentTable ? me : table.Rows[0],
                column: column
            }
        }
    },

    lookupBlockTable: function (tableNameLook) {
        var me = this;

        if (me.parentTable.TableName == tableNameLook)
            return me.parentTable;

        for (tableName in me.tables) {
            var table = me.tables[tableName];

            if (!table.IsRepeatable) {
                if (table.TableName == tableNameLook)
                    return table;
            }
        }
    },

    lookupBlockDetailTable: function (tableName) {
        var me = this;

        for (ctableName in me.tables) {
            var table = me.tables[ctableName];

            if (table.IsRepeatable) {
                if (table.TableName == tableName)
                    return table;
            }
        }
    },

    lookupDependencyUpInner: function ($var) {
        var me = this,
            dependency;

        dependency = me.lookupBlockCell($var);
        if (dependency)
            return dependency;

        if (me.parentTable.parentRow)
            return me.parentTable.parentRow.lookupDependencyUpInner($var);
    },

    lookupDependencyUp: function (varname) {
        var me = this,
            viewmodel = me.viewmodel,
            $var = viewmodel.parseVar(varname),
            dependency;

        //从本block向上查找
        return me.lookupDependencyUpInner($var);
    },

    lookupDependency: function (varname) {
        var me = this,
            viewmodel = me.viewmodel,
            $var = viewmodel.parseVar(varname),
            dependency;

        //从本block向上查找
        dependency = me.lookupDependencyUpInner($var);
        if (dependency)
            return dependency;

        return {
            isRuntimeDependency: true,
            row: me,
            var: $var
        };
    },

    eachBlockRow: function (fn) {
        var me = this;

        if (fn(me) === false)
            return;

        Ext.Object.each(me.tables, function (tableName, table) {
            if (table.IsRepeatable)
                return;

            return Ext.each(table.Rows, function (row) {
                if (fn(row) === false)
                    return false;
            });
        });
    },

    eachChildTable: function (fn, deep) {
        var me = this,
            rv;

        Ext.Object.each(me.tables, function (tableName,table) {
            if (!table.IsRepeatable)
                return;

            if (fn(table) === false)
                return false;

            if (deep) {
                rv = Ext.each(table.Rows, function (row) {
                    rv = Ext.Object.each(row.tables, function (tableName, table) {
                        if (table.IsRepeatable)
                            return;

                        if (fn(table) === false)
                            return false;
                    });
                    if (rv === false)
                        return false;

                    rv = row.eachChildTable(fn, deep);
                    if (rv === false)
                        return false;

                });
                if (rv === false)
                    return false;
            }
        });
    },

    getRuntimeValue: function ($var, convert) {
        var me = this,
            rv = [];

        me.getBlockRootRow().eachChildTable(function (table) {
            if (table.TableName == $var.tableName) {
                Ext.each(table.Rows, function (row) {
                    rv.push(row.get($var.columnName, convert));
                });
            }
        },true);

        return rv;
    },

    applyExpresses: function () {
        var me = this,
            parentTable = me.parentTable,
            express;

        Ext.Object.each(parentTable.Columns, function (columnName, column) {
            if (column.express) {
                express = Ext.create('YZSoft.src.viewmodel.bindable.Express', me, column.express);
                if (express.isValid()) {
                    me.expresses[columnName] = express;
                    express.on({
                        scope: me,
                        datachanged: function (newValue) {
                            me.set(columnName, newValue, 'express', true);
                        }
                    });
                    me.viewmodel.$formulars.add(express);
                }
            }
        });
    },

    set: function (columnName, value, action, ingoreDirty) {
        var me = this,
            viewmodel = me.viewmodel,
            action = action || 'enter',
            prioritys = me.priority[viewmodel.$initialized ? 'initialized' : 'beforeinitialize'],
            curpriority = prioritys[action],
            orgaction = columnName in me.data ? (me.action[columnName] || 'db') : 'none',
            orgpriority = prioritys[orgaction],
            column = me.parentTable.Columns[columnName],
            orgValue = me.data[columnName];//column.tryParseValue(value);

        if (curpriority >= orgpriority) {
            if (orgValue != value) {
                if (ingoreDirty === true || (orgValue === undefined && Ext.isEmpty(value))) {

                }
                else {
                    me.setDirty(true);
                }

                me.data[columnName] = value;
                me.viewmodel.lastdataversion++;
                me.viewmodel.scheduleUpdateTask();
            }

            me.action[columnName] = action;
        }
    },

    get: function (columnName, convert) {
        var me = this,
            value = me.data[columnName],
            column = me.parentTable.Columns[columnName];

        if (convert === true && column)
            value = column.parseValue(value);

        return value;
    },

    getNewTableName: function (perfix) {
        var me = this,
            perfix = perfix || '$$$temporarytable',
            tableName;

        for (var i = 0; ; i++) {
            tableName = perfix + i.toString();
            if (!me.lookupBlockDetailTable(tableName))
                return tableName;
        }
    },

    getFormData: function (data, relationParentRowGuid) {
        var me = this,
            relationParentRowGuid;

        relationParentRowGuid = me.getFormDataOfBlock(data, relationParentRowGuid);

        me.eachChildTable(function (ctable) {
            Ext.each(ctable.Rows, function (row) {
                row.getFormData(data, relationParentRowGuid);
            });
        },false);
    },

    getFormDataOfBlock: function (data, relationParentRowGuid) {
        var me = this,
            table, rowdata, relationRowGuid;

        me.eachBlockRow(function (row) {
            table = row.parentTable;

            if (table.TableName == 'Global')
                return;

            rowdata = row.getFormDataOfRow();
            formtable = data[table.TableName] = data[table.TableName] || [];

            if (row === me && table.IsRepeatable)
                relationRowGuid = rowdata["RelationRowGuid"] = formtable.length + 1;

            if (relationParentRowGuid)
                rowdata["RelationParentRowGuid"] = relationParentRowGuid;

            formtable.push(rowdata);
        });

        return relationRowGuid;
    },

    getFormDataOfRow: function () {
        var me = this,
            table = me.parentTable,
            row = {},
            vars = {},
            column;

        if (table.IsRepeatable) {
            var keys = {};
            Ext.Object.each(table.Columns, function (columnName, column) {
                if (column.PrimaryKey && me.data.hasOwnProperty(columnName)) {
                    keys[columnName] = me.data[columnName];
                }
            });

            row['RowPrimaryKeys'] = Ext.Object.toQueryString(keys);
        }

        Ext.Object.each(me.data, function (columnName, value) {
            column = table.Columns[columnName];
            if (column.isVar)
                vars[columnName] = value;
            else
                row[columnName] = value;
        });

        row.$vars = vars;
        return row;
    },

    isDBRow: function () {
        var me = this,
            table = me.parentTable,
            column;

        for (var columnName in table.Columns) {
            column = table.Columns[columnName];
            if (column.PrimaryKey) {
                if (!Ext.isEmpty(me.data[columnName]))
                    return true;
            }
        }
    },

    doMap: function (data, map) {
        var me = this;

        Ext.Object.each(map, function (field, mapto) {
            var value = data[field];

            me.doMapSingle(mapto, value);
        });
    },

    doMapSingle: function ($var, value, childblock) {
        var me = this,
            viewmodel = me.viewmodel,
            $var = Ext.isString($var) ? viewmodel.parseVar($var) : $var;

        me.eachBlockRow(function (row) {
            if (row.parentTable.TableName == $var.tableName) {
                if (childblock)
                    row.parentTable.Columns[$var.columnName].mapValue = value;

                row.set($var.columnName,value,'map');
                return false;
            }
        });

        me.eachChildTable(function (table) {
            Ext.each(table.Rows, function (row) {
                row.doMapSingle($var,value, true);
            });
        },false);
    },

    doMapGrid: function (data, map, appendModel) {
        var me = this,
            tableNames = me.getMapTargetTableNames(map);

        Ext.each(tableNames, function (tableName) {
            me.eachChildTable(function (table) {
                if (table.TableName == tableName) {
                    table['doMap' + appendModel](data, map);
                }
            }, true);
        });
    },

    getMapTargetTableNames: function (map) {
        var me = this,
            map = map || {},
            viewmodel = me.viewmodel,
            tableNames = [],
            $var;

        Ext.Object.each(map, function (field, mapto) {
            $var = map[field] = Ext.isString(mapto) ? viewmodel.parseVar(mapto) : mapto;
            tableName = $var.tableName;

            if (tableName && !Ext.Array.contains(tableNames, tableName))
                tableNames.push(tableName);
        });

        return tableNames;
    },

    destroy: function () {
        var me = this;

        Ext.Object.each(me.expresses, function (columnName, express) {
            express.destroy();
        });
    }
});