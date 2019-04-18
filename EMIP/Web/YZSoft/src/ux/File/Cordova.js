
Ext.define('YZSoft.src.ux.File.Cordova', {
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
            fileid = attachment.FileID,
            fileName = attachment.Name,
            ext = attachment.Ext,
            size = attachment.Size,
            url, pnl;

        url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'Download',
            fileid: fileid,
            dc: +new Date()
        }));

        pnl = Ext.create('YZSoft.src.panel.FileViewer', {
            url: url,
            fileName: fileName,
            ext: ext,
            size: size,
            back: function () {
                this.hide();
            }
        });

        Ext.Viewport.add(pnl);
        pnl.show();

        return pnl;
    }
});
