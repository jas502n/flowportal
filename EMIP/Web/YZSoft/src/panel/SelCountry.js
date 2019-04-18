
Ext.define('YZSoft.src.panel.SelCountry', {
    extend: 'Ext.Container',
    config: {
        store: null,
        style: 'background-color:#fff;'
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            singleSelection = 'singleSelection' in config ? config.singleSelection : me.config.singleSelection,
            params = config.params;

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

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            style: 'z-index:1',
            items: [me.btnBack]
        });

        me.search = Ext.create('YZSoft.src.field.Search', {
            placeHolder: RS.$('All__Search'),
            focusOnMaskTap: false,
            listeners: {
                scope: me,
                inputchange: 'onKeywordChange',
                beforeactivesearch: 'onActiveSearch',
                cancelsearch: 'onCancelSearch'
            }
        });

        me.searchBar = Ext.create('Ext.Container', {
            cls: ['yz-searchbar'],
            items: [me.search]
        });

        me.list = Ext.create('Ext.dataview.List', {
            loadingText: false,
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            store: config.store,
            grouped: true,
            indexBar: true,
            itemHeight: 30,
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            disableSelection: true,
            emptyText: '',
            cls: ['yz-list-flatheader', 'yz-list-country'],
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-country'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns  yz-align-vcenter">',
                '<div class="yz-column-center">',
                    '<div class="title">{Name:this.renderString}</div>',
                '</div>',
                '<div class="yz-column-right yz-align-vcenter">',
                    '<div class="iddcode">{IDDCode}</div>',
                '</div>',
            '</div>', {
                renderString: function (value) {
                    return Ext.util.Format.htmlEncode(value);
                }
            })
        });

        me.list.on({
            itemtap: function (list, index, target, record, e, eOpts) {
                e.stopEvent();
                me.onok(record);
            }
        });

        me.list.getScrollable().getScroller().getElement().insertFirst(me.searchBar.element);

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onActiveSearch: function (search) {
        var me = this,
            offset = me.titleBar.element.getHeight() - (application.statusbarOverlays ? 22 : 0);

        me.setBottom(-offset);
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
                me.setBottom(0);
            }
        });

        anim.run(me.element);
    },

    onKeywordChange: function (input, value, e) {
        var me = this,
            store = me.getStore();

        value = (value || '').trim().toLowerCase();
        if (value) {
            Ext.defer(function () {
                store.clearFilter();
                me.list.addCls('yz-list-group-hide');
                store.filterBy(function (record) {
                    var name = (record.data.Name || '').toLowerCase(),
                        pinyin = (record.data.Pinyin || '').toLowerCase();

                    return name.indexOf(value) != -1 || pinyin.indexOf(value) != -1;
                });
            }, 10);
        }
        else {
            store.clearFilter();
            me.list.removeCls('yz-list-group-hide');
        }
    },

    onClearSearchText: function (delay) {
        var me = this,
            store = me.getStore();

        store.clearFilter();
        me.list.removeCls('yz-list-group-hide');
    },

    onok: function (rec) {
        var me = this;

        if (me.config.fn)
            me.config.fn.call(me.scope, rec.data, me);
    }
});