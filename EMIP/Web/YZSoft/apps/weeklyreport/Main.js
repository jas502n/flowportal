
Ext.define('YZSoft.apps.weeklyreport.Main', {
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
                xclass: 'YZSoft.apps.weeklyreport.personal.Main',
                title: RS.$('WeeklyReport_My_Title'),
                iconCls: ['yz-glyph', 'yz-glyph-tab-dailyreport-personal'],
                account: YZSoft.LoginUser.Account,
                shortName: YZSoft.LoginUser.ShortName,
                tab: {
                    flex:1,
                    title: RS.$('WeeklyReport_Tab_My')
                }
            }, {
                xclass: 'YZSoft.apps.weeklyreport.team.Main',
                title: RS.$('WeeklyReport_Team_Title'),
                iconCls: ['yz-glyph', 'yz-glyph-tab-dailyreport-team'],
                account: YZSoft.LoginUser.Account,
                tab: {
                    flex: 1,
                    title: RS.$('WeeklyReport_Tab_Team')
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
