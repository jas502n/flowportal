
Ext.define('YZSoft.src.field.component.SearchInput', {
    extend: 'Ext.field.Input',
    xtype: 'yzsearchinput',

    getTemplate: function () {
        var me = this,
            items;

        items = [{
            reference: 'input',
            spellcheck: false,
            tag: this.tag
        }, {
            reference: 'mask',
            classList: [this.config.maskCls]
        }, {
            reference: 'clearIcon',
            cls: 'x-clear-icon'
        }];

        return items;
    },

    constructor: function (config) {
        var me = this;
        me.callParent(arguments);
    }
});