
Ext.define('YZSoft.src.field.component.InputSelect', {
    extend: 'Ext.field.Input',
    xtype: 'yzinputselect',

    getTemplate: function () {
        var me = this,
            items;

        items = [{
            reference: 'input',
            spellcheck:false,
            tag: this.tag
        }, {
            reference: 'mask',
            classList: [this.config.maskCls]
        }, {
            reference: 'clearIcon',
            cls: 'x-clear-icon'
        }, {
            reference: 'pickerIcon',
            cls: 'yz-picker-icon'
        }];

        return items;
    },

    initElement: function () {
        var me = this;

        me.callParent();

        if (me.pickerIcon) {
            me.pickerIcon.on({
                tap: 'onPickerIconTap',
                scope: me
            });
        }
    },

    onPickerIconTap: function (e) {
        this.fireEvent('pickericontap', this, e);
    }
});