
Ext.define('YZSoft$Boot.login.ServerSelect', {
    extend: 'YZSoft$Boot.src.ExpandSelect',
    config: {
        valueField: 'url',
        displayField: 'url',
        editable: true,
        component: {
            type: 'url'
        },
        pickerConfig: {
        }
    },

    getPicker: function () {
        var me = this,
            config = me.getPickerConfig();

        if (!me.picker) {
            me.picker = Ext.create('YZSoft$Boot.login.ServerPicker', Ext.apply({
                store: me.getStore(),
                listeners: {
                    scope: me,
                    change: me.onPickerChange,
                    hide: 'onPickerHide',
                    show: 'onPickerShow'
                }
            }, config));
        }

        return me.picker;
    },

    getValue: function () {
        return this.getComponent().getValue();
    }
});