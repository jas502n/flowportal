
Ext.define('YZSoft.src.plugin.ListPaging', {
    extend: 'Ext.plugin.ListPaging',
    alias: 'plugin.yzlistpaging',

    config: {
        loadMoreCmp: {
            xtype: 'component',
            baseCls: Ext.baseCSSPrefix + 'list-paging',
            cls: ['yz-listpaging'],
            scrollDock: 'bottom',
            hidden: true
        },

        loadTpl: [
            '<div class="{cssPrefix}loading-spinner" style="">',
                 '<span class="{cssPrefix}loading-top"></span>',
                 '<span class="{cssPrefix}loading-right"></span>',
                 '<span class="{cssPrefix}loading-bottom"></span>',
                 '<span class="{cssPrefix}loading-left"></span>',
            '</div>',
            '<div class="{cssPrefix}list-paging-msg">{message}</div>'
        ].join('')
    },

    init: function (list) {
        var me = this,
            scroller = list.getScrollable();

        me.callParent(arguments);

        scroller.on({
            scroll: this.onScroll1,
            scope: this
        });
    },

    onScroll1: function (scroller, x, y) {
        var list = this.getList();

        if (!this.getLoading() && y >= scroller.maxPosition.y) {
            this.currentScrollToTopOnRefresh = list.getScrollToTopOnRefresh();
            list.setScrollToTopOnRefresh(false);

            this.loadNextPage();
        }
    },

    updateLoading: function (isLoading) {
        this.callParent(arguments);
        if (!isLoading) {
            var loadMoreCmp = this.getLoadMoreCmp();
            loadMoreCmp.hide();
        }
    }
});