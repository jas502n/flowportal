
Ext.define('YZSoft.apps.bpmreport.personal.MyProcess', {
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
                text: RS.$('BPMReport_FrequentlyUsed_Process_my'),
                url: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/icons/love.png')
            }
        });

        me.chart = Ext.create('Ext.chart.Chart', {
            animate: true,
            height: 300,
            store: {
                fields: ['name', 'count'],
                data: [
                    { 'name': RS.$('All_Apps_Payment_Request'), 'count': 10 },
                    { 'name': RS.$('All_Apps_Expense_Title'), 'count': 7 },
                    { 'name': RS.$('All_Apps_Purchase_Request'), 'count': 5 },
                    { 'name': RS.$('All_Apps_Leaving_Title'), 'count': 2 },
                    { 'name': RS.$('All_Apps_BusinessTrip_Request'), 'count': 8 }
                ]
            },
            interactions: ['itemhighlight'],
            axes: [{
                type: 'numeric',
                position: 'left',
                fields: ['count'],
                grid: true,
                minimum: 0
            }, {
                type: 'category',
                position: 'bottom',
                fields: ['name']
            }],
            series: [{
                type: 'bar',
                xField: 'name',
                yField: 'count',
                style: {
                    fillOpacity: 0.8,
                    maxBarWidth: 30
                },
                highlightCfg: {
                    fillStyle: 'red',
                    fillOpacity: 1
                },
                renderer: function (sprite, config, rendererData, index) {
                    var colors = ['#6b76b8', '#54c4ef', '#76bf53', '#f6b260', '#ec684c'];
                    return {
                        fillStyle: colors[index % colors.length]
                    };
                },
                label: {
                    field: 'count',
                    orientation: 'horizontal',
                    display: 'insideEnd',
                    color: '#fff',
                    font: '16px Helvetica'
                }
            }]
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.cmpCaption, me.chart]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
