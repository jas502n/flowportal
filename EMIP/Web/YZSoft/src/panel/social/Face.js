
Ext.define('YZSoft.src.panel.social.Face', {
    extend: 'Ext.Container',

    constructor: function (config) {
        var me = this,
            cfg;

        me.tabBar = Ext.create('Ext.tab.Bar', {
            ui: 'plain',
            cls: ['yz-tabbar-face']
        });

        me.qqface = Ext.create('YZSoft.src.panel.social.QQFace', {
            tab: {
                cls: ['yz-tab-tab-face'],
                iconCls: ['yz-tabicon-face', 'yz-tabicon-qqface'],
                iconAlign: 'top'
            }
        });

        me.freqface = Ext.create('YZSoft.src.panel.social.FrequenceFace', {
            tab: {
                cls: ['yz-tab-tab-face'],
                iconCls: ['yz-tabicon-face', 'yz-tabicon-qqface-frequence'],
                iconAlign: 'top'
            }
        });
        

        me.tab = Ext.create('Ext.tab.Panel', {
            flex: 1,
            tabBar: me.tabBar,
            layout: {
                animation: false
            },
            activeItem: 0,
            items: [me.qqface, me.freqface]
        });

        me.btnSend = Ext.create('Ext.Button', {
            text: RS.$('All__Send'),
            cls: ['yz-button-flat', 'yz-button-social-sendcomments'],
            handler: function () {
                me.fireEvent('sendClick');
            }
        });

        cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.tab, {
                xtype: 'container',
                layout: {
                    type: 'hbox'
                },
                items: [{
                    xtype: 'container',
                    flex: 1,
                    items: [me.tabBar]
                }, me.btnSend]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.qqface, ['faceClick']);
        me.relayEvents(me.freqface, ['faceClick']);
    }
});