
Ext.define('YZSoft.form.aspx.grid.Repeater', {
    extend: 'YZSoft.form.grid.Repeater',
    mixins: ['YZSoft.form.aspx.field.mixins.Abstract'],

    constructor: function (config) {
        var me = this,
            config = config || {},
            attrs = config.attrs || {},
            cfg = {};

        //EmptyGrid
        cfg.emptyGrid = attrs.emptygrid || 'AutoAppendOneBlock';

        //XDataSource
        if (attrs.xdatasource)
            cfg.datasource = me.parseDataSource(attrs.xdatasource);

        //DataMap
        if (attrs.datamap)
            cfg.datamap = me.parseMap(attrs.datamap);

        //deletelastrow
        cfg.minBlockCount = String.Equ(attrs.deletelastrow, 'Denied') ? 1:0;

        Ext.apply(cfg, config);

        cfg.template = cfg.items;
        delete cfg.items;

        me.callParent([cfg]);
    }
});