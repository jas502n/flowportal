
Ext.define('YZSoft.form.aspx.field.PositionMap', {
    extend: 'YZSoft.form.field.PositionMap',
    mixins: ['YZSoft.form.aspx.field.mixins.Abstract'],

    constructor: function (config) {
        var me = this,
            config = config || {},
            attrs = config.attrs || {},
            cfg = {};

        //OULevel
        if (attrs.oulevel)
            cfg.oulevel = attrs.oulevel;

        //DataMap
        if (attrs.datamap)
            cfg.datamap = me.parseMap(attrs.datamap);

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});