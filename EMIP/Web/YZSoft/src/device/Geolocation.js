
Ext.define('YZSoft.src.device.Geolocation', {
    singleton:true,

    constructor: function () {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && browserEnv.Cordova)
            return Ext.create('YZSoft.src.device.geolocation.Cordova');

        return Ext.create('YZSoft.src.device.geolocation.AMap');
    }
});
