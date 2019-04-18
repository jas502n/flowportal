
Ext.define('YZSoft.form.aspx.field.DataBrowserButton', {
    extend: 'YZSoft.form.field.DataBrowserButton',
    mixins: {
        base: 'YZSoft.form.aspx.field.mixins.Abstract',
        wrap: 'YZSoft.form.aspx.field.mixins.WrapButton'
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            attrs = config.attrs || {},
            cfg = {};

        //XDataSource
        if (attrs.xdatasource)
            cfg.datasource = me.parseDataSource(attrs.xdatasource);

        if (attrs.displaycolumns)
            cfg.displayColumns = me.parseDisplayColumns(attrs.displaycolumns);

        //DataMap
        if (attrs.datamap)
            cfg.datamap = me.parseMap(attrs.datamap);

        //MultiSelect
        cfg.singleSelection = !me.parseBool(attrs.multiselect, false);

        //AppendMode
        cfg.appendMode = attrs.appendmode || 'RemoveEmptyRow';

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.mixins.wrap.init.call(me);
    }
});