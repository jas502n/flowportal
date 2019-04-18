
Ext.define('YZSoft.src.panel.Notify', {
    extend: 'YZSoft.src.panel.SocialAbstract',
    requires: [
        'YZSoft.src.model.Message',
        'YZSoft.src.util.MessageConverter',
        'YZSoft.src.ux.Push'
    ],
    config: {
        resType: null,
        resId: null,
        msgId: null,
        disablepush: false
    },

    constructor: function (config) {
        var me = this;

        me.channel = config.channel || Ext.String.format('{0}/{1}', config.resType, config.resId);
        me.player = YZSoft.src.device.AudioPlayer;

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.Message',
            autoLoad: false,
            clearOnPageLoad: false,
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
                extraParams: {
                    method: 'GetSocialMessages',
                    resType: config.resType,
                    resId: config.resId,
                    msgId: 'msgId' in config ? config.msgId + 1 : undefined,
                    dir: 'prev',
                    rows: 20
                }
            }
        });

        me.store.on({
            load: function (s, records, successful, operation) {
                if (!successful)
                    return;

                var params = operation.getParams() || {};
                if (records.length != 0 && (params.dir == 'next' || !params.msgId)) {
                    me.updateReaded(records[records.length - 1].getId());
                }
            }
        });

        me.list = Ext.create('Ext.dataview.List', {
            loadingText: '',
            flex: 1,
            scrollable: {
                direction: 'vertical',
                indicators: false,
                align: 'bottom'
            },
            scrollToTopOnRefresh: false,
            disableSelection: true,
            cls: 'yz-list-notify',
            itemCls: 'yz-list-item-notify',
            store: me.store,
            disableSelection: true,
            onItemDisclosure: false,
            scrollToTopOnRefresh: false,
            //emptyText: RS.$('Communication_EmptyText'),
            pressedCls: '',
            itemTpl: new Ext.XTemplate(
                '<div class="time">{date:this.renderDate}</div>',
                '<div class="message-wrap">',
                    '<div class="message">{message:this.renderMessage}</div>',
                '</div>', {
                    renderDate: function (value) {
                        return Ext.Date.toFriendlyString(value);
                    },
                    renderMessage: function (value) {
                        var messages = me.messages = me.messages || {},
                            message = me.messages[value];

                        if (!message) {
                            message = YZSoft.src.util.MessageConverter.convert(value);
                            messages[value] = message;
                        }

                        return message;
                    }
                })
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.list.on({
            single: true,
            painted: function () {
                me.store.load({
                    callback: function () {
                        if (me.getDisablepush() !== true) {
                            YZSoft.src.ux.Push.subscribe({
                                cmp: me,
                                channel: me.channel,
                                fn: function () {
                                    YZSoft.src.ux.Push.on({
                                        message: 'onNotify',
                                        scope: me
                                    });
                                }
                            });
                            me.on({
                                destroy: function () {
                                    YZSoft.src.ux.Push.unsubscribe({
                                        cmp: me,
                                        channel: me.channel
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });

        me.list.on({
            scope: me,
            itemtap: 'onItemTap'
        });

        var scroller = me.list.getScrollable().getScroller();
        scroller.on({
            scope: me,
            scroll: 'onScrollChange'
        });

        me.on({
            scope: me,
            audiotimeupdate: 'onAudioTimeUpdate',
            audioended: 'onAudioEnd',
            audiostop: 'onAudioEnd'
        });
    },

    onItemTap: function (list, index, target, record, e, eOpts) {
        var me = this,
            targetImg = Ext.get(e.getTarget('.yz-social-msg-item-img')),
            targetVideo = Ext.get(e.getTarget('.yz-social-msg-item-video')),
            targetDoc = Ext.get(e.getTarget('.yz-social-msg-item-doc')),
            targetAudio = Ext.get(e.getTarget('.yz-social-msg-item-audio')),
            targetTaskApproved = Ext.get(e.getTarget('.taskapprove-wrap')),
            targetTaskRejected = Ext.get(e.getTarget('.taskreject-wrap')),
            targetProcessRemind = Ext.get(e.getTarget('.processremind-wrap'));

        if (e.getTarget('.message') || e.getTarget('.headsort'))
            e.stopEvent();

        if (targetImg)
            me.onImageTap.apply(me, arguments);
        if (targetVideo)
            me.onVideoTap.apply(me, arguments);
        else if (targetDoc)
            me.onDocTap.apply(me, arguments);
        else if (targetAudio)
            me.onAudioTap.apply(me, arguments);
        else if (targetTaskApproved)
            me.onTaskApprovedTap.apply(me, arguments);
        else if (targetTaskRejected)
            me.onTaskRejectedTap.apply(me, arguments);
        else if (targetProcessRemind)
            me.onProcessRemindTap.apply(me, arguments);
    },

    onTaskApprovedTap: function (list, index, target, record, e, eOpts) {
        var me = this,
            targetTaskApproved = Ext.get(e.getTarget('.taskapprove-wrap')),
            taskid = Number(targetTaskApproved.getAttribute('taskid')),
            processName = targetTaskApproved.getAttribute('processName'),
            pnl;

        pnl = Ext.create('YZSoft.form.Read', {
            tid: taskid,
            title: processName,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
    },

    onTaskRejectedTap: function (list, index, target, record, e, eOpts) {
        var me = this,
            targetTaskRejected = Ext.get(e.getTarget('.taskreject-wrap')),
            taskid = Number(targetTaskRejected.getAttribute('taskid')),
            processName = targetTaskRejected.getAttribute('processName'),
            pnl;

        pnl = Ext.create('YZSoft.form.Read', {
            tid: taskid,
            title: processName,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
    },

    onProcessRemindTap: function (list, index, target, record, e, eOpts) {
        var me = this,
            targetProcessRemind = Ext.get(e.getTarget('.processremind-wrap')),
            stepid = Number(targetProcessRemind.getAttribute('stepid')),
            taskid = Number(targetProcessRemind.getAttribute('taskid')),
            processName = targetProcessRemind.getAttribute('processName'),
            pnl;

        if (targetProcessRemind.hasCls('processremind-finished')) {
            pnl = Ext.create('YZSoft.form.Read', {
                tid: taskid,
                title: processName,
                back: function () {
                    Ext.mainWin.pop();
                },
                fn: function () {
                    Ext.mainWin.pop();
                }
            });
        }

        else {
            pnl = Ext.create('YZSoft.form.Process', {
                pid: stepid,
                title: processName,
                back: function () {
                    Ext.mainWin.pop();
                },
                fn: function () {
                    Ext.mainWin.pop();
                },
                done: function () {
                    var items = me.element.query('.processremind-wrap');
                    Ext.Array.each(items, function (item) {
                        var itemel = Ext.get(item),
                            stepidItem = Number(itemel.getAttribute('stepid'));

                        if (stepidItem == stepid)
                            itemel.addCls('processremind-finished');
                    });
                }
            });
        }

        Ext.mainWin.push(pnl);
    }
});