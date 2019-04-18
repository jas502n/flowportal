
Ext.define('YZSoft.apps.footmark.team.UnSignPanel', {
    extend: 'YZSoft.src.container.SquaredContainer',
    config: {
        minBoxCount: 5,
        minBoxWidth: 80,
        itemDefaults: {
            xtype: 'button',
            iconAlign: 'top',
            cls: 'yz-button-user'
        },
        users: null,
        style: 'background-color:white;',
        padding:'10 0 0 0'
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
                handler: 'onTap'
            });
        });

        me.setItems(items);
    },

    onTap: function (button) {
        var me = this;
        me.fireEvent('usertap', button.config.user);
    }
});