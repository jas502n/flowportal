
Ext.define('YZSoft.src.device.StatusBar', {
    singleton: true,

    constructor: function () {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && browserEnv.Cordova)
            return Ext.create('YZSoft.src.device.statusbar.Cordova');

        return Ext.create('YZSoft.src.device.statusbar.Simulator');
    }
});
