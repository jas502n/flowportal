
Ext.define('YZSoft.src.device.Map', {

    constructor: function (config) {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && browserEnv.Cordova)
            return Ext.create('YZSoft.src.device.map.AMap', config);

        return Ext.create('YZSoft.src.device.map.AMap', config);
    }
});
