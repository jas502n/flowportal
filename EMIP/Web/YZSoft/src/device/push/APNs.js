
Ext.define('YZSoft.src.device.push.APNs', {
    extend: 'YZSoft.src.device.push.Abstract',
    isAPNs: true,

    construtor: function () {
        var me = this;
        me.callParent(arguments);
    },

    register: function () {
        var me = this;

        me.push = PushNotification.init({
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            }
        });

        me.push.on('notification', function (data) {
            me.push.finish(function () {
            });

            me.fireEvent('notification', {
                message: data.message,
                title: data.title,
                count: data.count,
                sound: data.sound,
                image: data.image,
                additionalData: data.additionalData
            });
        });

        me.push.on('error', function (e) {
            Ext.Msg.alert('APNs', e.message);
        });

        me.push.on('registration', function (data) {
            //alert(data.registrationId);
            me.registerPushNotificationClient('APNs', 'ios', data.registrationId, function () {
            });
        });
    },

    stopPush: function () {
        this.push.unregister(function () {
        }, function () {
        });
    },

    setApplicationIconBadgeNumber: function (badge) {
        var me = this;

        me.push.setApplicationIconBadgeNumber(function () {
        }, function (e) {
            Ext.Msg.alert('APNs', e.message);
        }, badge);
    }
});
