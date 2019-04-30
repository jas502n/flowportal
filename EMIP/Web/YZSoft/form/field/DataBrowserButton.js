
Ext.define('YZSoft.form.field.DataBrowserButton', {
    extend: 'YZSoft.form.field.BrowserButtonAbstract',
    requires: [
        'YZSoft.src.viewmodel.bindable.Filter'
    ],
    mixins: [
    ],
    config: {
        iconCls: 'yz-glyph yz-glyph-e909',
        datasource: null,
        displayColumns: null
    },

    doTap: function (btn, e) {
        if (!this.getDatasource()) {
            Ext.Msg.alert(RS.$('All_Uniform_DataBrowserButton_MissDataSource'));
            return;
        }

        var me = this,
            row = me.getRow(),
            datasource = me.getDatasource(),
            displayColumns = me.getDisplayColumns(),
            filter = YZSoft.src.viewmodel.bindable.Filter.getFilter(row, datasource.filter);

        e.preventDefault();
        me.showBrowserWindow(filter);
    },

    showBrowserWindow: function (filter) {
        var me = this,
            datasource = me.getDatasource(),
            displayColumns = me.getDisplayColumns(),
            datamap = me.getDatamap(),
            singleSelection = me.getSingleSelection(),
            uids = [],
            mapColumns = [],
            pnl;

        datasource = Ext.apply({}, {
            filter: filter
        }, datasource);

        Ext.Object.each(datamap, function (columnName, mapto) {
            mapColumns.push(columnName);
        });

        pnl = Ext.create('YZSoft.src.panel.DataBrowser', {
            datasource: datasource,
            displayColumns: displayColumns,
            mapColumns: mapColumns,
            singleSelection: singleSelection,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function (rows, deep) {
                Ext.mainWin.pop(deep);
              
                me.doMap(rows);
            }
        });

        Ext.mainWin.push(pnl);
    }
});