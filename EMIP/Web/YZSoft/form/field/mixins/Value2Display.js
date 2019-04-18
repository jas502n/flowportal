
Ext.define('YZSoft.form.field.mixins.Value2Display', {

    performBind: function (viewmodel, row) {
        var me = this,
            ds = me.getDatasource(),
            filtercolumn = me.getFilterColumn(),
            displayColumn = me.getDisplayColumn(),
            filter;

        me.row = row;

        if (ds && filtercolumn) {
            if (String.Equ(displayColumn, filtercolumn))
                me.setDisplayColumn(null);
            else
                me.id2text = true;

            me.updateBehavior && me.updateBehavior(me.id2text);

            ds.filter = ds.filter || {};
            ds.filter[filtercolumn] = {
                op: '=',
                token: me.bindings.value.tokens[0]
            };

            me.filter = Ext.create('YZSoft.src.viewmodel.bindable.Filter', row, ds.filter, {
                listeners: {
                    filterchanged: function (curfilter) {
                        me.onFilterChanged(viewmodel, curfilter);
                    }
                }
            });

            viewmodel.$bingings.add(me.filter);
        }
    },

    onFilterChanged: function (viewmodel, curfilter) {
        var me = this,
            ds = me.getDatasource(),
            row = me.row,
            datamap = me.getDatamap(),
            displayColumn = me.getDisplayColumn(),
            dsmgr = viewmodel.dsManager;

        dsmgr.getTable(ds, curfilter, function (rows) {
            var datarow = rows[0];

            if (!datarow)
                return;

            if (displayColumn)
                me.setDisplayText(datarow[displayColumn]);

            if (datamap)
                row.doMap(datarow, datamap);
        });
    },

    destroy: function () {
        this.filter && this.filter.destroy();
        return this.callParent(arguments);
    }
});