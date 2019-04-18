Ext.define('YZSoft.social.MessagePanel', {
    extend: 'YZSoft.social.MessageAbstractPanel',
    requires: [
        'YZSoft.src.model.NotifyTopic',
        'YZSoft.src.util.MessageConverter',
        'YZSoft.src.device.Device',
        'YZSoft.src.ux.GlobalStore',
        'YZSoft.src.ux.Push'
    ],

    constructor: function (config) {
        var me = this,
            pnl;

        me.btnAdd = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e907',
            align: 'right',
            handler: function () {
                pnl = Ext.create('Ext.Panel', {
                    xtype: 'panel',
                    cls: 'yz-panel-overlay',
                    modal: true,
                    hideOnMaskTap: true,
                    left: 0,
                    top: 0,
                    defaults: {
                        xtype: 'button',
                        cls: ['yz-button-flat', 'yz-button-overlay'],
                        iconAlign: 'left'
                    },
                    items: [{
                        text: RS.$('All_Social_StartChat'),
                        iconCls: 'yz-glyph yz-glyph-e999',
                        scope: me,
                        handler: function () {
                            pnl.on({
                                single: true,
                                delay: 100,
                                hide: function () {
                                    me.startChat();
                                }
                            });

                            pnl.hide();

                        }
                    }/*, {
                        xtype: 'component',
                        cls: 'yz-sp-border-1'
                    }, {
                        text: RS.$('All_Apps_BarcodeScan'),
                        iconCls: 'yz-glyph yz-glyph-e998',
                        handler: function () {
                        }
                    }*/],
                    listeners: {
                        order: 'after',
                        hide: function () {
                            this.destroy();
                        }
                    }
                });

                Ext.Viewport.add(pnl);
                pnl.showBy(me.btnAdd);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            cls: ['yz-titlebar'],
            title: RS.$('All_Social_Title'),
            items: [me.btnAdd]
        });

        me.search = Ext.create('YZSoft.src.field.Search', {
            placeHolder: RS.$('All__Search'),
            flex: 1,
            focusOnMaskTap: false,
            listeners: {
                scope: me,
                beforeactivesearch: 'onActiveSearch'
            }
        });

        me.searchBar = Ext.create('Ext.Container', {
            cls: ['yz-searchbar'],
            items: [me.search]
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.NotifyTopic',
            autoLoad: false,
            loadDelay: true,
            clearOnPageLoad: true,
            loadingText: '',
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
                extraParams: {
                    method: 'GetNotifyTopics'
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
            store: me.store,
            plugins: [{
                xclass: 'YZSoft.src.plugin.PullRefresh'
            }],
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            disableSelection: true,
            //emptyText: RS.$('TaskList_EmptyText'),
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-notify-topic'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns yz-list-item-{resType}">',
                '<div class="yz-column-left yz-align-vcenter">',
                    '<tpl switch="resType">',
                        '<tpl case="Task">',
                            '<div class="type taskimg" style="background-color:{ext:this.renderProcessBackgroundColor}">{ext:this.renderProcessShortName}</div>',
                        '<tpl case="Group">',
                            '<div class="type groupimg" style="background-image:url({ext:this.renderGroupImage})"></div>',
                        '<tpl case="SingleChat">',
                            '<div class="type groupimg" style="background-image:url({ext:this.renderSingleChatPeerHeadshot})"></div>',
                        '<tpl case="TaskApproved">',
                            '<div class="type taskapprovedimg"></div>',
                        '<tpl case="TaskRejected">',
                            '<div class="type taskrejectedimg"></div>',
                        '<tpl case="ProcessRemind">',
                            '<div class="type processremindimg"></div>',
                        '<tpl default>',
                            '<div class="type">{resType}</div>',
                    '</tpl>',
                '</div>',
                '<div class="yz-column-center">',
                    '<div class="title">{[this.renderTitle(values)]}</div>',
                    '<div class="desc">{message:this.renderMessage}</div>',
                '</div>',
                '<div class="yz-column-right">',
                    '<div class="date">{date:this.renderDate}</div>',
                    '<div class="badge">{newmessage:this.renderBadge}</div>',
                '</div>',
            '</div>', {
                renderString: function (value) {
                    return Ext.util.Format.htmlEncode(value);
                },
                renderTitle: function (value) {
                    return Ext.util.Format.htmlEncode(value.resName) || '&nbsp;';
                },
                renderMessage: function (value) {
                    return YZSoft.src.util.MessageConverter.convertLastMessage(value);
                },
                renderDate: function (value) {
                    return Ext.Date.toFriendlyString(value);
                },
                renderBadge: function (value) {
                    return value > 100 ? '···' : value || '';
                },
                renderProcessBackgroundColor: function (ext) {
                    return ext.Color;
                },
                renderProcessShortName: function (ext) {
                    return Ext.util.Format.htmlEncode(ext.ShortName);
                },
                renderGroupImage: function (ext) {
                    if (ext.GroupType == 'Chat') {
                        var store = YZSoft.src.ux.GlobalStore.getGroupImageStore(),
                            record = store.getById(ext.ImageFileID) || store.getById('Group99');

                        return YZSoft.$url(record.data.NameSpace, record.data.Image);
                    }
                    else {
                        if (ext.ImageFileID) {
                            return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                                Method: 'ImageStreamFromFileID',
                                scale: 'Scale',
                                width: 161,
                                height: 139,
                                fileid: ext.ImageFileID
                            }));
                        }
                        else
                            return YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/group/Group99.png');
                    }
                },
                renderSingleChatPeerHeadshot: function (ext) {
                    return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                        Method: 'GetHeadshot',
                        account: ext.P2PPeerAccount,
                        thumbnail: 'S'
                    }));
                }
            }),
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    e.stopEvent();
                    me.openSocialPanel(record);
                    record.set('newmessage', 0);
                    me.fireEvent('storeDataChanged', me.store, me.store.getData().items);
                }
            }
        });

        me.list.on({
            single: true,
            painted: function () {
                me.store.load({
                    callback: function () {
                        YZSoft.src.ux.Push.subscribe({
                            cmp: me,
                            channel: ['social', 'taskApproved', 'taskRejected', 'processRemind'],
                            fn: function () {
                                YZSoft.src.ux.Push.on({
                                    scope: me,
                                    social: function (message) {
                                        if (message.clientid == YZSoft.src.ux.Push.clientid) {
                                            me.modified = true;
                                            return;
                                        }

                                        me.onNotify(message);
                                    },
                                    taskApproved: 'onNotify',
                                    taskRejected: 'onNotify',
                                    processRemind: 'onNotify'
                                });
                            }
                        });

                        me.on({
                            destroy: function () {
                                YZSoft.src.ux.Push.unsubscribe({
                                    cmp: me,
                                    channel: ['social', 'taskApproved', 'taskRejected', 'processRemind']
                                });
                            }
                        });
                    }
                });
            }
        });

        me.list.getScrollable().getScroller().getElement().insertFirst(me.searchBar.element);

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            cancelsearch: 'onCancelSearch',
            groupRenamed: function (groupid, newName) {
                var rec = me.findRecord(me.store, 'Group', groupid);

                if (!rec)
                    return;

                rec.set('resName', newName);
            },
            groupImageChanged: function (groupid, newImage) {
                var rec = me.findRecord(me.store, 'Group', groupid);

                if (!rec)
                    return;

                rec.set('ext', Ext.apply({}, {
                    ImageFileID: newImage
                }, rec.data.ext));
            },
            exitGroup: function (groupid) {
                me.fireEvent('groupExited', groupid);
                Ext.mainWin.pop(2);
            },
            groupExited: function (groupid) {
                var rec = me.findRecord(me.store, 'Group', groupid);

                if (rec)
                    me.store.remove(rec);
            },
            painted: function () {
                if (me.modified) {
                    me.store.loadPage(1, { delay: false, mask: false });
                    me.modified = false;
                }
            }
        });

        me.store.on({
            load: function (store, records, successful, operation, eOpts) {
                if (successful)
                    me.fireEvent('storeDataChanged', store, records);
            }
        });

        YZSoft.src.device.Device.on({
            resume: function () {
                me.store.loadPage(1, { delay: false, mask: false });
            }
        });
    },

    onActiveSearch: function (search) {
        var me = this,
            offset = me.titleBar.element.getHeight() - (application.statusbarOverlays ? 22 : 0);

        me.element.setBottom(-offset);
        me.titleBar.addCls('yz-titlebar-searching');
        var anim = Ext.create('Ext.Anim', {
            autoClear: false,
            duration: 200,
            easing: 'ease-out',
            from: {
            },
            to: {
                transform: 'translateY(-' + offset + 'px)'
            },
            before: function (el) {
            },
            after: function (el) {
                me.fireEvent('afteractivesearch', me);
            }
        });

        anim.run(me.element);
    },

    onCancelSearch: function (search) {
        var me = this,
            offset = me.titleBar.element.getHeight(),
            keyword = search.getValue();

        me.search.cancelSearch();

        var anim = Ext.create('Ext.Anim', {
            autoClear: false,
            duration: 200,
            easing: 'ease-in',
            from: {
            },
            to: {
                transform: 'translateY(0px)'
            },
            before: function (el) {
            },
            after: function (el) {
                me.titleBar.removeCls('yz-titlebar-searching');
                me.element.setBottom(0);
            }
        });

        anim.run(me.element);
    },

    onNotify: function (message) {
        var me = this;
        me.store.loadPage(1, { delay: false, mask: false });
    },

    startChat: function () {
        var me = this,
            pnl;

        pnl = Ext.create('YZSoft.social.chat.StartChat', {
            title: RS.$('All_Social_StartChat_Title'),
            back: function () {
                pnl.hide();
            },
            fn: function (group) {
                var pnlSocial = Ext.create('YZSoft.social.chat.GroupChatPanel', {
                    title: group.Name,
                    groupid: group.GroupID,
                    back: function () {
                        Ext.mainWin.pop();
                    }
                });

                pnlSocial.on({
                    scope: me,
                    exitGroup: function (groupid) {
                        Ext.mainWin.pop(2);
                    }
                });

                Ext.mainWin.push(pnlSocial);
            },
            listeners: {
                order: 'after',
                hide: function () {
                    this.destroy();
                }
            }
        });

        Ext.Viewport.add(pnl);
        pnl.show();
    }
});