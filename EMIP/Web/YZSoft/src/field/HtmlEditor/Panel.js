
Ext.define('YZSoft.src.field.HtmlEditor.Panel', {
    extend: 'Ext.Panel',
    requires: [
    ],

    constructor: function (config) {
        var me = this,
            config = config || '',
            cfg;

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

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack]
        });

        me.editor = Ext.create('YZSoft.src.field.HtmlEditor.Editor', {
            value: config.value
        });

        cfg = {
            layout: 'fit',
            items: [
                me.titleBar,
                me.editor
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
