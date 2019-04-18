
Ext.define('YZSoft.app.Iframe', {
    extend: 'Ext.form.Panel',
    config: {
        cls: 'yz-form',
        style: 'background-color:#f3f5f9;',
        scrollable: {
            direction: 'vertical',
            indicators: false
        }
    },

    constructor: function (config) {
        var me = this,
            config = config || {}

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
         me.iframe=Ext.create('YZSoft.src.panel.IFramePanel', {
             url: config.url 
         });
   

    var cfg = {
        items: [me.titleBar, me.iframe]
    };

    Ext.apply(cfg, config);
    me.callParent([cfg]);

}
});