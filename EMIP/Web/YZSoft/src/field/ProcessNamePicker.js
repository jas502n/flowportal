
Ext.define('YZSoft.src.field.ProcessNamePicker', {
    extend: 'YZSoft.src.field.Select',
    requires: [
        'YZSoft.src.model.ValueText'
    ],
    config: {
        valueField: 'value',
        displayField: 'text'
    },

    constructor: function (config) {
        this.callParent(arguments);
        this.setValue(null);
    },

    onFocus: function () {
        var me = this,
            pnl;

        var pnl = Ext.create('YZSoft.src.sheet.SelProcessName', {
            back: function () {
                pnl.hide();
            },
            fn: function (button) {
                var rec = new YZSoft.src.model.ValueText({
                    value: button.config.value,
                    text: button.config.text
                });
                me.setValue(rec);
                pnl.hide();
            },
            listeners: {
                order: 'after',
                hide: function () {
                    this.destroy();
                }
            }
        });

        Ext.Viewport.add(pnl);
        pnl.show();
    },

    setValue: function (value) {
        if (!value) {
            value = new YZSoft.src.model.ValueText({
                value: null,
                text: RS.$('All__All')
            });
        }

        this.callParent(arguments);
    }
});
