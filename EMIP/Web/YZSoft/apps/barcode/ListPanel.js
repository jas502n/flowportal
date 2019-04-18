Ext.define('YZSoft.apps.barcode.ListPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.NotesBarcode',
        'Ext.util.Format'
    ],

    constructor: function (config) {
        var me = this;

        config = config || {};

        me.btnBack = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me);
            }
        });

        me.btnEdit = Ext.create('Ext.Button', {
            text: RS.$('All__Edit'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
            handler: function () {
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnEdit]
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.NotesBarcode',
            autoLoad: false,
            loadDelay: true,
            clearOnPageLoad: true,
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/Barcode.ashx'),
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
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-notesbarcode'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns">',
                '<div class="yz-column-center">',
                    '<div class="title">{[this.renderTitle(values)]}</div>',
                    '<div class="comments">{Comments:this.renderString}</div>',
                '</div>',
            '</div>',
            '<div class="yz-layout-columns">',
                '<div class="yz-column-left yz-align-vcenter">',
                '</div>',
                '<div class="yz-column-center">',
                    '<div class="barcode">{Barcode:this.renderString}</div>',
                '</div>',
                '<div class="yz-column-right yz-align-vcenter">',
                    '<div class="createat">{CreateAt:this.renderDate}</div>',
                '</div>',
            '</div>', {
                renderString: function (value) {
                    return Ext.util.Format.htmlEncode(value);
                },
                renderDate: function (value) {
                    return Ext.Date.toFriendlyString(value);
                },
                renderTitle: function (value) {
                    var rv;

                    rv = value.ProductName || value.Comments || value.Format;
                    return Ext.util.Format.htmlEncode(rv);
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
                    text: RS.$('All__Edit'),
                    style: 'background-color:#333',
                    hidden: true,
                    handler: function () {
                        alert('aaa');
                    }
                }, {
                    text: RS.$('All__Delete'),
                    padding: '0 20',
                    style: 'background-color:#e84134',
                    handler: function (record) {
                        YZSoft.Ajax.request({
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/Barcode.ashx'),
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
    }
});
