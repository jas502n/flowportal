
Ext.define('YZSoft.src.panel.databrowser.SearchPanel', {
    extend: 'Ext.Container',
    requires: [
    ],
    config: {
        params: null,
        style: 'background-color:#fff;'
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            params = config.params,
            items = [],
            cfg, item;

        me.btnReset = Ext.create('Ext.Button', {
            text:RS.$('All__Reset'),
            cls: ['yz-button-flat', 'yz-button-reset'],
            margin: '10 5 10 10',
            scope:me,
            handler: function () {
                me.reset();

                if (me.config.reset)
                    me.config.reset.call(me.scope, [], me);
            }
        });

        me.btnSearch = Ext.create('Ext.Button', {
            text: RS.$('All__OK'),
            cls: ['yz-button-flat', 'yz-button-search'],
            margin: '10 10 10 5',
            scope: me,
            handler: function () {
                var params = me.getParams();

                if (me.config.fn)
                    me.config.fn.call(me.scope, params, me);
            }
        });

        me.titleBar = Ext.create('Ext.Container', {
            docked: 'bottom',
            layout: {
                type: 'hbox',
                align:'center'
            },
            defaults: {
                minHeight: 40,
                flex: 1
            },
            items: [me.btnReset, me.btnSearch]
        });

        Ext.each(params, function (param) {
            item = Ext.create('YZSoft.src.panel.databrowser.SearchItem', {
                param: param,
                padding:'10 0'
            });
            items.push(item);
        });

        me.cntItems = Ext.create('Ext.Container', {
            layout: {
                type: 'vbox',
                align:'stretch'
            },
            padding: '0 10',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            items: items
        });

        cfg = {
            layout: 'fit',
            items: [me.titleBar, me.cntItems]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    reset: function () {
        var me = this;

        me.cntItems.items.each(function (item) {
            item.isSearchItem && item.reset();
        });
    },

    getParams: function () {
        var me = this,
            rv = [];

        me.cntItems.items.each(function (item) {
            if (item.isSearchItem)
                rv = Ext.Array.union(rv,item.getParams());
        });

        return rv;
    }
});