
Ext.define('YZSoft.App.Search', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.app.model.YZApp.SearchAppInfo'
    ],
    config: {
},

constructor: function (config) {
    var me = this,
            cfg;

    me.store = Ext.create('Ext.data.Store', {
        model: 'YZSoft.app.model.YZApp.SearchAppInfo',
        autoLoad: false,
        proxy: {
            type: 'ajax',
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/YZApp/App.ashx'),
            extraParams: {
                method: 'SearchMApplist'
            },
            reader: {
                type: 'json',
                rootProperty: 'Applist'
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
                        '<div class="name">{AppName}</div>',
                    '</div>',
                    '<div class="yz-column-right yz-align-vcenter yz-column-favorite">',
                        '<div class="favorite {[values.Favorited=="true"? "favorited":""]}"></div>',
                    '</div>',
                '</div>'
            ],
        listeners: {
            itemtap: function (list, index, target, record, e, eOpts) {
                if (e.getTarget('.yz-column-favorite')) {
                    me.onFavoriteClick(list, index, target, record, e, eOpts);
                    return;
                }
                else {

                    if (record.data.Type == "SYSTEM" || record.data.Type == "REPORT") {
                        if (record.data.Json == null) {
                            me.onAppClickError(record.data.AppName);

                        } else {
                            me.onAppClick(record.data.Json, record.data.AppName, record.data.Type, record.data.AppUrl);
                        }
                    }
                    else {
                        if (record.data.AppUrl == null) {
                            me.onAppClickError(record.data.AppName);

                        } else {
                            me.onAppClick(record.data.Json, record.data.AppName, record.data.Type, record.data.AppUrl);
                        }

                    }

                }
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
onAppClick: function (record, AppName, Type, AppUrl) {
    var me = this,

            pnl;

    if (Type == "SYSTEM") {
        pnl = Ext.create('YZSoft.App.AppInfo', {
            record: record,
            title: AppName,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop(deep || 1);
            }
        });

    }
    else if (Type == "REPORT") {
        pnl = Ext.create('YZSoft.app.Iframe', {
            title: AppName,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop(deep || 1);
            },
            url: AppUrl
        });
    }
    else if (Type == "CUSTOM") {
        pnl = Ext.create(AppUrl, {
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop(deep || 1);
            }
        });
    }
    else if (Type == "PROCESS") {
        pnl = Ext.create('YZSoft.form.Post', {
            title: AppUrl,
            processName: AppUrl,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop(deep || 1);
            }
        });
    }
    else {
        pnl = Ext.create('YZSoft.src.panel.Url', {
            title: AppName,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop(deep || 1);
            },
            url: AppUrl
        });

    }

    Ext.mainWin.push(pnl);
},
onAppClickError: function (AppName) {

    Ext.Msg.show({
        title: AppName,
        message: "尚未配置",
        hideOnMaskTap: true,
        buttons: [{
            text: $rs.YesISee,
            flex: 1,
            cls: 'yz-button-flat yz-button-action-hot',
            itemId: 'ok'
        }]
    });
},
onFavoriteClick: function (list, index, target, record, e, eOpts) {
    var me = this,
            favorited = record.get('Favorited');
    YZSoft.Ajax.request({
        url: YZSoft.$url('YZSoft.Services.REST.Mobile/YZApp/App.ashx'),
        params: {
            method: favorited == "true" ? 'CancelFavorite' : 'AddFavorite',
            resType: 'App',
            resId: record.data.AppName
        },
        success: function (action) {

            record.set('Favorited', action.result.result);
            me.fireEvent('favoriteChange');
        }
    });
}
});