Ext.define('YZSoft.src.panel.Social', {

    constructor: function (config) {
        var browserEnv = Ext.browser.is,
            className = 'HTML5';

        if (application.wechat)
            className = 'WeChat';
        else if (browserEnv.WebView && browserEnv.Cordova)
            className = 'Cordova';

        return Ext.create('YZSoft.src.panel.social.social.' + className, config);
    } 
});