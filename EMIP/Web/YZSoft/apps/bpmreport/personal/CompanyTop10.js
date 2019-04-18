
Ext.define('YZSoft.apps.bpmreport.personal.CompanyTop10', {
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
                    '<div class="yz-column-center title">{title}</div>',
                '</div>'
            ],
            data: {
                title: RS.$('BPMReport_Performance_Top10'),
                url: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/icons/star.png')
            }
        });

        me.chart = Ext.create('Ext.chart.Chart', {
            animate: true,
            height: 300,
            flipXY: true,
            store: {
                fields: ['name', 'count'],
                sorters: [{ property: 'count', direction: 'DESC'}],
                data: [
                    { 'name': '杨雪', 'count': 20 },
                    { 'name': 'Citty', 'count': 23 },
                    { 'name': '董子健', 'count': 25 },
                    { 'name': 'Davida', 'count': 30 },
                    { 'name': '常雨', 'count': 32 },
                    { 'name': '马龙', 'count': 40 },
                    { 'name': 'Citty2', 'count': 41 },
                    { 'name': '牛犇', 'count': 45 },
                    { 'name': 'Davida4', 'count': 50 },
                    { 'name': '崔大军', 'count': 60 }
                ]
            },
            axes: [{
                type: 'numeric',
                position: 'bottom',
                fields: ['count'],
                grid: true,
                minimum: 0,
                maximum: 100
            }, {
                type: 'category',
                position: 'left',
                fields: ['name']
            }],
            series: [{
                type: 'bar',
                xField: 'name',
                yField: 'count',
                style: {
                    fillOpacity: 0.8
                },
                renderer: function (sprite, config, rendererData, index) {
                    var colors = ['#e5677b', '#e96e7b', '#ec747b', '#f08578', '#f09293', '#f3a270', '#f3ac69', '#edbe63', '#eed252', '#ead949'];
                    return {
                        fillStyle: colors[9 - index % colors.length]
                    };
                },
                label: {
                    field: 'count',
                    orientation: 'horizontal',
                    display: 'insideStart',
                    color: '#000',
                    font: '12px Helvetica',
                    lineWidth: 2,
                    stroken: '#000',
                    renderer: function (text, sprite, config, rendererData, index) {
                        return text;
                    }
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
