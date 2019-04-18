
Ext.define('YZSoft.personal.setting.Version', {
    extend: 'Ext.Container',
    config: {
        layout: {
            type: 'vbox',
            slign: 'stretch'
        },
        cls: ['yz-container-version']
    },

    constructor: function (config) {
        var me = this,
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

        cfg = {
            items: [me.titleBar, {
                xtype: 'component',
                flex: 2
            }, {
                xtype: 'container',
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                items: [{
                    xtype: 'image',
                    width: 68,
                    height: 68,
                    src: YZSoft.$url('YZSoft$Boot', 'YZSoft$Boot/images/logo.png')
                }]
            }, {
                xtype: 'component',
                padding: '20 15 10 15',
                tpl: [
                    '<div class="yz-comments yz-comments-size-x yz-align-hcenter">{text} 5.0</div>',
                ],
                data: {
                    text: RS.$('All__MobileAppName')
                }
            }, {
                xtype: 'component',
                flex: 3
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});