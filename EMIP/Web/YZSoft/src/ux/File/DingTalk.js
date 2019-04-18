
Ext.define('YZSoft.src.ux.File.DingTalk', {
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
        dd.biz.util.previewImage({
            current: url,
            urls: [url],
            onSuccess: function (result) {
            },
            onFail: function (err) {
            }
        });
    },


    openFile: function (cmp, attachment) {
        var me = this,
            app = application.startApp,
            fileid = attachment.FileID,
            fileName = attachment.Name,
            ext = attachment.Ext,
            size = attachment.Size,
            fileUrl, url, pnl;

        if (!fileid)
            return;


        if (Ext.os.is.iOS) {
            fileUrl = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                Method: 'Download',
                fileid: fileid,
                dc: +new Date()
            }));
            fileUrl = YZSoft.$abs(fileUrl);

            dd.biz.util.openLink({
                url: fileUrl,
                onSuccess: function (result) {
                },
                onFail: function (err) {
                }
            });
        }
        else {
            fileUrl = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                Method: 'Preview',
                fileid: fileid,
                supports: 'html',
                dc: +new Date()
            }));
            fileUrl = YZSoft.$abs(fileUrl);

            url = Ext.String.urlAppend(YZSoft.$url('YZSoft/src/ux/File/viewer/HtmlViewer.aspx'), Ext.Object.toQueryString({
                fileUrl: fileUrl,
                fileName: fileName,
                dc: +new Date()
            }));
            url = YZSoft.$abs(url);

            dd.biz.util.openLink({
                url: url,
                onSuccess: function (result) {
                },
                onFail: function (err) {
                }
            });
        }
    }
});
