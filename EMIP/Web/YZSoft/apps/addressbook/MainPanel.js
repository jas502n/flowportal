
Ext.define('YZSoft.apps.addressbook.MainPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.User'
    ],
    config: {
    },

    constructor: function (config) {
        var me = this,
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

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack]
        });

        me.search = Ext.create('YZSoft.src.field.Search', {
            placeHolder: RS.$('All__Search'),
            flex: 1,
            focusOnMaskTap: false,
            listeners: {
                scope: me,
                beforeactivesearch: 'onActiveSearch',
                cancelsearch: 'onCancelSearch',
                inputchange: 'onKeywordChange'
            }
        });

        me.searchBar = Ext.create('Ext.Container', {
            cls: ['yz-searchbar'],
            items: [me.search]
        });

        me.pnlAssist = Ext.create('Ext.Container', {
            items: [me.searchBar, {
                xtype: 'button',
                text: RS.$('CompanyAddressBook_Group'),
                cls: ['yz-button-flat', 'yz-button-list', 'yz-button-addressbook-categroy'],
                iconAlign: 'left',
                icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/group/Group.png'),
                scope: me,
                handler: 'onSelGroupClick'
            }, {
                xtype: 'component',
                cls: 'yz-title-startchat-user',
                html: RS.$('All__Contacts')
            }]
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.User',
            autoLoad: false,
            sorters: 'group',
            clearOnPageLoad: true,
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Org.ashx'),
                extraParams: {
                    Method: 'GetUsers',
                    position: true
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children',
                    totalProperty: 'total'
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
            cls: ['yz-list-addressbook-user'],
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-addressbook-user'],
            itemTpl: Ext.create('Ext.XTemplate',
                '<div class="yz-layout-columns">',
                    '<div class="yz-column-left yz-align-vcenter">',
                        '<div class="headsort" style="background-image:url({headsort})"></div>',
                    '</div>',
                    '<div class="yz-column-center yz-layout-vbox yz-align-hcenter">',
                        '<div class="name">{ShortName}</div>',
                        '<div class="position">{positions:this.renderPosition}</div>',
                    '</div>',
                '</div>', {
                    renderPosition: function (value) {
                        var rv = [],
                            enc = Ext.util.Format.htmlEncode;

                        Ext.each(value, function (pos) {
                            if (pos.LeaderTitle)
                                rv.push(Ext.String.format('{0}-{1}', enc(pos.LeaderTitle), enc(pos.OUName)));
                            else
                                rv.push(Ext.String.format('{0}', enc(pos.OUName)));
                        });

                        return rv.join(',');
                    }
                }
            ),
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    e.stopEvent();
                    me.onItemTap(target, record);
                }
            }
        });

        me.list.getScrollable().getScroller().getElement().insertFirst(me.pnlAssist.element);

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.list]
        };

        me.list.on({
            single: true,
            painted: function () {
                me.store.load();
            }
        });

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActiveSearch: function (search) {
        var me = this,
            offset = me.titleBar.element.getHeight() - (application.statusbarOverlays ? 22 : 0);

        me.element.setBottom(-offset);
        me.titleBar.addCls('yz-titlebar-searching');
        var anim = Ext.create('Ext.Anim', {
            autoClear: false,
            duration: 200,
            easing: 'ease-out',
            from: {
            },
            to: {
                transform: 'translateY(-' + offset + 'px)'
            },
            before: function (el) {
            },
            after: function (el) {
                Ext.defer(function () {
                    if (!Ext.os.is.iOS)
                        search.focus();
                }, 10);
            }
        });

        anim.run(me.element);
    },

    onCancelSearch: function (search) {
        var me = this,
            offset = me.titleBar.element.getHeight(),
            keyword = search.getValue();

        search.setValue('');
        if (keyword)
            me.onClearSearchText(210);

        var anim = Ext.create('Ext.Anim', {
            autoClear: false,
            duration: 200,
            easing: 'ease-in',
            from: {
            },
            to: {
                transform: 'translateY(0px)'
            },
            before: function (el) {
            },
            after: function (el) {
                me.titleBar.removeCls('yz-titlebar-searching');
                me.element.setBottom(0);
            }
        });

        anim.run(me.element);
    },

    onKeywordChange: function (input, value, e) {
        var me = this;

        me.store.load({
            params: {
                keyword: value
            },
            mask: false,
            delay: false
        });
    },

    onClearSearchText: function (delay) {
        var me = this;

        me.store.load({
            params: {
                keyword: ''
            },
            mask: false,
            delay: delay || 250
        });
    },

    onSelGroupClick: function () {
        var me = this,
            pnl;

        pnl = Ext.create('YZSoft.src.panel.SelGroup', {
            title: RS.$('CompanyAddressBook_Group'),
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function (group) {
                var pnlSocial = Ext.create('YZSoft.social.chat.GroupChatPanel', {
                    title: group.Name,
                    groupid: group.GroupID,
                    back: function () {
                        Ext.mainWin.pop(2);
                    },
                    listeners: {
                        exitGroup: function () {
                            Ext.mainWin.pop(3);
                        }
                    }
                });

                Ext.mainWin.push(pnlSocial);
            }
        });

        Ext.mainWin.push(pnl);
    },

    onItemTap: function (target, record) {
        var me = this,
            date = record.data.Date,
            uid = record.data.Account,
            pnl;

        pnl = Ext.create('YZSoft.src.panel.CompanyContactPanel', {
            uid: uid,
            back: function () {
                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
    }
});
