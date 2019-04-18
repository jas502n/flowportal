
Ext.define('YZSoft.src.container.SquaredContainer', {
    extend: 'Ext.Container',
    config: {
        minBoxCount: 4,
        minBoxWidth: 100,
        itemDefaults: {
            xtype: 'button',
            iconAlign: 'top'
        },
        hboxConfig: {
            type: 'container',
            style: 'background-color:transparent',
            cls:'yz-squaredcontainer-hbox',
            layout: {
                type: 'hbox',
                align: 'stretch'
            }
        },
        emptyElementConfig: {
            xtype: 'component'
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        }
    },

    constructor: function (config) {
        var me = this;

        if ('defaults' in config) {
            config.itemDefaults = config.defaults;
        }

        delete config.defaults;

        me.callParent(arguments);
    },

    applyItems: function (items, collection) {
        var me = this,
            minBoxCount = me.getMinBoxCount(),
            minBoxWidth = me.getMinBoxWidth(),
            hboxConfig = me.getHboxConfig(),
            emptyElementConfig = me.getEmptyElementConfig(),
            screenWidth = Ext.getBody().getSize().width,
            itemDefaults = me.getItemDefaults(),
            srcItems = [], tagItems = [], lineBoxCount, lines;

        Ext.each(items, function (item) {
            if ((item.getHidden && item.getHidden()) || item.hidden)
                return;

            if (item.isComponent) {
                item.setFlex(1);
                srcItems.push(item);
            }
            else {
                srcItems.push(Ext.apply({
                    flex: 1
                }, item, itemDefaults));
            }
        });

        emptyElementConfig = Ext.apply({
            flex: 1
        }, emptyElementConfig, itemDefaults);

        lineBoxCount = Math.max(Math.floor(screenWidth / minBoxWidth), minBoxCount);
        lines = Math.floor(srcItems.length / lineBoxCount) + (srcItems.length % lineBoxCount ? 1 : 0);

        for (var i = srcItems.length; i < lines * lineBoxCount; i++)
            srcItems.push(emptyElementConfig);

        for (var l = 0; l < lines; l++) {
            var hboxitems = [];

            for (var c = 0; c < lineBoxCount; c++) {
                var item = srcItems[l * lineBoxCount + c];
                hboxitems.push(item);
            }

            var hbox = Ext.apply({
                items: hboxitems
            }, hboxConfig);

            tagItems.push(hbox);
        }

        me.callParent([tagItems, collection]);
    }
});