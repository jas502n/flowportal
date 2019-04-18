
Ext.define('YZSoft.form.aspx.field.PopupCheckboxList', {
    extend: 'YZSoft.form.field.PopupCheckboxList',
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

        //XDataBind
        if (attrs.xdatabind)
            cfg.xdatabind = attrs.xdatabind;

        if (attrs.xdatasource) { //使用数据源
            cfg.datasource = me.parseDataSource(attrs.xdatasource);

            if (attrs.valuecolumn)
                cfg.valueField = attrs.valuecolumn;

            if (attrs.displaycolumn)
                cfg.displayField = attrs.displaycolumn;

            //DataMap
            if (attrs.datamap)
                cfg.datamap = me.parseMap(attrs.datamap);
        }
        else { //使用Items
            cfg = Ext.apply(cfg, me.parseListItems(config.childNodes));
        }

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});