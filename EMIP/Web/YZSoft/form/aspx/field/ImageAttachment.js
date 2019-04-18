
Ext.define('YZSoft.form.aspx.field.ImageAttachment', {
    extend: 'YZSoft.form.field.ImageAttachment',
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

        //maximumfilesize
        if (attrs.maximumfilesize)
            cfg.maximumfilesize = attrs.maximumfilesize;

        //imagedisplaystyle
        if (attrs.imagedisplaystyle)
            cfg.imagedisplaystyle = attrs.imagedisplaystyle;

        Ext.apply(cfg, config);
        return me.callParent([cfg]);
    }
});