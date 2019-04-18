Ext.define('YZSoft.task.AllAccessableTaskPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.TaskItem',
        'Ext.util.Format'
    ],

    constructor: function (config) {
        var me = this;

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

        me.btnSearch = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e90a',
            align: 'right',
            handler: function () {
                me.fireEvent('searchClick', me.btnSearch);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            cls: ['yz-titlebar'],
            title: config.title || '',
            items: [me.btnBack, me.btnSearch]
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.TaskItem',
            autoLoad: false,
            loadDelay: true,
            clearOnPageLoad: true,
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/TaskList.ashx'),
                extraParams: {
                    method: 'GetHistoryTasks',
                    HistoryTaskType: 'AllAccessable',
                    byYear: 1
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children',
                    totalProperty: 'total'
                }
            }
        });

        me.list = Ext.create('Ext.dataview.List', {
            loadingText: '',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            itemCls: ['yz-list-item-flat', 'yz-list-item-task', 'yz-list-item-mytask'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns {StatusClass}">',
                '<div class="yz-column-left yz-align-vcenter">',
                    '<div class="shortname" style="background-color:{Color}">{ShortName:this.renderString}</div>',
                '</div>',
                '<div class="yz-column-center">',
                    '<div class="title">{[this.renderTitle(values)]}</div>',
                    '<div class="createat">{CreateAt:this.renderDate}</div>',
                    '<div class="desc">{Description}</div>',
                    '<div class="processingsteps">{ProcessingSteps:this.renderString}</div>',
                '</div>',
                '<div class="yz-column-right yz-align-vcenter">',
                    '<div class="status-wrap">',
                        '<div class="statusicon"></div>',
                        '<div class="statustext">{StatusText}</div>',
                    '</div>',
                '</div>',
            '</div>', {
                renderString: function (value) {
                    return Ext.util.Format.htmlEncode(value);
                },
                renderDate: function (value) {
                    return Ext.Date.toFriendlyString(value);
                },
                renderTitle: function (value) {
                    var rv;

                    rv = Ext.String.format('{0}',
                        Ext.util.Format.htmlEncode(value.ProcessName));

                    if (value.AgentAccount && value.AgentAccount != value.OwnerAccount)
                        rv += [
                        '<div class="delegation">',
                            Ext.String.format(RS.$('All_BPM_DelegationBy_FMT'), Ext.util.Format.htmlEncode(value.AgentDisplayName)),
                        '</div>'
                    ].join('');

                    return rv;
                }
            }),
            store: me.store,
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
                    me.openForm(record);
                }
            }
        });

        me.list.on({
            single: true,
            painted: function () {
                me.store.load();
            }
        });

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            searchClick: 'onSearch'
        });
    },

    openForm: function (record) {
        var me = this,
            data = record.data,
            pnl;

        pnl = Ext.create('YZSoft.form.Read', {
            tid: data.TaskID,
            title: data.ProcessName,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop();
            },
            done: function () {
                var store = me.store;
                store.loadPage(1, { delay: false, mask: false });
            }
        });

        Ext.mainWin.push(pnl);
    },

    onSearch: function (processName) {
        var me = this,
            pnl = me.pnlSearch;

        if (!pnl) {
            pnl = me.pnlSearch = Ext.create('YZSoft.task.filter.HistoryTask', {
                title: RS.$('All__Filter'),
                back: function () {
                    Ext.mainWin.remove(pnl, false);
                },
                fn: function (newparams) {
                    var store = me.store,
                        params = store.getProxy().getExtraParams();

                    Ext.mainWin.remove(pnl, false);

                    Ext.apply(params, newparams);
                    me.store.loadPage(1, { delay: false, mask: false });
                },
                listeners: {
                    backbutton: function () {
                        Ext.mainWin.remove(pnl, false);
                        return false;
                    }
                }
            });
        }

        Ext.mainWin.push(pnl);
    }
});
