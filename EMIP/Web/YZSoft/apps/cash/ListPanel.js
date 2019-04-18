Ext.define('YZSoft.apps.cash.ListPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.NotesCash',
        'Ext.util.Format'
    ],

    constructor: function (config) {
        var me = this;

        config = config || {};

        me.btnBack = Ext.create('Ext.Button', {
            text:RS.$('All__Back'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me);
            }
        });

        me.btnNew = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e907',
            iconAlign: 'left',
            align: 'right',
            handler: function () {
                me.addNew();
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnNew]
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.NotesCash',
            autoLoad: false,
            loadDelay: true,
            clearOnPageLoad: true,
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/Cash.ashx'),
                extraParams: {
                    method: 'GetMyList'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children',
                    totalProperty: 'total'
                }
            }
        });

        me.list = Ext.create('Ext.dataview.List', {
            loadingText: '',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            itemCls: ['yz-list-item-flat','yz-list-item-border','yz-list-item-notescash'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns">',
                '<div class="yz-column-left yz-align-vcenter">',
                    '<div class="type" style="background-image:url({typeimageurl})"></div>',
                '</div>',
                '<div class="yz-column-center">',
                    '<div class="title">{title:this.renderString}</div>',
                    '<div class="createat">{CreateAt:this.renderDate}</div>',
                '</div>',
                '<div class="yz-column-right yz-align-vcenter">',
                    '<div class="amount">{Amount:this.renderCurrency}</div>',
                '</div>',
            '</div>', {
                renderString: function (value) {
                    return Ext.util.Format.htmlEncode(value);
                },
                renderDate: function (value) {
                    return Ext.Date.toFriendlyString(value);
                },
                renderCurrency: function (value) {
                    return Ext.util.Format.currency(value, '', 2);
                }
            }),
            store: me.store,
            plugins: [{
                xclass: 'YZSoft.src.plugin.PullRefresh'
            }, {
                xclass: 'YZSoft.src.plugin.ListPaging',
                autoPaging: true
            }, {
                xclass: 'YZSoft.src.plugin.ListOptions',
                items: [{
                    text: RS.$('All__Delete'),
                    padding: '0 20',
                    style: 'background-color:#e84134',
                    handler: function (record) {
                        YZSoft.Ajax.request({
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/Cash.ashx'),
                            params: {
                                Method: 'Delete',
                                itemid: record.getId()
                            },
                            success: function (action) {
                                me.store.remove(record);
                            },
                            failure: function (action) {
                                Ext.Msg.alert(RS.$('All__Title_DeleteFailed'), action.result.errorMessage);
                            }
                        });
                    }
                }]
            }],
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            disableSelection: true,
            //emptyText: RS.$('TaskList_EmptyText'),
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    e.stopEvent();
                    me.openForm(record);
                }
            }
        });

        me.list.on({
            single: true,
            painted: function () {
                me.store.load();
            }
        });

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    addNew: function () {
        var me = this,
            pnl;

        pnl = Ext.create('YZSoft.apps.cash.Form', {
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop();
            },
            done: function () {
                var store = me.store;
                store.loadPage(1, { delay: false, mask: false });
            }
        });

        me.on({
            single: true,
            hide: function () {
                Ext.defer(function () {
                    if (!Ext.os.is.iOS)
                        pnl.getFields('Amount').focus();
                }, 10);
            }
        });

        Ext.mainWin.push(pnl);
    },

    openForm: function (record) {
        var me = this,
            data = record.data,
            pnl;

        pnl = Ext.create('YZSoft.apps.cash.Form', {
            itemid: data.ItemID,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop();
            },
            done: function () {
                var store = me.store;
                store.loadPage(1, { delay: false, mask: false });
            }
        });

        Ext.mainWin.push(pnl);
    }
});
