
Ext.define('YZSoft.form.aspx.field.Label', {
    extend: 'YZSoft.form.field.Label',
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
        if (attrs.text)
            cfg.value = attrs.text;

        //Format
        if (attrs.format)
            cfg.format = me.parseFormat(attrs.format);

        //TextAlign
        if (attrs.textalign)
            cfg.cls = 'yz-field-valuealign-' + attrs.textalign.toLowerCase();

        //ValueToDisplayText、DataMap
        if (attrs.valuetodisplaytext) { //使用数据源
            cfg.datasource = me.parseDataSource(attrs.valuetodisplaytext);

            cfg.filterColumn = cfg.datasource.filterColumn;
            cfg.displayColumn = cfg.datasource.displayColumn;

            //DataMap
            if (attrs.datamap)
                cfg.datamap = me.parseMap(attrs.datamap);
        }

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});