
Ext.define('YZSoft.src.device.audioplayer.Cordova', {
    extend: 'YZSoft.src.device.Abstract',
    config: {
        fileId: null,
        url: null
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

    isPlaying: function () {
        return !!this.media;
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

    bind: function (cmp, itemid) {
        var me = this;

        me.cmp = cmp;
        me.itemid = itemid;
    },

    getDuration: function () {
        var me = this,
            media = me.media,
            duration;

        if (media)
            duration = media.getDuration();

        return duration;
    },

    getCurrentTime: function () {
        var me = this,
            media = me.media,
            pos;

        if (media) {
            media.getCurrentPosition(
                function (position) {
                    if (position > -1)
                        pos = position;
                },
                function (e) {
                }
            );
        }

            return pos;
    },

    play: function () {
        var me = this,
            url = me.getUrl(),
            media;

        media = me.media = new Media(url,
            function () {
                console.log("playAudio():Audio Success");
            },
            function (err) {
            },
            function (status) {
                switch (status) {
                    case Media.MEDIA_NONE:
                        break;
                    case Media.MEDIA_STARTING:
                        me.fireEvent('play', me);
                        break;
                    case Media.MEDIA_RUNNING:
                        break;
                    case Media.MEDIA_PAUSED:
                        me.fireEvent('pause', me);
                        break;
                    case Media.MEDIA_STOPPED:
                        if (me.mediaTimer) {
                            clearInterval(me.mediaTimer);
                            delete me.mediaTimer;
                        }

                        if (me.media) {
                            me.media.release();
                            delete me.media;
                        }

                        me.fireEvent('stop', me);
                        break;
                }
            }
        );

        media.play();

        if (me.mediaTimer) {
            clearInterval(me.mediaTimer);
            delete me.mediaTimer;
        }

        me.mediaTimer = setInterval(function () {
            media.getCurrentPosition(
                function (position) {
                    if (position > -1)
                        me.fireEvent('timeupdate', me, position);
                },
                function (e) {
                }
            );
        }, 100);
    },

    stop: function () {
        var me = this;

        if (me.mediaTimer) {
            clearInterval(me.mediaTimer);
            delete me.mediaTimer;
        }

        if (me.media) {
            me.media.pause();
            me.media.release();
            delete me.media;
            me.fireEvent('stop', me);
        }
    }
});
