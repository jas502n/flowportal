
Ext.define('YZSoft.src.field.Attachment.DingTalk', {
    extend: 'YZSoft.src.field.Attachment.Abstract',
    requires: [
        'YZSoft.src.ux.File'
    ],

    onAddFileClick: function () {
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
    }
});