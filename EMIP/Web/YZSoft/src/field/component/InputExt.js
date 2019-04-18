
Ext.define('YZSoft.src.field.component.InputExt', {
    extend: 'Ext.field.Input',
    xtype: 'yzinputext',

    getTemplate: function () {
        var me = this,
            items;

        items = [{
            reference: 'input',
            spellcheck:false,
            tag: this.tag
        }, {
            reference: 'imageIcon',
            cls: 'yz-image-icon'
        }, {
            reference: 'mask',
            classList: [this.config.maskCls]
        }, {
            reference: 'clearIcon',
            cls: 'x-clear-icon'
        }];

        return items;
    }
});