
Ext.define('YZSoft.form.aspx.field.Url', {
    extend: 'YZSoft.form.field.Url',
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

        //navigateurl
        if (attrs.navigateurl)
            cfg.value = attrs.navigateurl;

        //innerhtml
        if (attrs.innerhtml)
            cfg.text = attrs.innerhtml;

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});