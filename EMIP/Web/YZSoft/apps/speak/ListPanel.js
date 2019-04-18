Ext.define('YZSoft.apps.speak.ListPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.NotesSpeak',
        'YZSoft.src.device.AudioPlayer',
        'YZSoft.src.device.File',
        'YZSoft.src.device.Capture'
    ],
    config: {
        playingCls: 'yz-list-item-playing'
    },

    constructor: function (config) {
        var me = this,
            config = config || {};

        me.capture();
        me.player = YZSoft.src.device.AudioPlayer;

        me.btnBack = Ext.create('Ext.Button', {
            text: RS.$('All__Back'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me);
            }
        });

        me.btnNew = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e907',
            iconAlign: 'left',
            align: 'right',
            handler: function () {
                me.capture();
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnNew]
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.NotesSpeak',
            autoLoad: false,
            loadDelay: true,
            clearOnPageLoad: true,
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/Speak.ashx'),
                extraParams: {
                    method: 'GetMyList'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children',
                    totalProperty: 'total'
                }
            },
            listeners: {
                load: function (store, records, successful, operation, eOpts) {
                    me.syncPlayingRecord();
                }
            }
        });

        me.list = Ext.create('Ext.dataview.List', {
            loadingText: '',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-notesspeak'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns {playing:this.renderPlaying}">',
                '<div class="yz-column-left yz-align-vcenter">',
                    '<div class="play"></div>',
                '</div>',
                '<div class="yz-column-center">',
                    '<div class="title">{[this.renderTitle(values)]}</div>',
                    '<div class="createat">{CreateAt:this.renderDate}</div>',
                '</div>',
                '<div class="yz-column-right yz-align-vcenter">',
                    '<div class="duration">{Duration:this.renderDuration}</div>',
                '</div>',
            '</div>', {
                renderTitle: function (value) {
                    var title = value.Comments || value.FileID;
                    return Ext.util.Format.htmlEncode(title);
                },
                renderDate: function (value) {
                    return Ext.Date.toFriendlyString(value);
                },
                renderDuration: function (value) {
                    return Ext.util.Format.mediaDurationM(value);
                },
                renderPlaying: function (value) {
                    return value ? 'yz-list-item-playing' : ''
                }
            }),
            store: me.store,
            plugins: [{
                xclass: 'YZSoft.src.plugin.PullRefresh',
                fetchCopyFieldsExcept: ['playing', 'Duradion'],
                listeners: {
                    latestfetched: function () {
                        me.syncPlayingRecord();
                    }
                }
            }, {
                xclass: 'YZSoft.src.plugin.ListPaging',
                autoPaging: true
            }, {
                xclass: 'YZSoft.src.plugin.ListOptions',
                items: [{
                    text: RS.$('All__Rename'),
                    padding: '0 20',
                    style: 'background-color:#c7c6cc',
                    handler: function (record) {
                        me.edit(record);
                    }
                }, {
                    text: RS.$('All__Delete'),
                    padding: '0 20',
                    style: 'background-color:#e84134',
                    handler: function (record) {
                        YZSoft.Ajax.request({
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/Speak.ashx'),
                            params: {
                                Method: 'Delete',
                                itemid: record.getId()
                            },
                            success: function (action) {
                                me.store.remove(record);
                            },
                            failure: function (action) {
                                Ext.Msg.alert(RS.$('All__Title_DeleteFailed'), action.result.errorMessage);
                            }
                        });
                    }
                }]
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
            single: true,
            painted: function () {
                me.on({
                    hide: function () {
                        me.player.stop();
                        me.player.bind(null);
                    }
                });
            }
        });

        me.on({
            scope: me,
            audiotimeupdate: 'onAudioTimeUpdate',
            audioended: 'onAudioEnd',
            audiostop: 'onAudioEnd'
        });
    },

    syncPlayingRecord: function () {
        var me = this,
            player = me.player,
            store = me.store;

        if (player.cmp == me && player.isPlaying()) {
            var rec = store.getById(player.itemid);
            if (rec) {
                Ext.apply(rec.data, {
                    playing: true,
                    Duration: me.player.getDuration() - player.getCurrentTime()
                });
                rec.commit();
            }
        }
    },

    onAudioTimeUpdate: function (player, time, itemid) {
        var me = this,
            store = me.store,
            list = me.list,
            record = store.getById(itemid),
            item = record ? list.getItemAt(store.indexOf(record)) : null;

        if (record) {
            if (!record.data.playing && time != 0)
                record.set('playing', true);

            if (item) {
                var duel = item.element.down('.duration'),
                    total = player.getDuration(),
                    remain = Math.floor(total - time);

                if (total && remain >= 0)
                    duel.setHtml(Ext.util.Format.mediaDurationM(remain));
            }
        }
        else {
            player.stop();
        }
    },

    onAudioEnd: function (player, time, itemid) {
        var me = this,
            record = me.store.getById(itemid);

        if (record)
            record.set('playing', false);
    },

    onItemTap: function (target, record) {
        var me = this,
            player = me.player,
            store = me.store;

        if (record.data.playing) {
            player.stop();
            record.set('playing', false);
        }
        else {
            store.each(function (rec) {
                rec.set('playing', false);
            });

            player.setFileId(record.data.FileID);
            player.bind(me, record.getId());
            player.play();
        }
    },

    capture: function () {
        var me = this;

        YZSoft.src.device.Capture.captureAudio({
            successEnterRight: true,
            success: function (result) {
                var mediaFile = result[0],
                    uri = mediaFile.fullPath;

                mediaFile.getFormatData(function (format) {
                    YZSoft.src.device.File.upload({
                        file: uri,
                        fileName: uri.substr(uri.lastIndexOf('/') + 1),
                        params: {
                            method: 'SaveNotesSpeak',
                            duration: Math.ceil(format.duration || 0)
                        },
                        success: function (action) {
                            me.store.insert(0, action.result.speak);
                        },
                        failure: function (action) {
                            Ext.Msg.alert(RS.$('All__Title_UploadFailed'), action.result.errorMessage);
                        },
                        progress: function (progress) {
                        }
                    });
                });
            }
        });
    },

    edit: function (record) {
        var me = this,
            data = record.data,
            pnl;

        pnl = Ext.create('YZSoft.apps.speak.Rename', {
            itemid: data.ItemID,
            comments: data.Comments,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop();
            },
            done: function (result) {
                record.set('Comments', result.Comments);
            }
        });

        me.on({
            single: true,
            hide: function () {
                Ext.defer(function () {
                    if (!Ext.os.is.iOS)
                        pnl.comments.focus();
                }, 10);
            }
        });

        Ext.mainWin.push(pnl);
    }
});
