
Ext.define('YZSoft.social.chat.SingleChatPanel', {
    extend: 'YZSoft.social.chat.ChatAbstractPanel',
    config: {
        tid: null
    },

    constructor: function (config) {
        var me = this;

        me.btnBack = Ext.create('Ext.Button', {
            text: RS.$('All__Back'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me);
            }
        });

        me.cnt = Ext.create('Ext.Panel', {
            items: []
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title,
            cls: ['yz-titlebar'],
            items: [me.btnBack]
        });

        me.pnlSocial = Ext.create('YZSoft.src.panel.Social', Ext.apply({
            resType: 'SingleChat',
            resId: config.groupid
        }, config.socialPanelConfig));

        var cfg = {
            layout: 'fit',
            items: [
                me.titleBar,
                me.pnlSocial
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});