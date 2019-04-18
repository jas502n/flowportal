
Ext.define('YZSoft.src.device.keyboard.iOS', {
    extend: 'YZSoft.src.device.keyboard.Abstract',

    styleDefault: function () {
        Keyboard.shrinkView(false);
        Keyboard.disableScrollingInShrinkView(false);
    },

    styleShrinkViewport: function () {
        Keyboard.shrinkView(true);
        Keyboard.disableScrollingInShrinkView(true);
    },

    hideFormAccessoryBar: function () {
        Keyboard.hideFormAccessoryBar(true);
    },

    showFormAccessoryBar: function () {
        Keyboard.hideFormAccessoryBar(false);
    }
});