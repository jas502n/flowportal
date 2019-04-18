
Ext.define('YZSoft.form.aspx.field.Radio', {
    extend: 'YZSoft.form.field.Radio',
    mixins: ['YZSoft.form.aspx.field.mixins.Abstract'],

    constructor: function (config) {
        var me = this,
            config = config || {},
            attrs = config.attrs || {},
            cfg = {};

        //label
        if (attrs.text)
            cfg.label = attrs.text;

        //XDataBind
        if (attrs.xdatabind)
            cfg.xdatabind = attrs.xdatabind;

        //value
        if (attrs.value)
            cfg.value = attrs.value;

        //Checked
        if (attrs.checked)
            cfg.checked = me.parseBool(attrs.checked, false);

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});