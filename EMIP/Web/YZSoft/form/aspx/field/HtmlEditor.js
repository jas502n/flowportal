
Ext.define('YZSoft.form.aspx.field.HtmlEditor', {
    extend: 'YZSoft.form.field.HtmlEditor',
    mixins: ['YZSoft.form.aspx.field.mixins.Abstract'],

    constructor: function (config) {
        var me = this,
            config = config || {},
            attrs = config.attrs || {},
            cfg = {};

        //FieldName
        if (attrs.fieldname) {
            cfg.label = attrs.fieldname;
        }
        else {
            var bind = me.parseVarName(attrs.xdatabind);

            if (bind)
                cfg.label = bind.columnName;
        }

        //XDataBind
        if (attrs.xdatabind)
            cfg.xdatabind = attrs.xdatabind;

        //初始值
        if (attrs.innerhtml)
            cfg.value = attrs.innerhtml;

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});