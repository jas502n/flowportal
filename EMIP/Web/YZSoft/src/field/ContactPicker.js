
Ext.define('YZSoft.src.field.ContactPicker', {
    extend: 'Ext.field.Text',
    requires: [
        'YZSoft.src.field.component.InputSelect',
        'YZSoft.src.device.Contacts'
    ],
    config: {
        cls: 'yz-field-contactpicker',
        clearIcon: false,
        component: {
            xtype: 'yzinputselect',
            type: 'text'
        }
    },

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.getComponent().on({
            scope: me,
            pickericontap: 'onPickerIconTap'
        });
    },

    onPickerIconTap: function () {
        var me = this;

        YZSoft.src.device.Contacts.pickContact({
            success: function (contract) {
                //alert(Ext.encode(contract));
                me.setValue(Ext.os.is.iOS ? contract.name.formatted:contract.displayName);
            }
        });
    }
});