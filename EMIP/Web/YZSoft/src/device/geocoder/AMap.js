
Ext.define('YZSoft.src.device.geocoder.AMap', {
    extend: 'YZSoft.src.device.geocoder.Abstract',

    getAddressOptions: {
        city: true,
        radius: {
            defaults: 1000
        },
        batch: true,
        extensions: {
            defaults: 'all'
        },
        pos: {
            convert: 'encodePosition'
        }
    },
    getPOIsOptions: {
        pos: {
            convert: 'encodePosition'
        },
        offset: {
            defaults: 30
        },
        page: {
            defaults: 1
        },
        extensions: {
            defaults: 'all'
        },
        radius: {
            defaults: 1000
        }
    },

    doGetAddress: function (onSuccess, onError, options) {
        var me = this;

        AMap.plugin('AMap.Geocoder', function () {
            var geocoder = new AMap.Geocoder(options);

            geocoder.getAddress(options.pos, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    onSuccess(result);
                }
            });
        });
    },

    doGetPOIs: function (onSuccess, onError, options) {
        var me = this;

        YZSoft.Ajax.request({
            url: 'http://restapi.amap.com/v3/place/around',
            params: Ext.apply({
                key: me.keyWebServices,
                location: options.pos.join(',')
            }, options),
            success: function (action) {
                var result = action.result;
                if (result.status === '1' && result.info === 'OK') {
                    onSuccess(result);
                }
            }
        });
    }
});