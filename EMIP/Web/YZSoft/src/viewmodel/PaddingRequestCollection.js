
Ext.define('YZSoft.src.viewmodel.PaddingRequestCollection', {
    extend: 'Ext.util.MixedCollection',

    constructor: function (allowFunctions, keyFn) {
        var me = this;

        me.callParent(arguments);

        me.on({
            scope:me,
            add: 'onAdd'
        });
    },

    onAdd: function (index, request, key, eOpts) {
        var me = this,
            xhr = request.xhr;

        if (xhr) {
            Ext.each(['onload', 'onreadystatechange', 'onerror'], function (eventName) {
                var orgCallback = xhr[eventName];
                if (orgCallback) {
                    xhr[eventName] = function () {
                        orgCallback();
                        me.onStateChange(request,xhr);
                    }
                }
            });
        }
    },

    onStateChange: function (request, xhr) {
        var me = this;

        if (xhr.readyState == 4) {
            me.remove(request);

            if (me.getCount() == 0)
                me.fireEvent('done',me);
        }
    }
});