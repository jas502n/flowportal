
Ext.define('YZSoft.post.Recently', {
    extend: 'Ext.dataview.DataView',
    requires: [
        'YZSoft.src.model.ProcessInfo'
    ],
    config: {
        padding: '0 6',
        scrollable: null,
        inline: {
            wrap: true
        },
        cls: 'yz-dataview-favorite-process',
        itemCls: 'yz-dataview-item-process yz-dataview-item-process-recently',
        itemTpl: [
            '<div class="d-flex flex-column">',
            '<div class="align-self-center shortname" style="background-color:{Color}">{ShortName:this.renderString}</div>',
            '<div class="flex-fill name">{ProcessName}</div>',
            '<div class="remove"></div>',
            '</div>', {
                renderString: function (value) {
                    return Ext.util.Format.htmlEncode(value);
                }
            }
        ]
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.ProcessInfo',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Process.ashx'),
                extraParams: {
                    method: 'GetRecentlyProcess'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children'
                }
            }
        });

        cfg = {
            store: me.store,
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    me.fireEvent('processClick', record);
                }
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            painted: function () {
                me.store.load({ delay: false, mask: false });
            }
        });

        me.store.load({ delay: false, mask: false });
    }
});