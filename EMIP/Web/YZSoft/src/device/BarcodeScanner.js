
Ext.define('YZSoft.src.device.BarcodeScanner', {
    singleton: true,

    constructor: function () {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && browserEnv.Cordova)
            return Ext.create('YZSoft.src.device.barcodescanner.Cordova');

        return Ext.create('YZSoft.src.device.barcodescanner.Simulator');
    }
});