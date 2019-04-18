
Ext.define('YZSoft.src.device.statusbar.Cordova', {
    extend: 'YZSoft.src.device.statusbar.Abstract',

    constructor: function () {
        var me = this;

        if (Ext.isReady) {
            me.onReady();
        } else {
            Ext.onReady(me.onReady, me, { single: true });
        }

        me.callParent(arguments);
    },

    onReady: function () {
        var me = this;

        me.isVisible = StatusBar.isVisible;
    },

    overlaysWebView: function (overlay) {
        StatusBar.overlaysWebView(overlay);
    },

    styleDefault: function () {
        this.style = 'styleDefault';
        StatusBar.styleDefault();
    },

    styleLightContent: function () {
        this.style = 'styleLightContent';
        StatusBar.styleLightContent();
    },

    styleBlackTranslucent: function () {
        this.style = 'styleBlackTranslucent';
        StatusBar.styleBlackTranslucent();
    },

    styleBlackOpaque: function () {
        this.style = 'styleBlackOpaque';
        StatusBar.styleBlackOpaque();
    },

    backgroundColorByName: function (colorName) {
        StatusBar.backgroundColorByName(colorName);
    },

    backgroundColorByHexString: function (colorHex) {
        StatusBar.backgroundColorByHexString(colorHex);
    },

    hide: function () {
        StatusBar.hide();
    },

    show: function () {
        StatusBar.show();
    }
});
