
Ext.define('YZSoft.src.field.Barcode', {
    extend: 'Ext.field.Field',
    xtype: 'yzbarcode',
    config: {
        cls: 'yz-field-barcode',
        barcodeFormat: 'QR_CODE',
        pureBarcode: true,
        barcodeWidth: 60,
        barcodeHeight: 60,
        readOnly: false
    },

    initialize: function () {
        var me = this,
            component = me.getComponent();

        me.callParent();

        component.element.on({
            scope: me,
            tap: 'onTap'
        });

        me.label.on({
            scope: me,
            tap: 'onTap'
        });
    },

    updateReadOnly: function (newValue) {
        this[newValue ? 'addCls' : 'removeCls']('yz-field-readonly');
    },

    updateValue: function (value) {
        var me = this,
            comp = me.getComponent(),
            bodyWidth = me.bodyElement.getWidth() || 300,
            imgEl,url;

        imgEl = comp.element.down('.yz-barcode-image', false);
        if (!imgEl)
            imgEl = Ext.DomHelper.append(comp.element.dom, '<img class="yz-barcode-image" />', true);

        if (value) {
            url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/util/Barcode.ashx'), Ext.Object.toQueryString({
                method: 'Encode',
                format: me.getBarcodeFormat(),
                pureBarcode: me.getPureBarcode(),
                text: value,
                width: Math.min(me.getBarcodeWidth(), bodyWidth),
                height: me.getBarcodeHeight()
            }));
        }
        else {
            url = '';
        }

        imgEl.dom.src = url;
    }
});