document.body.addEventListener('touchmove', function (e) {
    e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
}, { passive: false }); //passive 参数不能省略，用来兼容ios和android


Ext.define('YZSoft.newpost.Panel', {
    extend: 'Ext.Container',
    requires: [
             'Ext.Mask'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        me.search = Ext.create('YZSoft.src.field.Search', {
            placeHolder: RS.$('All_Post_AllProcess'),
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
            docked:'top',
            cls: ['yz-searchbar'],
            style: application.statusbarOverlays ? 'padding-top:27px' : '',
            items: [me.search]
        });

        me.pnlHome = Ext.create('YZSoft.newpost.Home', {
            listeners: {
                processClick: function (record) {
                    me.onProcessClick(record);
                }
            }
        });

        me.pnlSearch = Ext.create('YZSoft.newpost.Search', {
            listeners: {
                processClick: function (record) {
                    me.onProcessClick(record,2);
                }
            }
        });

        me.cnt = Ext.create('Ext.Container', {
            layout: 'card',
            activeItem:0,
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

    onProcessClick: function (record, deep) {
      
      
        var me = this,
            processName = record.data.ProcessName,
            pnl;

         pnl = Ext.create('YZSoft.form.Post', {
            title: processName,
            processName: processName,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop(deep || 1);
            }
        });

        Ext.mainWin.push(pnl);
    }
});