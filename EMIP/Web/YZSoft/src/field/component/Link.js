
Ext.define('YZSoft.src.field.component.Link', {
    extend: 'Ext.Component',
    cachedConfig: {
        cls: 'd-flex x-field-input yz-field-comp-link'
    },
    config: {
        value: null,
        emptyCls:'yz-field-comp-link-empty',
        emptyText: null,
        openText: null
    },

    getTemplate: function () {
        var me = this,
            items;

        items = [{
            reference: 'input',
            cls:'flex-fill fieldinput'
        }, {
            reference: 'opentext',
            cls: 'opentext'
        }, {
            reference: 'openlink',
            cls: 'openlink'
        }];

        return items;
    },

    initElement: function () {
        var me = this;

        me.callParent();

        me.openlink.on({
            tap: 'onOpenClick',
            scope: me
        });
    },

    updateOpenText: function (value) {
        var me = this;

        me.opentext.setHtml(value);
    },

    setValue: function (value) {
        var me = this,
            emptyText = me.getEmptyText(),
            emptyCls = me.getEmptyCls();

        if (Ext.isEmpty(value)) {
            me.input.setHtml(emptyText);
            me.addCls(emptyCls);
        }
        else {
            me.input.setHtml(value);
            me.removeCls(emptyCls);
        }
    },

    setText: function (value) {
        this.input.setHtml(value);
    },

    onOpenClick: function (e) {
        this.fireEvent('openclick', this, e);
    }
});