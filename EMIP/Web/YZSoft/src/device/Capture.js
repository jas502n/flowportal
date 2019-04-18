
Ext.define('YZSoft.src.device.Capture', {
    singleton: true,

    constructor: function () {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && browserEnv.Cordova)
            return Ext.create('YZSoft.src.device.capture.Cordova');

        return Ext.create('YZSoft.src.device.capture.Simulator');
    }
});
