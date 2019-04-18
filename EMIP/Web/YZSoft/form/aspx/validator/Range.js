
Ext.define('YZSoft.form.aspx.validator.Range', {
    extend: 'YZSoft.form.validator.Range',
    mixins: ['YZSoft.form.aspx.field.mixins.Abstract'],
    typeMap: {
        string: 'String',
        integer: 'Number',
        double: 'Number',
        date: 'Date',
        currency:'Number'
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

        //MinimumValue
        if (attrs.minimumvalue)
            cfg.minValue = attrs.minimumvalue;

        //MinValueExpress
        if (attrs.minvalueexpress)
            cfg.minValueExpress = attrs.minvalueexpress;

        //MaximumValue
        if (attrs.maximumvalue)
            cfg.maxValue = attrs.maximumvalue;

        //MaxValueExpress
        if (attrs.maxvalueexpress)
            cfg.maxValueExpress = attrs.maxvalueexpress;

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});