
Ext.define('YZSoft.src.device.push.Abstract', {
    extend: 'YZSoft.src.device.Abstract',
    register: Ext.emptyFn,
    stopPush: Ext.emptyFn,
    setApplicationIconBadgeNumber: Ext.emptyFn,

    registerPushNotificationClient: function (serviceName, os, registerId, fn, scope) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/PushNotification.ashx'),
            params: {
                method: 'Register',
                serviceName: serviceName,
                os: os,
                registerId: registerId
            },
            success: function (action) {
                me.registerId = registerId;

                if (fn)
                    fn.call(scope);
            },
            failure: function (action) {
            }
        });
    },

    unregister: function (args) {
        var me = this;

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/PushNotification.ashx'),
            params: {
                Method: 'UnRegister',
                registerId: me.registerId
            }
        }, args));
    }
});
