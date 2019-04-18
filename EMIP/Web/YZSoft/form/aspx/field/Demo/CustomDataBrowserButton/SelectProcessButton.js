
Ext.define('YZSoft.form.aspx.field.Demo.CustomDataBrowserButton.SelectProcessButton', {
    extend: 'YZSoft.form.aspx.field.CustomBrowserButton',
    config: {
        iconCls: 'yz-glyph yz-glyph-e92b',
        singleSelection: true
    },

    showBrowserWindow: function (filter) {
        var me = this,
            pnl;

        pnl = Ext.create('YZSoft.src.sheet.SelProcessName', {
            back: function () {
                pnl.hide();
            },
            fn: function (button) {
                pnl.hide();

                me.doMap({
                    ProcessName: button.config.value
                });
            },
            listeners: {
                order: 'after',
                hide: function () {
                    this.destroy();
                }
            }
        });

        Ext.Viewport.add(pnl);
        pnl.show();
    }
});