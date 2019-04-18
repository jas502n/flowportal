Ext.define('YZSoft.src.panel.social.social.HTML5', {
    extend: 'YZSoft.src.panel.social.social.Abstract',
    requires: [
    ],

    onImageTap: function (list, index, target, record, e, eOpts) {
        var me = this,
            targetImg = Ext.get(e.getTarget('.yz-social-msg-item-img')),
            fileid = targetImg && targetImg.getAttribute('fileid'),
            previews = me.imagePreviews = me.imagePreviews || {},
            pnl = previews[fileid],
            url;

        if (!fileid)
            return;

        if (!pnl) {
            url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                Method: 'ImageStreamFromFileID',
                fileid: fileid,
                dc: +new Date()
            }));

            pnl = previews[fileid] = Ext.create('YZSoft.src.panel.ImageViewer', {
                imageSrc: url,
                singletap: function () {
                    this.hide();
                }
            });

            Ext.Viewport.add(pnl);
        }

        pnl.show();
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
    }
});