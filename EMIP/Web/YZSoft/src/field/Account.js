
Ext.define('YZSoft.src.field.Account', {
    extend: 'Ext.field.Text',
    xtype: 'yzfieldusername',
    config: {
        clearIcon:false,
        readOnly:true
    },

    applyValue: function (newValue) {
        var me = this;

        if (Ext.isObject(newValue))
            return newValue;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Org.ashx'),
            params: {
                method: 'GetCompanyContactInfo',
                uid: newValue
            },
            success: function (action) {
                var result = action.result,
                    user = result.user;

                me.setValue(user);
            }
        });

        return {
            Account: newValue,
            ShortName: newValue
        };
    },

    updateValue: function (newValue) {
        this.record = newValue;
        this.callParent([newValue.ShortName]);
    },

    getValue: function () {
        var me = this,
            record = me.record || {};

        return record.Account;
    }
});