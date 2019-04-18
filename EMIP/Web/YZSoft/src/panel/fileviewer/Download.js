
Ext.define('YZSoft.src.panel.fileviewer.Download', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.ux.File',
        'YZSoft.src.device.File'
    ],
    config: {
        url: null,
        fileName: null,
        ext: null,
        size: null,
        cls: 'yz-container-fileviewer-download',
        style: 'background-color:#f3f5f6;',
        scrollable: false
    },

    constructor: function (config) {
        var me = this,
            url = config.url,
            fileName = config.fileName,
            ext = config.ext,
            size = config.size;

        me.cmpImage = Ext.create('Ext.Component', {
            margin: '0 0 30 0',
            tpl: '<div class="type" style="background-image:url({icon})"></div>',
            data: {
                icon: YZSoft.src.ux.File.getIconByExt(ext, 276)
            }
        });

        me.cmpFileName = Ext.create('Ext.Component', {
            tpl: '<div class="filename">{fileName}</div>',
            data: {
                fileName: fileName
            }
        });

        me.cmpSize = Ext.create('Ext.Component', {
            tpl: '<div class="size">{size}</div>',
            data: {
                size: Ext.isNumber(size) ? size.toFileSize(false) : ''
            }
        });

        me.btnDownload = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-file-download'],
            padding: '13 10',
            text: RS.$('All__File_Download'),
            scope: me,
            handler: 'onDownloadClick'
        });

        me.cmpProgress = Ext.create('Ext.Component', {
            width: '80%',
            margin: '30 0 6 0',
            style: 'background-color:#fff;',
            tpl: '<div class="progress" style="height:3px;background-color:#25a6d8;width:{per}%"></div>',
            data: {
                per: 0
            }
        });

        me.cmpProgressText = Ext.create('Ext.Component', {
            tpl: '<div class="progressText">{cur}/{total}</div>',
            data: {
                cur: 0,
                total: Ext.isNumber(size) ? size.toFileSize(false) : ''
            }
        });

        me.btnOpen = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-file-open'],
            padding: '13 10',
            text: RS.$('All__File_Preview'),
            scope: me,
            handler: 'onOpenClick'
        });

        me.btnOpenWith = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-file-openwith'],
            padding: '13 10',
            text: RS.$('All__File_OpenWith'),
            scope: me,
            handler: 'onOpenWithClick'
        });

        me.cmpPrompt = Ext.create('Ext.Component', {
            tpl: '<div class="prompt">{text}</div>',
            data: {
                text: RS.$('All__File_OpenPrompt')
            }
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
                flex: 2,
                layout: {
                    type: 'vbox',
                    pack: 'end',
                    align: 'center'
                },
                items: [me.cmpImage]
            }, {
                xtype: 'container',
                flex: 3,
                layout: {
                    type: 'vbox',
                    pack: 'start',
                    align: 'center'
                },
                items: [me.cmpFileName, me.cmpSize, me.btnDownload, me.cmpProgress, me.cmpProgressText, me.btnOpen, me.btnOpenWith, me.cmpPrompt]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.setModel('init');

        me.on({
            scope: me,
            openWithClick: 'onOpenWithClick'
        });
    },

    setModel: function (model) {
        var me = this,
            all = [me.cmpSize, me.btnDownload, me.cmpProgress, me.cmpProgressText, me.btnOpen, me.btnOpenWith, me.cmpPrompt],
            show = [];

        switch (model) {
            case 'init':
                show = [me.cmpSize, me.btnDownload];
                break;
            case 'downloading':
                show = [me.cmpProgress, me.cmpProgressText];
                break;
            case 'open':
                show = [me.cmpSize, me.btnOpen];
                break;
            case 'openwith':
                show = [me.cmpSize, me.btnOpenWith, me.cmpPrompt];
                break;
        }

        Ext.each(all, function (item) {
            if (Ext.Array.contains(show, item))
                item.show();
            else
                item.hide()
        });
    },

    onDownloadClick: function () {
        var me = this,
            url = me.getUrl(),
            fileName = me.getFileName();

        me.setModel('downloading');

        YZSoft.src.device.File.download({
            url: url,
            root: 'cache',
            folder: '.emip',
            fileName: fileName,
            progress: function (progress) {
                me.updateProgress(progress);
            },
            success: function (entry) {
                me.fileEntry = entry;

                if (me.canPreview(me.getExt()))
                    me.preview(entry);
                else
                    me.setModel('openwith');
            },
            failure: function (e) {
                alert(e.exception);
            }
        });
    },

    canPreview: function (ext) {
        var extLower = (ext || '').toLowerCase();

        if (Ext.os.is.iOS)
            return Ext.Array.contains(['.xls', '.xlsx', '.doc', '.docx', '.ppt', '.pptx', '.pdf', '.rtf'], extLower);

        return false;
    },

    preview: function (entry) {
        var me = this;

        me.setModel('open');

        if (Ext.os.is.iOS) {
            window.open(entry.toURL(), '_blank', 'openinbutton=yes,toolbar=yes,closebuttoncaption=<,location=no,enableViewportScale=yes,toolbarposition=top');
        }
    },

    onOpenClick: function () {
        var me = this,
            entry = me.fileEntry;

        if (!entry)
            return;

        me.preview(entry);
    },

    onOpenWithClick: function () {
        var me = this,
            entry = me.fileEntry;

        if (!entry)
            return;


        if (Ext.os.is.iOS) {
            window.open(entry.toURL(), '_blank', 'openinbutton=yes,toolbar=yes,closebuttoncaption=<,location=no,enableViewportScale=yes,toolbarposition=top');

            //var url = entry.toURL();

            //url = url.substr(7);
            //alert(url);
            //cordova.plugins.fileOpener2.open(
            //    entry.nativeURL, mime, {
            //        error: function (e) {
            //            Ext.Msg.alert('', e.message);
            //        }
            //    }
            //);
        }
        else {
            entry.file(function (data) {
                var mime = data.type;

                cordova.plugins.fileOpener2.open(
                    entry.toInternalURL(), mime, {
                        error: function (e) {
                            Ext.Msg.alert('', e.message);
                        }
                    }
                );
            });

            //window.fileOpener.open(entry.toURL(), function () {
            //}, function (e) {
            //    Ext.Msg.alert('',e.message);
            //});
        }
    },

    updateProgress: function (progress) {
        var me = this,
            elprogress = me.cmpProgress.progressEl = me.cmpProgress.progressEl || me.cmpProgress.element.down('.progress'),
            eltxt = me.cmpProgressText.progressEl = me.cmpProgressText.progressEl || me.cmpProgressText.element.down('.progressText');

        if (progress.lengthComputable) {
            elprogress.setWidth((progress.loaded * 100 / progress.total) + '%');
            eltxt.setText(progress.loaded.toFileSize(false) + '/' + progress.total.toFileSize(false));
        }
    },

    destroy: function () {
        var me = this;

        me.callParent(arguments);
    }
}); 
