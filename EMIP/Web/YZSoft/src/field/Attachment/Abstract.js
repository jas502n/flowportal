
Ext.define('YZSoft.src.field.Attachment.Abstract', {
    extend: 'YZSoft.src.field.AbstractContainerField',
    mixins: [
       // 'YZSoft.form.field.mixins.Base'
    ],
    requires: [
        'YZSoft.src.model.Attachment',
        'YZSoft.src.ux.File',
        'YZSoft.src.device.File'
    ],
    config: {
        titlebar: true,
        appendOnly: false
    },
    onCaptureClick: Ext.emptyFn,
    onPickImageClick: Ext.emptyFn,

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.Attachment',
            data: [],
            listeners: {
                scope: me,
                addrecords: 'onDataChanged',
                removerecords: 'onDataChanged'
            }
        });

        me.list = Ext.create('Ext.dataview.DataView', {
            store: me.store,
            scrollable: false,
            disableSelection: true,
            cls: ['yz-noscroll-autosize', 'yz-dataview-attachment'],
            itemCls: 'yz-list-item-border yz-dataview-item-attachment',
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns {newadded:this.getNewAddedCls}">',
                '<div class="yz-column-left">',
                    '<div class="type" style="background-image:url({Ext:this.getIconByType})"></div>',
                '</div>',
                '<div class="yz-column-center">',
                    '<div class="name">{Name:this.renderString}</div>',
                    '<div class="size">{Size:this.renderFileSize}</div>',
                '</div>',
                '<div class="yz-column-right yz-align-vcenter">',
                    '<div class="delete"></div>',
                '</div>',
            '</div>', {
                getNewAddedCls: function (value) {
                    return value ? 'yz-attachment-newadded' : 'yz-attachment-org';
                },
                renderString: function (value) {
                    return Ext.util.Format.htmlEncode(value);
                },
                renderFileSize: function (value) {
                    return value.toFileSize();
                },
                getIconByType: function (ext) {
                    return YZSoft.src.ux.File.getIconByExt(ext, 89);
                }
            }),
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    e.stopEvent();

                    var del = e.getTarget('.delete');
                    if (del) {
                        me.onDeleteClick(record, target);
                        return;
                    }

                    me.preview(record);
                }
            }
        });

        me.btnAddFile = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-fieldtitlebar', 'yz-button-upload'],
            iconCls: 'yz-glyph yz-glyph-e941',
            iconAlign: 'right',
            align: 'right',
            scope: me,
            handler: 'onAddFileClick'
        });

        me.titlebar = Ext.create('Ext.TitleBar', {
            xtype: 'titlebar',
            cls: 'yz-titlebar-field',
            titleAlign: 'left',
            padding: '0 0 0 15',
            title: config.label || RS.$('All__Attachments'),
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [me.btnAddFile]
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.titlebar, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.addCls(['yz-field-attachment', 'x-field-nopadding']);
    },

    updateTitlebar: function (newValue) {
        this.titlebar[newValue ? 'show' : 'hide']();
    },

    updateAppendOnly: function (newValue) {
        this[newValue ? 'addCls' : 'removeCls']('yz-field-appendonly');
    },

    updateValue: function (newValue) {
        var me = this,
            data = [];

        if (newValue == me.getValue())
            return;

        if (newValue) {
            YZSoft.Ajax.request({
                async: false,
                url: YZSoft.$url('YZSoft.Services.REST/Attachment/Assist.ashx'),
                params: {
                    Method: 'GetAttachmentsInfo',
                    fileids: newValue
                },
                success: function (action) {
                    data = action.result;
                }
            });
        }

        me.store.setData(data);
        me.onDataChanged();
    },

    addAttachment: function (attachmentInfo) {
        var me = this;

        me.store.add(attachmentInfo);
        me.onDataChanged();
    },

    getValue: function () {
        var me = this,
            rv = [];

        me.store.each(function (record) {
            rv.push(record.data.FileID);
        });

        return rv.join(',');
    },

    onDataChanged: function () {
        var me = this,
            emptycls = 'yz-field-attachment-empty',
            count = 1 || me.store.getCount();

        if (count)
            me.removeCls(emptycls);
        else
            me.addCls(emptycls);

        me.fireEvent('change');
    },

    onDeleteClick: function (rec) {
        var me = this,
            item = me.list.getElement(rec);

        if (rec.newfile) {
            if (rec.fs) {
                rec.fs.abort();
                rec.fs = null;
            }

            me.store.remove(rec);
        }
        else {
            Ext.Msg.show({
                title: RS.$('All__Delete'),
                message: rec.data.Name,
                hideOnMaskTap: true,
                buttons: [{
                    text: RS.$('All__Delete'),
                    flex: 1,
                    cls: 'yz-button-flat yz-button-dlg-normal',
                    itemId: 'ok'
                }, { xtype: 'spacer', width: 12 }, {
                    text: RS.$('All__WrongClick'),
                    flex: 1,
                    cls: 'yz-button-flat yz-button-dlg-default',
                    itemId: 'cancel'
                }],
                fn: function (btn) {
                    if (btn != 'ok')
                        return;

                    me.store.remove(rec);
                }
            });
        }
    },

    onAddFileClick: function () {
        var me = this,
            sheet;

        sheet = Ext.create('Ext.ActionSheet', {
            hideOnMaskTap: true,
            cls: 'yz-sheet-action',
            padding: 0,
            items: [{
                text: RS.$('All__CapturePhoto'),
                cls: 'yz-button-flat yz-button-sheet-action',
                handler: function () {
                    sheet.hide();
                    me.onCaptureClick();
                }
            }, {
                text: RS.$('All__PickImage'),
                cls: 'yz-button-flat yz-button-sheet-action',
                handler: function () {
                    sheet.hide();
                    me.onPickImageClick();
                }
            }, {
                text: RS.$('All__Cancel'),
                cls: 'yz-button-flat yz-button-sheet-action',
                margin: '7 0 0 0',
                handler: function () {
                    sheet.hide();
                }
            }],
            listeners: {
                order: 'after',
                hide: function () {
                    this.destroy();
                }
            }
        });

        Ext.Viewport.add(sheet);
        sheet.show();
    },

    addFile: function (uri) {
        var me = this,
            fileName = uri.substr(uri.lastIndexOf('/') + 1),
            ext = YZSoft.src.ux.File.getExtension(fileName),
            rec, fs;

        window.resolveLocalFileSystemURL(uri, function (entry) {
            entry.getMetadata(function (metadata) {
                rec = me.store.add({
                    FileID: Ext.id(null, 'file'),
                    Ext: ext,
                    Name: fileName,
                    Size: metadata.size
                })[0];
                rec.newfile = true;

                var item = me.list.getElement(rec),
                    maskel = item.down('.type'),
                    mask;

                item.addCls('uploading');

                mask = Ext.create('YZSoft.src.loadmask.CircleProgressMask', {
                    borderWidth: 3,
                    circleWidth: 30,
                    circleHeight: 30,
                    renderTo: maskel
                });
                mask.setProgress(0);

                rec.fs = YZSoft.src.device.File.upload({
                    file: uri,
                    fileName: fileName,
                    params: {
                        method: 'SaveAttachment'
                    },
                    success: function (action) {
                        rec.fs = null;
                        Ext.defer(function () {
                            mask.destroy();
                            item.removeCls('uploading');
                            rec.set('FileID', action.result.fileid);
                            rec.set('newadded', true);
                            Ext.apply(rec.data, action.result.attachment);
                            rec.commit();
                            me.onDataChanged();
                        }, 100);
                        mask.setProgress(100);
                    },
                    failure: function () {
                        rec.fs = null;
                        mask.destroy();
                        me.store.remove(rec);
                    },
                    progress: function (progress) {
                        mask.setProgress(progress.loaded * 100 / progress.total);
                    }
                });
            }, function (error) { });
        });
    },

    preview: function (rec) {
        var me = this,
            item = me.list.getElement(rec),
            fileid = rec.data.FileID,
            url;

        if (!fileid || item.hasCls('uploading'))
            return;

        YZSoft.src.ux.File.open({
            fileid: fileid,
            cmp: me
        });
    }
});