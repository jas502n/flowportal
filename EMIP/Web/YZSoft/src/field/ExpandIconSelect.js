
Ext.define('YZSoft.src.field.ExpandIconSelect', {
    extend: 'YZSoft.src.field.ExpandSelect',
    xtype: 'yzexpandiconselect',
    config: {
        valueField: 'Code',
        displayField: 'Text',
        cls: ['yz-field-expense', 'yz-field-valuealign-right'],
        pickerConfig: {
            textProperty: 'Text',
            iconProperty: 'imageurl',
            minBoxCount: 5,
            minBoxWidth: 80
        }
    },

    getPicker: function () {
        var me = this,
            config = me.getPickerConfig();

        if (!me.picker) {
            me.picker = Ext.create('YZSoft.src.field.picker.IconPicker', Ext.apply({
                store: me.getStore()
            }, config));
        }

        return me.picker;
    },

    updateValue: function (newValue, oldValue) {
        var me = this,
            cmp = me.getComponent();

        cmp.imageIcon.dom.style.backgroundImage = Ext.String.format('url({0})', newValue.data.imageurl);
        me.callParent([newValue]);
    }
});