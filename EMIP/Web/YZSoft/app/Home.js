
Ext.define('YZSoft.App.Home', {
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

        me.favorite = Ext.create('YZSoft.App.Favorite', {
        });

         me.AllApp = Ext.create('YZSoft.App.AllApp', {
         });
  
cfg = {
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    style: {
        background: '#eee'
    },
    items: [{
        xtype: 'container',
        layout: 'fit',
        margin: '6 0 0 0',
        style: {
            background: 'white'
        },
        items: [{
            xtype: 'titlebar',
            title: RS.$('All_Post_Favorite'),
            docked: 'top',
            cls: ['yz-titlebar-post'],
            padding: '10 10 10 10',
            titleAlign: 'left',
            style: 'font-weight: normal',
            items: [me.btnEdit]
        }, me.favorite]
    }, {
        xtype: 'container',
        layout: 'fit',
        margin: '10 0 0 0',
        style: {
            background: 'white'
        },
        items: [me.AllApp]
    }]
};

Ext.apply(cfg, config);
me.callParent([cfg]);

me.favorite.relayEvents(me, 'favoriteChange');
me.relayEvents(me.favorite, 'appClick');
me.relayEvents(me.AllApp, 'appClick');
me.relayEvents(me.favorite, 'appClickError');
me.relayEvents(me.AllApp, 'appClickError');
}
});