
Ext.define('YZSoft$Boot.src.Device', {
    singleton: true,

    requires: [
        'YZSoft$Boot.src.device.Cordova',
        'YZSoft$Boot.src.device.Simulator'
    ],

    constructor: function () {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && browserEnv.Cordova)
            return Ext.create('YZSoft$Boot.src.device.Cordova');

        return Ext.create('YZSoft$Boot.src.device.Simulator');
    }
});
