
Ext.define('YZSoft.src.plugin.SwipeTabs', {
    extend: 'Ext.Component',
    requires: ['Ext.Anim'],
    alias: 'plugin.swipetabs',
    config: {
        hidden: true,
        animation: {
            type: 'slide'
        }
    },

    getElementConfig: function () {
        return {
            reference: 'element',
            classList: ['yz-tab-slider']
        };
    },

    init: function (tab) {
        var me = this,
            tabBar = tab.getTabBar();

        me.tab = tab;
        tabBar.addCls('yz-tab-underline');
        tabBar.add(me);

        tabBar.on({
            order: 'before',
            scope: me,
            activetabchange: 'onActiveTabChange'
        });

        tabBar.on({
            single: true,
            painted: function () {
                me.adjustTo(tabBar.getActiveTab());
            }
        });
    },

    adjustTo: function (btn) {
        var me = this,
            tab = me.tab,
            offset = btn.element.dom.offsetLeft,
            width = btn.element.dom.getBoundingClientRect().width;

        //me.element.translate(offset);
        me.element.setStyle('transform', 'translateX(' + offset + 'px)');
        me.element.setWidth(width);
    },

    onActiveTabChange: function (tabBar, newTab, oldTab, eOpts) {
        var me = this,
            offset = newTab.element.dom.offsetLeft,
            width = newTab.element.dom.getBoundingClientRect().width;

        if (newTab && !newTab.element.hasCls('yz-tab-moving')) {
            newTab.addCls('yz-tab-moving');
            me.show();

            var anim = Ext.create('Ext.Anim', {
                autoClear: false,
                duration: 250,
                easing: 'east-in-out',
                from: {
                },
                to: {
                    transform: 'translateX(' + offset + 'px)'
                },
                before: function (el) {
                },
                after: function (el) {
                    me.hide();
                    newTab.removeCls('yz-tab-moving');
                }
            });

            anim.run(me.element);
        }
    }
});