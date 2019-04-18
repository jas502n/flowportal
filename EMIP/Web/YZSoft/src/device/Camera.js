
Ext.define('YZSoft.src.device.Camera', {
    singleton: true,

    constructor: function() {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && browserEnv.Cordova)
            return Ext.create('YZSoft.src.device.camera.Cordova');

        return Ext.create('YZSoft.src.device.camera.Simulator');
    }
});
