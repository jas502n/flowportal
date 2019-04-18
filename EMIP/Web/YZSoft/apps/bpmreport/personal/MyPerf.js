
Ext.define('YZSoft.apps.bpmreport.personal.MyPerf', {
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
                title: RS.$('BPMReport_Performance_My'),
                url: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/icons/rocket.png')
            }
        });

        me.cmpPer = Ext.create('Ext.Component', {
            flex: 1,
            cls: 'yz-container-border-right-dark',
            tpl: [
                '<div style="height:70px" class="yz-layout-vbox yz-box-pack-center yz-box-align-center">',
                    Ext.String.format('<div style="font-size:13px;color:#000;padding-bottom:6px;">{0}</div>',RS.$('BPMReport_Performance_Per')),
                    '<div style="width:80%;height:10px;background-color:#fff;border-radius: 5px;border:solid 1px #76bf53;position:relative">',
                        '<div style="position:absolute;top:0px;bottom:0px;left:0px;box-sizing: content-box;height:8px;background-color:#76bf53;border-radius: 5px;width:{per}%"></div>',
                    '</div>',
                '</div>'
            ],
            data: {
                per: '80'
            }
        });

        me.cmpAvg = Ext.create('Ext.Component', {
            flex: 1,
            tpl: [
                '<div class="yz-layout-vbox yz-box-align-center">',
                    '<div style="font-size:13px;color:#000;line-height:20px;">{title}</div>',
                    '<div style="line-height:20px;">{avg}</div>',
                '</div>'
            ],
            data: {
                title:RS.$('BPMReport_ProcessTime_Avg'),
                avg: RS.$('BPMReport_ProcessTime_Minutes')
            }
        });

        me.chart = Ext.create('Ext.chart.CartesianChart',{
            animate: true,
            height: 300,
            store: {
                fields: ['name', 'time'],
                data: [
                    { 'name': RS.$('All__MonthName1'), 'time': 10 },
                    { 'name': RS.$('All__MonthName2'), 'time': 7 },
                    { 'name': RS.$('All__MonthName3'), 'time': 5 },
                    { 'name': RS.$('All__MonthName4'), 'time': 2 },
                    { 'name': RS.$('All__MonthName5'), 'time': 8 },
                    { 'name': RS.$('All__MonthName6'), 'time': 7 },
                    { 'name': RS.$('All__MonthName7'), 'time': 6 },
                    { 'name': RS.$('All__MonthName8'), 'time': 8 },
                    { 'name': RS.$('All__MonthName9'), 'time': 9 },
                    { 'name': RS.$('All__MonthName10'), 'time': 11 },
                    { 'name': RS.$('All__MonthName11'), 'time': 10 },
                    { 'name': RS.$('All__MonthName12'), 'time': 8 }
                ]
            },
            axes: [{
                type: 'numeric',
                position: 'left',
                fields: ['time'],
                grid: true,
                minimum: 0
            }, {
                type: 'category',
                position: 'bottom',
                fields: ['name']
            }],
            series: [{
                type: 'line',
                xField: 'name',
                yField: 'time',
                style: {
                    stroke: '#f7ba5f',
                    lineWidth:3
                },
                marker: {
                    type: 'circle',
                    radius: 6,
                    lineWidth: 3,
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
                type: 'container',
                cls: ['yz-container-border-top-dark', 'yz-container-border-bottom-dark'],
                margin:'0 0 20 20',
                layout: {
                    type:'hbox',
                    align:'center'
                },
                items: [me.cmpPer, me.cmpAvg]
            }, me.chart]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
