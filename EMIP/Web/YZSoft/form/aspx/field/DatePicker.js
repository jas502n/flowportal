
Ext.define('YZSoft.form.aspx.field.DatePicker', {
    extend: 'YZSoft.form.field.DatePicker',
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

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});