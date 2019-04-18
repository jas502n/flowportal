Ext.define('YZSoft.src.field.Select', {
    extend: 'Ext.field.Select',
    xtype: 'yzselectfield',
    config: {
        table: null,
        orderBy: null,
        usePicker: true,
        editable: false,
        defaultPhonePickerConfig: {
            hideOnMaskTap: true
        }
    },

    onFocus: function (e) {
        var me = this,
            component = me.getComponent(),
            editable = me.getEditable();

        if (!editable) {
            me.callParent(arguments);
        }
        else {
            component.showMask();
        }
    },

    updateEditable: function (newValue) {
        this[newValue ? 'addCls' : 'removeCls']('yz-field-select-editable');
    },

    updateTable: function (newTable) {
        var me = this,
            store = me.getStore();

        if (!store) {
            me.setStore(true);
            store = me._store;
        }

        if (!newTable) {
            store.clearData();
        }
        else {
            var data;
            YZSoft.Ajax.request({
                method: 'POST',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/MDM/MasterData.ashx'),
                async: false,
                params: {
                    method: 'GetMasterData',
                    tableName: newTable,
                    orderby: me.getOrderBy()
                },
                jsonData: {
                    fields: [me.getValueField(), me.getDisplayField()]
                },
                success: function (action) {
                    data = action.result;
                }
            });

            store.setData(data);
            me.onStoreDataChanged(store);
        }
        return me;
    }
});
