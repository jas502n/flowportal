
Ext.define('YZSoft.request.MainPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.button.ListButton',
        //--------------微信钉钉启动程序附加项-----------------
        'YZSoft.src.button.Button'
    ],
    config:{
        backButton: true,
        titleBar: true
    },

    constructor: function (config) {
        var me = this;

        config = config || {};

        me.btnBack = Ext.create('Ext.Button', {
            xtype: 'button',
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            hidden: config.backButton === false,
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            title: config.title || '',
            docked: 'top',
            cls: ['yz-titlebar'],
            hidden: config.titleBar === false,
            items: [me.btnBack]
        });

        var cfg = {
            style: 'background-color:#f5f5f9;',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                defaults: {
                    padding: '11 10 11 12'
                }
            },
            items: [me.titleBar,{
                xtype: 'container',
                cls: ['yz-container-border-bottom'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype:'titlebar',
                    title: RS.$('All_Apps_CompanyAdmin'),
                    docked: 'top',
                    cls: ['yz-titlebar-request'],
                    padding: '8 0 8 5',
                    titleAlign: 'left'
                },{
                    xclass: 'YZSoft.src.button.ListButton',
                    bborder: true,
                    icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/request/qingjia.png'),
                    iconGoCls: 'yz-glyph yz-glyph-e904',
                    text: RS.$('All_Apps_Leaving'),
                    handler: function () {
                        var pnl = Ext.create('YZSoft.form.Post', {
                            title: RS.$('All_Apps_Leaving_Title'),
                            processName: '$请假',
                            back: function () {
                                Ext.mainWin.pop();
                            },
                            fn: function () {
                                Ext.mainWin.pop();
                            }
                        });

                        Ext.mainWin.push(pnl);
                    }
                }, {
                    xclass: 'YZSoft.src.button.ListButton',
                    bborder: true,
                    icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/request/baoxiao.png'),
                    iconGoCls: 'yz-glyph yz-glyph-e904',
                    text: RS.$('All_Apps_Expense'),
                    handler: function () {
                        var pnl = Ext.create('YZSoft.form.Post', {
                            title: RS.$('All_Apps_Expense_Title'),
                            processName: '$报销',
                            back: function () {
                                Ext.mainWin.pop();
                            },
                            fn: function () {
                                Ext.mainWin.pop();
                            }
                        });

                        Ext.mainWin.push(pnl);
                    }
                }, {
                    xclass: 'YZSoft.src.button.ListButton',
                    bborder: true,
                    icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/request/chuchai.png'),
                    iconGoCls: 'yz-glyph yz-glyph-e904',
                    text: RS.$('All_Apps_BusinessTrip'),
                    handler: function () {
                        var pnl = Ext.create('YZSoft.form.Post', {
                            title: RS.$('All_Apps_BusinessTrip_Request'),
                            processName: '$出差',
                            back: function () {
                                Ext.mainWin.pop();
                            },
                            fn: function () {
                                Ext.mainWin.pop();
                            }
                        });

                        Ext.mainWin.push(pnl);
                    }
                }, {
                    xclass: 'YZSoft.src.button.ListButton',
                    bborder: true,
                    icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/request/waichu.png'),
                    iconGoCls: 'yz-glyph yz-glyph-e904',
                    text: RS.$('All_Apps_Outside'),
                    handler: function () {
                        var pnl = Ext.create('YZSoft.form.Post', {
                            title: RS.$('All_Apps_Outside_Request'),
                            processName: '$外出',
                            back: function () {
                                Ext.mainWin.pop();
                            },
                            fn: function () {
                                Ext.mainWin.pop();
                            }
                        });

                        Ext.mainWin.push(pnl);
                    }
                }]
            }, {
                xtype: 'container',
                cls: ['yz-container-border-bottom'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'titlebar',
                    title: RS.$('All__Production'),
                    docked: 'top',
                    cls: ['yz-titlebar-request'],
                    padding: '8 0 8 5',
                    titleAlign: 'left'
                }, {
                    xclass: 'YZSoft.src.button.ListButton',
                    iconCls: 'yz-glyph yz-glyph-e90f',
                    iconGoCls: 'yz-glyph yz-glyph-e904',
                    iconColor: '#49aee4',
                    text: RS.$('All__Process_Feedback'),
                    handler: function () {
                        var pnl = Ext.create('YZSoft.form.Post', {
                            title: RS.$('All__Process_Feedback_Title'),
                            processName: '$反馈',
                            back: function () {
                                Ext.mainWin.pop();
                            },
                            fn: function () {
                                Ext.mainWin.pop();
                            }
                        });

                        Ext.mainWin.push(pnl);
                    }
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
