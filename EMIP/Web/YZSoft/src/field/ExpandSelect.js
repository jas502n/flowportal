
Ext.define('YZSoft.src.field.ExpandSelect', {
    extend: 'YZSoft.src.field.Select',
    xtype: 'yzexpandselect',
    requires: [
        'YZSoft.src.field.component.InputExt'
    ],
    config: {
        expended: false,
        pickerConfig: null,
        imageIcon: true,
        expandedCls: 'yz-field-expanded',
        component: {
            xtype: 'yzinputext',
            type: 'text'
        }
    },

    getElementConfig: function () {
        var prefix = Ext.baseCSSPrefix;

        return {
            reference: 'element',
            className: 'x-container yz-field-expand',
            children: [{
                reference: 'fieldbody',
                cls: 'yz-form-field-body',
                children: [{
                    reference: 'label',
                    cls: prefix + 'form-label',
                    children: [{
                        reference: 'labelspan',
                        tag: 'span'
                    }]
                }, {
                    reference: 'innerElement',
                    cls: prefix + 'component-outer'
                }]
            }, {
                reference: 'pickerouter',
                cls: 'yz-form-field-picker-outer'
            }]
        };
    },

    updateImageIcon: function (newValue) {
        var me = this,
            cls = 'yz-field-hasimage';

        if (newValue)
            me.addCls(cls);
        else
            me.removeCls(cls);
    },

    updateExpended: function (newValue) {
        var me = this;

        if (newValue)
            me.showPicker();
        else
            me.hidePicker();
    },

    onMaskTap: function () {
        var me = this,
            picker = me.picker;

        if (!picker) {
            me.setExpended(true);
        }
        else {
            if (picker.isHidden())
                me.setExpended(true);
            else
                me.setExpended(false);
        }
    },

    getPickerConfig: function () {
        var me = this,
            rv = me._pickerConfig || {};

        rv.listeners = rv.listeners || {};

        Ext.apply(rv.listeners, {
            scope: me,
            change: 'onPickerChange',
            hide: 'onPickerHide',
            show: 'onPickerShow'
        });

        return rv;
    },

    getPicker: function () {
        var me = this,
            config = me.getPickerConfig();

        if (!me.picker) {
            me.picker = Ext.create('Ext.picker.Picker', Ext.apply({
                floatingCls: '',
                slots: [{
                    align: me.getPickerSlotAlign(),
                    name: me.getName(),
                    valueField: me.getValueField(),
                    displayField: me.getDisplayField(),
                    value: me.getValue(),
                    store: me.getStore()
                }]
            }, config));
        }

        return me.picker;
    },

    showPicker: function () {
        var me = this,
            store = me.getStore(),
            value = me.getValue();

        if (!store || store.getCount() === 0)
            return;

        if (me.getReadOnly())
            return;

        var picker = me.getPicker(),
            name = me.getName(),
            pickerValue = {};

        pickerValue[name] = value;
        picker.setValue(pickerValue);

        if (picker.yzrendered) {
            picker.show();
        }
        else {
            picker.yzrendered = true;
            picker.renderTo(me.pickerouter);
            me.onPickerShow();
        }
    },

    hidePicker: function () {
        var me = this,
            picker = me.picker;

        if (picker)
            picker.hide();
    },

    onPickerChange: function (picker, record) {
        var me = this,
            oldValue = me.getValue(),
            newValue = record.get(me.getValueField());

        me.setValue(record);
        me.setExpended(false);
        if (oldValue != newValue)
            me.fireEvent('select', newValue, record, picker);
    },

    onPickerShow: function () {
        this.addCls(this.getExpandedCls());
    },

    onPickerHide: function () {
        this.removeCls(this.getExpandedCls());
    },

    updateValue: function (newValue, oldValue) {
        this.record = newValue;
        if (this.getDisplayField() !== false)
            this.callParent(arguments);
    }
});