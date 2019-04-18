
Ext.define('YZSoft.form.aspx.validator.RegExp', {
    extend: 'YZSoft.form.validator.RegExp',
    mixins: ['YZSoft.form.aspx.field.mixins.Abstract'],

    constructor: function (config) {
        var me = this,
            config = config || {},
            attrs = config.attrs || {},
            cfg = {};

        //ControlToValidate
        if (attrs.controltovalidate)
            me.controltovalidate = attrs.controltovalidate; //直接设置属性

        //ValidationGroup
        if (attrs.validationgroup)
            cfg.validationGroup = attrs.validationgroup;

        //ErrorMessage
        cfg.errorMessage = attrs.errormessage || attrs.innerhtml;

        //DisableExpress
        if (attrs.disableexpress)
            cfg.disableExpress = attrs.disableexpress;

        //ValidationExpression
        if (attrs.validationexpression)
            cfg.regex = attrs.validationexpression;

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});