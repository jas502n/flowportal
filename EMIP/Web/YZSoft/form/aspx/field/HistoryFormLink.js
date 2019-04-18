
Ext.define('YZSoft.form.aspx.field.HistoryFormLink', {
    extend: 'YZSoft.form.field.HistoryFormLink',
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

        //Text
        if (attrs.innerhtml)
            cfg.activeText = attrs.innerhtml;

        //EmptyText
        if (attrs.emptytext)
            cfg.emptyText = attrs.emptytext;

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});