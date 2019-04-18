
Ext.define('YZSoft.form.field.mixins.Base', {

    getRow: function () {
        var me = this,
            blockEl = me.up('[row]');

        return blockEl && blockEl.row;
    },

    applyDatasource: function (value) {

        if (!value)
            return;

        if (value.tableName) {
            value.dsType = 'Table';
            value.id = value.tableName;
        }
        else if (value.procedureName) {
            value.dsType = 'Procedure';
            value.id = value.procedureName;
        }
        else if (value.esb) {
            value.dsType = 'ESB';
            value.id = value.esb;
        }

        return value;
    }
});