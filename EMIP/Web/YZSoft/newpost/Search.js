
Ext.define('YZSoft.newpost.Search', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.ProcessInfo'
    ],
    config: {
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
                    method: 'SearchProcess'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children'
                }
            }
        });

        me.list = Ext.create('Ext.dataview.List', {
            store: me.store,
            loadingText: '',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            disableSelection: true,
            //emptyText: RS.$('TaskList_EmptyText'),
            cls: 'yz-list-process',
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-process'],
            itemTpl: [
                '<div class="yz-layout-columns">',
                    '<div class="yz-column-center yz-align-vcenter">',
                        '<div class="name">{ProcessName}</div>',
                    '</div>',
                    '<div class="yz-column-right yz-align-vcenter yz-column-favorite">',
                        '<div class="favorite {[values.Favorited ? "favorited":""]}"></div>',
                    '</div>',
                '</div>'
            ],
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    if (e.getTarget('.yz-column-favorite')) {
                        me.onFavoriteClick(list, index, target, record, e, eOpts);
                        return;
                    }

                    me.fireEvent('processClick', record);
                }
            }
        });

        cfg = {
            layout: 'fit',
            items: [me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.doSearch('');
    },

    doSearch: function (keyword) {
        var me = this;

        me.store.loadPage(1, {
            params: {
                kwd: keyword
            }
        });
    },

    onFavoriteClick: function (list, index, target, record, e, eOpts) {
        var me = this,
            favorited = record.get('Favorited');

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Favorite.ashx'),
            params: {
                method: favorited ? 'CancelFavorite' : 'AddFavorite',
                resType: 'Process',
                resId: record.data.ProcessName
            },
            success: function (action) {
                record.set('Favorited', action.result);
                me.fireEvent('favoriteChange');
            }
        });
    }
});