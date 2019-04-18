
Ext.define('YZSoft.src.device.Keyboard', {
    singleton: true,

    constructor: function () {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && browserEnv.Cordova) {
            if (Ext.os.is.iOS)
                return Ext.create('YZSoft.src.device.keyboard.iOS');
        }

        return Ext.create('YZSoft.src.device.keyboard.Simulator');
    }
});
