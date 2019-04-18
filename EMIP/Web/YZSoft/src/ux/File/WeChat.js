
Ext.define('YZSoft.src.ux.File.WeChat', {
    extend: 'YZSoft.src.ux.File.Abstract',

    openImageFile: function (cmp, attachment) {
        var me = this,
            fileid = attachment.FileID,
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
    },

    openFile: function (cmp, attachment) {
        var me = this,
            fileid = attachment.FileID,
            fileName = attachment.Name,
            ext = attachment.Ext,
            size = attachment.Size,
            url, pnl;

        if (!fileid)
            return;

        YZSoft.Ajax.request({
            method: 'GET',
            url: YZSoft.$url('YZSoft.Services.REST/Attachment/Assist.ashx'),
            params: {
                method: 'GetFileSize',
                fileid: fileid
            },
            success: function (action) {
                size = action.result.size;

                url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                    Method: 'Download',
                    fileid: fileid,
                    dc: +new Date()
                }));

                url = YZSoft.$abs(url);
                wx.previewFile({
                    url: url,
                    name: fileName,
                    size: size
                });
            },
            failure: function (action) {
                alert(action.result.errorMessage);
            }
        });
    }
});
