
Ext.define('YZSoft.form.aspx.validator.Compare', {
    extend: 'YZSoft.form.validator.Compare',
    mixins: ['YZSoft.form.aspx.field.mixins.Abstract'],
    typeMap: {
        string: 'String',
        integer: 'Number',
        double: 'Number',
        date: 'Date',
        currency: 'Number'
    },

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

        //Type
        cfg.dataType = me.typeMap[(attrs.type || '').toLowerCase()] || 'Number';

        //ValueToCompare
        if (attrs.valuetocompare)
            cfg.valuetoCompare = attrs.valuetocompare;

        //ValueToCompareExpress
        if (attrs.valuetocompareexpress)
            cfg.valueToCompareExpress = attrs.valuetocompareexpress;

        //Operator
        cfg.operator = attrs.operator || 'Equal';

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});