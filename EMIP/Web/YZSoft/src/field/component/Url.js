
Ext.define('YZSoft.src.field.component.Url', {
    extend: 'Ext.field.Input',
    xtype: 'yzurl',
    config: {
        baseCls: 'd-flex x-field-input yz-field-comp-url',
        emptyCls: 'yz-field-comp-url-empty'
    },

    getTemplate: function () {
        var me = this,
            items;

        items = [{
            reference: 'input',
            spellcheck: false,
            tag: me.tag,
            cls:'flex-fill fieldinput'
        }, {
            reference: 'mask',
            classList: [me.config.maskCls]
        }, {
            reference: 'openlink',
            cls: 'openlink'
        }];

        return items;
    },

    initElement: function () {
        var me = this;

        me.callParent();

        me.openlink.on({
            scope: me,
            tap: 'onOpenClick'
        });
    },

    onOpenClick: function (e) {
        var me = this,
            value = me.input.getValue();

        if (value)
            me.fireEvent('openclick', this, e);
    }
});