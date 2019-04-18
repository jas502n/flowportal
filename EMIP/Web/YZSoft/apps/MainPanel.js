Ext.define('YZSoft.apps.MainPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.container.SquaredContainer'
    ],

    constructor: function (config) {
        var me = this;

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            cls: ['yz-titlebar'],
            title: RS.$('All__Apps')
        });

        me.banner = Ext.create('Ext.Img', {
            cls: 'yz-img-fill',
            src: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/apps/banner.png'),
            height: 146
        });

        me.panelHotApp = me.createHotAppPanel();
        me.pnlMyApps = me.createMyAppsPanel();
        me.pnlSpecAppsXZ = me.createXZPanel();

        var cfg = {
            style: 'background-color:#f0f3f5;',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.titleBar, me.banner, me.panelHotApp, me.pnlMyApps, me.pnlSpecAppsXZ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    createHotAppPanel: function () {
        var me = this,
            minBoxWidth = 100,
            minBoxCount = 4,
            screenWidth = Ext.getBody().getSize().width,
            lineBoxCount, boxWidth;

        lineBoxCount = Math.max(Math.floor(screenWidth / minBoxWidth), minBoxCount);
        boxWidth = screenWidth / lineBoxCount;

        return Ext.create('Ext.Container', {
            height: 68,
            cls: ['yz-container-apps'],
            margin: '0 0 10 0',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            scrollable: {
                direction: 'horizontal',
                directionLock: true,
                indicators: false
            },
            defaults: {
                width: boxWidth,
                iconAlign: 'top',
                cls: 'yz-button-hotapp'
            },
            items: [{
                xtype: 'button',
                text: RS.$('All_Apps_PostRequest'),
                iconCls: 'yz-glyph yz-glyph-e918',
                handler: function () {
                    var pnl = Ext.create('YZSoft.request.MainPanel', {
                        title: RS.$('All_Apps_PostRequest'),
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
                xtype: 'button',
                text: RS.$('All_Apps_Leaving'),
                iconCls: 'yz-glyph yz-glyph-e972',
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
                xtype: 'button',
                text: RS.$('All_Apps_Expense'),
                iconCls: 'yz-glyph yz-glyph-e971',
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
                xtype: 'button',
                text: RS.$('All_Apps_DailyReport'),
                iconCls: 'yz-glyph yz-glyph-e919',
                handler: function () {
                    var pnl = Ext.create('YZSoft.apps.dailyreport.Main', {
                        title: RS.$('All_Apps_DailyReport'),
                        back: function () {
                            Ext.mainWin.pop();
                        }
                    });

                    Ext.mainWin.push(pnl);
                }
            }, {
                xtype: 'button',
                text: RS.$('All_BPM_MyRequest'),
                iconCls: 'yz-glyph yz-glyph-e911',
                handler: function () {
                    var pnl = Ext.create('Ext.Container', {
                        layout: 'fit',
                        items: [{
                            xtype: 'titlebar',
                            docked: 'top',
                            cls: ['yz-titlebar'],
                            title: RS.$('All_BPM_MyRequest'),
                            items: [{
                                cls: ['yz-button-flat', 'yz-button-titlebar'],
                                iconCls: 'yz-glyph yz-glyph-e913',
                                iconAlign: 'left',
                                align: 'left',
                                handler: function () {
                                    Ext.mainWin.pop();
                                }
                            }]
                        }, {
                            xclass: 'YZSoft.task.MyRequestPanel'
                        }]
                    });

                    Ext.mainWin.push(pnl);
                }
            }, {
                xtype: 'button',
                text: RS.$('All_Apps_MyProcessedTask'),
                iconCls: 'yz-glyph yz-glyph-e91b',
                handler: function () {
                    var pnl = Ext.create('Ext.Container', {
                        layout: 'fit',
                        items: [{
                            xtype: 'titlebar',
                            docked: 'top',
                            cls: ['yz-titlebar'],
                            title: RS.$('All_Apps_MyProcessedTask'),
                            items: [{
                                cls: ['yz-button-flat', 'yz-button-titlebar'],
                                iconCls: 'yz-glyph yz-glyph-e913',
                                iconAlign: 'left',
                                align: 'left',
                                handler: function () {
                                    Ext.mainWin.pop();
                                }
                            }]
                        }, {
                            xclass: 'YZSoft.task.MyRequestPanel'
                        }]
                    });

                    Ext.mainWin.push(pnl);
                }
            }, {
                xtype: 'button',
                text: RS.$('All_Apps_FieldsDemo'),
                iconCls: 'yz-glyph yz-glyph-e974',
                handler: function () {
                    var pnl = Ext.create('YZSoft.form.Post', {
                        title: RS.$('All_Apps_FieldsDemo_Title'),
                        processName: '$移动表单控件',
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
                xtype: 'button',
                text: '动态隐藏',
                iconCls: 'yz-glyph yz-glyph-e974',
                handler: function () {
                    var pnl = Ext.create('YZSoft.form.Post', {
                        title: '动态隐藏',
                        processName: '$移动表单控件',
                        form: {
                            xclass: 'YZSoft.demo.HideShow'
                        },
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
        });
    },

    createMyAppsPanel: function () {
        var me = this,
            myApps;

        myApps = Ext.create('YZSoft.src.container.SquaredContainer', {
            cls: ['yz-container-apps'],
            defaults: {
                iconAlign: 'top',
                cls: 'yz-button-app'
            },
            items: [{
                xtype: 'button',
                text: RS.$('All_Apps_Footmark'),
                icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/apps/signin.png'),
                handler: function () {
                    var pnl = Ext.create('YZSoft.apps.footmark.Main', {
                        title: RS.$('All_Apps_Footmark'),
                        back: function () {
                            Ext.mainWin.pop();
                        }
                    });

                    Ext.mainWin.push(pnl);
                }
            }, {
                xtype: 'button',
                text: RS.$('All_Apps_BarcodeScan'),
                icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/apps/scan.png'),
                handler: function () {
                    var pnl = Ext.create('YZSoft.apps.barcode.Scan', {
                        back: function () {
                            Ext.mainWin.pop();
                        }
                    });

                    Ext.mainWin.getLayout().getAnimation().disable();
                    Ext.mainWin.push(pnl);
                    Ext.mainWin.getLayout().getAnimation().enable();
                }
            }, {
                xtype: 'button',
                text: RS.$('All_Apps_CashMemo'),
                icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/apps/notes.png'),
                handler: function () {
                    var pnl = Ext.create('YZSoft.apps.cash.ListPanel', {
                        title: RS.$('All_Apps_CashMemo_Title'),
                        back: function () {
                            Ext.mainWin.pop();
                        }
                    });

                    Ext.mainWin.push(pnl);
                }
            }, {
                xtype: 'button',
                text: RS.$('All_Apps_BPMReport'),
                icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/apps/report.png'),
                handler: function () {
                    var pnl = Ext.create('YZSoft.apps.bpmreport.personal.Main', {
                        title:RS.$('All_Apps_BPMReport_Title'),
                        uid: YZSoft.LoginUser.Account,
                        back: function () {
                            Ext.mainWin.pop();
                        }
                    });

                    Ext.mainWin.push(pnl);
                }
            }, {
                xtype: 'button',
                text: RS.$('All_Apps_CompanyAddressBook'),
                icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/apps/addressbook.png'),
                handler: function () {
                    var pnl = Ext.create('YZSoft.apps.addressbook.MainPanel', {
                        title: RS.$('All_Apps_CompanyAddressBook'),
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
                xtype: 'button',
                text: RS.$('All_Apps_FindTask'),
                icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/apps/task.png'),
                handler: function () {
                    var pnl = Ext.create('YZSoft.task.AllAccessableTaskPanel', {
                        title: RS.$('All_Apps_FindTask_Title'),
                        back: function () {
                            Ext.mainWin.pop();
                        }
                    });

                    Ext.mainWin.push(pnl);
                }
            }, {
                xtype: 'button',
                text: RS.$('All_Apps_DailyReport'),
                icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/apps/daily.png'),
                handler: function () {
                    var pnl = Ext.create('YZSoft.apps.dailyreport.Main', {
                        title: RS.$('All_Apps_DailyReport'),
                        back: function () {
                            Ext.mainWin.pop();
                        }
                    });

                    Ext.mainWin.push(pnl);
                }
            }, {
                xtype: 'button',
                text: RS.$('All_Apps_AudioRecord'),
                icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/apps/speak.png'),
                handler: function () {
                    var pnl = Ext.create('YZSoft.apps.speak.ListPanel', {
                        title: RS.$('All_Apps_AudioRecord_My_Title'),
                        back: function () {
                            Ext.mainWin.pop();
                        }
                    });

                    Ext.mainWin.getLayout().getAnimation().disable();
                    Ext.mainWin.push(pnl);
                    Ext.mainWin.getLayout().getAnimation().enable();
                }
            }]
        });

        return Ext.create('Ext.Container', {
            layout: 'fit',
            margin: '0 0 10 0',
            items: [{
                xtype: 'titlebar',
                docked: 'top',
                cls: ['yz-titlebar-panel'],
                title: RS.$('All_Apps_Favorite'),
                titleAlign: 'left',
                items: [{
                    cls: ['yz-button-flat', 'yz-button-paneltitlebar'],
                    iconCls: 'yz-glyph yz-glyph-e904',
                    iconAlign: 'right',
                    text: RS.$('All_Apps_Arriange'),
                    align: 'right'
                }]
            }, myApps]
        });
    },

    createXZPanel: function () {
        var me = this,
            specApps;

        specApps = Ext.create('YZSoft.src.container.SquaredContainer', {
            cls: ['yz-container-apps'],
            defaults: {
                xtype: 'button',
                iconAlign: 'top',
                cls: 'yz-button-app'
            },
            items: [{
                text: RS.$('All_Apps_DailyReport'),
                icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/apps/daily.png'),
                handler: function () {
                    var pnl = Ext.create('YZSoft.apps.dailyreport.Main', {
                        title: RS.$('All_Apps_DailyReport'),
                        back: function () {
                            Ext.mainWin.pop();
                        }
                    });

                    Ext.mainWin.push(pnl);
                }
            }, {
                text: RS.$('All_Apps_WeeklyReport'),
                icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/apps/weekly.png'),
                handler: function () {
                    var pnl = Ext.create('YZSoft.apps.weeklyreport.Main', {
                        title: RS.$('All_Apps_WeeklyReport'),
                        back: function () {
                            Ext.mainWin.pop();
                        }
                    });

                    Ext.mainWin.push(pnl);
                }
            }, {
                text: RS.$('All_Apps_MonthlyReport'),
                icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/apps/monthly.png'),
                handler: function () {
                    var pnl = Ext.create('YZSoft.apps.monthlyreport.Main', {
                        title: RS.$('All_Apps_MonthlyReport'),
                        back: function () {
                            Ext.mainWin.pop();
                        }
                    });

                    Ext.mainWin.push(pnl);
                }
            }]
        });

        return Ext.create('Ext.Container', {
            layout: 'fit',
            margin: '0 0 10 0',
            items: [{
                xtype: 'titlebar',
                docked: 'top',
                cls: ['yz-titlebar-panel'],
                title: RS.$('All_Apps_CompanyAdmin'),
                titleAlign: 'left'
            }, specApps]
        });
    }
});
