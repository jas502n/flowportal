
Ext.define('YZSoft.src.viewmodel.BindingCollection', {
    extend: 'Ext.util.MixedCollection',

    constructor: function (allowFunctions, keyFn) {
        var me = this;

        me.callParent(arguments);

        me.on({
            scope:me,
            add: 'onAdd'
        });
    },

    onAdd: function (index, o, key, eOpts) {
        var me = this;

        o.on({
            destroy: function () {
                me.remove(o);
            }
        });
    }
});