
Ext.define('YZSoft.src.field.picker.IconPicker', {
    extend: 'YZSoft.src.container.SquaredContainer',
    config: {
        store: null,
        textProperty: 'Text',
        iconProperty: 'imageurl',
        minBoxCount: 5,
        minBoxWidth: 80,
        itemDefaults: {
            xtype: 'button',
            iconAlign: 'top',
            cls: 'yz-button-iconpicker'
        },
        value: null,
        cls: 'yz-container-iconpicker'
    },

    initialize: function () {
        var me = this,
            store = me.getStore(),
            textProperty = me.getTextProperty(),
            iconProperty = me.getIconProperty(),
            items = [];

        me.callParent(arguments);

        store.each(function (record) {
            items.push({
                text: record.get(textProperty),
                icon: record.get(iconProperty),
                scope: me,
                record: record,
                handler: 'onTap'
            });
        });


        me.setItems(items);
    },

    onTap: function (button) {
        var me = this;
        me.fireEvent('change', me, button.config.record);
    }
});