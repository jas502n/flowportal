
Ext.define('YZSoft.form.field.ChildFormLink', {
    extend: 'Ext.field.Field',
    requires: [
        'YZSoft.src.field.component.Link',
        'YZSoft.src.viewmodel.bindable.Filter'
    ],
    mixins: [
        'YZSoft.form.field.mixins.Base'
    ],
    config: {
        label:RS.$('All_Uniform_ChildForm'),
        labelWidth: 100,
        cls: 'yz-field-childformlink',
        app: null,
        text: RS.$('All_Uniform_ChildForm'),
        datamap: null,
        paramsFill: null,
        readOnly: false,
        component: {
            xclass: 'YZSoft.src.field.component.Link',
            openText: RS.$('All__Open')
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

    performBind: function (viewmodel, row) {
        this.row = row;
    },

    updateReadOnly: function (newValue) {
        this[newValue ? 'addCls' : 'removeCls']('yz-field-readonly');
    },

    updateText: function (value) {
        this.getComponent().setText(value);
    },

    setValue: function (value) {
        var me = this;
        me.callParent(arguments);
    },

    onTap: function () {
        var me = this,
            key = me.getValue(),
            paramsFill = me.getParamsFill(),
            row = me.row,
            filter,
            writeable = me.bindings && me.bindings.value ?  me.bindings.value.column.Writeable:false,
            pnl;

        filter = YZSoft.src.viewmodel.bindable.Filter.getFilter(row, paramsFill, true);

        pnl = Ext.create('YZSoft.form.FormApplication', {
            app: me.getApp(),
            key: key,
            state: writeable ? 'edit':'read',
            title: me.getText(),
            params: filter,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function (result) {
                var datamap = me.getDatamap();

                me.setValue(result.Key);

                //绑定之前不做map
                if (row && datamap)
                    row.doMap(result, datamap);

                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
    }
});