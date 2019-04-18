
Ext.define('YZSoft.src.device.audioplayer.HTML5', {
    extend: 'Ext.Audio',
    config: {
        fileId: null,
        fileUri: null
    },

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

        me.on({
            play: function (player) {
                if (me.cmp)
                    me.cmp.fireEvent('audioplay', player, me.itemid);
            },
            canplay: function (player) {
                if (me.cmp)
                    me.cmp.fireEvent('audiocanplay', player, me.itemid);
            },
            timeupdate: function (player, time) {
                if (me.cmp)
                    me.cmp.fireEvent('audiotimeupdate', player, time, me.itemid);
            },
            pause: function (player, time) {
                if (me.cmp)
                    me.cmp.fireEvent('audiopause', player, time, me.itemid);
            },
            ended: function (player, time) {
                if (me.cmp)
                    me.cmp.fireEvent('audioended', player, time, me.itemid);
            },
            stop: function (player) {
                if (me.cmp)
                    me.cmp.fireEvent('audiostop', player, 0, me.itemid);
            },
            volumechange: function (player, volumn) {
                if (me.cmp)
                    me.cmp.fireEvent('audiovolumechange', player, volumn, me.itemid);
            }
        });
    },

    updateFileId: function (fileid) {
        var me = this,
            url;

        url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'AudioStreamFromFileID',
            fileid: fileid,
            supports: 'mp3,wav',
            dc: (+new Date())
        }));

        me.fileid = fileid;
        me.setUrl(url);
    },

    updateFileUri: function (uri) {
        var me = this,
            url;

        me.fileid = '';
        me.setUrl(uri);
    },

    bind: function (cmp, itemid) {
        var me = this;

        me.cmp = cmp;
        me.itemid = itemid;
    }
});
