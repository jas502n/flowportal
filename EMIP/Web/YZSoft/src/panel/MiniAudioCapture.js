
Ext.define('YZSoft.src.panel.MiniAudioCapture', {
    extend: 'Ext.Panel',
    config: {
        button: null,   //录音的触发按钮，监视其释放事件
        minDuration: 1000,
        errLTMinDuration: RS.$('All_Social_Recording_TooShort'),
        cls: ['yz-panel-miniaudiocapture'],
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        audioExt: Ext.os.is.iOS ? '.wav' : '.amr'
    },

    constructor: function (config) {
        var me = this,
            button = config.button,
            cfg;

        me.icon = Ext.create('Ext.Component', {
            cls: 'yz-panel-miniaudiocapture-icon'
        });

        me.volumn = Ext.create('Ext.Component', {
            cls: 'yz-panel-miniaudiocapture-volumn'
        });

        me.message = Ext.create('Ext.Component', {
            cls: 'yz-panel-miniaudiocapture-text',
            html: RS.$('All_Social_Recording_SwipUpToCancel')
        });

        me.cntMask = Ext.create('Ext.Container', {
            cls: 'yz-panel-miniaudiocapture-mask',
            layout: {
                type: 'vbox',
                pack: 'center',
                align: 'center'
            },
            items: [{
                layout: {
                    type: 'hbox',
                    align: 'end'
                },
                cls: 'yz-panel-miniaudiocapture-mask-body',
                items: [me.icon, me.volumn]
            }, me.message]
        });

        cfg = {
            layout: {
                type: 'vbox',
                pack: 'center',
                align: 'center'
            },
            items: [me.cntMask]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            recordAmplitude: 'onRecordAmplitude'
        });

        //解决弹出请求mic权限问题
        me.element.on({
            tap: function () {
                me.stopRecord(function () {
                });

                if (me.config.cancel)
                    me.config.cancel.call(me.scope);
            }
        });

        if (Ext.browser.is.WebView && Ext.browser.is.Cordova)
            me.startRecord();

        if (button) {
            button.element.on({
                single: true,
                touchend: function () {
                    var mediaRec = me.mediaRec,
                        elapsed = Ext.Date.getElapsed(me.beginTime),
                        minDuration = me.getMinDuration(),
                        uri = me.uri;

                    if (Ext.browser.is.WebView && Ext.browser.is.Cordova) {
                        if (me.cancelWhenRelease) {
                            me.stopRecord(function () {
                            });

                            if (me.config.cancel)
                                me.config.cancel.call(me.scope);
                        }
                        else {
                            if (elapsed < minDuration || !mediaRec) {
                                me.showError(me.getErrLTMinDuration());
                                Ext.defer(function () {
                                    if (me.config.cancel)
                                        me.config.cancel.call(me.scope);
                                }, 500);

                                me.stopRecord(function () {
                                });
                            }
                            else {
                                me.stopRecord(function () {
                                    if (me.config.fn) {
                                        var duration = Math.ceil(Ext.Date.getElapsed(me.beginTime) / 1000);
                                        me.config.fn.call(me.scope, uri, duration);
                                    }
                                });
                            }
                        }
                    }
                    else {
                        if (me.config.cancel)
                            me.config.cancel.call(me.scope);
                    }
                }
            });

            button.element.on({
                dragstart: function (e) {
                    me.startDeltaY = e.deltaY;
                },
                drag: function (e) {
                    var delta = e.deltaY - me.startDeltaY;

                    if (me.cancelWhenRelease) {
                        if (delta > -20) {
                            delete me.cancelWhenRelease;
                            me.removeCls('yz-panel-miniaudiocapture-cancel');
                            me.message.setHtml(RS.$('All_Social_Recording_SwipUpToCancel'));
                        }
                    }
                    else {
                        if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && delta < -20) {
                            me.cancelWhenRelease = true;
                            me.addCls('yz-panel-miniaudiocapture-cancel');
                            me.message.setHtml(RS.$('All_Social_Recording_ReleaseToCancel'));
                        }
                    }
                }
            });
        }
    },

    startRecord: function () {
        var me = this,
            path = Ext.os.is.iOS ? cordova.file.tempDirectory : cordova.file.cacheDirectory,
            mediaRec, uri, filepath;

        me.beginTime = new Date();

        window.resolveLocalFileSystemURL(path, function (entry) {
            if (!me.stoped) {
                uri = entry.toURL() + encodeURIComponent('speak') + me.getAudioExt();
                filepath = uri.substr(7);

                mediaRec = me.mediaRec = new Media(filepath, function () {
                    me.successCallback();
                }, function (e) {
                    me.failCallback(e);
                });

                mediaRec.startRecord();

                me.timer = setInterval(function () {
                    mediaRec.getCurrentAmplitude(function (amp) {
                        me.fireEvent('recordAmplitude', amp);
                    }, function () { });
                }, 50);

                me.uri = uri;
            }
        });
    },

    stopRecord: function (successCallback) {
        var me = this;

        me.successCallbackFn = successCallback;
        me.successCallback = function () {
            if (me.mediaRec) {
                me.mediaRec.release();
                delete me.mediaRec;
            }

            me.successCallbackFn();
        }

        if (me.timer) {
            clearInterval(me.timer);
            delete me.timer;
        }

        if (me.mediaRec) {
            me.mediaRec.stopRecord();

            //ios录音后不能播放声音
            if (Ext.os.is.iOS) {
                me.mediaRec.play();
                me.mediaRec.stop();
            }
        }
        else {
            me.stoped = true;
            successCallback();
        }
    },

    failCallback: function (e) {
        var me = this;

        if (me.mediaRec) {
            me.mediaRec.release();
            delete me.mediaRec;
        }

        me.showError(e.message);

        Ext.defer(function () {
            if (me.config.cancel)
                me.config.cancel.call(me.scope);
        }, 500);
    },

    showError: function (err) {
        var me = this;

        me.addCls('yz-panel-miniaudiocapture-error');
        me.message.setHtml(err);
    },

    onRecordAmplitude: function (amp) {
        var me = this,
            oldCls = this.volumn.getCls(),
            volumn = Math.round(amp * 12) + 1,
            volumnCls = 'yz-panel-miniaudiocapture-volumn-' + volumn,
            newCls = [];

        volumn = volumn > 8 ? 8 : volumn;

        Ext.Array.each(oldCls, function (cls) {
            if (cls.indexOf('yz-panel-miniaudiocapture-volumn-') != 0)
                newCls.push(cls);
        });

        newCls.push(volumnCls);
        me.volumn.setCls(newCls);
    }
});