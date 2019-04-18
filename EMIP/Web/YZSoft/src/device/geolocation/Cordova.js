
Ext.define('YZSoft.src.device.geolocation.Cordova', {
    extend: 'YZSoft.src.device.geolocation.Abstract',
    getCurrentPositionOptions: {
        enableHighAccuracy: {
            defaults: true
        },
        timeout: true,
        maximumAge: true
    },

    doGetCurrentPosition: function (onSuccess, onError, options) {
        navigator.geolocation.getCurrentPosition(function (result) {
            onSuccess({
                lat: result.coords.latitude,
                lon: result.coords.longitude
            });
        }, onError, options);
    }
});