
Ext.define('YZSoft.apps.weeklyreport.team.Main', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.apps.weeklyreport.model.WeeklyReportTeam'
    ],
    config: {
        account: null,
        style: 'background-color:#f3f5f9;'
    },

    constructor: function (config) {
        var me = this,
            config = config || {};

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

        me.searchForm = Ext.create('Ext.form.Panel', {
            docked: 'top',
            cls: ['yz-form', 'yz-form-search'],
            margin: '0 0 10 0',
            scrollable: null,
            items: [{
                xtype: 'fieldset',
                padding: 0,
                margin: 0,
                items: [{
                    xclass: 'YZSoft.src.field.WeekPicker',
                    label: RS.$('All__Date'),
                    value: Ext.Date.getWeekFirstDate(new Date()),
                    name: 'date',
                    listeners: {
                        scope: me,
                        select: 'onSearch'
                    }
                }, {
                    xtype: 'selectfield',
                    label: RS.$('All__Range'),
                    readOnly: true,
                    value: 'xs',
                    options: [
                        { text: RS.$('All__MySubordinates'), value: 'xs' }
                    ]
                }]
            }]
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.apps.weeklyreport.model.WeeklyReportTeam',
            autoLoad: false,
            loadDelay: false,
            clearOnPageLoad: true,
            pageSize: -1,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/WeeklyReport.ashx'),
                extraParams: {
                    method: 'GetTeamReports',
                    account: config.account
                }
            }
        });

        me.list = Ext.create('Ext.dataview.List', {
            store: me.store,
            loadingText: '',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            cls: ['yz-list-dailyreport-team'],
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-dailyreport-team'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns">',
                '<div class="yz-column-left yz-layout-vbox yz-align-hcenter yz-column-headshort">',
                    '<div class="headsort" style="background-image:url({headsort})"></div>',
                    '<div class="uname">{ShortName}</div>',
                '</div>',
                '<div class="yz-column-center">',
                    '<div class="content">{[this.renderContent(values)]}</div>',
                '</div>',
            '</div>', {
                renderContent: function (value) {
                    var lines = [];

                    if (value.Done)
                        lines.push(Ext.util.Format.htmlEncode(value.Done));
                    if (value.Undone)
                        lines.push(Ext.util.Format.htmlEncode(value.Undone));
                    if (value.Coordinate)
                        lines.push(Ext.util.Format.htmlEncode(value.Coordinate));
                    if (value.Comments)
                        lines.push(Ext.util.Format.htmlEncode(value.Comments));

                    return lines.length ? lines.join('<br/>') : Ext.String.format('<span class="empty">{0}</span>', RS.$('All__None'));
                }
            }),
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            disableSelection: true,
            //emptyText: RS.$('TaskList_EmptyText'),
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    e.stopEvent();
                    me.onItemTap(target, record);
                }
            }
        });

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.searchForm, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            scope: me,
            painted: 'onSearch'
        });

        me.store.on({
            load: function () {
                var count = me.store.getCount(),
                    title = count ? Ext.String.format(RS.$('WeeklyReport_Team_Title_FMT'), count) : RS.$('WeeklyReport_Team_Title');

                me.titleBar.setTitle(title);
            }
        });
    },

    onSearch: function () {
        var me = this,
            store = me.store,
            params = store.getProxy().getExtraParams(),
            data = me.searchForm.getValues(false, false);

        Ext.apply(params, {
            date: data.date
        });

        me.store.load();
    },

    onItemTap: function (target, record) {
        var me = this,
            date = record.data.Date,
            uid = record.data.Account,
            pnl;

        if (!record.data.ItemID)
            return;

        pnl = Ext.create('YZSoft.apps.weeklyreport.panel.WeeklyReport', {
            title: Ext.String.format(RS.$('WeeklyReport_Personal_Title'), record.data.ShortName),
            account: uid,
            date: date,
            editable: false,
            back: function () {
                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
    }
});
