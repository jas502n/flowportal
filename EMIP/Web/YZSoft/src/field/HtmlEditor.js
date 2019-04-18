
Ext.define('YZSoft.src.field.HtmlEditor', {
    extend: 'Ext.field.Field',
    xtype: 'yzhtml',
    config: {
        cls: 'yz-field-html',
        labelAlign: 'top',
        tap: true
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

    applyComponent: function (config) {
        return Ext.create('Ext.Container', Ext.apply({
            cls: 'yz-field-htmleditor-body',
            minHeight:50
        }, config));
    },

    applyValue: function (value) {
        return value || '';
    },

    updateValue: function (value) {
        var me = this,
            comp = me.getComponent();

        comp.setHtml(value);
    },

    onTap: function () {
        var me = this,
            pnl;

        if (me.getTap() === false)
            return;
        
        pnl = Ext.create('YZSoft.src.field.HtmlEditor.Panel', {
            value: me.getValue(),
            back: function () {
                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
    }
});