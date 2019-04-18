
Ext.define('YZSoft.src.field.ImageAttachment.DingTalk', {
    extend: 'YZSoft.src.field.ImageAttachment.Abstract',
    requires: [
        'YZSoft.src.ux.File'
    ],

    onAddPicClick: function () {
        var me = this,
            app = application.startApp;

        dd.biz.util.uploadImage({
            multiple: false, //是否多选，默认false
            max: 1, //最多可选个数
            onSuccess: function (result) {
                var mediaUrl = result[0];

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/DingTalk/Core.ashx'),
                    params: {
                        Method: 'DownloadTempMediaFile',
                        mediaUrl: mediaUrl,
                        ext: YZSoft.src.ux.File.getExtension(mediaUrl)
                    },
                    success: function (action) {
                        me.addAttachment(action.result);
                    },
                    failure: function (action) {
                        Ext.Msg.alert(RS.$('All_Error'), action.result.errorMessage);
                    }
                });
            },
            onFail: function (err) {
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
        dd.biz.util.previewImage({
            current: url,
            urls: [url],
            onSuccess: function (result) {
            },
            onFail: function (err) {
            }
        });
    }
});