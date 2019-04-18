
Ext.define('YZSoft.form.aspx.field.TimePicker', {
    extend: 'YZSoft.form.field.TimePicker',
    mixins: ['YZSoft.form.aspx.field.mixins.Abstract'],
    typemap: {
        timeminutes: 1,
        timeminutes15: 15,
        timeminutes30: 30,
        timehour:60
    },

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

        //Format
        if (attrs.type) {
            cfg.picker = {
                minuteScale: me.typemap[attrs.type.toLowerCase()]
            }
        }

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});