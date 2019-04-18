
Ext.define('YZSoft.form.field.mixins.ListBase', {
    mixins: [
        'YZSoft.form.field.mixins.Base'
    ],

    //处理displayfield值为空的情况
    regularRows: function (rows) {
        var me = this,
            valueField = me.getValueField(),
            displayField = me.getDisplayField(),
            rv = [];

        Ext.each(rows, function (row) {
            row = Ext.clone(row);
            if (Ext.isEmpty(row[displayField]))
                row[displayField] = row[valueField];

            rv.push(row);
        });
        return rv;
    }
});