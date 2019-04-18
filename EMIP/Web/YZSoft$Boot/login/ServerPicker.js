
Ext.define('YZSoft$Boot.login.ServerPicker', {
    extend: 'Ext.dataview.List',
    config: {
        itemCls: ['yzlg-list-item-flat', 'yzlg-list-item-border', 'yzlg-list-item-server'],
        itemTpl: [
            '<div class="url">{url}</div>'
        ],
        scrollable: false,
        cls: ['yzlg-noscroll-autosize', 'yzlg-list-server'],
        disableSelection: true
    },
    setValue: Ext.emptyFn,

    constructor: function (config) {
        var me = this;

        var cfg = {
            plugins: [{
                xclass: 'YZSoft$Boot.src.plugin.ListOptions',
                items: [{
                    text: $rs.AllDelete,
                    padding: '0 20',
                    style: 'background-color:#e84134',
                    handler: function (record) {
                        me.getStore().remove(record);
                        me.saveServerInfo();
                    }
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            itemtap: function (list, index, target, record, e, eOpts) {
                var me = this;
                e.stopEvent();
                me.fireEvent('change', me, record);
            }
        });
    },

    getListItemConfig: function () {
        var rv = this.callParent(arguments);
        delete rv.minHeight;
        return rv;
    },

    saveServerInfo: function () {
        var me = this,
            store = me.getStore(),
            servers = [];

        store.each(function (record) {
            servers.push(record.data);
        });

        try {
            localStorage.setItem('servers', Ext.encode(servers));
        }
        catch (exp) {
            //alert(exp);
        }
    }
});