
Ext.define('YZSoft.apps.footmark.Main', {
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
                xclass: 'YZSoft.apps.footmark.form.Sign',
                title: RS.$('Footmark_Module_Sign'),
                iconCls: ['yz-glyph', 'yz-glyph-tab-footmark-sign']
            }, {
                xclass: 'YZSoft.apps.footmark.team.Main',
                title: RS.$('Footmark_Team_Title'),
                tab: {
                    flex: 1,
                    title: RS.$('Footmark_Module_Team')
                },
                iconCls: ['yz-glyph', 'yz-glyph-tab-footmark-list']
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
