
Ext.define('YZSoft.src.device.geolocation.AMap', {
    extend: 'YZSoft.src.device.geolocation.Abstract',
    requires: ['YZSoft.src.device.GPS'],
    getCurrentPositionOptions: {
        timeout: {
            defaults: 10000
        },
        maximumAge: {
            defaults: 0
        }
    },

    doGetCurrentPosition: function (onSuccess, onError, options) {
        var me = this;

        Ext.apply(options, {
            enableHighAccuracy: false,
            extensions: 'base',
            convert: true
        });

        AMap.plugin('AMap.Geolocation', function () {
            var geolocation = new AMap.Geolocation(options);

            geolocation.getCurrentPosition(function (status, result) {
                if (status === 'complete' && result.info === 'SUCCESS') {
                    onSuccess(me.encodePos(result));
                }
                else {
                    onError(result.message);
                }
            });
        });
    },

    encodePos: function (result) {
        var gps = YZSoft.src.device.GPS.gcj_decrypt(result.position.lat, result.position.lng);

        return {
            lat: gps.lat,
            lon: gps.lon
        };
    }
});