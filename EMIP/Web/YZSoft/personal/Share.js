
Ext.define('YZSoft.personal.Share', {
    extend: 'YZSoft.src.sheet.Share',

    onWechatSessionClick: function () {
        Wechat.share({
            message: {
                title: RS.$('All__Share_Wechat_Session_Title'),
                description: RS.$('All__Share_Wechat_Session_Desc'),
                thumb: 'http://www.flowportal.com/share/emip/wechat.png',
                media: {
                    type: Wechat.Type.WEBPAGE,
                    webpageUrl: 'http://www.flowportal.com/share/emip/about.html'
                }
            },
            scene: Wechat.Scene.SESSION   //共享到联系人
        }, function () {
        }, function (reason) {
        });
    },

    onWechatTimelineClick: function () {
        Wechat.share({
            message: {
                title: RS.$('All__Share_Wechat_Timeline_Title'),
                description: '',
                thumb: 'http://www.flowportal.com/share/emip/wechat.png',
                media: {
                    type: Wechat.Type.WEBPAGE,
                    webpageUrl: 'http://www.flowportal.com/share/emip/about.html'
                }
            },
            scene: Wechat.Scene.TIMELINE   //共享到朋友圈
        }, function () {
        }, function (reason) {
        });
    },

    //help:http://npm.taobao.org/package/cordova-plugin-qqsdk  分享到QQ
    onQQClick: function () {
        var args = {};
        args.client = QQSDK.ClientType.QQ;//QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
        args.scene = QQSDK.Scene.QQ;//QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
        args.url = 'http://www.flowportal.com/share/emip/about.html',
            args.title = RS.$('All__Share_Wechat_Session_Title'),
            args.description = RS.$('All__Share_Wechat_Session_Desc'),
            args.image = 'http://www.flowportal.com/share/emip/wechat.png'
        QQSDK.shareNews(function () {

        }, function (failReason) {

        }, args);
    },

    //help:http://npm.taobao.org/package/cordova-plugin-qqsdk  分享到QQ空间
    onQQSpaceClick: function () {
        var args = {};
        args.client = QQSDK.ClientType.QQ;//QQSDK.ClientType.QQ,QQSDK.ClientType.TIM;
        args.scene = QQSDK.Scene.QQZone;//QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
        args.url = 'http://www.flowportal.com/share/emip/about.html',
            args.title = RS.$('All__Share_Wechat_Session_Title'),
            args.description = RS.$('All__Share_Wechat_Session_Desc'),
            args.image = 'http://www.flowportal.com/share/emip/wechat.png'
        QQSDK.shareNews(function () {

        }, function (failReason) {

        }, args);
    },

    //help:http://npm.taobao.org/package/cordova-plugin-weibosdk 分享到微博
    onWeiboClick: function () {

        var args = {};
        args.url = 'http://www.flowportal.com/share/emip/about.html',
            args.title = RS.$('All__Share_Wechat_Timeline_Title'),
            args.description = RS.$('All__Share_Wechat_Session_Desc'),
            args.image = 'http://www.flowportal.com/share/emip/wechat.png';
        WeiboSDK.shareToWeibo(function () {
        }, function (failReason) {
        }, args);
    }
});