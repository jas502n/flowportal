
Ext.define('YZSoft.src.panel.SelUser', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.User'
    ],
    listClsSelModeMulti: 'yz-list-selmode-multi',
    config: {
        singleSelection: false,
        style: 'background-color:#fff;'
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
                    me.config.back.call(me.scope || me, me);
            }
        });

        me.btnSingle = Ext.create('Ext.Button', {
            text: RS.$('All__Cancel'),
            hidden: true,
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'left',
            handler: function () {
                me.normalSearchBar();

                me.list.removeCls('yz-anim-list-select-checkbox-show');
                me.list.addCls('yz-anim-list-select-checkbox-hide');
                me.list.removeCls(me.listClsSelModeMulti);

                me.btnSingle.hide();
                me.btnBack.show();
                me.btnMulti.show();
                me.btnOK.hide();

                me.storeSel.removeAll();
                me.list.deselectAll(true);
                me.onSelectionChanged();

                me.list.setDisableSelection(true);
            }
        });

        me.btnMulti = Ext.create('Ext.Button', {
            text: RS.$('All__MultiSelect'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
            handler: function () {
                me.expandSearchBar();

                me.list.removeCls('yz-anim-list-select-checkbox-hide');
                me.list.addCls('yz-anim-list-select-checkbox-show');
                me.list.addCls(me.listClsSelModeMulti);

                me.btnSingle.show();
                me.btnBack.hide();
                me.btnMulti.hide();
                me.btnOK.show();

                me.list.setDisableSelection(false);
            }
        });

        me.btnOK = Ext.create('Ext.Button', {
            text: RS.$('All__OK'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
            hidden: true,
            handler: function () {
                var recs = me.storeSel.getData().items;
                if (recs.length)
                    me.onok(recs);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnSingle, me.btnMulti, me.btnOK]
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

        me.storeSel = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.User',
            data: [],
            listeners: {
                scope: me,
                addrecords: 'onSelectionChanged',
                removerecords: 'onSelectionChanged'
            }
        });

        me.listSel = Ext.create('Ext.dataview.DataView', {
            scrollable: {
                direction: 'horizontal',
                directionLock: true,
                indicators: false
            },
            width: 0,
            store: me.storeSel,
            inline: {
                wrap: false
            },
            cls: 'yz-dataview-user-selection',
            itemCls: 'yz-dataview-item-user-selection',
            itemTpl: '<div class="headsort" style="background-image:url({headsort})"></div>',
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    e.stopEvent();
                    me.deselect(record);
                }
            }
        });

        me.searchExpand = Ext.create('YZSoft.src.field.Search', {
            placeHolder: RS.$('All__Search'),
            cancelButton: false,
            expand: true,
            flex: 1,
            listeners: {
                scope: me,
                inputchange: 'onKeywordChange'
            }
        });

        me.searchBarExpand = Ext.create('Ext.Container', {
            docked: 'top',
            hidden: true,
            layout: 'fit',
            cls: ['yz-searchbar', 'yz-searchbar-expand'],
            layout: {
                type: 'hbox',
                align: 'center'
            },
            items: [me.listSel, me.searchExpand]
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.User',
            autoLoad: false,
            sorters: 'Account',
            clearOnPageLoad: true,
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Org.ashx'),
                extraParams: {
                    Method: 'GetUsers'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children',
                    totalProperty: 'total'
                }
            },
            listeners: {
                load: function () {
                    var recs = [];
                    me.storeSel.each(function (record) {
                        var rec = me.store.getById(record.getId());
                        if (rec)
                            recs.push(rec);
                    });

                    me.list.select(recs, false, true);
                }
            }
        });

        me.list = Ext.create('Ext.dataview.List', {
            store: me.store,
            loadingText: false,
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            disableSelection: true,
            mode: 'MULTI',
            emptyText: '',
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-user'],
            selectedCls: 'yz-item-selected',
            itemTpl: Ext.create('Ext.XTemplate',
                '<div class="yz-layout-columns">',
                    '<div class="yz-column-left yz-align-vcenter check-column">',
                        '<div class="check"></div>',
                    '</div>',
                    '<div class="yz-column-left yz-align-vcenter">',
                        '<div class="headsort" style="background-image:url({headsort})"></div>',
                    '</div>',
                    '<div class="yz-column-center yz-align-vcenter">',
                        '<div class="name">{ShortName}</div>',
                    '</div>',
                    '<div class="yz-column-right">',
                    '</div>',
                '</div>'
            ),
            listeners: {
                scope: me,
                select: 'onItemSelect',
                deselect: 'onItemDeselect',
                itemtap: function (list, index, target, record, e, eOpts) {
                    if (me.isSingleSelectMode()) {
                        e.stopEvent();
                        me.onok([record]);
                    }
                }
            }
        });

        me.list.on({
            single: true,
            painted: function () {
                me.store.load();
            }
        });

        me.list.getScrollable().getScroller().getElement().insertFirst(me.searchBar.element);

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.searchBarExpand, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    updateSingleSelection: function (newValue) {
        this.btnMulti[newValue ? 'hide' : 'show']();
    },

    isSingleSelectMode: function () {
        var me = this;
        return !me.list.element.hasCls(me.listClsSelModeMulti);
    },

    expandSearchBar: function (bar) {
        var me = this,
            offset;

        me.searchBar.hide();
        me.searchBarExpand.show();
        offset = me.searchBarExpand.element.getHeight();

        var anim = Ext.create('Ext.Anim', {
            autoClear: false,
            duration: 250,
            easing: 'ease-out',
            from: {
                transform: 'translateY(-' + offset + 'px)'
            },
            to: {
                transform: 'translateY(0px)'
            },
            before: function (el) {
            },
            after: function (el) {
            }
        });

        anim.run(me.searchBarExpand.element);
    },

    normalSearchBar: function () {
        var me = this,
            keyword = me.searchExpand.getValue(),
            cls = 'yz-searchbar-expand';

        if (keyword) {
            me.searchExpand.setValue('');
            me.onClearSearchText(210);
        }

        me.searchBarExpand.hide();
        me.searchBar.show();
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

    onItemSelect: function (list, record, supressed, eOpts) {
        var me = this,
            listSel = me.listSel,
            selRec = me.storeSel.getById(record.getId());

        if (!selRec) {
            me.storeSel.add(Ext.apply({}, record.data));

            listSel.getScrollable().getScroller().on({
                single: true,
                maxpositionchange: function (scroller, maxPosition, eOpts) {
                    Ext.defer(function () {
                        me.scrollToRecord(listSel, listSel.getStore().last());
                    }, 1);
                }
            });
        }
    },

    onItemDeselect: function (list, record, eOpts) {
        var me = this,
            selRec = me.storeSel.getById(record.getId());

        if (selRec)
            me.storeSel.remove(selRec);
    },

    deselect: function (record) {
        var me = this,
            list = me.list,
            listrecord = me.store.getById(record.getId());

        me.storeSel.remove(record);
        if (listrecord)
            list.deselect(listrecord);
    },

    onSelectionChanged: function () {
        var me = this,
            list = me.listSel,
            store = list.getStore();

        var boxWidth = 42,
            maxBoxCount = 8,
            padding = list.element.getPadding('lr'),
            screenWidth = Ext.getBody().getSize().width,
            usableWidth = screenWidth * 2 / 3,
            lineBoxCount, boxWidth;

        lineBoxCount = Math.min(Math.floor(usableWidth / boxWidth), maxBoxCount);
        lineBoxCount = Math.min(store.getCount(), lineBoxCount);

        list.setWidth(lineBoxCount * boxWidth + padding);
    },

    scrollToRecord: function (list, record) {
        if (!record)
            return;

        var me = this,
            scroller = list.getScrollable().getScroller(),
            store = list.getStore(),
            index = store.indexOf(record);

        //make sure the new offsetTop is not out of bounds for the scroller
        var containerSize = scroller.getContainerSize().x,
            size = scroller.getSize().x,
            maxOffset = size - containerSize,
            offset, item;

        if (maxOffset == 0)
            return;

        scroller.scrollTo(maxOffset, 0, true);
    },

    onok: function (recs) {
        var me = this,
            users = [];

        Ext.each(recs, function (rec) {
            users.push(rec.data);
        });

        if (me.config.fn)
            me.config.fn.call(me.scope || me, users, me);
    }
});