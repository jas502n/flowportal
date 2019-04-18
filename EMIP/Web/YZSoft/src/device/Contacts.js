
Ext.define('YZSoft.src.device.Contacts', {
    singleton: true,

    constructor: function() {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView && browserEnv.Cordova)
            return Ext.create('YZSoft.src.device.contacts.Cordova');

        return Ext.create('YZSoft.src.device.contacts.Simulator');
    }
});
