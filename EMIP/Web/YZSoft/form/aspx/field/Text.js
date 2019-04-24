
Ext.define('YZSoft.form.aspx.field.Text', {
    extend: 'YZSoft.form.field.Text',
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

        //HiddenInput
        if (attrs.hiddeninput == 'True')
            cfg.hidden = true;

        //readonly
        if (attrs.readonly == 'True')
            cfg.readOnly = true;

        //PlaceHolder
        if (attrs.placeholder)
            cfg.placeHolder = attrs.placeholder;

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});