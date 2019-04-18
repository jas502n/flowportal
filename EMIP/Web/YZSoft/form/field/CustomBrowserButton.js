
Ext.define('YZSoft.form.field.CustomBrowserButton', {
    extend: 'YZSoft.form.field.BrowserButtonAbstract',
    requires: [
        'YZSoft.src.viewmodel.bindable.Filter'
    ],
    mixins: [
    ],
    config: {
        filter: null
    },

    doTap: function (btn, e) {
        var me = this,
            row = me.getRow(),
            filter = YZSoft.src.viewmodel.bindable.Filter.getFilter(row, me.getFilter(), true);

        e.preventDefault();
        me.showBrowserWindow(filter);
    }
});