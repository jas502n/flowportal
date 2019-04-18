
Ext.define('YZSoft.src.device.camera.Simulator', {
    extend: 'YZSoft.src.device.camera.Abstract',

    doCapture: function (onSuccess, onError, options) {
        Ext.defer(function () {
            onSuccess.call(this, 'http://www.sencha.com/img/sencha-large.png');
        }, 100);
    },

    doCleanUp: function (onSuccess, onError) {
    } 
});
