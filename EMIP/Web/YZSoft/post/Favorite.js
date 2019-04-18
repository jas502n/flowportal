
Ext.define('YZSoft.post.Favorite', {
    extend: 'Ext.dataview.DataView',
    requires: [
        'YZSoft.src.model.ProcessInfo'
    ],
    config: {
        padding:'0 6',
        editing:false,
        scrollable: null,
        inline: {
            wrap: true
        },
        cls: 'yz-dataview-favorite-process',
        itemCls: 'yz-dataview-item-process yz-dataview-item-process-favorite',
        itemTpl: [
            '<div class="d-flex flex-column">',
                '<div class="align-self-center shortname" style="background-color:{Color}">{ShortName:this.renderString}</div>',
                '<div class="flex-fill name">{ProcessName}</div>',
                '<div class="remove"></div>',
            '</div>',{
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
                    method: 'GetFavoriteProcesses'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children'
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
                        me.fireEvent('processClick', record);
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
        else{
            dropPosition = 'after';
            targetRecord = store.getAt(store.getCount() - 2);
        }

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/Favorite.ashx'),
            params: {
                method: 'MoveFavorites',
                resType: 'Process',
                target: targetRecord.data.ProcessName,
                position: dropPosition
            },
            jsonData: [record.data.ProcessName],
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
            url: YZSoft.$url('YZSoft.Services.REST/core/Favorite.ashx'),
            params: {
                method: 'CancelFavorite',
                resType: 'Process',
                resId: record.data.ProcessName
            },
            success: function (action) {
                me.store.remove(record);
            }
        });
    }
});