
Ext.define('YZSoft.social.MainPanel', {
    extend: 'Ext.Container',
    requires: [
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        config = config || {};

        me.pnlMessage = Ext.create('YZSoft.social.MessagePanel', {
            title: config.title
        });

        me.pnlSearch = Ext.create('YZSoft.social.SearchPanel', {
        });

        cfg = {
            layout: 'card',
            items: [me.pnlMessage, me.pnlSearch]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.pnlMessage.on({
            scope: me,
            storeDataChanged: 'onStoreDataChanged',
            afteractivesearch: function () {
                me.pnlSearch.on({
                    single: true,
                    painted: function () {
                        Ext.defer(function () {
                            if (!Ext.os.is.iOS)
                                me.pnlSearch.search.focus();
                        }, 10);
                    }
                });
                me.setActiveItem(1);
            }
        });

        me.pnlSearch.on({
            cancelsearch: function (searchfield) {
                me.pnlMessage.on({
                    single: true,
                    painted: function () {
                        me.pnlMessage.fireEvent('cancelsearch', searchfield);
                    }
                });
                me.setActiveItem(0);
            }
        });

        me.pnlMessage.relayEvents(me.pnlSearch, ['groupRenamed', 'groupImageChanged', 'groupExited']);

        me.on({
            backbutton: function (firewin) {
                return me.getActiveItem().fireEvent('backbutton', firewin);
            }
        });
    },

    onStoreDataChanged: function (store, records) {
        var me = this,
            newmessages = 0;

        if (!me.tab)
            return;

        Ext.each(records, function (record) {
            newmessages += record.data.newmessage || 0;
        });

        me.tab[newmessages ? 'addCls' : 'removeCls']('yz-badge-flag');
    }
});
