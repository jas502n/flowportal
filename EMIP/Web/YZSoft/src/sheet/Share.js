
Ext.define('YZSoft.src.sheet.Share', {
    extend: 'Ext.ActionSheet',
    config: {
        hideOnMaskTap: true,
        cls: 'yz-sheet-apps',
        showAnimation: {
            type: 'slideIn',
            duration: 250,
            easing: 'ease-out'
        },
        hideAnimation: {
            type: 'slideOut',
            duration: 250,
            easing: 'ease-in'
        }
    },
    onWechatSessionClick: Ext.emptyFn,
    onWechatTimelineClick: Ext.emptyFn,

    constructor: function (config) {
        var me = this;

        me.btnWechatSession = Ext.create('Ext.Button', {
            icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/share/wechat-session.png'),
            text: RS.$('All__WeChat'),
            handler: 'onWechatSessionClick'
        });

        me.btnWechatTimeline = Ext.create('Ext.Button', {
            icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/share/wechat-timeline.png'),
            text: RS.$('All__WeChatTimeline'),
            handler: 'onWechatTimelineClick'
        });

        me.btnQQ = Ext.create('Ext.Button', {
            icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/share/qq.png'),
            text: 'QQ',
            handler: 'onQQClick'
        });

        me.btnQQSpace = Ext.create('Ext.Button', {
            icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/share/qq-zone.png'),
            text: RS.$('All__QQSpace'),
            handler: 'onQQSpaceClick'
        });

        me.btnWeibo = Ext.create('Ext.Button', {
            icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/share/weibo.png'),
            text: RS.$('All__WeiBo'),
            handler: 'onWeiboClick'
        });

        me.pnlApps = Ext.create('Ext.Container', {
            layout: 'hbox',
            style: 'background-color:transparent;',
            padding: '25 10 20 10',
            defaults: {
                xtype: 'button',
                iconAlign: 'top',
                cls: ['yz-button-boxapp', 'yz-button-share'],
                flex: 1,
                scope: me,
                disabled: true
            },
            items: [
                me.btnWechatSession,
                me.btnWechatTimeline,
                me.btnQQ,
                me.btnQQSpace,
                me.btnWeibo
            ]
        });

        var cfg = {
            items: [me.pnlApps, {
                xtype: 'button',
                text: RS.$('All__Cancel'),
                cls: 'yz-button-flat yz-button-sheet-action yz-button-sheet-topborder',
                handler: function () {
                    me.hide();
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (window.Wechat) {
            Wechat.isInstalled(function (installed) {
                me.btnWechatSession.setDisabled(!installed);
                me.btnWechatTimeline.setDisabled(!installed);
            }, function (reason) {
            });
        }
        else {
            me.btnWechatSession.setDisabled(true);
            me.btnWechatTimeline.setDisabled(true);
        }

        if (window.QQSDK) {
            QQSDK.checkClientInstalled(function () {
                me.btnQQ.setDisabled(false);
                me.btnQQSpace.setDisabled(false);
            }, function () {
                me.btnQQ.setDisabled(true);
                me.btnQQSpace.setDisabled(true);
            }, {
                client: QQSDK.ClientType.QQ
            });
        }
        else {
            me.btnQQ.setDisabled(true);
            me.btnQQSpace.setDisabled(true);
        }

        if (window.WeiboSDK) {
            WeiboSDK.checkClientInstalled(function () {
                me.btnWeibo.setDisabled(false);
            }, function () {
                me.btnWeibo.setDisabled(true);
            });
        }
        else {
            me.btnWeibo.setDisabled(true);
        }
    }
});