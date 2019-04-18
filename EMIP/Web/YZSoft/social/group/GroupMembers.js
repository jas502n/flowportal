
Ext.define('YZSoft.social.group.GroupMembers', {
    extend: 'Ext.Container',
    config: {
        groupid: null,
        users: null,
        style: 'background-color:white;',
        layout: {
            type: 'vbox',
            align: 'stretch'
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.btnBack = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me, me);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack]
        });

        me.viewUser = Ext.create('YZSoft.src.container.SquaredContainer', {
            minBoxCount: 5,
            minBoxWidth: 80,
            flex: 1,
            padding: '10 0 10 0',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            itemDefaults: {
                xtype: 'button',
                iconAlign: 'top',
                cls: ['yz-button-user', 'yz-button-group-user']
            },
            hboxConfig: {
                padding: 0
            }
        });

        cfg = {
            items: [me.titleBar, me.viewUser]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    updateUsers: function (users) {
        var me = this,
            items = [];

        Ext.each(users, function (user) {
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

        me.viewUser.setItems(items);
        me.titleBar.setTitle(Ext.String.format(RS.$('All_Group_Member_Title_FMT'), users.length));
    },

    onUserTap: function (button) {
        var me = this;
        me.fireEvent('usertap', button.config.user);
    }
});