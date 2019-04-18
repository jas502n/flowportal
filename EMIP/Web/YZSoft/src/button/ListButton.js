
Ext.define('YZSoft.src.button.ListButton', {
    extend: 'YZSoft.src.button.Button',
    config: {
        cls: ['yz-button-flat', 'yz-button-list'],
        iconGoCls: null,
        iconGo: false,
        iconGoColor: null,
        desc: null,
        bborder: false
    },

    template: [{
        tag: 'span',
        reference: 'badgeElement',
        hidden: true
    }, {
        tag: 'span',
        className: Ext.baseCSSPrefix + 'button-icon',
        reference: 'iconElement'
    }, {
        tag: 'span',
        reference: 'textElement',
        hidden: true
    }, {
        tag: 'span',
        className: 'yz-button-label-desc',
        reference: 'descElement',
        hidden: true
    }, {
        tag: 'span',
        className: 'yz-button-icon-go',
        reference: 'iconGoElement'
    }],

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {};
        Ext.apply(cfg, config);

        me.callParent([cfg]);
    },

    updateIconGo: function (icon) {
        var me = this,
            element = me.iconGoElement;

        if (icon) {
            me.showElementExt(element);
            element.setStyle('background-image', 'url(' + icon + ')');
        } else {
            element.setStyle('background-image', '');
            me.hideElementExt(element);
        }
    },

    updateIconGoCls: function (iconCls, oldIconCls) {
        var me = this,
            element = me.iconGoElement;

        if (iconCls) {
            me.showElementExt(element);
            element.replaceCls(oldIconCls, iconCls);
        } else {
            element.removeCls(oldIconCls);
            me.hideElementExt(element);
        }
    },

    updateIconGoColor: function (color) {
        var me = this,
            element = me.iconGoElement;

        if (color)
            element.setStyle('color', color);
    },

    updateDesc: function (text) {
        var descElement = this.descElement;

        if (descElement) {
            if (text) {
                descElement.show();
                descElement.setHtml(text);
            } else {
                descElement.hide();
            }
        }
    },

    updateBborder: function (bborder) {
        var me = this;
        me[bborder ? 'addCls' : 'removeCls']('yz-button-list-bborder');
    },

    showElementExt: function (element) {
        element.removeCls(Ext.baseCSSPrefix + 'hidden');
        element.addCls(Ext.baseCSSPrefix + 'shown');
    },

    hideElementExt: function (element) {
        element.removeCls(Ext.baseCSSPrefix + 'shown');
        element.addCls(Ext.baseCSSPrefix + 'hidde');
    }
});