Ext.define('YZSoft.personal.MainPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.ux.Push',
        'YZSoft.src.device.Push',
        'YZSoft.src.button.ListButton'
    ],

    constructor: function (config) {
        var me = this,
            cfg;

        //头像url
        var url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'GetHeadshot',
            account: YZSoft.LoginUser.Account,
            thumbnail: 'M'
        }));

        me.cmpName = Ext.create('Ext.Component', {
            cls: 'text',
            padding: '10 0 0 0',
            tpl: '{name}({dept})',
            data: {}
        });

        me.caption = Ext.create('Ext.Container', {
            cls: 'yz-personal-caption',
            layout: {
                type: 'vbox',
                pack: 'center',
                align: 'center'
            },
            items: [{
                cls: 'yz-pull-top',
                style: 'background-color:#26a5d8;'
            }, {
                xtype: 'image',
                cls: ['yz-headshort'],
                width: 76,
                height: 76,
                src: url
            }, me.cmpName]
        });

        me.btnProtect = Ext.create('YZSoft.src.button.ListButton', {
            iconCls: 'yz-glyph yz-glyph-e914',
            iconGoCls: ['yz-glyph', 'yz-account-protect', 'yz-account-protected'],
            iconColor: '#4bbfd6',
            text: RS.$('All_Personal_Security'),
            desc: RS.$('All_Bind_Disabled'),
            handler: function () {
                var pnl = Ext.create('YZSoft.personal.security.SecurityMainPanel', {
                    title: RS.$('All_Security_Title'),
                    back: function () {
                        me.loadForm();
                        Ext.mainWin.pop();
                    }
                });
                Ext.mainWin.push(pnl);
            }
        });

        me.btnShare = Ext.create('YZSoft.src.button.ListButton', {
            bborder: true,
            iconCls: 'yz-glyph yz-glyph-e910',
            iconGoCls: 'yz-glyph yz-glyph-e904',
            iconColor: '#e65857',
            text: RS.$('All_Personal_Share'),
            handler: function () {
                var sheet = Ext.create('YZSoft.personal.Share', {
                    listeners: {
                        order: 'after',
                        hide: function () {
                            this.destroy();
                        }
                    }
                });
                Ext.Viewport.add(sheet);
                sheet.show();
            }
        });

        me.btnServiceCenter = Ext.create('YZSoft.src.button.ListButton', {
            bborder: true,
            iconCls: 'yz-glyph yz-glyph-e90d',
            iconGoCls: 'yz-glyph yz-glyph-e904',
            iconColor: '#edb92f',
            text: RS.$('All_Personal_ServiceCenter'),
            handler: function () {
                var pnl = Ext.create('YZSoft.personal.service.ContactsPanel', {
                    title: RS.$('All_ServiceCenter_Title'),
                    back: function () {
                        Ext.mainWin.pop();
                    }
                });
                Ext.mainWin.push(pnl);
            }
        });

        me.btnAbout = Ext.create('YZSoft.src.button.ListButton', {
            iconCls: 'yz-glyph yz-glyph-e90c',
            iconGoCls: 'yz-glyph yz-glyph-e904',
            iconColor: '#90c328',
            text: Ext.String.format(RS.$('All_Personal_About'), RS.$('All__MobileAppName')),
            handler: function () {
                var pnl = Ext.create('YZSoft.personal.about.About', {
                    title: RS.$('All__MobileAppName'),
                    back: function () {
                        Ext.mainWin.pop();
                    }
                });
                Ext.mainWin.push(pnl);
            }
        });

        me.btnSetting = Ext.create('YZSoft.src.button.ListButton', {
            iconCls: 'yz-glyph yz-glyph-e90f',
            iconGoCls: 'yz-glyph yz-glyph-e904',
            iconColor: '#49aee4',
            text: RS.$('All_Personal_Setting'),
            handler: function () {
                var pnl = Ext.create('YZSoft.personal.setting.SettingMainPanel', {
                    title: RS.$('All_Setting_Title'),
                    back: function () {
                        Ext.mainWin.pop();
                    }
                });
                Ext.mainWin.push(pnl);
            }
        });

        me.btnLogout = Ext.create('YZSoft.src.button.ListButton', {
            cls: ['yz-button-flat'],
            padding: '13 10',
            style: 'background-color:white;border-radius:0px;',
            text: RS.$('All__SignOut'),
            handler: function () {
                YZSoft.src.device.Push.unregister({
                    success: function (action) {
                        try {
                            localStorage.setItem('pwd', '');
                            localStorage.setItem('logout', 'true');
                        }
                        catch (exp) {
                        }

                        YZSoft.src.device.Push.stopPush();
                        YZSoft.src.ux.Push.stop();

                        YZSoft.Ajax.request({
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Auth.ashx'),
                            params: {
                                method: 'Logout'
                            },
                            success: function (action) {
                                window.location.reload(true);
                            }
                        });
                    },
                    failure: function (action) {
                        Ext.Msg.alert(RS.$('All__Title_Error'), action.result.errorMessage);
                    }
                });

                //                var app = application.app;

                //                app.removeAllWins();
                //                YZSoft.src.ux.Push.stop();

                //                try {
                //                    localStorage.setItem('pwd', '');
                //                    localStorage.setItem('logout', 'true');
                //                }
                //                catch (exp) {
                //                }

                //                app.restore();
                //                app.login({
                //                    fn: function (result) {
                //                        app.launchApp(result);
                //                    }
                //                });
            }
        });

        cfg = {
            style: 'background-color:#f0f3f5;',
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
                    padding: '11 10'
                }
            },
            items: [me.caption, {
                xtype: 'container',
                margin: '12 0 0 0',
                cls: ['yz-container-border-top', 'yz-container-border-bottom'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.btnProtect]
            }, {
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-container-border-top', 'yz-container-border-bottom'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.btnShare, me.btnServiceCenter, me.btnAbout]
            }, {
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-container-border-top', 'yz-container-border-bottom'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.btnSetting]
            }, {
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-container-border-top', 'yz-container-border-bottom'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.btnLogout]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.loadForm();

        me.on({
            painted: function () {
                Ext.Loader.require('YZSoft.src.device.StatusBar', function () {
                    YZSoft.src.device.StatusBar.styleLightContent();
                    YZSoft.home.on({
                        scope: me,
                        deactivate: 'onContainerDeactive'
                    });
                });
            },
            deactivate: function () {
                Ext.Loader.require('YZSoft.src.device.StatusBar', function () {
                    YZSoft.src.device.StatusBar.styleDefault();
                    YZSoft.home.un({
                        scope: me,
                        deactivate: 'onContainerDeactive'
                    });
                });
            }
        });
    },

    onContainerDeactive: function () {
        YZSoft.src.device.StatusBar.styleDefault();
    },

    loadForm: function () {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Org.ashx'),
            params: {
                method: 'GetPersonalInfo'
            },
            success: function (action) {
                var result = action.result,
                    user = result.user,
                    userCommonInfo = result.userCommonInfo,
                    positions = result.positions,
                    protect = userCommonInfo.AppLoginProtect,
                    position = positions[0];

                me.cmpName.setData({
                    name: user.ShortName,
                    dept: position && position.OUName
                });

                me.btnProtect.iconGoElement[protect ? 'addCls' : 'removeCls']('yz-account-protected');
                me.btnProtect.setDesc(protect ? RS.$('All_Bind_Enabled') : RS.$('All_Bind_Disabled'));
            }
        });
    }
});
