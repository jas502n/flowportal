
Ext.define('YZSoft.src.device.camera.Abstract', {
    extend: 'YZSoft.src.device.Abstract',
    doCapture: Ext.emptyFn,
    doCleanUp: Ext.emptyFn,

    capture: function (args) {
        var me = this,
            onSuccess = args.success,
            onError = args.failure,
            scope = args.scope,
            options = me.getDeviceOptions('captureOptions', args);

        if (scope) {
            onSuccess = Ext.Function.bind(onSuccess, scope);
            onError = Ext.Function.bind(onError, scope);
        }

        me.doCapture(onSuccess, onError, options);
    },

    cleanup: function (args) {
        var me = this,
            onSuccess = args.success,
            onError = args.failure,
            scope = args.scope;

        if (scope) {
            onSuccess = Ext.Function.bind(onSuccess, scope);
            onError = Ext.Function.bind(onError, scope);
        }

        me.doCleanUp(onSuccess, onError, options);
    }
});
