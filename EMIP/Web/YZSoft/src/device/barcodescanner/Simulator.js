
Ext.define('YZSoft.src.device.barcodescanner.Simulator', {
    extend: 'YZSoft.src.device.barcodescanner.Abstract',

    doScan: function (onSuccess, onError, options) {
        Ext.defer(function () {
            onSuccess.call(this, {
                text: 'http://www.flowportal.com',
                format: 'QR_CODE',
                cancelled: false
            });
        }, 100);
    },

    doEncode: function (type, data, onSuccess, onError, options) {
        Ext.defer(function () {
            onSuccess.call(this);
        }, 100);
    }
});