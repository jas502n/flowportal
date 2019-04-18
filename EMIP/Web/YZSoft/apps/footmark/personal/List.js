
Ext.define('YZSoft.apps.footmark.personal.List', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.NotesFootmark'
    ],

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


        me.cmpCaption = Ext.create('Ext.Component', {
            xtype: 'component',
            flex: 1,
            cls: 'yz-cmp-footmark-caption',
            tpl: [
                '<div class="title">{title}</div>',
                '<div class="subtitle">' + Ext.String.format(RS.$('Footmark_My_SubTitle'), '<span class="count">{count}</span>') + '</div>'
            ],
            data: {
                title: config.title,
                count: '-'
            }
        });

        me.edtDate = Ext.create('YZSoft.src.field.MonthPicker', {
            cls: ['yz-field-box', 'yz-border-width-1', 'yz-field-box-date', 'yz-field-box-month'],
            value: config.month || new Date(),
            listeners: {
                scope: me,
                select: 'onSearch'
            }
        });

        me.pnlCaption = Ext.create('Ext.Container', {
            docked: 'top',
            padding: '15 15 15 20',
            layout: {
                type: 'hbox',
                align: 'center'
            },
            items: [{
                xclass: 'YZSoft.src.component.Headshot',
                uid: config.account,
                width: 44,
                height: 44
            }, me.cmpCaption, me.edtDate]
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.NotesFootmark',
            autoLoad: false,
            loadDelay: false,
            clearOnPageLoad: true,
            pageSize: -1,
            grouper: {
                direction: 'DESC',
                sorterFn: function (item1, item2) {
                    var sort1 = item1.data.ItemID,
                    sort2 = item2.data.ItemID;

                    return (sort1 > sort2) ? 1 : ((sort1 < sort2) ? -1 : 0);
                },
                groupFn: function (record) {
                    return Ext.Date.format(record.get('Time'), RS.$('All__DateFmt_MonthDay'));
                }
            },
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/Footmark.ashx'),
                extraParams: {
                    method: 'GetUserList',
                    account: config.account
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children',
                    totalProperty: 'total'
                }
            }
        });

        me.list = Ext.create('Ext.dataview.List', {
            store: me.store,
            grouped: true,
            loadingText: '',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            cls: ['yz-list-flatheader', 'yz-list-footmark'],
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-footmark'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns">',
                '<div class="yz-column-left">',
                    '<div class="time">{Time:this.renderTime}</div>',
                '</div>',
                '<div class="yz-column-center">',
                    '<div class="address">{[this.renderPosition(values)]}</div>',
                    '<tpl if="Comments">',
                        '<div class="comments">{Comments:this.renderString}</div>',
                    '</tpl>',
                '</div>',
                '<div class="yz-column-right yz-align-vcenter">',
                    '<div class="go"></div>',
                '</div>',
            '</div>', {
                renderString: function (value) {
                    return Ext.util.Format.htmlEncode(value);
                },
                renderPosition: function (value) {
                    return Ext.String.format('{0}, {1}', Ext.util.Format.htmlEncode(value.LocName), Ext.util.Format.htmlEncode(value.LocAddress))
                },
                renderTime: function (value) {
                    return Ext.Date.format(value, 'H:i');
                }
            }),
            plugins: [{
                xclass: 'YZSoft.src.plugin.PullRefresh'
            }, {
                xclass: 'YZSoft.src.plugin.ListPaging',
                autoPaging: true
            }],
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
            items: [me.titleBar, me.pnlCaption, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.store.on({
            load: function (store) {
                var data = Ext.apply({}, me.cmpCaption.getData());
                data.count = store.getTotalCount();
                me.cmpCaption.setData(data);
            }
        });

        me.on({
            single: true,
            scope: me,
            painted: 'onSearch'
        });
    },

    onItemTap: function (target, record) {
        var me = this,
            pnl;

        pnl = Ext.create('YZSoft.apps.footmark.Detail', {
            title: record.data.LocName,
            value: Ext.apply({}, record.data),
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
            month = me.edtDate.getValue();

        Ext.apply(params, {
            month: month
        });

        me.store.load();
    }
});
