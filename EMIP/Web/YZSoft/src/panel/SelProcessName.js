Ext.define('YZSoft.src.panel.SelProcessName', {
    extend: 'Ext.Container',
    config: {
        style: 'background-color:#fff;'
    },

    constructor: function (config) {
        var me = this,
            cfg;

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

        me.pickProcess = Ext.create('YZSoft.src.component.ProcessSegmentedButton', {
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            padding: '12 12',
            listeners: {
                itemClick: function (button) {
                    if (me.config.fn)
                        me.config.fn.call(me.scope, button);
                }
            }
        });

        cfg = {
            items: [me.titleBar, me.pickProcess]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
