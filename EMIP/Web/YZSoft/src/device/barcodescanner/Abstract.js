
Ext.define('YZSoft.src.device.barcodescanner.Abstract', {
    extend: 'YZSoft.src.device.Abstract',

    scan: function (args) {
        var me = this,
            onSuccess = args.success,
            onError = args.failure,
            scope = args.scope,
            options = me.getDeviceOptions('scanOptions',args);

        if (scope) {
            onSuccess = Ext.Function.bind(onSuccess, scope);
            onError = Ext.Function.bind(onError, scope);
        }

        me.doScan(onSuccess, onError, options);
    },

    encode: function (args) {
        var me = this,
            onSuccess = args.success,
            onError = args.failure,
            scope = args.scope,
            options = me.getDeviceOptions('encodeOptions',args);

        if (scope) {
            onSuccess = Ext.Function.bind(onSuccess, scope);
            onError = Ext.Function.bind(onError, scope);
        }

        me.doEncode(onSuccess, onError, options);
    }
});