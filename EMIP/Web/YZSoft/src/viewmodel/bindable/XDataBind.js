
Ext.define('YZSoft.src.viewmodel.bindable.XDataBind', {
    extend: 'YZSoft.src.viewmodel.bindable.Abstract',

    constructor: function (row, column, formfield) {
        var me = this,
            cfg;

        cfg = {
            row: row,
            column: column,
            formfield: formfield,
            tokens: [{
                row: row,
                column: column
            }]
        };

        me.callParent([cfg]);

        formfield.bindings = formfield.bindings || {};
        formfield.bindings.value = me;

        row.bindings = row.bindings || {};
        row.bindings[column.ColumnName] = row.bindings[column.ColumnName] || [];
        row.bindings[column.ColumnName].push(me);

        row.set(column.ColumnName, me.getFieldSubmitValue(formfield), 'init');

        me.onFieldBind(formfield,column);

        formfield.onBind && formfield.onBind(me,column);

        formfield.on({
            change: function () {
                me.row.set(me.column.ColumnName, me.getFieldSubmitValue(formfield),'enter');
            },
            destroy: function () {
                me.destroy();
            }
        });
    },

    getFieldSubmitValue: function (field) {
        return field[field.getSubmitValue ? 'getSubmitValue' : 'getValue']();
    },

    onDataChanged: function (newValues) {
        var me = this,
            formfield = me.formfield;

        if (formfield.isDestroyed) //【补偿措施】grid的datasource用grid的sum值过滤时会发生这种情况
            return;

        formfield[formfield.setFormValue ? 'setFormValue':'setValue'](newValues[0], true);
    },

    onFieldBind: function (field, column) {
        if (column.Readable === false) {
            field.hide();
            return;
        }

        if (column.Writeable === false) {
            field.removeCls('yz-field-editable');
            field.setDisabled && field.setDisabled(true);
        }
        else {
            if (field.getDisabled && field.getDisabled())
                return;

            field.addCls('yz-field-editable');
            field.setDisabled && field.setDisabled(false);
        }
    },

    getAllFields: function () {
        var me = this,
            allbindings = me.row.bindings[me.column.ColumnName],
            fields = [];

        Ext.each(allbindings, function (binding) {
            fields.push(binding.formfield);
        });

        return fields;
    }
});