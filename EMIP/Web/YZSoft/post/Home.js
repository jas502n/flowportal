
Ext.define('YZSoft.post.Home', {
    extend: 'Ext.Container',
    requires: [
    ],
    config: {
        scrollable: {
            direction: 'vertical',
            indicators: false
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnEdit = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-paneltitlebar'],
            text: RS.$('All__Edit'),
            align: 'right',
            handler: function () {
                if (me.favorite.getEditing()) {
                    me.favorite.setEditing(false);
                    me.btnEdit.setText(RS.$('All__Edit'));
                }
                else {
                    me.favorite.setEditing(true);
                    me.btnEdit.setText(RS.$('All__Finished'));
                }
            }
        });

        me.favorite = Ext.create('YZSoft.post.Favorite', {
        });

        me.recently = Ext.create('YZSoft.post.Recently', {
        });

        cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
                layout: 'fit',
                margin: '6 0 0 0',
                items: [{
                    xtype: 'titlebar',
                    title: RS.$('All_Post_Favorite'),
                    docked: 'top',
                    cls: ['yz-titlebar-post'],
                    padding: '10 10 10 10',
                    titleAlign: 'left',
                    items: [me.btnEdit]
                }, me.favorite]
            },{
                xtype: 'container',
                layout: 'fit',
                margin: '0 0 0 0',
                items: [{
                    xtype: 'titlebar',
                    title: RS.$('All_Post_Recently'),
                    docked: 'top',
                    cls: ['yz-titlebar-post'],
                    padding: '16 10 10 10',
                    titleAlign: 'left'
                }, me.recently]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.favorite.relayEvents(me, 'favoriteChange');
        me.relayEvents(me.favorite, 'processClick');
        me.relayEvents(me.recently, 'processClick');
    }
});