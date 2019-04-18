Ext.define('YZSoft.src.panel.Social', {
    extend: 'YZSoft.src.panel.SocialAbstract',
    requires: [
        'YZSoft.src.model.Message',
        'YZSoft.src.util.MessageConverter',
        'YZSoft.src.util.InputAssist',
        'YZSoft.src.device.File',
        'YZSoft.src.device.Capture',
        'YZSoft.src.device.Camera',
        'YZSoft.src.ux.Push'
    ],
    config: {
        resType: null,
        resId: null,
        msgId: null,
        style: 'background-color:#fff;',
        disablepush:false
    },
    toolBarClses: ['yz-toolbar-social-comments', 'yz-toolbar-social-speak', 'yz-toolbar-social-face', 'yz-toolbar-social-media'],

    constructor: function (config) {
        var me = this;

        me.channel = Ext.String.format('{0}/{1}', config.resType, config.resId);

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

        me.list = Ext.create('Ext.dataview.DataView', {
            loadingText: '',
            flex: 1,
            scrollable: {
                direction: 'vertical',
                indicators: false,
                align: 'bottom'
            },
            scrollToTopOnRefresh: false,
            disableSelection: true,
            cls: 'yz-list-social',
            itemCls: 'yz-list-item-message',
            store: me.store,
            disableSelection: true,
            onItemDisclosure: false,
            scrollToTopOnRefresh: false,
            //emptyText: RS.$('Communication_EmptyText'),
            pressedCls: '',
            itemTpl: new Ext.XTemplate(
                '<tpl if="this.isMy(uid)">',
                    '<div class="yz-layout-columns yz-layout-columns-my yz-layout-columns-{message:this.getMessageType}">',
                        '<div class="yz-column-left">',
                        '</div>',
                        '<div class="yz-column-center">',
                            '<div class="time">{date:this.renderDate}</div>',
                            '<div class="message-wrap">',
                                '<div class="yz-align-vcenter message-body">',
                                    '<div class="yz-socialmessage-status">',
                                        '<div class="x-loading-spinner">',
                                            '<span class="x-loading-top"></span>',
                                            '<span class="x-loading-right"></span>',
                                            '<span class="x-loading-bottom"></span>',
                                            '<span class="x-loading-left"></span>',
                                        '</div>',
                                    '</div>',
                                    '<div class="duration" orgDur="{duration:this.renderDuration}">{duration:this.renderDuration}</div>',
                                    '<div class="message">',
                                        '<div class="message-inner">{message:this.renderMessage}</div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<div class="yz-column-right">',
                            '<div class="headsort" style="background-image:url({headsort})"></div>',
                        '</div>',
                    '</div>',
                '<tpl else>',
                    '<div class="yz-layout-columns yz-layout-columns-other yz-layout-columns-{message:this.getMessageType}">',
                        '<div class="yz-column-left">',
                            '<div class="headsort" style="background-image:url({headsort})"></div>',
                        '</div>',
                        '<div class="yz-column-center">',
                            '<div class="time"><span class="uid">{UserDisplayName:this.renderString}</span>{date:this.renderDate}</div>',
                            '<div class="message-wrap">',
                                '<div class="yz-align-vcenter message-body">',
                                    '<div class="message">',
                                        '<div class="message-inner">{message:this.renderMessage}</div>',
                                    '</div>',
                                    '<div class="duration" orgDur="{duration:this.renderDuration}">{duration:this.renderDuration}</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<div class="yz-column-right">',
                        '</div>',
                    '</div>',
                '</tpl>', {
                    isMy: function (value) {
                        return (YZSoft.LoginUser.Account || '').toLowerCase() == (value || '').toLowerCase();
                    },
                    renderString: function (value) {
                        return Ext.util.Format.htmlEncode(value);
                    },
                    getMessageType: function (value) {
                        var types = me.types = me.types || {},
                            type = me.types[value];

                        if (!type) {
                            type = YZSoft.src.util.MessageConverter.getMessageType(value);
                            types[value] = type;
                        }

                        return type;
                    },
                    renderMessage: function (value) {
                        var messages = me.messages = me.messages || {},
                            message = me.messages[value];

                        if (!message) {
                            message = YZSoft.src.util.MessageConverter.convert(value);
                            messages[value] = message;
                        }

                        return message;
                    },
                    renderDate: function (value) {
                        return Ext.Date.toFriendlyString(value);
                    },
                    renderDuration: function (value) {
                        return value <= 0 ? '' : Ext.util.Format.mediaDurationM(value);
                    }
                })
        });

        me.btnSpeak = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-social'],
            iconCls: 'yz-glyph yz-socialglyph-speak',
            scope: me,
            handler: 'onSpeakClick'
        });

        me.txtComments = Ext.create('YZSoft.src.panel.social.Comments', {
            flex: 1,
            maxRows: 3,
            listeners: {
                action: function (el, e) {
                    e.stopEvent();
                    me.send();
                },
                focus: function (el, e) {
                    me.setInputModel(false);
                }
            }
        });

        me.btnPressToRecord = Ext.create('Ext.Button', {
            flex: 1,
            text: RS.$('All_Social_Record_PressToRecord'),
            cls: ['yz-button-flat', 'yz-border-width-1', 'yz-button-presstorecord'],
            hidden: true,
            listeners: {
                element: 'element',
                touchstart: function () {
                    if (me.btnPressToRecord.recording)
                        return;

                    me.btnPressToRecord.setText(RS.$('All_Social_Record_ReleaseToEnd'));
                    var pnl = Ext.create('YZSoft.src.panel.MiniAudioCapture', {
                        button: me.btnPressToRecord,
                        fn: function (uri, duration) {
                            pnl.on({
                                single: true,
                                hide: function () {
                                    me.btnPressToRecord.setText(RS.$('All_Social_Record_PressToRecord'));
                                    if (uri)
                                        me.sendAudio(uri, duration);
                                }
                            });

                            pnl.hide();
                        },
                        cancel: function () {
                            pnl.hide();
                        },
                        listeners: {
                            order: 'after',
                            hide: function () {
                                me.btnPressToRecord.recording = false;
                                this.destroy();
                            }
                        }
                    });

                    Ext.Viewport.add(pnl);
                    pnl.show();
                    me.btnPressToRecord.recording = true;
                }
            }
        });

        me.btnFace = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-social'],
            iconCls: 'yz-glyph yz-socialglyph-face',
            scope: me,
            handler: 'onFaceModelClick'
        });

        me.btnMedia = new Ext.Button({
            cls: ['yz-button-flat', 'yz-button-social'],
            iconCls: 'yz-glyph yz-socialglyph-media',
            scope: me,
            handler: 'onMediaModelClick'
        });

        me.toolBar = Ext.create('Ext.Toolbar', {
            cls: ['yz-toolbar-flat', 'yz-toolbar-social'],
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [me.btnSpeak, me.btnPressToRecord, me.txtComments, me.btnFace, me.btnMedia]
        });

        me.pnlFace = me.createFacePanel();
        me.pnlMedia = me.createMediaPanel();

        me.pnlAssist = Ext.create('Ext.Container', {
            height: 188,
            cls: ['yz-container-social-assist'],
            hidden: true,
            layout: {
                type: 'card',
                animation: {
                    duration: 300,
                    easing: 'ease-out',
                    type: 'slide',
                    direction: 'up'
                }
            },
            items: [me.pnlFace, me.pnlMedia]
        });

        var cfg = {
            title: config.resType + ":" + config.resId,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.list, me.toolBar, me.pnlAssist]
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

        me.list.element.on({
            singletap: function () {
                me.setInputModel(false);
            }
        });

        var scroller = me.list.getScrollable().getScroller();
        scroller.on({
            scope: me,
            scroll: 'onScrollChange',
            scrollstart: function () {
                me.setInputModel(false);
            }
        });

        me.pnlFace.on({
            scope: me,
            faceClick: 'onFaceClick',
            sendClick: function () {
                me.send();
            }
        });
    },

    onItemTap: function (list, index, target, record, e, eOpts) {
        var me = this,
            targetImg = Ext.get(e.getTarget('.yz-social-msg-item-img')),
            targetVideo = Ext.get(e.getTarget('.yz-social-msg-item-video')),
            targetDoc = Ext.get(e.getTarget('.yz-social-msg-item-doc')),
            targetAudio = Ext.get(e.getTarget('.yz-social-msg-item-audio'));

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
    },

    onSpeakClick: function () {
        var me = this;

        if (me.btnPressToRecord.isHidden())
            me.setSpeakModel();
        else
            me.setInputModel(true);
    },

    onFaceModelClick: function () {
        var me = this,
            pnlAssist = me.pnlAssist;

        if (pnlAssist.isHidden() || pnlAssist.getActiveItem() !== me.pnlFace)
            me.setFaceModel();
        else
            me.setInputModel(true);
    },

    onMediaModelClick: function () {
        var me = this,
            pnlAssist = me.pnlAssist;

        if (pnlAssist.isHidden() || pnlAssist.getActiveItem() !== me.pnlMedia)
            me.setMediaModel();
        else
            me.setInputModel(true);
    },

    setSpeakModel: function () {
        var me = this,
            pnl = me.pnlAssist;

        me.toolBar.replaceCls(me.toolBarClses, 'yz-toolbar-social-speak');
        pnl.hide();
        me.txtComments.hide();
        me.btnPressToRecord.show();
    },

    setInputModel: function (focus) {
        var me = this,
            pnl = me.pnlAssist,
            fn;

        me.toolBar.replaceCls(me.toolBarClses, 'yz-toolbar-social-comments');
        fn = function () {
            me.btnPressToRecord.hide();

            if (me.txtComments.isHidden()) {
                me.txtComments.on({
                    single: true,
                    show: function () {
                        if (focus && !Ext.os.is.iOS)
                            me.txtComments.focus();
                    }
                });
            }
            else {
                if (focus && !Ext.os.is.iOS)
                    me.txtComments.focus();
            }
            me.txtComments.show();
        };

        if (!pnl.isHidden()) {
            pnl.on({
                single: true,
                hide: function () {
                    Ext.defer(function () {
                        fn();
                    }, 1);
                }
            });
            pnl.hide();
        }
        else {
            fn();
        }
    },

    setFaceModel: function () {
        var me = this;

        me.toolBar.replaceCls(me.toolBarClses, 'yz-toolbar-social-face');
        me.btnPressToRecord.hide();
        me.txtComments.show();
        me.showAssistPanel(me.pnlFace);
    },

    setMediaModel: function () {
        var me = this;

        me.toolBar.replaceCls(me.toolBarClses, 'yz-toolbar-social-media');
        me.btnPressToRecord.hide();
        me.txtComments.show();
        me.showAssistPanel(me.pnlMedia);
    },

    showAssistPanel: function (pnlShow) {
        var me = this,
            pnl = me.pnlAssist;

        if (pnl.isHidden()) {
            pnl.setActiveItem(pnlShow);
            pnl.show();
        }
        else {
            if (pnl.getActiveItem() !== pnlShow)
                pnl.setActiveItem(pnlShow);
        }
    },

    createFacePanel: function () {
        var me = this,
            pnl;

        pnl = Ext.create('YZSoft.src.panel.social.Face', {
        });

        return pnl;
    },

    createMediaPanel: function () {
        var me = this,
            pnl;

        pnl = Ext.create('Ext.Container', {
            layout: {
                type: 'hbox',
                align: 'center'
            },
            cls: 'yz-container-social-media',
            padding: '6 16 0 16',
            defaults: {
                xtype: 'button',
                iconAlign: 'top'
            },
            items: [{
                xtype: 'component',
                flex: 1
            }, {
                text: RS.$('All__Photo'),
                iconCls: 'yz-glyph yz-glyph-e957',
                cls: ['yz-button-media', 'yz-button-media-photo'],
                handler: function () {
                    YZSoft.src.device.Camera.capture({
                        source: 'library',
                        quality: 75,
                        destination: 'file',
                        encoding: 'jpeg',
                        allowEdit: false,
                        saveToPhotoAlbum: false,
                        success: function (uri) {
                            me.sendPicture(uri);
                        }
                    });
                }
            }, {
                xtype: 'component',
                flex: 2
            }, {
                text: RS.$('All__Social_CapturePhoto'),
                iconCls: 'yz-glyph yz-glyph-e955',
                cls: ['yz-button-media', 'yz-button-media-camera'],
                handler: function () {
                    YZSoft.src.device.Camera.capture({
                        source: 'camera',
                        quality: 75,
                        destination: 'file',
                        encoding: 'jpeg',
                        allowEdit: false,
                        saveToPhotoAlbum: false,
                        success: function (uri) {
                            me.sendPicture(uri);
                        }
                    });
                }
            }, {
                xtype: 'component',
                flex: 2
            }, {
                text: RS.$('All__Video'),
                iconCls: 'yz-glyph yz-glyph-e956',
                cls: ['yz-button-media', 'yz-button-media-vedio'],
                handler: function () {
                    YZSoft.src.device.Capture.captureVideo({
                        successEnterRight: true,
                        quality: 1,
                        duration: 20,
                        success: function (result) {
                            var mediaFile = result[0],
                                uri = mediaFile.fullPath,
                                fileName = uri.substr(uri.lastIndexOf('/') + 1),
                                fileNameNoExt = fileName.substr(0, fileName.lastIndexOf('.'));

                            VideoEditor.createThumbnail(
                                function (result) {
                                    me.sendVideo(uri, result);
                                },
                                function () {
                                }, {
                                    fileUri: uri,
                                    outputFileName: 'IMG_' + fileNameNoExt,
                                    atTime: 0,
                                    width: 540,
                                    height: 600,
                                    quality: 100
                                }
                            );
                        }
                    });
                }
            }, {
                xtype: 'component',
                flex: 1
            }]
        });

        return pnl;
    },

    onFaceClick: function (face) {
        var me = this;

        if (face.isBackSpace)
            me.txtComments.fireEvent('backspaceClick');
        else
            YZSoft.src.util.InputAssist.insertAtCaret(this.txtComments, Ext.String.format('[{0}]', face.text));
    },

    send: function () {
        var me = this,
            resType = me.getResType(),
            resId = me.getResId(),
            msg = me.txtComments.getValue(),
            s = me.list.getScrollable().getScroller(),
            r;

        if (!msg)
            return;

        msg = YZSoft.src.util.MessageConverter.encodeFace(msg);

        var msg = {
            resType: resType,
            resId: resId,
            date: new Date(),
            uid: YZSoft.LoginUser.Account,
            message: msg
        };

        me.txtComments.setValue('');

        s.scrollToTop(false);

        r = me.store.add(msg)[0];
        r.phantom = true;

        var item = {};
        item.item = Ext.get(me.list.getItemAt(me.store.indexOf(r)));
        item.statusEl = item.item.down('.yz-socialmessage-status');
        item.statusEl.addCls('yz-socialmessage-send-waiting');
        item.beginTime = Ext.Date.now();

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
            params: {
                method: 'PostComments',
                clientid: YZSoft.src.ux.Push.clientid,
                resType: resType,
                resId: resId
            },
            jsonData: {
                message: msg.message
            },
            success: function (action) {
                r.setId(action.result.id);
            },
            failure: function (action) {
                //Ext.Logger.log(action.result.errorMessage);
            },
            requestend: function () {
                var tick = YZSoft.setting.delay.sendMessage - Ext.Date.getElapsed(item.beginTime);
                Ext.defer(function () {
                    item.statusEl.removeCls('yz-socialmessage-send-waiting');
                }, tick);
            }
        });
    },

    sendAudio: function (uri, duration) {
        var me = this,
            resType = me.getResType(),
            resId = me.getResId(),
            msgtext = Ext.String.format('{localAudioFile:{0}}', uri),
            s = me.list.getScrollable().getScroller(),
            r;

        var msg = {
            resType: resType,
            resId: resId,
            date: new Date(),
            uid: YZSoft.LoginUser.Account,
            message: msgtext,
            duration: -1
        };

        s.scrollToTop(false);

        r = me.store.add(msg)[0];
        r.phantom = true;

        var item = {};
        item.item = Ext.get(me.list.getItemAt(me.store.indexOf(r)));
        item.statusEl = item.item.down('.yz-socialmessage-status');
        item.statusEl.addCls('yz-socialmessage-send-waiting');
        item.beginTime = Ext.Date.now();

        YZSoft.src.device.File.upload({
            file: uri,
            fileName: uri.substr(uri.lastIndexOf('/') + 1),
            params: {
                method: 'SaveAudio',
                duration: duration
            },
            success: function (action) {
                msgtext = Ext.String.format('{audioFile:{0}}', action.result.fileid);

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
                    params: {
                        method: 'PostComments',
                        clientid: YZSoft.src.ux.Push.clientid,
                        resType: resType,
                        resId: resId,
                        duration: duration
                    },
                    jsonData: {
                        message: msgtext
                    },
                    success: function (action) {
                        Ext.apply(r.data, {
                            message: msgtext,
                            duration: duration
                        });
                        r.setId(action.result.id);
                    },
                    failure: function (action) {
                        //Ext.Logger.log(action.result.errorMessage);
                    },
                    requestend: function () {
                        var tick = YZSoft.setting.delay.sendMessage - Ext.Date.getElapsed(item.statusEl.beginTime);
                        Ext.defer(function () {
                            item.statusEl.removeCls('yz-socialmessage-send-waiting');
                        }, tick);
                    }
                });
            },
            failure: function (action) {
                item.statusEl.removeCls('yz-socialmessage-send-waiting');
                Ext.Msg.alert(RS.$('All__Title_UploadFailed'), action.result.errorMessage);
            },
            progress: function (progress) {
            }
        });
    },

    sendPicture: function (uri) {
        var me = this,
            resType = me.getResType(),
            resId = me.getResId(),
            msgtext = Ext.String.format('{localImageFile:{0}}', uri),
            s = me.list.getScrollable().getScroller(),
            r;

        var msg = {
            resType: resType,
            resId: resId,
            date: new Date(),
            uid: YZSoft.LoginUser.Account,
            message: msgtext
        };

        s.scrollToTop(false);

        r = me.store.add(msg)[0];
        r.phantom = true;

        var item = {};
        item.item = Ext.get(me.list.getItemAt(me.store.indexOf(r)));
        item.msgEl = item.item.down('.message-inner');
        item.mask = Ext.create('YZSoft.src.loadmask.CircleProgressMask', {
            cls: ['yz-mask-cicprogress', 'yz-mask-socialupload'],
            circleWidth: 50,
            circleHeight: 50,
            renderTo: item.msgEl
        });
        item.mask.setProgress(0);
        item.beginTime = Ext.Date.now();

        YZSoft.src.device.File.upload({
            file: uri,
            fileName: uri.substr(uri.lastIndexOf('/') + 1),
            success: function (action) {
                msgtext = Ext.String.format('{imageFile:{0}}', action.result.fileid);

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
                    params: {
                        method: 'PostComments',
                        clientid: YZSoft.src.ux.Push.clientid,
                        resType: resType,
                        resId: resId
                    },
                    jsonData: {
                        message: msgtext
                    },
                    success: function (action) {
                        Ext.apply(r.data, {
                            message: msgtext
                        });
                        r.setId(action.result.id);
                    },
                    failure: function (action) {
                        //Ext.Logger.log(action.result.errorMessage);
                    },
                    requestend: function () {
                        var tick = YZSoft.setting.delay.sendMessage - Ext.Date.getElapsed(item.beginTime);
                        Ext.defer(function () {
                            item.mask.destroy();
                        }, tick);
                    }
                });
            },
            failure: function (action) {
                item.mask.destroy();
                Ext.Msg.alert(RS.$('All__Title_UploadFailed'), action.result.errorMessage);
            },
            progress: function (progress) {
                item.mask.setProgress(progress.loaded * 100 / progress.total);
            }
        });
    },

    sendVideo: function (uri, thumb) {
        var me = this,
            resType = me.getResType(),
            resId = me.getResId(),
            msgtext = Ext.String.format('{localVedioFile:{0}}', thumb),
            fileName = uri.substr(uri.lastIndexOf('/') + 1),
            fileNameNoExt = fileName.substr(0, fileName.lastIndexOf('.')),
            s = me.list.getScrollable().getScroller(),
            r;

        var msg = {
            resType: resType,
            resId: resId,
            date: new Date(),
            uid: YZSoft.LoginUser.Account,
            message: msgtext
        };

        s.scrollToTop(false);

        r = me.store.add(msg)[0];
        r.phantom = true;

        var item = {};
        item.item = Ext.get(me.list.getItemAt(me.store.indexOf(r)));
        item.msgEl = item.item.down('.message-inner');
        item.mask = Ext.create('YZSoft.src.loadmask.CircleProgressMask', { circleWidth: 50, circleHeight: 50, renderTo: item.msgEl });
        item.mask.setProgress(0);
        item.beginTime = Ext.Date.now();

        VideoEditor.transcodeVideo(
            function (result) {
                uri = result;
                fileName = uri.substr(uri.lastIndexOf('/') + 1);

                YZSoft.src.device.File.upload({
                    file: uri,
                    fileName: fileName,
                    success: function (action) {
                        msgtext = Ext.String.format('{vedioFile:{0}}', action.result.fileid);

                        YZSoft.Ajax.request({
                            method: 'POST',
                            url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
                            params: {
                                method: 'PostComments',
                                clientid: YZSoft.src.ux.Push.clientid,
                                resType: resType,
                                resId: resId
                            },
                            jsonData: {
                                message: msgtext
                            },
                            success: function (action) {
                                Ext.apply(r.data, {
                                    message: msgtext
                                });
                                r.setId(action.result.id);
                            },
                            failure: function (action) {
                                //Ext.Logger.log(action.result.errorMessage);
                            },
                            requestend: function () {
                                var tick = YZSoft.setting.delay.sendMessage - Ext.Date.getElapsed(item.beginTime);
                                Ext.defer(function () {
                                    item.mask.destroy();
                                }, tick);
                            }
                        });
                    },
                    failure: function (action) {
                        item.mask.destroy();
                        Ext.Msg.alert(RS.$('All__Title_UploadFailed'), action.result.errorMessage);
                    },
                    progress: function (progress) {
                        item.mask.setProgress(progress.loaded * 100 / progress.total);
                    }
                });
            },
            function (err) {
                Ext.Msg.alert(RS.$('All__Title_CompressImageFailed'), err);
            },
            {
                fileUri: uri,
                outputFileName: 'C_' + fileNameNoExt,
                outputFileType: VideoEditorOptions.OutputFileType.MPEG4,
                optimizeForNetworkUse: VideoEditorOptions.OptimizeForNetworkUse.YES,
                saveToLibrary: false,
                maintainAspectRatio: true,
                height: 960,
                videoBitrate: 1000000, // 1 megabit
                audioChannels: 2,
                audioSampleRate: 44100,
                audioBitrate: 128000, // 128 kilobits
                progress: function (info) {
                    //console.log('transcodeVideo progress callback, info: ' + info);
                }
            }
        );
    }
});