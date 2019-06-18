
Ext.define('YZSoft.form.grid.Repeater', {
    extend: 'Ext.Container',
    mixins: [
        'YZSoft.form.field.mixins.Base'
    ],
    xtype: 'yzrepeater',
    isRepeaterContainer: true,
    config: {
        template: null,
        datasource: null,
        datamap: null,
        allowAddRecord: true,
        emptyGrid: 'AutoAppendOneBlock', //AutoAppendOneBlock,KeepEmpty
        minBlockCount: 0,
        titleBarConfig: {
            title: RS.$('All__DetailTable'),
            titleAlign: 'left',
            cls: 'yz-titlebar-repeater',
            defaults: {
                align: 'right'
            }
        },
        addButton: {
            text: RS.$('All_Form_AddRecord'),
            cls: ['yz-button-flat', 'yz-button-noflex'],
            iconCls: 'yz-glyph yz-glyph-e907',
            padding: '7 10',
            style: 'background-color:white;border-radius:0px;'
        },
        repeaterItemConfig: {
            title: RS.$('All_Form_RecordTitle_FMT'),
            delButton: {
                text: RS.$('All__Delete')
            }
        }
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            initBlocks = 'initBlocks' in config ? config.initBlocks : 1,
            addButton = config.addButton,
            cfg;

        me.cntItems = Ext.create('Ext.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            }
        });

        if (config.attrs.title != undefined) {
            me.config.titleBarConfig.title = config.attrs.title;
        } else {
            me.config.titleBarConfig.title = RS.$('All__DetailTable');
        }
        me.titleBar = Ext.create('Ext.TitleBar', Ext.apply({
            title: config.title
        }, config.titleBarConfig, me.config.titleBarConfig));

        me.optionBar = Ext.create('Ext.Container', {
            cls: ['yz-container-border-top', 'yz-container-border-bottom', 'yz-repeatable-optcontainer'],
            layout: {
                type: 'vbox',
                align: 'stretch'
            }
        });

        cfg = {
            items: [me.titleBar, me.cntItems, me.optionBar]
        };

        Ext.apply(cfg, config);

        me.callParent([cfg]);
        me.addCls('yz-repeatable-container');

        me.cntItems.on({
            scope: me,
            add: 'updateIndex',
            remove: 'updateIndex'
        });
    },

    initialize: function () {
        var me = this,
            addButtonConfig = me.getAddButton();

        me.btnAdd = Ext.create('Ext.Button', Ext.apply({
            scope: me,
            handler: 'onAddBlockClick'
        }, addButtonConfig));

        me.optionBar.add(me.btnAdd);
    },

    updateAllowAddRecord: function (newValue) {
        this[newValue ? 'removeCls' : 'addCls']('yz-repeatable-container-denyaddrecord');
    },

    updateTitle: function (value) {
        this.titleBar.setTitle(value);
    },

    performBind: function (viewmodel, row) {
        var me = this,
            ds = me.getDatasource(),
            emptyGrid = me.getEmptyGrid(),
            tableName,
            table;

        tableName = me.getRepeaterBindTable(viewmodel);
        if (tableName) {
            table = row.lookupBlockDetailTable(tableName);
            if (!table)
                table = row.copyTable(tableName);
        }
        else {
            table = row.createTemporaryTable({
                AllowAddRecord: false
            });
        }


        if (ds) {
            if (ds.dsType == 'Table' && String.Equ(ds.datasource, table.DataSource) && String.Equ(ds.tableName, table.TableName) && Ext.isEmpty(ds.filter)) {
                //ds就是grid写入表
            }
            else {

                me.filter = Ext.create('YZSoft.src.viewmodel.bindable.Filter', row, ds.filter, {
                    listeners: {
                        filterchanged: function (curfilter) {
                            me.onFilterChanged(viewmodel, curfilter);
                        }
                    }
                });

                viewmodel.$bingings.add(me.filter);
            }
        }

        me.setAllowAddRecord(table.AllowAddRecord);

        Ext.each(me.config.blockVars, function (varname) {
            column = table.addColumn({
                ColumnName: varname,
                Type: 'String',
                isVar: true
            });

            Ext.each(table.Rows, function (row) {
                row.set(varname, '');
            });
        });

        if (table.Rows.length == 0 && table.AllowAddRecord && emptyGrid == 'AutoAppendOneBlock')
            table.addRow();

        me.refresh(viewmodel, table);
        me.table = table;
        me.row = row;
        table.grid = me;

        me.table.on({
            scope: me,
            addrow: 'onTableAddRow',
            removerow: 'onTableRemoveRow'
        });
    },

    onFilterChanged: function (viewmodel, curfilter) {
        var me = this,
            dsmgr = viewmodel.dsManager,
            ds = me.getDatasource(),
            datamap = me.getDatamap();

        dsmgr.getTable(ds, curfilter, function (rows) {
            me.table.doMapClearAndAppend(rows, datamap);
        });
    },

    getRepeaterBindTable: function (viewmodel) {
        var me = this,
            repeaterItem = me.createRepeaterItemInner(),
            blockFields, i;

        blockFields = viewmodel.getAllFields(repeaterItem, function (field) {
            return field.config && field.config.xdatabind;
        }, function (field) {
            return field.isRepeaterContainer;
        });

        for (i = 0; i < blockFields.length; i++) {
            var field = blockFields[i],
                xdatabind = field.config.xdatabind,
                $var = xdatabind && viewmodel.parseVar(xdatabind);

            if ($var && !$var.isVar) {
                table = viewmodel.schema.findTable($var.tableName);
                if (table && table.IsRepeatable)
                    return table.TableName;
            }
        }
    },

    refresh: function (viewmodel, table) {
        var me = this,
            items = [], i;

        Ext.each(table.Rows, function (row) {
            items.push(me.createRepeaterItem(viewmodel, row));
        });

        me.cntItems.setItems(items);
        me.updateIndex();
    },

    createRepeaterItemInner: function () {
        var me = this,
            template = template || me.getTemplate(),
            repeaterItemConfig = me.getRepeaterItemConfig(),
            repeaterItem;

        return Ext.create('YZSoft.form.grid.RepeaterItem', Ext.apply({
            items: template
        }, repeaterItemConfig));
    },

    createRepeaterItem: function (viewmodel, row) {
        var me = this,
            repeaterItem = me.createRepeaterItemInner();

        repeaterItem.row = row;

        repeaterItem.on({
            scope: me,
            deleteclick: 'onDeleteBlockClick'
        });

        viewmodel.performBind(repeaterItem, row);
        return repeaterItem;
    },

    onTableAddRow: function (index, row) {
        var me = this,
            table = me.table,
            viewmodel = table.viewmodel,
            item;

        item = me.createRepeaterItem(viewmodel, row);
        me.cntItems.insert(index,item);
    },

    onTableRemoveRow: function (row) {
        var me = this,
            table = me.table,
            viewmodel = table.viewmodel,
            block = me.getBlockByRow(row);

        block && me.cntItems.remove(block);
    },

    onAddBlockClick: function () {
        var me = this;

        if (me.table)
            me.table.addRow();
    },

    onDeleteBlockClick: function (block) {
        var me = this,
            table = me.table,
            row = block.row,
            minBlockCount = me.getMinBlockCount();

        if (me.cntItems.getItems().items.length <= minBlockCount)
            return;

        table.removeRow(row);
    },

    updateIndex: function () {
        var me = this,
            items = me.cntItems.getItems().items,
            ln = items.length,
            i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            item.fireEvent('indexChanged', i, ln);
        }
    },

    getBlockByRow: function (row) {
        var me = this;

        return me.cntItems.getItems().findBy(function (block) {
            return block.row === row;
        });
    }
});