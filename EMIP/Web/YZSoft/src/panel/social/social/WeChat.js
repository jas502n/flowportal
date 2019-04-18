Ext.define('YZSoft.src.panel.social.social.WeChat', {
    extend: 'YZSoft.src.panel.social.social.Abstract',
    requires: [
    ],

    onImageTap: function (list, index, target, record, e, eOpts) {
        var me = this,
            targetImg = Ext.get(e.getTarget('.yz-social-msg-item-img')),
            fileid = targetImg && targetImg.getAttribute('fileid'),
            url;

        if (!fileid)
            return;

        url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'ImageStreamFromFileID',
            fileid: fileid,
            dc: +new Date()
        }));

        url = YZSoft.$abs(url);
        wx.previewImage({
            current: url,
            urls: []
        });
    },

    onVideoTap: function (list, index, target, record, e, eOpts) {
        var me = this,
            targetVideo = Ext.get(e.getTarget('.yz-social-msg-item-video')),
            fileid = targetVideo && targetVideo.getAttribute('fileid'),
            players = me.videoPlayers = me.videoPlayers || {},
            pnl = players[fileid],
            url;

        if (!fileid)
            return;

        if (!pnl) {
            url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                Method: 'VideoStreamFromFileID',
                fileid: fileid,
                dc: +new Date()
            }));

            pnl = /*players[fileid] =*/Ext.create('YZSoft.src.panel.VideoPlayer', {
                modal: true,
                url: url,
                posterImage: targetVideo.dom,
                fn: function () {
                    Ext.Viewport.remove(pnl);
                }
            });

            Ext.Viewport.add(pnl);
        }

        pnl.show();
    },

    onDocTap: function (list, index, target, record, e, eOpts) {
        var me = this;
        alert('doc tap');
    },

    onPickImageClick: function () {
        var me = this,
            app = application.startApp;

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

                wx.uploadImage({
                    localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        var serverId = res.serverId; // 返回图片的服务器端ID

                        YZSoft.Ajax.request({
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/WeChat/Core.ashx'),
                            params: {
                                Method: 'DownloadTempMediaFile',
                                cropId: app.corpId,
                                appSecret: app.secret,
                                mediaId: serverId
                            },
                            success: function (action) {
                                me.send(Ext.String.format('{imageFile:{0}}', action.result.FileID));
                            },
                            failure: function (action) {
                                Ext.Msg.alert(RS.$('All_Error'), action.result.errorMessage);
                            }
                        });
                    }
                });
            }
        });
    },

    onCapturePhotoClick: function () {
        var me = this,
            app = application.startApp;

        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

                wx.uploadImage({
                    localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        var serverId = res.serverId; // 返回图片的服务器端ID

                        YZSoft.Ajax.request({
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/WeChat/Core.ashx'),
                            params: {
                                Method: 'DownloadTempMediaFile',
                                cropId: app.corpId,
                                appSecret: app.secret,
                                mediaId: serverId
                            },
                            success: function (action) {
                                me.send(Ext.String.format('{imageFile:{0}}', action.result.FileID));
                            },
                            failure: function (action) {
                                Ext.Msg.alert(RS.$('All_Error'), action.result.errorMessage);
                            }
                        });
                    }
                });
            }
        });
    }
});