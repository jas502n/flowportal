
Ext.define('YZSoft.form.aspx.field.Barcode', {
    extend: 'YZSoft.form.field.Barcode',
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

        //BarcodeFormat
        if (attrs.barcodeformat)
            cfg.barcodeFormat = attrs.barcodeformat;

        //PureBarcode
        cfg.pureBarcode = me.parseBool(attrs.purebarcode,true);

        //宽高
        cfg.barcodeWidth = me.parseSize(attrs.width,60);
        cfg.barcodeHeight = me.parseSize(attrs.height, 60);

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});