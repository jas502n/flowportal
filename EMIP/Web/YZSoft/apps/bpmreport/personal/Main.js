
Ext.define('YZSoft.apps.bpmreport.personal.Main', {
    extend: 'Ext.Container',
    requires: [
    ],
    config: {
        uid: null,
        style:'background-color:#f3f5f9',
        scrollable: {
            direction: 'vertical',
            indicators: false
        }
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            uid = config.uid;

        me.btnBack = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack]
        });

        me.pnlMyPerf = Ext.create('YZSoft.apps.bpmreport.personal.MyPerf', {
            uid: uid,
            margin: 0
        });

        me.pnlMyProcess = Ext.create('YZSoft.apps.bpmreport.personal.MyProcess', {
            uid: uid
        });

        me.pnlCompanyTop10 = Ext.create('YZSoft.apps.bpmreport.personal.CompanyTop10', {
            uid: uid
        });

        me.pnlCompanyProcess = Ext.create('YZSoft.apps.bpmreport.personal.CompanyProcess', {
            uid: uid
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                padding: 32,
                style:'background-color:#fff',
                margin: '10 0 0 0'
            },
            items: [me.titleBar, me.pnlMyPerf, me.pnlMyProcess, me.pnlCompanyTop10, me.pnlCompanyProcess]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
