
Ext.define('YZSoft.social.group.GroupMembersShortcut', {
    extend: 'Ext.Container',
    config: {
        groupid: null,
        users: null,
        style: 'background-color:white;',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        padding: '10 0 10 0'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.viewUser = Ext.create('YZSoft.src.container.SquaredContainer', {
            minBoxCount: 5,
            minBoxWidth: 80,
            itemDefaults: {
                xtype: 'button',
                iconAlign: 'top',
                cls: ['yz-button-user', 'yz-button-group-user']
            },
            hboxConfig: {
                padding: 0
            }
        });

        me.btnMore = Ext.create('Ext.Button', {
            text: RS.$('All_Group_Member_More'),
            cls: ['yz-button-flat', 'yz-button-group-user-more'],
            iconCls: 'yz-glyph yz-glyph-e904',
            iconAlign: 'right',
            scope: me,
            handler: 'onMoreClick'
        });

        me.cntMore = Ext.create('Ext.Container', {
            xtype: 'container',
            layout: {
                type: 'hbox',
                pack: 'center'
            },
            items: [me.btnMore]
        });

        cfg = {
            items: [me.viewUser, me.cntMore]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    updateUsers: function (users) {
        var me = this,
            items = [],
            dspUsers = me.subsetUsers(users, 8);

        me.cntMore[dspUsers.length == users.length ? 'hide' : 'show']()

        Ext.each(dspUsers, function (user) {
            var url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                Method: 'GetHeadshot',
                account: user.Account,
                thumbnail: 'M'
            }));

            items.push({
                text: user.DisplayName || user.Account,
                icon: url,
                scope: me,
                user: user,
                handler: 'onUserTap'
            });
        });

        me.btnAdd = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', '.yz-button-user', 'yz-button-addlistitem-glyph-44'],
            iconCls: 'yz-glyph yz-glyph-e968',
            iconAlign: 'top',
            scope: me,
            handler: 'onAddUserClick'
        });

        items.push(me.btnAdd);

        me.btnRemove = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', '.yz-button-user', 'yz-button-addlistitem-glyph-44'],
            iconCls: 'yz-glyph yz-glyph-e967',
            iconAlign: 'top',
            scope: me,
            handler: 'onRemoveUserClick'
        });

        items.push(me.btnRemove);

        me.viewUser.setItems(items);
    },

    subsetUsers: function (users, maxcount) {
        var startindex = Math.max(users.length - maxcount, 0);
        return Ext.Array.slice(users, startindex);
    },

    onUserTap: function (button) {
        var me = this;
        me.fireEvent('usertap', button.config.user);
    },

    onAddUserClick: function () {
        var me = this;

        var pnl = Ext.create('YZSoft.src.sheet.SelUser', {
            title: RS.$('All_Group_Member_SelUser_Title'),
            back: function () {
                pnl.hide();
            },
            fn: function (users) {
                var uids = [];

                Ext.each(users, function (user) {
                    uids.push(user.Account);
                });

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                    params: {
                        method: 'AddGroupMembers',
                        groupid: me.getGroupid(),
                        role: 'Guset'
                    },
                    jsonData: uids,
                    success: function (action) {
                        pnl.hide();
                        me.fireEvent('memberChanged');
                    }
                });
            },
            listeners: {
                order:'after',
                hide: function () {
                    this.destroy();
                }
            }
        });

        Ext.Viewport.add(pnl);
        pnl.show();
    },

    onRemoveUserClick: function () {
        var me = this;

        var pnl = Ext.create('YZSoft.social.group.DeleteGroupMember', {
            title: RS.$('All_Group_Member_Delete'),
            groupid: me.getGroupid(),
            back: function () {
                pnl.hide();
            },
            fn: function () {
                pnl.hide();
                me.fireEvent('memberChanged');
            },
            listeners: {
                order: 'after',
                hide: function () {
                    this.destroy();
                }
            }
        });

        Ext.Viewport.add(pnl);
        pnl.show();
    },

    onMoreClick: function () {
        var me = this;

        var pnl = Ext.create('YZSoft.social.group.GroupMembers', {
            title: RS.$('All_Group_Member_Title'),
            users: me.getUsers(),
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