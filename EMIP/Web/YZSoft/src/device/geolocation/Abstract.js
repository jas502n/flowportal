
Ext.define('YZSoft.src.device.geolocation.Abstract', {
    extend: 'YZSoft.src.device.AMapAbstract',
    doGetCurrentPosition: Ext.emptyFn,

    getCurrentPosition: function (args) {
        var me = this,
            onSuccess = args.success,
            onError = args.failure,
            scope = args.scope,
            options = me.getDeviceOptions('getCurrentPositionOptions', args);

        if (scope) {
            onSuccess = Ext.Function.bind(onSuccess, scope);
            onError = Ext.Function.bind(onError, scope);
        }

        me.doGetCurrentPosition(onSuccess, onError, options);
    }
});