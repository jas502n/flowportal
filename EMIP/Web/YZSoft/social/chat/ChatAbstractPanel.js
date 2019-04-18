
Ext.define('YZSoft.social.chat.ChatAbstractPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.device.Keyboard'
    ],

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            painted: function () {
                me.painted = true;
                YZSoft.src.device.Keyboard.styleShrinkViewport();
                YZSoft.src.device.Keyboard.hideFormAccessoryBar();
            },
            hide: function () {
                if (me.painted) {
                    YZSoft.src.device.Keyboard.styleDefault();
                    YZSoft.src.device.Keyboard.showFormAccessoryBar();
                }
            }
        });
    }
});