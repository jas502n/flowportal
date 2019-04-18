
Ext.define('YZSoft.social.chat.GroupChatPanel', {
    extend: 'YZSoft.social.chat.ChatAbstractPanel',
    config: {
        groupid: null,
        editable: null
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

        me.btnGroup = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e997',
            iconAlign: 'left',
            align: 'right',
            hidden: config.editable === false,
            handler: function () {
                var pnl = Ext.create('YZSoft.social.group.Setting', {
                    title: RS.$('All_Group_Title'),
                    groupid: me.getGroupid(),
                    back: function () {
                        Ext.mainWin.pop();
                    },
                    exitgroup: function () {
                        if (me.config.exitgroup)
                            me.config.exitgroup.call(me.scope || me);
                    },
                    listeners: {
                        groupRenamed: function (newName) {
                            me.updateGroupInfo();
                            me.fireEvent('groupRenamed', me.getGroupid(), newName);
                        },
                        groupImageChanged: function (newImage) {
                            me.fireEvent('groupImageChanged', me.getGroupid(), newImage);
                        },
                        exitGroup: function () {
                            me.fireEvent('exitGroup', me.getGroupid());
                        },
                        memberChanged: function () {
                            me.updateGroupInfo();
                        }
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
            items: [me.btnBack, me.btnGroup]
        });

        me.pnlSocial = Ext.create('YZSoft.src.panel.Social', Ext.apply({
            resType: 'Group',
            resId: config.groupid
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

        me.updateGroupInfo();
    },

    updateGroupInfo: function () {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
            params: {
                method: 'GetGroupShortcut',
                groupid: me.getGroupid()
            },
            success: function (action) {
                var group = action.result.group,
                    membercount = action.result.membercount;

                me.titleBar.setTitle(Ext.String.format('{0}({1})', group.Name, membercount));
            }
        });
    }
});