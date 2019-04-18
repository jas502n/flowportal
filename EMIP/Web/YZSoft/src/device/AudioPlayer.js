
Ext.define('YZSoft.src.device.AudioPlayer', {
    singleton: true,

    constructor: function () {
        var browserEnv = Ext.browser.is;

//        if (browserEnv.WebView && browserEnv.Cordova) {
//            if (Ext.os.is.iOS)
//                return Ext.create('YZSoft.src.device.audioplayer.Cordova');
//            else
//                return Ext.create('YZSoft.src.device.audioplayer.HTML5');
//        }

        return Ext.create('YZSoft.src.device.audioplayer.HTML5');
    }
});
