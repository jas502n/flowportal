
Ext.define('YZSoft.form.aspx.field.SelectOUButton', {
    extend: 'YZSoft.form.field.SelectOUButton',
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

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.mixins.wrap.init.call(me);
    }
});