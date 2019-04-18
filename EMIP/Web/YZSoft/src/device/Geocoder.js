
Ext.define('YZSoft.src.device.Geocoder', {
    singleton: true,

    constructor: function (config) {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && browserEnv.Cordova)
            return Ext.create('YZSoft.src.device.geocoder.AMap', config);

        return Ext.create('YZSoft.src.device.geocoder.AMap', config);
    }
});
