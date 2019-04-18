
Ext.define('YZSoft.apps.monthlyreport.Main', {
    extend: 'Ext.tab.Panel',
    requires: [
    ],

    constructor: function (config) {
        var me = this;

        var cfg = {
            tabBar: {
                cls: ['yz-tab-panel']
            },
            tabBarPosition: 'bottom',
            layout: {
                animation: false
            },
            activeItem: 0,
            defaults: {
                tab: {
                    flex: 1
                },
                back: function () {
                    if (me.config.back)
                        me.config.back.call(me.scope);
                }
            },
            items: [{
                xclass: 'YZSoft.apps.monthlyreport.personal.Main',
                title: RS.$('MonthlyReport_My_Title'),
                iconCls: ['yz-glyph', 'yz-glyph-tab-dailyreport-personal'],
                account: YZSoft.LoginUser.Account,
                shortName: YZSoft.LoginUser.ShortName
            }, {
                xclass: 'YZSoft.apps.monthlyreport.team.Main',
                title: RS.$('MonthlyReport_Team_Title'),
                iconCls: ['yz-glyph', 'yz-glyph-tab-dailyreport-team'],
                account: YZSoft.LoginUser.Account
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
