
Ext.define('YZSoft.src.field.ImageAttachment.WeChat', {
    extend: 'YZSoft.src.field.ImageAttachment.Abstract',

    onCaptureClick: function () {
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
                                me.addAttachment(action.result);
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
                                me.addAttachment(action.result);
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

    preview: function (rec) {
        var me = this,
            fileid = rec.data.FileID,
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
            urls: [url]
        });
    }
});