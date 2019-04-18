
Ext.define('YZSoft.form.field.SelectUserButton', {
    extend: 'YZSoft.form.field.BrowserButtonAbstract',
    config: {
        iconCls: 'yz-glyph yz-glyph-e911'
    },

    showBrowserWindow: function () {
        var me = this,
            singleSelection = me.getSingleSelection(),
            uids = [],
            pnl;

        pnl = Ext.create('YZSoft.src.sheet.SelUser', {
            singleSelection: singleSelection,
            back: function () {
                pnl.hide();
            },
            fn: function (users) {
                pnl.hide();

                Ext.each(users, function (user) {
                    uids.push(user.Account);
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Org.ashx'),
                    params: {
                        method: 'MemberFromUIDs'
                    },
                    jsonData: uids,
                    success: function (action) {
                        me.doMap(action.result);
                    }
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