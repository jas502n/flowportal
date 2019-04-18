
Ext.define('YZSoft.src.device.geocoder.Abstract', {
    extend: 'YZSoft.src.device.AMapAbstract',
    doGetAddress: Ext.emptyFn,
    doGetPOIs: Ext.emptyFn,

    getAddress: function (args) {
        var me = this,
            onSuccess = args.success,
            onError = args.failure,
            scope = args.scope,
            options = me.getDeviceOptions('getAddressOptions', args);

        if (scope) {
            onSuccess = Ext.Function.bind(onSuccess, scope);
            onError = Ext.Function.bind(onError, scope);
        }

        me.doGetAddress(onSuccess, onError, options);
    },

    getPOIs: function (args) {
        var me = this,
            onSuccess = args.success,
            onError = args.failure,
            scope = args.scope,
            options = me.getDeviceOptions('getPOIsOptions', args);

        if (scope) {
            onSuccess = Ext.Function.bind(onSuccess, scope);
            onError = Ext.Function.bind(onError, scope);
        }

        me.doGetPOIs(onSuccess, onError, options);
    }
});