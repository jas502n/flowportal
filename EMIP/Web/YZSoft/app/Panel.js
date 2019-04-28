
Ext.define('YZSoft.app.Panel', {
    extend: 'Ext.Container',
    requires: [
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.search = Ext.create('YZSoft.src.field.Search', {
            placeHolder: RS.$('All_App_AllApp'),
            flex: 1,
            focusOnMaskTap: true,
            cancelText: RS.$('All__Back'),
            listeners: {
                scope: me,
                afteractivesearch: 'onActiveSearch',
                cancelsearch: 'onCancelSearch',
                searchClick: 'onSearch'
            }
        });

        me.searchBar = Ext.create('Ext.Container', {
            docked: 'top',
            cls: ['yz-searchbar'],
            style: application.statusbarOverlays ? 'padding-top:27px' : '',
            items: [me.search]
        });

        me.pnlHome = Ext.create('YZSoft.App.Home', {
            listeners: {
                appClick: function (record, AppName, Type, AppUrl) {
                    me.onAppClick(record, AppName, Type, AppUrl);
                },
                appClickError: function (AppName) {
                    me.onAppClickError(AppName);
                }
            }
        });

        me.pnlSearch = Ext.create('YZSoft.App.Search', {
            listeners: {
                AppClick: function (record) {
                    me.onAppClick(record, 2);
                }
            }
        });

        me.cnt = Ext.create('Ext.Container', {
            layout: 'card',
            activeItem: 0,
            items: [me.pnlHome, me.pnlSearch]

        })

        cfg = {
            layout: 'fit',
            items: [me.searchBar, me.cnt]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.pnlHome.relayEvents(me.pnlSearch, 'favoriteChange');
    },

    onActiveSearch: function () {
        var me = this;
        me.pnlSearch.doSearch('');
        me.cnt.setActiveItem(1);
    },

    onCancelSearch: function () {
        var me = this;
        me.search.setValue('');
        me.cnt.setActiveItem(0);
    },
    onSearch: function () {
        var me = this;

        me.pnlSearch.doSearch(me.search.getValue());
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
        else if (Type == "REPORT") {
           
            pnl = Ext.create('YZSoft.app.Iframe', {
                title: AppName,
                back: function () {
                    Ext.mainWin.pop();
                },
                fn: function () {
                    Ext.mainWin.pop(deep || 1);
                },
                url: YZSoft.$url("YZSoft/app/report/index.html?id=" + JSON.parse(record).pid + "")
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
    }
});