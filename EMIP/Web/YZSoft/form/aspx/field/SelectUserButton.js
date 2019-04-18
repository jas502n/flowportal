
Ext.define('YZSoft.form.aspx.field.SelectUserButton', {
    extend: 'YZSoft.form.field.SelectUserButton',
    mixins: {
        base: 'YZSoft.form.aspx.field.mixins.Abstract',
        wrap: 'YZSoft.form.aspx.field.mixins.WrapButton'
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            attrs = config.attrs || {},
            cfg = {};


        //按钮文字
        //if (attrs.text)
        //    cfg.text = attrs.text;

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