
Ext.define('YZSoft.src.sheet.AppsSheet', {
    extend: 'Ext.ActionSheet',
    config: {
        hideOnMaskTap: true,
        cls: 'yz-sheet-apps',
        showAnimation: {
            type: 'slideIn',
            duration: 250,
            easing: 'ease-out'
        },
        hideAnimation: {
            type: 'slideOut',
            duration: 250,
            easing: 'ease-in'
        }
    },

    constructor: function (config) {
        var me = this;

        me.pnlApps = Ext.create('YZSoft.src.container.SquaredContainer', {
            style: 'background-color:transparent;',
            minBoxCount: 5,
            minBoxWidth: 100,
            padding: '0 10',
            defaults: {
                xtype: 'button',
                iconAlign: 'top',
                cls: 'yz-button-boxapp'
            },
            items: config.items
        });

        delete config.items;

        var cfg = {
            items: [{
                xtype: 'titlebar',
                cls: 'yz-titlebar-sheet',
                title: config.title || ''
            }, me.pnlApps, {
                xtype: 'button',
                text: RS.$('All__Cancel'),
                cls: 'yz-button-flat yz-button-sheet-action yz-button-sheet-topborder',
                margin: '7 0 0 0',
                handler: function () {
                    me.hide();
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});