Ext.define('YZSoft.social.TopicSearchResultPanel', {
    extend: 'YZSoft.social.MessageAbstractPanel',
    requires: [
        'YZSoft.src.model.NotifyTopic',
        'YZSoft.src.util.MessageConverter',
        'YZSoft.src.ux.GlobalStore'
    ],
    config: {
        resName:null,
        resType: null,
        resId: null,
        total: null,
        keyword:null
    },

    constructor: function (config) {
        var me = this;

        me.btnBack = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me, me);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            cls: ['yz-titlebar'],
            title: config.title || '',
            items: [me.btnBack]
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
                    method: 'SearchSocialMessagesInTopic',
                    resType: config.resType,
                    resId: config.resId,
                    keyword: config.keyword
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children',
                    totalProperty: 'total'
                }
            }
        });

        me.cmpDesc = Ext.create('Ext.Component', {
            docked: 'top',
            cls: ['yz-title-topicsearchresult'],
            tpl: RS.$('All_Social_Search_TopicResult_Topic'),
            data: {
                resName: config.resName,
                total: config.total,
                keyword: config.keyword
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
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-notify-topic yz-list-item-searchsocial-intopic'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns yz-list-item-{resType}">',
                '<div class="yz-column-left yz-align-vcenter">',
                    '<tpl switch="resType">',
                        '<tpl case="Task">',
                            '<div class="type taskimg" style="background-color:{ext:this.renderProcessBackgroundColor}">{ext:this.renderProcessShortName}</div>',
                        '<tpl case="Group">',
                            '<div class="type groupimg" style="background-image:url({headsort})"></div>',
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
                    '<div class="title">{[this.renderUserName(values)]}</div>',
                    '<div class="desc">{message:this.renderMessage}</div>',
                '</div>',
                '<div class="yz-column-right">',
                    '<div class="date">{date:this.renderDate}</div>',
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
                renderUserName: function (value) {
                    return Ext.util.Format.htmlEncode(value.ext.UserShortName || value.uid) || '&nbsp;';
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
                    me.openSocialPanel(record, {
                        socialPanelConfig: {
                            disablepush:true,
                            msgId: record.data.id
                        }
                    });
                }
            }
        });

        me.list.on({
            single: true,
            painted: function () {
                me.store.load({
                    callback: function (records, operation, success) {
                        if (success) {
                            me.cmpDesc.setData({
                                resName: me.getResName(),
                                total: me.store.getTotalCount(),
                                keyword: me.getKeyword()
                            });
                        }
                    }
                });
            }
        });

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.cmpDesc, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            groupRenamed: function (groupid, newName) {
                me.titleBar.setTitle(newName);
                me.store.each(function (rec) {
                    rec.set('resName', newName);
                });
            },
            groupImageChanged: function (groupid, newImage) {
                me.store.each(function (rec) {
                    rec.set('ext', Ext.apply({}, {
                        ImageFileID: newImage
                    }, rec.data.ext));
                });
            },
            exitGroup: function (groupid) {
                me.fireEvent('groupExited', groupid);
                Ext.mainWin.pop(3);
            }
        });
    }
});