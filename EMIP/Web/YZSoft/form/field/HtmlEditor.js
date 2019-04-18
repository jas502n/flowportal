
Ext.define('YZSoft.form.field.HtmlEditor', {
    extend: 'YZSoft.src.field.HtmlEditor',
    mixins: [
        'YZSoft.form.field.mixins.Base'
    ],
    config: {
        labelWidth: 100,
        component: {
            maxHeight: 290
        }
    }
});