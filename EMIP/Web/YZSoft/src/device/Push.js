
Ext.define('YZSoft.src.device.Push', {
    singleton: true,
    requires: [
        Ext.browser.is.WebView && Ext.browser.is.Cordova && Ext.os.is.Android && YZSoft.LoginUser.AndroidPushService == 'JPush' ? 'YZSoft.src.device.push.JPush':'',
        Ext.browser.is.WebView && Ext.browser.is.Cordova && Ext.os.is.Android && YZSoft.LoginUser.AndroidPushService == 'GCM' ? 'YZSoft.src.device.push.GCM' : '',
        Ext.browser.is.WebView && Ext.browser.is.Cordova && Ext.os.is.iOS ? 'YZSoft.src.device.push.APNs' : '',
        Ext.browser.is.WebView && Ext.browser.is.Cordova ? '' :'YZSoft.src.device.push.Simulator'
    ],

    constructor: function () {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && browserEnv.Cordova){
            if (Ext.os.is.Android) {
                if (YZSoft.LoginUser.AndroidPushService == 'JPush')
                    return Ext.create('YZSoft.src.device.push.JPush');

                if (YZSoft.LoginUser.AndroidPushService == 'GCM')
                    return Ext.create('YZSoft.src.device.push.GCM');
            }
            else if (Ext.os.is.iOS) {
                return Ext.create('YZSoft.src.device.push.APNs');
            }
        }
        else {
            return Ext.create('YZSoft.src.device.push.Simulator');
        }
    }
});
