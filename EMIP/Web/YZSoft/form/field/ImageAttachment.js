
Ext.define('YZSoft.form.field.ImageAttachment', {
    extend: 'YZSoft.src.field.ImageAttachment',
    mixins: [
        'YZSoft.form.field.mixins.Base'
    ],
    config: {
    },

    constructor: function (config) {
        var me = this,
            config = config || {};

        config.single = true;

        return me.callParent([config]);
    },
});