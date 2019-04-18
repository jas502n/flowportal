
Ext.define('YZSoft.form.aspx.validator.Custom', {
    extend: 'YZSoft.form.validator.Custom',
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

        //ClientValidationFunction
        if (attrs.clientvalidationfunction) {
            cfg.fn = function (field, row, form) {
                var fnname = attrs.clientvalidationfunction,
                    fn = form.funcs[fnname],
                    value = field.getValue(),
                    args;

                if (!fn)
                    YZSoft.Error.raise(RS.$('All_Uniform_ValidateFunc_Miss'), fnname);

                if (fn) {
                    args = {
                        isMobile: true,
                        field: field,
                        row: row,
                        Value: value,
                        IsValid: true
                    };

                    fn.call(undefined, me, args);
                    return args.IsValid;
                }

                return true;
            }
        }

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});