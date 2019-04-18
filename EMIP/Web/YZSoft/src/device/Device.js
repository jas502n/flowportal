
Ext.define('YZSoft.src.device.Device', {
    singleton: true,
    requires: [
        Ext.browser.is.WebView && Ext.browser.is.Cordova ? 'YZSoft.src.device.device.Cordova' : 'YZSoft.src.device.device.Simulator'
    ],

    constructor: function () {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && browserEnv.Cordova)
            return Ext.create('YZSoft.src.device.device.Cordova');

        return Ext.create('YZSoft.src.device.device.Simulator');
    }
});
