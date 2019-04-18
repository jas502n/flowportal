
Ext.define('YZSoft.social.chat.TaskChatPanel', {
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

        me.btnForm = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e966',
            iconAlign: 'left',
            align: 'right',
            hidden: config.disableform === true,
            handler: function () {
                pnl = Ext.create('YZSoft.form.Read', {
                    tid: config.tid,
                    title: '',
                    disablesocial:true,
                    back: function () {
                        Ext.mainWin.pop();
                    },
                    fn: function () {
                        Ext.mainWin.pop();
                    }
                });

                Ext.mainWin.push(pnl);
            }
        });

        me.cnt = Ext.create('Ext.Panel', {
            items: []
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title,
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnForm]
        });

        me.pnlSocial = Ext.create('YZSoft.src.panel.Social', Ext.apply({
            resType: 'Task',
            resId: config.tid
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