
Ext.define('YZSoft.task.MainPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.plugin.SwipeTabs',
        'YZSoft.src.device.Push',
        'YZSoft.src.device.Device',
        'YZSoft.src.ux.Push',
        //--------------微信钉钉启动程序附加项-----------------
        'YZSoft.src.device.Device',
        'YZSoft.src.ux.Push',
        'YZSoft.src.device.device.Simulator',
        'YZSoft.src.device.push.Simulator',
        'YZSoft.src.device.device.Abstract',
        'YZSoft.src.device.push.Abstract',
        'YZSoft.src.device.Abstract',
        'YZSoft.task.WorkListPanel',
        'YZSoft.task.WorkListPanel',
        'YZSoft.src.plugin.PullRefresh',
        'YZSoft.src.plugin.ListPaging',
        'YZSoft.task.ShareTaskPanel',
        'YZSoft.task.MyProcessedPanel',
        'YZSoft.src.model.TaskItem',
        'YZSoft.task.MyRequestPanel',
        'YZSoft.src.model.WorkListItem'

    ],
    config: {
        titleBar: true
    },

    constructor: function (config) {
        var me = this;

        config = config || {};

        me.btnSearch = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e90a',
            align: 'right',
            handler: function () {
                me.tabMain.getActiveItem().fireEvent('searchClick', me.btnSearch);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            title: config.title || RS.$('All_BPM_Title'),
            docked: 'top',
            cls: ['yz-titlebar'],
            hidden: config.titleBar === false,
            items: [me.btnSearch]
        });

        me.pnlWorkList = Ext.create('YZSoft.task.WorkListPanel', {
            title: RS.$('All_BPM_Worklist'),
            tab: {
                flex: 1
            }
        });

        me.pnlShare = Ext.create('YZSoft.task.ShareTaskPanel', {
            title: RS.$('All_BPM_SharePool'),
            tab: {
                flex: 1
            }
        });

        me.pnlMyProcessed = Ext.create('YZSoft.task.MyProcessedPanel', {
            title: RS.$('All_BPM_MyProcessed'),
            tab: {
                flex: 1
            }
        });

        me.pnlMyRequest = Ext.create('YZSoft.task.MyRequestPanel', {
            title: RS.$('All_BPM_MyRequest'),
            tab: {
                flex: 1
            }
        });

        me.tabMain = Ext.create('Ext.tab.Panel', {
            plugins: 'swipetabs',
            tabBar: {
                ui: 'plain',
                cls: ['yz-tab-module']
            },
            activeItem: 0,
            items: [me.pnlWorkList, me.pnlShare, me.pnlMyProcessed, me.pnlMyRequest]
        });

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.tabMain]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateBadget({
            fn: function () {
                YZSoft.src.ux.Push.subscribe({
                    cmp: me,
                    channel: 'worklistChanged',
                    fn: function () {
                        YZSoft.src.ux.Push.on({
                            scope: me,
                            worklistChanged: 'onWorkListChanged'
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

        YZSoft.src.device.Device.on({
            resume: function () {
                me.updateBadget();
            }
        });
    },

    onWorkListChanged: function (message) {
        this.updateBadget();
    },

    updateBadget: function (args) {
        var me = this;

        args = args || {};

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/TaskList.ashx'),
            params: {
                Method: 'GetTaskCount'
            },
            success: function (action) {
                var result = action.result,
                    total = result.total,
                    worklist = result.worklist,
                    sharetask = result.sharetask;

                if (me.tab && me.tab.setBadgeText) {
                    me.tab.setBadgeText(total || '');
                }

                me.pnlWorkList.tab.setText(RS.$('All_BPM_Worklist') + (worklist ? Ext.String.format('<span class="yz-tasklist-badge">({0})</span>', worklist) : ''));
                me.pnlShare.tab.setText(RS.$('All_BPM_SharePool') + (sharetask ? Ext.String.format('<span class="yz-tasklist-badge">({0})</span>', sharetask) : ''));

                YZSoft.src.device.Push.setApplicationIconBadgeNumber(total);

                if (args.fn)
                    args.fn.call(args.fn.scope, action);
            },
            failure: function (action) {
            }
        });
    }
});
