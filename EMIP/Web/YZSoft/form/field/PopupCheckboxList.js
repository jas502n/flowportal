
Ext.define('YZSoft.form.field.PopupCheckboxList', {
    extend: 'YZSoft.src.field.PopupCheckboxList',
    mixins: [
        'YZSoft.form.field.mixins.ListBase'
    ],
    config: {
        labelWidth: 100,
        datasource: null,
        datamap: null
    },

    constructor: function (config) {
        var me = this,
            config = config || {};

        if (config.datasource)
            config.store = true;

        me.callParent(arguments);
    },

    performBind: function (viewmodel, row) {
        var me = this,
            ds = me.getDatasource();

        me.row = row;

        if (ds) {
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
            store = me.getStore(),
            dsmgr = viewmodel.dsManager,
            store;

        dsmgr.getTable(ds, curfilter, function (rows) {
            store.setData(me.regularRows(rows));
        });
    },

    setValue: function (value, byviewmodel) {
        var me = this;

        if (byviewmodel)
            me.getInitialConfig().value = value;

        me.callParent(arguments);
    },

    updateValue: function (newValue, oldValue) {
        var me = this,
            row = me.row,
            datamap = me.getDatamap();

        me.callParent(arguments);

        //绑定之前不做map
        if (row && datamap && me.record)
            row.doMap(Ext.apply({}, me.record.data, me.record.raw), datamap);
    },

    destroy: function () {
        this.filter && this.filter.destroy();
        return this.callParent(arguments);
    }
});