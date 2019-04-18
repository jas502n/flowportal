
Ext.define('YZSoft.social.SearchPanel', {
    extend: 'YZSoft.social.MessageAbstractPanel',
    requires: [
        'YZSoft.src.model.NotifyTopic',
        'YZSoft.src.util.MessageConverter',
        'YZSoft.src.model.User',
        'YZSoft.src.ux.GlobalStore'
    ],
    config: {
        style: 'background-color:#eeeeef;'
    },

    constructor: function (config) {
        var me = this;

        me.search = Ext.create('YZSoft.src.field.Search', {
            placeHolder: RS.$('All__Search'),
            flex: 1,
            focusOnMaskTap: false,
            active: true,
            listeners: {
                scope: me,
                action: 'onKeywordChange',
                beforecancelsearch: function () {
                    return false;
                }
            }
        });

        me.searchBar = Ext.create('Ext.Container', {
            cls: ['yz-searchbar'],
            style: application.statusbarOverlays ? 'padding-top:27px':'',
            items: [me.search]
        });

        me.listRender = {
            renderString: function (value) {
                return Ext.util.Format.htmlEncode(value);
            },
            renderTitle: function (value) {
                return Ext.util.Format.htmlEncode(value.resName) || '&nbsp;';
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
            renderMessage: function (value) {
                if (value.total != 1)
                    return Ext.String.format(RS.$('All_Social_Search_MultiMessage_FMT'), value.total);
                else
                    return YZSoft.src.util.MessageConverter.convertLastMessage(value.message);
            },
            renderDate: function (value) {
                return Ext.Date.toFriendlyString(value);
            },
            renderSingleChatPeerHeadshot: function (ext) {
                return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                    Method: 'GetHeadshot',
                    account: ext.P2PPeerAccount,
                    thumbnail: 'S'
                }));
            }
        };

        me.storeTopic = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.NotifyTopic'
        });

        me.listTopic = Ext.create('Ext.dataview.List', {
            loadingText: '',
            store: me.storeTopic,
            scrollable: false,
            disableSelection: true,
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            cls: ['yz-noscroll-autosize'],
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-notify-topic', 'yz-list-item-searchsocial-topic'],
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
                '<div class="yz-column-center yz-align-vcenter">',
                    '<div class="title">{[this.renderTitle(values)]}</div>',
                '</div>',
            '</div>', me.listRender
            ),
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    e.stopEvent();
                    me.openSocialPanel(record);
                }
            }
        });

        me.cntTopic = Ext.create('Ext.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            style: 'background-color:white',
            hidden: true,
            items: [{
                xtype: 'component',
                html: RS.$('All_Social_Search_Group_Title'),
                cls: ['yz-topic-social-search-topic']
            }, me.listTopic]
        });

        me.storeUser = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.User'
        });

        me.listUser = Ext.create('Ext.dataview.List', {
            loadingText: '',
            store: me.storeUser,
            scrollable: false,
            disableSelection: true,
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            cls: ['yz-noscroll-autosize'],
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-notify-topic', 'yz-list-item-searchsocial-topic'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns yz-list-item-user11111">',
                '<div class="yz-column-left yz-align-vcenter">',
                    '<div class="type groupimg" style="background-image:url({headsort})"></div>',
                '</div>',
                '<div class="yz-column-center yz-align-vcenter">',
                    '<div class="title">{ShortName:this.renderString}</div>',
                '</div>',
            '</div>', me.listRender
            ),
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    e.stopEvent();

                    YZSoft.Ajax.request({
                        url: YZSoft.$url('YZSoft.Services.REST/core/P2PGroup.ashx'),
                        params: {
                            method: 'OpenOrCreateGroup',
                            peeraccount: record.data.Account
                        },
                        success: function (action) {
                            var result = action.result,
                                pnl;

                            pnl = Ext.create('YZSoft.social.chat.SingleChatPanel', {
                                title: result.resName,
                                groupid: result.groupid,
                                back: function () {
                                    Ext.mainWin.pop();
                                }
                            });

                            Ext.mainWin.push(pnl);
                        }
                    });
                }
            }
        });

        me.cntUser = Ext.create('Ext.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            style: 'background-color:white',
            hidden: true,
            items: [{
                xtype: 'component',
                html: RS.$('All_Social_Search_User_Title'),
                cls: ['yz-topic-social-search-topic']
            }, me.listUser]
        });

        me.storeMessage = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.NotifyTopic'
        });

        me.listMessage = Ext.create('Ext.dataview.List', {
            loadingText: '',
            store: me.storeMessage,
            scrollable: false,
            disableSelection: true,
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            cls: ['yz-noscroll-autosize'],
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-notify-topic', 'yz-list-item-searchsocial-topic'],
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
                    '<div class="desc">{[this.renderMessage(values)]}</div>',
                '</div>',
                '<tpl if="total==1">',
                    '<div class="yz-column-right">',
                        '<div class="date">{date:this.renderDate}</div>',
                    '</div>',
                '</tpl>',
            '</div>', me.listRender
            ),
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    e.stopEvent();

                    if (record.data.total != 1) {
                        me.openDetailPanel(record);
                    }
                    else {
                        me.openSocialPanel(record, {
                            socialPanelConfig: {
                                msgId: record.data.lastMsgId
                            }
                        });
                    }
                }
            }
        });

        me.cntMessage = Ext.create('Ext.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            style: 'background-color:white',
            hidden: true,
            items: [{
                xtype: 'component',
                html: RS.$('All_Social_Search_Message_Title'),
                cls: ['yz-topic-social-search-topic']
            }, me.listMessage]
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.searchBar, me.cntTopic, me.cntUser, me.cntMessage]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.relayEvents(me.search, ['cancelsearch']);

        me.on({
            scope: me,
            groupRenamed: function (groupid, newName) {
                Ext.each([me.storeTopic, me.storeMessage], function (store) {
                    var rec = me.findRecord(store, 'Group', groupid);

                    if (!rec)
                        return;

                    rec.set('resName', newName);
                });
            },
            groupImageChanged: function (groupid, newImage) {
                Ext.each([me.storeTopic, me.storeMessage], function (store) {
                    var rec = me.findRecord(store, 'Group', groupid);

                    if (!rec)
                        return;

                    rec.set('ext', Ext.apply({}, {
                        ImageFileID: newImage
                    }, rec.data.ext));
                });
            },
            exitGroup: function (groupid) {
                me.fireEvent('groupExited', groupid);
                Ext.mainWin.pop(2);
            },
            groupExited: function (groupid) {
                Ext.each([me.storeTopic, me.storeMessage], function (store) {
                    var rec = me.findRecord(store, 'Group', groupid);

                    if (rec)
                        store.remove(rec);
                });
            },
            backbutton: function (firewin) {
                me.fireEvent('cancelsearch', me.search);
                return false;
            }
        });
    },

    onClearSearchText: function (delay) {
        var me = this;

        return;
        me.storeTopic.load({
            params: {
                keyword: ''
            },
            mask: false,
            delay: delay || 250
        });
    },

    onKeywordChange: function (input, e) {
        var me = this,
            value = input.getValue();

        me.doSearch(value);
    },

    doSearch: function (keyword) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Notify.ashx'),
            params: {
                method: 'SearchSocial',
                keyword: keyword
            },
            success: function (action) {
                var topics = action.result.topics,
                    users = action.result.users,
                    messages = action.result.messages;

                me.keyword = keyword;

                me.storeTopic.setData(topics);
                me.cntTopic[topics.length ? 'show' : 'hide']();

                me.cntUser[topics.length && users.length ? 'addCls' : 'removeCls']('yz-container-margintop10');
                me.storeUser.setData(users);
                me.cntUser[users.length ? 'show' : 'hide']();

                me.cntMessage[(topics.length || users.length) && messages.length ? 'addCls' : 'removeCls']('yz-container-margintop10');
                me.storeMessage.setData(messages);
                me.cntMessage[messages.length ? 'show' : 'hide']();
            }
        });
    },

    openDetailPanel: function (record) {
        var me = this,
            pnl;

        pnl = Ext.create('YZSoft.social.TopicSearchResultPanel', {
            title: record.data.resName,
            resName: record.data.resName,
            resType: record.data.resType,
            resId: record.data.resId,
            total: record.data.total,
            keyword: me.keyword,
            back: function () {
                Ext.mainWin.pop();
            }
        });

        me.relayEvents(pnl, ['groupRenamed', 'groupImageChanged', 'groupExited']);

        Ext.mainWin.push(pnl);
    }
});