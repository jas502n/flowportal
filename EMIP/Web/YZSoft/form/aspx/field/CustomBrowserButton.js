
Ext.define('YZSoft.form.aspx.field.CustomBrowserButton', {
    extend: 'YZSoft.form.field.CustomBrowserButton',
    mixins: {
        base: 'YZSoft.form.aspx.field.mixins.Abstract',
        wrap: 'YZSoft.form.aspx.field.mixins.WrapButton'
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            attrs = config.attrs || {},
            cfg = {};

        //Filter
        if (attrs.filter)
            cfg.filter = me.parseFilter(attrs.filter);

        //DataMap
        if (attrs.datamap)
            cfg.datamap = me.parseMap(attrs.datamap);

        //AppendMode
        cfg.appendMode = attrs.appendmode || 'RemoveEmptyRow';

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.mixins.wrap.init.call(me);
    }
});