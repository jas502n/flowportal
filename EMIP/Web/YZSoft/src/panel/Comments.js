
Ext.define('YZSoft.src.panel.Comments', {
    extend: 'Ext.Panel',

    config: {
        cls:'yz-msgbox',
        modal: true,
        hideOnMaskTap: true,
        centered: true,
        width: 300
    },

    constructor: function (config) {
        var me = this;

        me.edtComments = Ext.create('Ext.field.TextArea', {
        });

        me.btnOK = Ext.create('Ext.Button', {
            text: RS.$('All__OK'),
            cls: 'yz-button-flat yz-button-dlg-default',
            flex: 1,
            handler: function () {
                var comments = me.edtComments.getValue();
                if (me.config.fn)
                    me.config.fn.call(me.scope, comments, me);
            }
        });

        me.btnCancel = Ext.create('Ext.Button', {
            text: RS.$('All__Cancel'),
            cls: 'yz-button-flat yz-button-dlg-normal',
            flex: 1,
            handler: function () {
                me.hide();
            }
        });

        var cfg = {
            layout: 'fit',
            items: [{
                docked: 'top',
                xtype: 'titlebar',
                cls: 'yz-titlebar-panel',
                title: config.title
            }, me.edtComments, {
                docked: 'bottom',
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [me.btnCancel, { xtype: 'spacer', width: 20 }, me.btnOK]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});