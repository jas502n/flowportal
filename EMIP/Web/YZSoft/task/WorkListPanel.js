document.body.addEventListener('touchmove', function (e) {
    e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
}, { passive: false }); //passive 参数不能省略，用来兼容ios和android


Ext.define('YZSoft.task.WorkListPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.WorkListItem',
        'Ext.util.Format',
        'YZSoft.src.device.Device',
        'YZSoft.src.ux.Push'
    ],

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.WorkListItem',
            autoLoad: false,
            loadDelay: true,
            clearOnPageLoad: true,
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/TaskList.ashx'),
                extraParams: {
                    method: 'GetWorkList'
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
            '<div class="yz-layout-columns">',
                '<div class="yz-column-left yz-align-vcenter">',
                    '<div class="shortname" style="background-color:{Color}">{ShortName:this.renderString}</div>',
                '</div>',
                '<div class="yz-column-center">',
                    '<div class="title">{[this.renderTitle(values)]}</div>',
                    '<div class="initiator">{Owner:this.renderString}</div>',
                    '<div class="desc">{Description}<span class="step">{NodeName}</span></div>',
                '</div>',
                '<div class="yz-column-right">',
                    '<div class="createat">{CreateAt:this.renderDate}</div>',
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

                    rv = Ext.String.format(RS.$('All_BPM_Task_Title_FMT'),
                        Ext.util.Format.htmlEncode(value.OwnerDisplayName),
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

        //me.list.on({
        //    single: true,
        //    painted: function () {
        me.store.load({
            delay: false,
            mask: false,
            callback: function () {
                YZSoft.src.ux.Push.subscribe({
                    cmp: me,
                    channel: 'worklistChanged',
                    fn: function () {
                        YZSoft.src.ux.Push.on({
                            worklistChanged: 'onWorkListChanged',
                            scope: me
                        });
                    }
                });
                me.on({
                    destroy: function () {
                        YZSoft.src.ux.Push.unsubscribe({
                            cmp: me,
                            channel: 'worklistChanged'
                        });
                    }
                });
            }
        });
        //    }
        //});

        var cfg = {
            layout: 'fit',
            items: [me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        Ext.mainWin.on({
            worklistchanged: function () {
       
                me.store.loadPage(1, { delay: false, mask: false });
            }
        });

        YZSoft.src.device.Device.on({
            resume: function () {
         
                me.store.loadPage(1, { delay: false, mask: false });
            }
        });

        me.on({
            scope: me,
            searchClick: 'onSearch'
        });
    },

    onWorkListChanged: function (message) {
        this.store.loadPage(1, { delay: false, mask: false });
    },

    openForm: function (record) {
        var me = this,
            data = record.data,
            pnl;

        pnl = Ext.create('YZSoft.form.Process', {
            pid: data.StepID,
            title: data.ProcessName,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop();
            },
            done: function () {
                me.store.loadPage(1, { delay: false, mask: false });
            }
        });

        Ext.mainWin.push(pnl);
    },

    onSearch: function (processName) {
        var me = this,
            pnl = me.pnlSearch;

        if (!pnl) {
            pnl = me.pnlSearch = Ext.create('YZSoft.task.filter.WorkList', {
                title: RS.$('All__Filter'),
                back: function () {
                    Ext.mainWin.remove(pnl, false);
                },
                fn: function (processName) {
                    var store = me.store,
                        params = store.getProxy().getExtraParams();

                    Ext.mainWin.remove(pnl, false);

                    Ext.apply(params, {
                        processName: processName
                    });

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
