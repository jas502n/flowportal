
Ext.define('YZSoft.form.field.SelectOUButton', {
    extend: 'YZSoft.form.field.BrowserButtonAbstract',
    config: {
        iconCls: 'yz-glyph yz-glyph-e902'
    },

    showBrowserWindow: function () {
        var me = this,
            pnl;

        pnl = Ext.create('YZSoft.src.sheet.SelOU', {
            back: function () {
                pnl.hide();
            },
            fn: function (ou) {
                pnl.hide();

                ou = Ext.apply({}, ou);
                ou.OUName = ou.Name;
                ou.OUFullName = ou.FullName;
                ou.OUCode = ou.Code;
                ou.OULevel = ou.Level;

                me.doMap(ou);
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