
Ext.define('YZSoft.form.field.mixins.TextBase', {
    mixins: [
        'YZSoft.form.field.mixins.Base',
        'YZSoft.form.field.mixins.Format',
        'YZSoft.form.field.mixins.Value2Display'
    ],

    setDisplayText: function (text) {
        this.suspendEvents();
        Ext.field.Text.prototype.updateValue.apply(this, arguments);
        this.resumeEvents(true);
    },

    updateBehavior: function (id2text) {
        var me = this;

        if (id2text) {
            me.setReadOnly(true);
            me.addCls('yz-field-text-id2display');
        }
    },

    onBind: function (bind, column) {
        var me = this;

        if (column.isNumber) {
            me.getComponent().input.dom.setAttribute('type', 'tel');
        }

        me.on({
            keyup: function () {
                me.fireEvent('change', me.getValue());
            }
        })
    }
});