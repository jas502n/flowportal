
Ext.define('YZSoft.src.ux.File.HTML5', {
    extend: 'YZSoft.src.ux.File.Abstract',

    openImageFile: function (cmp, attachment) {
        var me = this,
            fileid = attachment.FileID,
            url;

        url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'ImageStreamFromFileID',
            fileid: fileid,
            dc: +new Date()
        }));

        pnl = Ext.create('YZSoft.src.panel.ImageViewer', {
            imageSrc: url,
            singletap: function () {
                this.hide();
            }
        });

        Ext.Viewport.add(pnl);
        pnl.show();

        return pnl;
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

        fileUrl = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'Preview',
            fileid: fileid,
            supports: 'html',
            dc: +new Date()
        }));
        fileUrl = YZSoft.$abs(fileUrl);

        pnl = Ext.create('YZSoft.src.panel.HtmlFileViewer', {
            title: fileName,
            fileUrl: fileUrl,
            back: function () {
                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
    }
});
