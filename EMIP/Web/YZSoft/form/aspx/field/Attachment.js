
Ext.define('YZSoft.form.aspx.field.Attachment', {
    extend: 'YZSoft.form.field.Attachment',
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

        //filetypesdescription
        if (attrs.filetypesdescription)
            cfg.filetypesDesc = attrs.filetypesdescription;

        //filetypes
        if (attrs.filetypes)
            cfg.filetypes = attrs.filetypes;

        //maximumfilesize
        if (attrs.maximumfilesize)
            cfg.maximumFileSize = attrs.maximumfilesize;

        //attachmentbehavior
        if (String.Equ(attrs.attachmentbehavior,'AppendOnly'))
            cfg.appendOnly = true;

        Ext.apply(cfg, config);
        return me.callParent([cfg]);
    }
});