
Ext.define('YZSoft.src.panel.HtmlFileViewer', {
    extend: 'Ext.Container',
    config: {
        fileUrl: null,
        style: 'background-color:#fff;'
    },

    constructor: function (config) {
        var me = this;

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

        me.iframe = Ext.create('YZSoft.src.panel.IFramePanel', {
            url: config.fileUrl
        });

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.iframe]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
}); 
