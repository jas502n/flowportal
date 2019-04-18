Ext.define('YZSoft.personal.setting.SettingMainPanel', {
    extend: 'Ext.Container',
    requires:[
        'YZSoft.src.ux.Push',
        'YZSoft.src.button.ListButton'
    ],
    config: {
        style: 'background-color:#f0f3f5;',
        scrollable: {
            direction: 'vertical',
            indicators: false
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        config = config || {};

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

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack]
        });

        me.btnMessage = Ext.create('YZSoft.src.button.ListButton', {
            text: RS.$('All_Setting_Message'),
            iconGoCls: 'yz-glyph yz-glyph-e904',
            handler: function () {
                var pnl = Ext.create('YZSoft.personal.setting.Message', {
                    title: RS.$('All_Setting_Message'),
                    back: function () {
                        Ext.mainWin.pop();
                    }
                });

                Ext.mainWin.push(pnl);
            }
        });

        me.btnLang = Ext.create('YZSoft.src.button.ListButton', {
            text: RS.$('All_Setting_Lang'),
            iconGoCls: 'yz-glyph yz-glyph-e904',
            handler: function () {
                var pnl = Ext.create('YZSoft.personal.setting.Lang', {
                    title: RS.$('All_Setting_Lang'),
                    back: function () {
                        Ext.mainWin.pop();
                    },
                    fn: function () {
                        YZSoft.src.ux.Push.stop();
                        window.location.reload(true);
                    }
                });

                Ext.mainWin.push(pnl);
            }
        });

        me.btnOutOfOffice = Ext.create('YZSoft.src.button.ListButton', {
            text: RS.$('All_Setting_OutOfOffice'),
            iconGoCls: 'yz-glyph yz-glyph-e904',
            bborder: true,
            handler: function () {
                var pnl = Ext.create('YZSoft.personal.setting.OutOfOffice', {
                    title: RS.$('All_Setting_OutOfOffice'),
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

        me.btnVersion = Ext.create('YZSoft.src.button.ListButton', {
            text: RS.$('All_Setting_Version'),
            iconGoCls: 'yz-glyph yz-glyph-e904',
            handler: function () {
                var pnl = Ext.create('YZSoft.personal.setting.Version', {
                    title: RS.$('All_Setting_Version'),
                    back: function () {
                        Ext.mainWin.pop();
                    }
                });

                Ext.mainWin.push(pnl);
            }
        });

        cfg = {
            defaults: {
                defaults: {
                    padding: '11 10 11 15'
                }
            },
            items: [me.titleBar, {
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-container-border-top', 'yz-container-border-bottom', 'yz-list-button-container-left15'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.btnMessage]
            }, {
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-container-border-top', 'yz-container-border-bottom', 'yz-list-button-container-left15'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.btnLang]
            }, {
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-container-border-top', 'yz-container-border-bottom', 'yz-list-button-container-left15'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.btnOutOfOffice, me.btnVersion]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
