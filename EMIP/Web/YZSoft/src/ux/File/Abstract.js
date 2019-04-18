
Ext.define('YZSoft.src.ux.File.Abstract', {
    FileTypeIcon: {
        'ai.png': 'ai',
        'avi.png': 'avi,rmvb,mpg,mpeg,wmv,mp4v,m4v,3gp,3gpp,3g2,3gp2',
        'mov.png': 'mov',
        'mp4.png': 'mp4',
        'bmp.png': 'bmp,rle,dib,wbm,wbmp',
        'cdr.png': 'cdr',
        'chm.png': 'chm',
        'dll.png': 'dll,sys,dat,bak,drv',
        'doc.png': 'doc,docx',
        'dwg.png': 'dwg',
        'eml.png': 'eml',
        'fla.png': 'fla',
        'gif.png': 'gif',
        'htm.png': 'htm,html,asp,aspx,php',
        'ini.png': 'ini,inf',
        'jpg.png': 'jpg,jpeg,jpe,jpf,jpx,jp2,j2c',
        'mdb.png': 'mdb,mdbx',
        'mp3.png': 'mp3,mid,rmi,midi,m4a,m4r,wma,wav,snd,aac,ra',
        'pdf.png': 'pdf',
        'png.png': 'png',
        'ppt.png': 'ppt,pptx',
        'psd.png': 'psd',
        'rar.png': 'rar',
        'zip.png': 'zip',
        'rm.png': 'rm,asf,wm',
        'rtf.png': 'rtf',
        'swf.png': 'swf',
        'tif.png': 'tif,tiff,wml,raw,eps,pcx',
        'ttf.png': 'ttf,fon,otf,ttc',
        'txt.png': 'txt,log',
        'xls.png': 'xls,xlsx',
        'xml.png': 'xml'
    },
    openImageFile: Ext.emptyFn,
    openFile: Ext.emptyFn,

    getExtension: function (path) {
        if (!path)
            return '';

        var idx = path.lastIndexOf('.');
        if (idx == -1)
            return '';

        return path.substring(idx) || '';
    },

    getIconByExt: function (ext, size) {
        var me = this;

        ext = ext || '';

        if (!me.FileTypeIconFlat) {
            me.FileTypeIconFlat = {};

            for (var propName in me.FileTypeIcon) {
                var exts = me.FileTypeIcon[propName].split(',')
                for (var o = 0; o < exts.length; o++)
                    me.FileTypeIconFlat[exts[o]] = propName;
            }
        }

        var ext = ext.replace('.', '').toLowerCase(),
            filetypeimg = me.FileTypeIconFlat[ext] || 'unknow.png';

        return YZSoft.$url(Ext.String.format('YZSoft/Attachment/ext{0}/{1}', size || '', filetypeimg));
    },

    open: function (params) {
        var me = this,
            fileid = params.fileid,
            cmp = params.cmp,
            previews = cmp.$filePreviews = cmp.$filePreviews || {},
            pnl = previews[fileid];

        if (pnl) {
            pnl.show();
            return;
        }

        YZSoft.Ajax.request({
            async: false,
            method: 'GET',
            url: YZSoft.$url('YZSoft.Services.REST/Attachment/Assist.ashx'),
            params: {
                method: 'GetAttachmentInfo',
                fileid: fileid
            },
            success: function (action) {
                var attachment = action.result,
                    mime = (attachment.MimeType || '').toLowerCase();

                if (mime.indexOf('image/') == 0)
                    pnl = me.openImageFile(cmp, attachment);
                else
                    pnl = me.openFile(cmp, attachment);

                if (pnl) {
                    previews[fileid] = pnl;

                    if (!cmp.$filePreviewsListen) {
                        cmp.on({
                            destroy: function () {
                                me.onCmpDestroy(cmp);
                            }
                        });

                        cmp.$filePreviewsListen = true;
                    }
                }
            },
            failure: function (action) {
                alert(action.result.errorMessage);
            }
        });
    },

    onCmpDestroy: function (cmp) {
        var me = this,
            previews = cmp.$filePreviews = cmp.$filePreviews || {};

        Ext.Object.each(previews, function (key, pnl) {
            if (pnl)
                pnl.destroy();
        });

        delete previews;
    }
});