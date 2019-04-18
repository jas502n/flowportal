
Ext.define('YZSoft.src.device.capture.Abstract', {
    extend: 'YZSoft.src.device.Abstract',
    doCaptureAudio: Ext.emptyFn,
    doCaptureVideo: Ext.emptyFn,
    doCaptureImage: Ext.emptyFn,

    captureAudio: function (args) {
        var me = this,
            onSuccess = args.success,
            onError = args.failure,
            scope = args.scope,
            options = me.getDeviceOptions('captureAudioOptions', args);

        if (scope) {
            onSuccess = Ext.Function.bind(onSuccess, scope);
            onError = Ext.Function.bind(onError, scope);
        }

        me.doCaptureAudio(onSuccess, onError, options);
    },

    captureVideo: function (args) {
        var me = this,
            onSuccess = args.success,
            onError = args.failure,
            scope = args.scope,
            options = me.getDeviceOptions('captureVideoOptions', args);

        if (scope) {
            onSuccess = Ext.Function.bind(onSuccess, scope);
            onError = Ext.Function.bind(onError, scope);
        }

        me.doCaptureVideo(onSuccess, onError, options);
    },

    captureImage: function (args) {
        var me = this,
            onSuccess = args.success,
            onError = args.failure,
            scope = args.scope,
            options = me.getDeviceOptions('captureImageOptions', args);

        if (scope) {
            onSuccess = Ext.Function.bind(onSuccess, scope);
            onError = Ext.Function.bind(onError, scope);
        }

        me.doCaptureImage(onSuccess, onError, options);
    }
});
