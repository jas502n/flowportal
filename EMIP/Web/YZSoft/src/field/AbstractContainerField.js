
Ext.define('YZSoft.src.field.AbstractContainerField', {
    extend: 'Ext.Container',
    isField: true,
    config: {
        name: 'absContainer',
        readOnly: false,
        value: null
    },

    constructor: function (config) {
        this.callParent(arguments);
        this.addCls('x-field');
    },

    updateReadOnly: function (newValue) {
        this[newValue ? 'addCls' : 'removeCls']('yz-field-readonly');
    }
});
