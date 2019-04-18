
Ext.define('YZSoft.apps.footmark.team.Main', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.NotesFootmarkByUser'
    ],
    config: {
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

        me.btnMySign = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            text: RS.$('Footmark_ShowMy'),
            align: 'right',
            scope: me,
            handler: 'onMySign'
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnMySign]
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
                    xclass: 'YZSoft.src.field.DatePicker',
                    label: RS.$('All__Date'),
                    value: Ext.Date.clearTime(new Date()),
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
            model: 'YZSoft.src.model.NotesFootmarkByUser',
            autoLoad: false,
            loadDelay: false,
            clearOnPageLoad: true,
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/Footmark.ashx'),
                extraParams: {
                    method: 'GetTeamList'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children',
                    totalProperty: 'total'
                }
            }
        });

        me.pnlSigned = Ext.create('YZSoft.apps.footmark.team.SignedPanel', {
            title: me.getTabTitle('-', RS.$('Footmark_Status_Sign')),
            store: me.store
        });

        me.pnlUnSigned = Ext.create('YZSoft.apps.footmark.team.UnSignPanel', {
            title: me.getTabTitle('-', RS.$('Footmark_Status_NoSign'))
        });

        me.tab = Ext.create('Ext.tab.Panel', {
            tabBar: {
                ui: 'plain',
                cls: ['yz-tab-text']
            },
            tabBarPosition: 'top',
            layout: {
                animation: false
            },
            activeItem: 0,
            items: [me.pnlSigned, me.pnlUnSigned]
        });

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.searchForm, me.tab]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.pnlSigned.on({
            scope: me,
            itemtap: 'onRecordTap'
        });

        me.pnlUnSigned.on({
            scope: me,
            usertap: 'onUserTap'
        });

        me.on({
            single: true,
            scope: me,
            painted: 'onSearch'
        });

        me.store.on({
            load: function (store) {
                var signed = store.getCount(),
                    rawdata = store.getProxy().getReader().rawData,
                    unsignedUsers = rawdata.unsignedusers;

                me.pnlSigned.tab.setTitle(me.getTabTitle(signed, RS.$('Footmark_Status_Sign')));
                me.pnlUnSigned.tab.setTitle(me.getTabTitle(unsignedUsers.length, RS.$('Footmark_Status_NoSign')));
                me.pnlUnSigned.setUsers(unsignedUsers);
            }
        });
    },

    getTabTitle: function (count, title) {
        return Ext.String.format('<div class="text">{0}</div>{1}', count, title);
    },

    onUserTap: function (user) {
        var me = this,
            data = me.searchForm.getValues(false, false),
            pnl;

        pnl = Ext.create('YZSoft.apps.footmark.personal.List', {
            account: user.Account,
            month: data.date,
            title: user.DisplayName || user.Account,
            back: function () {
                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
    },

    onRecordTap: function (record) {
        var me = this,
            data = me.searchForm.getValues(false, false),
            pnl;

        pnl = Ext.create('YZSoft.apps.footmark.personal.List', {
            account: record.data.Account,
            month: data.date,
            title: record.data.Name || record.data.Account,
            back: function () {
                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
    },

    onMySign: function () {
        var me = this,
            user = YZSoft.LoginUser,
            pnl;

        pnl = Ext.create('YZSoft.apps.footmark.personal.List', {
            account: user.Account,
            title: user.DisplayName || user.Account,
            back: function () {
                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
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
    }
});
