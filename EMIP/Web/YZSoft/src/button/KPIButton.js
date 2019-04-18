
Ext.define('YZSoft.src.button.KPIButton', {
    extend: 'YZSoft.src.button.Button',
    config: {
        kpi: null,
        kpiAlign:'top'
    },
    template: [{
        tag: 'span',
        reference: 'badgeElement',
        hidden: true
    },
    {
        tag: 'span',
        className: Ext.baseCSSPrefix + 'button-icon',
        reference: 'iconElement'
    }, {
        tag: 'span',
        className: 'yz-button-label-kpi',
        reference: 'kpiElement'
    },
    {
        tag: 'span',
        reference: 'textElement',
        hidden: true
    }],

    constructor: function (config) {
        this.callParent(arguments);
        this.addCls('yz-button-kpi');
    },

    updateKpi: function (text) {
        var kpiElement = this.kpiElement;

        if (kpiElement) {
            kpiElement.setHtml(text);
        }
    },

    updateKpiAlign: function(alignment, oldAlignment) {
        var element = this.element,
            baseCls = 'yz-kpialign-';

        element.removeCls(baseCls + oldAlignment);
        element.addCls(baseCls + alignment);
    }
});