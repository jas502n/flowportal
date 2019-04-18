
Ext.define('YZSoft.App.Favorite', {
    extend: 'Ext.dataview.DataView',
    requires: [
        'YZSoft.app.model.YZApp.AppInfo'
    ],
    config: {
        padding: '0 6',
        editing: false,
        scrollable: null,
        inline: {
            wrap: true
        },
        cls: 'yz-dataview-favorite-process',
        itemCls: 'yz-dataview-item-app yz-dataview-app',
        itemTpl: [
            '<div class="d-flex flex-column">',
                '<div class="align-self-center shortname" style="background-color:{IconColor}"><i style="color:white;font-size:{IconSize}px" class="iconfont {Icon}"></i>',
                 '<tpl if="BADGE &gt; 1">',
            '<span class="appbadge">{BADGE}</span>',
             '</tpl>',
                '</div>',
                '<div class="flex-fill name">{AppName}</div>',
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
            model: 'YZSoft.app.model.YZApp.AppInfo',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/YZApp/App.ashx'),
                extraParams: {
                    method: 'GetMFavorite'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'Applist'
                }
            }
        });

        me.pluginDragDrop = Ext.create('YZSoft.src.plugin.DataViewDragDrop', {
            listeners: {
                scope: me,
                moved: 'onItemMove'
            }
        });

        cfg = {
            store: me.store,
            plugins: [me.pluginDragDrop],
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {

                    if (e.getTarget('.remove')) {
                        e.stopEvent();
                        me.onRemoveClick(record);
                    }
                    if (!me.getEditing()) {

                        if (record.data.Type == "SYSTEM") {
                            if (record.data.Json == null) {
                                me.fireEvent('appClickError', record.data.AppName);

                            } else {
                                me.fireEvent('appClick', record.data.Json, record.data.AppName, record.data.Type, record.data.AppUrl);
                            }
                        }
                        else {
                            if (record.data.AppUrl == null) {
                                me.fireEvent('appClickError', record.data.AppName);

                            } else {
                                me.fireEvent('appClick', record.data.Json, record.data.AppName, record.data.Type, record.data.AppUrl);
                            }

                        }

                        
                    }
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

        me.on({
            favoriteChange: function () {
                me.store.load({ delay: false, mask: false });
            }
        });

        me.store.load({ delay: false, mask: false });
    },

    updateEditing: function (newValue) {
        var me = this;

        me[newValue ? 'addCls' : 'removeCls']('yz-dataview-editing');
        me.pluginDragDrop.setDisabled(!newValue);
    },

    onItemMove: function (startIndex, endIndex) {
        var me = this,
            store = me.store,
            record = store.getAt(startIndex),
            targetRecord,
            dropPosition;

        store.remove(record);
        store.insert(endIndex, record);

        if (record != store.last()) {
            dropPosition = 'before';
            targetRecord = store.getAt(store.indexOf(record) + 1);
        }
        else {
            dropPosition = 'after';
            targetRecord = store.getAt(store.getCount() - 2);
        }

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/YZApp/App.ashx'),
            params: {
                method: 'MoveFavorites',
                resType: 'App',
                target: targetRecord.data.AppName,
                position: dropPosition
            },
            jsonData: [record.data.AppName],
            success: function (action) {
            },
            failure: function (action) {
                YZSoft.alert(action.result.errorMessage);
            }
        });
    },

    onRemoveClick: function (record) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/YZApp/App.ashx'),
            params: {
                method: 'CancelFavorite',
                resType: 'App',
                resId: record.data.AppName
            },
            success: function (action) {
                me.store.remove(record);
            }
        });
    }
});