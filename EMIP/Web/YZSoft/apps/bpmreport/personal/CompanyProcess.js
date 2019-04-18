
Ext.define('YZSoft.apps.bpmreport.personal.CompanyProcess', {
    extend: 'Ext.Container',
    requires: [
    ],
    config: {
        uid: null
    },

    constructor: function (config) {
        var me = this,
            config = config || {};

        me.cmpCaption = Ext.create('Ext.Component', {
            padding: '0 0 20 0',
            tpl: [
                '<div class="yz-layout-hbox yz-align-vcenter yz-cmp-report-caption">',
                    '<div class="yz-column-left icon" style="background-image:url({url})"></div>',
                    '<div class="yz-column-center title">{text}</div>',
                '</div>'
            ],
            data: {
                text:RS.$('BPMReport_FrequentlyUsed_Process'),
                url: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/icons/hot.png')
            }
        });

        me.chart = Ext.create('Ext.chart.PolarChart', {
            animate: true,
            interactions: ['rotate'],
            colors: ['#ec684c', '#76bf53', '#6b76b8', '#54c4ef', '#f6b260'],
            store: {
                fields: ['name', 'count'],
                data: [
                    { 'name': RS.$('All_Apps_BusinessTrip_Request'), 'count': 48 },
                    { 'name': RS.$('All_Apps_Purchase_Request'), 'count': 29 },
                    { 'name': RS.$('All_Apps_Payment_Request'), 'count': 26 },
                    { 'name': RS.$('All_Apps_Expense_Title'), 'count': 15 },
                    { 'name': RS.$('All_Apps_Contract_Request'), 'count': 8 }
                ]
            },
            legend: {
                position: 'right',
                width: 100,
                scrollable: false
            },
            series: [{
                type: 'pie',
                xField: 'count',
                donut: 0,
                style: {
                    doCallout: true,
                    labelOverflowPadding: 0
                },
                renderer: function (sprite, config, rendererData, index) {
                    return {
                        text: Ext.String.format('{0}%',rendererData.store.getAt(index).get('count'))
                    };
                },
                label: {
                    field: 'name',
                    color: '#000',
                    font: '16px Helvetica',
                    fillStyle:'#fff'
                }
            }]
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.cmpCaption, {
                xtype: 'container',
                height: 300,
                layout: 'fit',
                items: [me.chart]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
