
Ext.define('YZSoft.form.aspx.field.ChildFormLink', {
    extend: 'YZSoft.form.field.ChildFormLink',
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

        //FormApplication
        if (attrs.formapplication)
            cfg.app = attrs.formapplication;

        //Text
        if (attrs.innerhtml)
            cfg.text = attrs.innerhtml;

        //DataMap
        if (attrs.datamap)
            cfg.datamap = me.parseMap(attrs.datamap);

        //ParamsFill
        if (attrs.paramsfill)
            cfg.paramsFill = me.parseFilter(attrs.paramsfill);

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});