
Ext.define('YZSoft.src.panel.FileViewer', {
    extend: 'Ext.Container',
    config: {
        url: null,
        fileName: null,
        ext: null,
        size: null,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
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

        me.btnOpenWith = Ext.create('Ext.Button', {
            iconCls: 'yz-glyph yz-glyph-e91f',
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
            handler: function () {
                me.cnt.getActiveItem().fireEvent('openWithClick',this)
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnOpenWith]
        });

        me.pnlDownload = Ext.create('YZSoft.src.panel.fileviewer.Download', {
            url: config.url,
            fileName: config.fileName,
            ext: config.ext,
            size: config.size
        });

        me.cnt = Ext.create('Ext.Container', {
            layout: 'card',
            style: 'background-color:#fff',
            items: [me.pnlDownload]
        });

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.cnt]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    destroy: function () {
        var me = this;

        me.callParent(arguments);
    }
}); 
