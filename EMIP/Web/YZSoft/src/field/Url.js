
Ext.define('YZSoft.src.field.Url', {
    extend: 'Ext.field.Field',
    requires: [
        'YZSoft.src.field.component.Link'
    ],
    config: {
        cls: 'yz-field-url',
        text:null,
        component: {
            xclass: 'YZSoft.src.field.component.Link'
        }
    },

    initialize: function () {
        var me = this,
            component = me.getComponent();

        me.callParent();

        component.element.on({
            scope: me,
            tap: 'onTap'
        });

        me.label.on({
            scope: me,
            tap: 'onTap'
        });
    },

    updateText: function (value) {
        this.getComponent().setEmptyText(value);
    },

    setValue: function (value) {
        var me = this,
            text = me.getText();

        me.getComponent().setValue(value);

        if (text && !Ext.isEmpty(value)) {
            me.getComponent().setText(text);
        }

        me.callParent(arguments);
    },

    onTap: function () {
        var me = this,
            url = me.getValue();

        if (!url)
            return;

        pnl = Ext.create('YZSoft.src.panel.Url', {
            url: url,
            back: function () {
                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
    }
});