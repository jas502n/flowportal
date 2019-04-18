
Ext.define('YZSoft.src.device.contacts.Abstract', {
    extend: 'YZSoft.src.device.Abstract',
    doPickContact: Ext.emptyFn,

    pickContact: function (args) {
        var me = this,
            onSuccess = args.success,
            onError = args.failure,
            scope = args.scope;

        if (scope) {
            onSuccess = Ext.Function.bind(onSuccess, scope);
            onError = Ext.Function.bind(onError, scope);
        }

        me.doPickContact(onSuccess, onError);
    }
});