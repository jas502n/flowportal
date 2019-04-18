
Ext.define('YZSoft.src.viewmodel.ViewModel', {
    extend: 'Ext.Evented',
    requires: [
        'YZSoft.src.viewmodel.Schema',
        'YZSoft.src.viewmodel.Table',
        'YZSoft.src.viewmodel.BindingCollection',
        'YZSoft.src.viewmodel.DataSourceManager',
        'YZSoft.src.viewmodel.PaddingRequestCollection'
    ],
    $varMaps: null,
    $expresses: null,
    $formulars: null,
    $bingings: null,
    $requests:null,
    dataversion: 0,
    lastdataversion: 0,
    $initialized: false,

    constructor: function (form, config) {
        var me = this,
            rows = [];

        me.form = form;
        form.viewmodel = me;

        me.dsManager = Ext.create('YZSoft.src.viewmodel.DataSourceManager', {
            viewmodel: me
        });
        me.relayEvents(me.dsManager,'failure');

        me.$varMaps = {};
        me.$expresses = {};
        me.$formulars = Ext.create('YZSoft.src.viewmodel.BindingCollection', {});
        me.$bingings = Ext.create('YZSoft.src.viewmodel.BindingCollection', {});
        me.$requests = Ext.create('YZSoft.src.viewmodel.PaddingRequestCollection', {});
        me.rootTableConfig = {
            DataSource: '',
            TableName: '$vars',
            FormTable: true,
            IsRepeatable: false,
            AllowAddRecord: false,
            Columns: {
            },
            Rows: [{
            }]
        };

        Ext.apply(me, config);

        me.formulars = me.formulars || {};

        me.callParent([config]);

        me.schema = Ext.create('YZSoft.src.viewmodel.Schema', {
            viewmodel:me,
            tables: me.tables
        });

        me.schema.marginExpresses(me.formulars);

        me.rootTable = Ext.create('YZSoft.src.viewmodel.Table', Ext.apply(me.rootTableConfig, {
            isRoot: true,
            viewmodel: me
        }));

        Ext.each(me.globalVars, function (varname) {
            column = me.rootTable.addColumn({
                ColumnName: varname,
                Type: 'String',
                isVar: true
            });

            Ext.each(me.rootTable.Rows, function (row) {
                row.set(varname, '','init');
            });
        });

        me.rootRow = me.rootTable.Rows[0];

        if (me.schema.tables['Global']) //表单服务没有Global表
            me.rootRow.copyTable('Global');

        form.row = me.rootRow;
        me.performBind(form, me.rootRow );

        me.lastdataversion++;
        me.notify();

        me.$requests.on({
            done: function () {
                if (me.dataversion == me.lastdataversion) {
                    me.onInitialized();
                }
            }
        });
    },

    registerRequest: function (request) {
        var me = this;

        if (!me.$initialized)
            me.$requests.add(request);
    },

    onInitialized: function () {
        var me = this;

        me.$initialized = true;
        me.fireEvent('initialized', me);
    },

    getAllFields: function (container, matchFn, breakFn) {
        var me = this,
            fields = [];

        var getFields = function (item) {
            if (matchFn(item)) {
                fields.push(item);
            }

            if (item.isContainer) {
                if (!breakFn || !breakFn(item)) {
                    item.items.each(getFields);
                }
            }
        };

        container.items.each(getFields);
        return fields;
    },

    performBind: function (container, row) {
        var me = this,
            fields;

        fields = me.getAllFields(container, function (field) {
            return field.config.xdatabind || field.config.express || field.performBind;
        }, function (field) {
            return field.isRepeaterContainer;
        });

        Ext.each(fields, function (field) {
            me.performXDataBind(row, field);
        });

        row.eachBlockRow(function (row) {
            row.fireEvent('afterblockbind');
        });

        Ext.each(fields, function (field) {
            field.performBind && field.performBind(me, row);
        });

        fields = me.getAllFields(container, function (field) {
            return true;
        }, function (field) {
            return field.isRepeaterContainer;
        });

        Ext.each(fields, function (field) {
            me.performAfterBind(row, field);
            field.fireEvent('afterblockbind', me, row);
        });
    },

    performAfterBind: function (row, field) {
        var me = this,
            hiddenExpress = field.config.hiddenExpress,
            disableExpress = field.config.disableExpress;

        if (hiddenExpress) {
            var express = field.hiddenExpress = Ext.create('YZSoft.src.viewmodel.bindable.Express', row, hiddenExpress);
            if (express.isValid()) {
                express.on({
                    scope: me,
                    datachanged: function (newValue) {
                        field[newValue ? 'hide' : 'show']();
                    }
                });
                me.$bingings.add(express);

                field.on({
                    destroy: function () {
                        express.destroy();
                    }
                });
            }
        }

        if (disableExpress) {
            var express = field.disableExpress = Ext.create('YZSoft.src.viewmodel.bindable.Express', row, disableExpress);

            if (express.isValid()) {
                express.on({
                    scope: me,
                    datachanged: function (newValue) {
                        me.setFieldDisabled(field, newValue);
                    }
                });
                me.$bingings.add(express);

                field.on({
                    destroy: function () {
                        express.destroy();
                    }
                });
            }
        }
    },

    //根据表达式的值修改控件状态
    setFieldDisabled: function (field, disabled) {
        var databind = field.bindings && field.bindings.value,
            column = databind && databind.column;

        if (column.Writeable === false) //不能动态修改状态
            return;

        if (disabled) {
            field.removeCls('yz-field-editable');
            field.setDisabled && field.setDisabled(true);
        }
        else {
            field.addCls('yz-field-editable');
            field.setDisabled && field.setDisabled(false);
        }
    },

    performXDataBind: function (row, field) {
        var me = this,
            xdatabind = field.config.xdatabind,
            express = field.config.express,
            binding;

        if ((express || field.autoBind) && !xdatabind)
            xdatabind = field.config.xdatabind = Ext.id(null, '$$$var');

        if (xdatabind) {
            binding = me.bindField(row, xdatabind, field);

            if (express)
                binding.column.express = express;
        }
    },

    bindField: function (row, xdatabind, field) {
        var me = this,
            $var = me.parseVar(xdatabind),
            table,
            column, binding;

        if ($var.isVar) {
            column = row.parentTable.Columns[$var.columnName];
            if (!column) {
                column = row.parentTable.addColumn({
                    ColumnName: $var.columnName,
                    Type: 'String',
                    isVar: true
                });
            }
        }
        else {
            table = row.lookupBlockTable($var.tableName);
            if (!table)
                table = row.copyTable($var.tableName);

            if (row.parentTable !== table) {
                if (table.Rows.length == 0)
                    table.addRow({});

                row = table.Rows[0];
            }

            column = table.Columns[$var.columnName];
            if (!column)
                YZSoft.Error.raise(RS.$('All_ViewModel_Column_Miss'), $var.tableName, $var.columnName);
        }

        binding = Ext.create('YZSoft.src.viewmodel.bindable.XDataBind', row, column, field);
        me.$bingings.add(binding);

        return binding;
    },

    scheduleUpdateTask: function () {
        var me = this;

        if (!me.timer) {
            me.timer = Ext.defer(function () {
                me.doScheduleUpdate();
            }, 1);
        }
    },

    doScheduleUpdate: function () {
        var me = this;

        if (me.timer) {
            clearTimeout(me.timer)
            delete me.timer;
        }

        me.notify();
    },

    notify: function () {
        var me = this;

        Ext.Logger && Ext.Logger.log('dataversion' + me.dataversion + '    lastdataversion:' + me.lastdataversion);

        if (me.dataversion != me.lastdataversion) {
            for (var i = 0; i < 10; i++) {
                me.dataversion = me.lastdataversion;

                me.$formulars.each(function (binding) {
                    binding.notify();
                });

                if (me.dataversion == me.lastdataversion)
                    break;
            }

            me.$bingings.each(function (binding) {
                binding.notify();
            });
        }

        if (me.dataversion == me.lastdataversion) {
            if (!me.$initialized && me.$requests.getCount() == 0)
                me.onInitialized();
        }
    },

    parseVar: function (varname) {
        var me = this,
            varMaps = me.$varMaps || {},
            $var;

        if (!varname)
            return;

        $var = varMaps[varname];
        if ($var)
            return $var;

        $var = varMaps[varname] = me.parseVarName(varname);
        return $var
    },

    parseVarName: function (varname) {
        var me = this,
            index, names, len;

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

        column = me.schema.findColumn(tableName, columnName);

        if (column) {
            return {
                isColumn: true,
                tableName: column.parentTable.TableName,
                columnName: column.ColumnName
            };
        }
        else {
            YZSoft.Error.raise(RS.$('All_ViewModel_Var_Miss'), varname);
        }
    },

    getFormData: function () {
        var me = this,
            data = {},
            rv = {};

        me.rootRow.getFormData(data);

        rv = {
            FormData: data,
            vars: data.$vars[0].$vars
        }

        delete data.$vars;
        return rv;
    }
});