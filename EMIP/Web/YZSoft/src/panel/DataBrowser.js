
Ext.define('YZSoft.src.panel.DataBrowser', {
    extend: 'Ext.Container',
    requires: [
        'Ext.util.Format'
    ],
    config: {
        style: 'background-color:#fff;',
        singleSelection: false,
        datasource: null,
        displayColumns: null,
        mapColumns: null
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            datasource = Ext.clone(config.datasource),
            filter = datasource.filter || {},
            displayColumns = config.displayColumns,
            mapColumns = config.mapColumns,
            singleSelection = config.singleSelection,
            isTableDS = datasource.tableName,
            realDisplayColumns,
            cfg;

        me.selection = [];

        delete datasource.filter;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/DataSource.ashx'),
            async: false,
            params: Ext.apply({
                method: 'GetDataSourceSchema'
            }, datasource),
            success: function (action) {
                me.dsSchema = action.result.Tables[0];
            }
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/BPM/DataSource.ashx'),
            async: false,
            params: Ext.apply({
                method: 'GetDataSourceParams'
            }, datasource),
            success: function (action) {
                me.dsParams = action.result.Tables[0].Columns;
                Ext.each(me.dsParams, function (dsParam) {
                    dsParam.supportOp = action.result.supportOp;
                });
            }
        });

        realDisplayColumns = me.realDisplayColumns = me.regularDisplayColumns(displayColumns, mapColumns, me.dsSchema);

        //根据数据源查询参数，获得能动态查询的参数
        var dynSearchParams = [];
        Ext.each(me.dsParams, function (dsparam) {
            //去掉固定filter项目
            if (me.isFixFilter(filter, dsparam.ColumnName))
                return;

            //如果是table数据源，只查询可显示列
            if (isTableDS) {
                var exist = Ext.Array.findBy(realDisplayColumns, function (displayColumn) {
                    if (String.Equ(displayColumn.columnName, dsparam.ColumnName))
                        return true;
                });

                if (!exist)
                    return;

                //为dsparam添加displayName列
                var displayColumn = me.findDisplayColumn(realDisplayColumns, dsparam.ColumnName);
                if (displayColumn)
                    dsparam.displayName = displayColumn.displayName;
            }

            dynSearchParams.push(dsparam);
        });

        //创建store
        var fields = [];
        Ext.each(me.dsSchema.Columns, function (column) {
            fields.push(column.ColumnName);
        });

        var supportAllSearchParams = [];
        Ext.each(dynSearchParams, function (dsParam) {
            if (dsParam.DataType && dsParam.DataType.name == 'String')
                supportAllSearchParams.push(dsParam.ColumnName);
        });

        var allOutputColumns = [];
        Ext.each(realDisplayColumns, function (displayColumn) {
            allOutputColumns.push(displayColumn.columnName);
        });

        me.store = Ext.create('Ext.data.Store', {
            fields: fields,
            autoLoad: false,
            clearOnPageLoad: true,
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                actionMethods: { read: 'POST' },
                type: 'ajax',
                url: YZSoft.$url(me, 'databrowser/DataBrowser.ashx?method=GetData'),
                extraParams: {
                    ds: Ext.util.Base64.encode(Ext.encode(datasource)),
                    filters: Ext.util.Base64.encode(Ext.encode(filter)), //固定filter
                    supportAllSearchParams: Ext.util.Base64.encode(Ext.encode(supportAllSearchParams)), //all搜索列
                    allOutputColumns: Ext.util.Base64.encode(Ext.encode(allOutputColumns)), //结果集包含列
                    params: Ext.util.Base64.encode(Ext.encode([]))
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children',
                    totalProperty: 'total'
                }
            },
            listeners: {
                load: function (store, records, successful, operation, eOpts) {
                    if (!successful)
                        return;

                    store.each(function (record) {
                        if (me.isRecordSelected(record)) {
                            me.list.doItemDeselect(me.list, record); //不调用classMap中已经有选中标志，不会添加选中cls，如搜索选中001->搜索001->搜索002->再搜索001 不显示选中
                            me.list.doItemSelect(me.list, record);
                        }
                    });
                }
            }
        });

        me.list = me.createList(me.store, realDisplayColumns);

        me.list.on({
            single: true,
            painted: function () {
                me.store.load();
            }
        });

        //将数据源可动态查询参数转化为ExtSearchPanel查询参数
        var params = [];
        Ext.each(dynSearchParams, function (dsparam) {
            params.push({
                name: dsparam.ColumnName,
                displayName: dsparam.displayName || dsparam.ColumnName,
                dataType: dsparam.DataType,
                supportOp: dsparam.supportOp
            });
        });

        //对table数据源，添加全文搜索
        if (isTableDS) {
            me.allParam = {
                isAll: true,
                name: 'all',
                op: 'like'
            };
        }

        me.btnBack = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-color-normal', 'yz-button-titlebar'],
            height: 40,
            iconCls: 'yz-glyph-s16 yz-glyph yz-glyph-e1000',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me, me);
            }
        });

        if (me.allParam) {
            me.search = Ext.create('YZSoft.src.field.Search', {
                placeHolder: RS.$('All__Search'),
                flex: 1,
                margin: 0,
                listeners: {
                    scope: me,
                    beforeactivesearch: 'onActiveSearch',
                    cancelsearch: 'onCancelSearch',
                    searchClick: 'onSearchClick'
                }
            });
        }
        else {
            me.search = Ext.create('Ext.Component', {
                flex: 1
            });
        }

        me.sheetFilter = Ext.create('YZSoft.src.panel.databrowser.SearchSheet', {
            params: params,
            hideOnMaskTap: true,
            back: function () {
                me.sheetFilter.hide();
            },
            reset: function () {
                me.store.loadPage(1,{
                    params: {
                        params: Ext.util.Base64.encode(Ext.encode([])),
                    },
                    mask: false,
                    delay: false
                });
            },
            fn: function (params) {
                me.sheetFilter.hide();

                me.store.loadPage(1, {
                    params: {
                        params: Ext.util.Base64.encode(Ext.encode(params)),
                    },
                    mask: false,
                    delay: false
                });
            }
        });

        me.btnFilter = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            height: 40,
            iconCls: 'yz-glyph-s18 yz-glyph yz-glyph-e90a',
            iconAlign: 'right',
            align: 'right',
            hidden: params.length == 0,
            handler: function () {
                Ext.Viewport.add(me.sheetFilter);
                me.sheetFilter.show();
            }
        });

        me.titleBar = Ext.create('Ext.Container', {
            docked:'top',
            cls: ['yz-searchbar', 'yz-padding-0'],
            style: (application.statusbarOverlays ? 'padding-top:27px' : '') + 'border-bottom-width:0px!important',
            padding: '1 0 0 0',
            minHeight:0,
            layout: {
                type: 'hbox',
                align:'center'
            },
            items: [me.btnBack, me.search, me.btnFilter]
        });

        me.btnOK = Ext.create('Ext.Button', {
            text: RS.$('All__OK'),
            cls: ['yz-button-flat', 'yz-button-selectok'],
            minWidth:100,
            height: 40,
            align: 'right',
            disabled:true,
            handler: function () {
                var selection = me.selection;
                if (selection.length)
                    me.onok(selection);
            }
        });

        me.selectBar = Ext.create('Ext.Container', {
            docked: 'bottom',
            cls: ['yz-select-bar'],
            minHeight: 0,
            hidden: singleSelection,
            layout: {
                type: 'hbox',
                align: 'center'
            },
            items: [{xtype:'component',flex:1},me.btnOK]
        });

        cfg = {
            layout: 'fit',
            items: [me.titleBar, me.list, me.selectBar]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope:me,
            selectionchange: 'onSelectionChange'
        });
    },

    updateSingleSelection: function (newValue) {
        var me = this;
        me.list[newValue ? 'removeCls' : 'addCls']('yz-list-selmode-m');
        me.list[newValue ? 'addCls' : 'removeCls']('yz-list-selmode-s');
    },

    createList: function (store, displayColumns) {
        var me = this,
            displayColumns = displayColumns || [],
            items = [];
    
        for (var i = 0; i < displayColumns.length; i++) {
            var displayColumn = displayColumns[i];
            items.push([
                '<div class="yz-layout-columns item">',
                    '<div class="label">',
                        displayColumn.displayName || displayColumn.columnName,
                    '</div>',
                    '<div class="sp"></div>',
                    '<div class="yz-column-center text">',
                        '{[this.renderValue(values,' + i + ')]}',
                    '</div> ',
                '</div>'
            ].join(''));
        }

        return Ext.create('Ext.dataview.List', {
            store: store,
            cls:'yz-list-firstitemnotopborder',
            loadingText: false,
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            plugins: [{
                xclass: 'YZSoft.src.plugin.ListPaging',
                autoPaging: true
            }],
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            disableSelection: true,
            emptyText: '',
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-databrowser'],
            selectedCls: 'yz-item-selected',
            itemTpl: Ext.create('Ext.XTemplate',
                '<div class="yz-layout-columns">',
                    '<div class="yz-column-left yz-align-vcenter yz-list-item-check-column">',
                        '<div class="check"></div>',
                    '</div>',
                    '<div class="yz-column-center body">',
                        items.join(''),
                    '</div>',
                    '<div class="yz-column-right yz-align-vcenter yz-list-item-more-column">',
                        '<div class="yz-list-item-more"></div>',
                    '</div>',
                '</div>', {
                    renderValue: function (values,columnIndex) {
                  
                        var column = displayColumns[columnIndex],
                            value = values[column.columnName];

                        return me.renderValue(column.dataType.name, value);
                    }
                }
            ),
            listeners: {
                scope: me,
                itemtap: 'onItemTap'
            }
        });
    },

    renderValue: function (dataTypeName,value) {
        var me = this,
            emptyText = '<div class="emptytext">' + RS.$('All__Empty') + '</div>';

        switch (dataTypeName) {
            case 'Decimal':
            case 'Double':
            case 'Single':
            case 'Int16':
            case 'Int32':
            case 'Int64':
            case 'UInt16':
            case 'UInt32':
            case 'UInt64':
            case 'SByte':
            case 'Byte':
                return Ext.isEmpty(value) ? emptyText : value;
            case 'DateTime':
                if (Ext.isDate(value))
                    value = Ext.Date.format(value, 'Y-m-d H:i:s');

                return value || emptyText;
            case 'Char':
            case 'String':
                return value || emptyText;
            case 'Boolean':
                return value || emptyText;
            default:
                return Ext.isEmpty(value) ? emptyText : value;
        }
    },

    onItemTap: function (list, index, target, record, e, eOpts) {
        var me = this,
            singleSelection = me.getSingleSelection();

        if (singleSelection) {
            if (e.getTarget('.yz-list-item-more-column'))
                me.onMoreTap(record);
            else
                me.select(record);
        }
        else {
            if (e.getTarget('.yz-list-item-check-column')) {
                if (me.isRecordSelected(record))
                    me.deselect(record);
                else
                    me.select(record);
            }
            else {
                me.onMoreTap(record);
            }
        }
    },

    onMoreTap: function (record) {
        var me = this,
            displayColumns = me.realDisplayColumns,
            selected = me.isRecordSelected(record),
            singleSelection = me.getSingleSelection(),
            pnl;

        pnl = Ext.create('YZSoft.src.panel.databrowser.RecordDetail', {
            displayColumns: displayColumns,
            record: record,
            selected: selected,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function (record) {
                if (singleSelection) {
                    me.select(record, 2);
                }
                else {
                    Ext.mainWin.pop();
                    if (!selected)
                        me.select(record);
                    else
                        me.deselect(record);
                }
            }
        });

        Ext.mainWin.push(pnl);
    },

    regularDisplayColumns: function (displayColumns, mapColumns, schema) {
        var me = this,
            rv = [];

        displayColumns = displayColumns || [];
        mapColumns = mapColumns || [];

        Ext.each(displayColumns, function (displayColumn) {
            var column = me.findSchemaColumn(schema, displayColumn.columnName);
            if (column && !me.findDisplayColumn(rv, column.ColumnName)) {
                rv.push(Ext.apply(Ext.clone(displayColumn), {
                    columnName: column.ColumnName,
                    dataType: column.DataType,
                    width: displayColumn.width
                }));
            }
        });

        var displayColumnExist = rv.length != 0;
        Ext.each(mapColumns, function (columnName) {
            var column = me.findSchemaColumn(schema, columnName);
            if (column && !me.findDisplayColumn(rv, column.ColumnName)) {
                rv.push({
                    columnName: column.ColumnName,
                    dataType: column.DataType,
                    hidden: displayColumnExist
                });
            }
        });

        if (rv.length == 0) {
            Ext.each(schema.Columns, function (column) {
                rv.push({
                    columnName: column.ColumnName,
                    dataType: column.DataType
                });
            });
        }

        return rv;
    },

    findSchemaColumn: function (schema, columnName) {
        return Ext.Array.findBy(schema.Columns, function (column) {
            if (String.Equ(column.ColumnName, columnName))
                return true;
        });
    },

    findDisplayColumn: function (displayColumns, columnName) {
        return Ext.Array.findBy(displayColumns, function (displayColumn) {
            if (String.Equ(displayColumn.columnName, columnName))
                return true;
        });
    },

    isFixFilter: function (filters, columnName) {
        for (var filterColumnName in filters) {
            if (String.Equ(filterColumnName, columnName))
                return true;
        }
    },

    onActiveSearch: function (search) {
        var me = this;

        search.cancel.show();
        me.btnFilter.hide();
    },

    onCancelSearch: function (search) {
        var me = this,
            keyword = search.getValue();

        search.cancel.hide();
        me.btnFilter.show();

        search.setValue('');
        if (keyword)
            me.onClearSearch(210);
    },

    onSearchClick: function (search, value, e) {
        var me = this,
            param = Ext.clone(me.allParam);

        param.value = value;
        me.store.loadPage(1,{
            params: {
                params: Ext.util.Base64.encode(Ext.encode([param])),
            },
            mask: false,
            delay: false
        });
    },

    onClearSearch: function (delay) {
        var me = this;

        me.store.loadPage(1, {
            params: {
                params: Ext.util.Base64.encode(Ext.encode([])),
            },
            mask: false,
            delay: delay || 250
        });
    },

    select: function (record, deep) {
        var me = this,
            singleSelection = me.getSingleSelection();

        if (singleSelection) {
            me.onok([record.data], deep);
        } else {
            me.selection.push(Ext.clone(record.data));
            me.list.doItemSelect(me.list, record);
            me.fireEvent('selectionchange');
        }
    },

    deselect: function (record) {
        var me = this,
            selitem = me.getSelectedItem(record);

        Ext.Array.remove(me.selection, selitem);
        me.list.doItemDeselect(me.list, record);
        me.fireEvent('selectionchange');
    },

    getSelectedItem: function (record) {
        var me = this,
            selection = me.selection;

        return Ext.Array.findBy(selection,function (selitem) {
            if (me.isEquRecord(selitem, record))
                return true;
        });
    },

    isRecordSelected: function (record) {
        return !!this.getSelectedItem(record);
    },

    isEquRecord: function (selitem, record) {
        var me = this;

        for (var p in record.data) {
            if (p == 'id')
                continue;

            if (!(p in selitem))
                return false;

            if (record.data[p] !== selitem[p])
                return false;
        }

        return true;
    },

    onSelectionChange: function () {
        var me = this,
            rows = me.selection;

        me.btnOK.setDisabled(!rows.length);

        if (rows.length)
            me.btnOK.setText(Ext.String.format('{0}({1})', RS.$('All__OK'), rows.length));
        else
            me.btnOK.setText(RS.$('All__OK'));
    },

    onok: function (rows, deep) {
        var me = this;

        if (me.config.fn)
            me.config.fn.call(me.scope || me, rows, deep || 1, me);
    }
});