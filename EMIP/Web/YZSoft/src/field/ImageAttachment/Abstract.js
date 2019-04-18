
Ext.define('YZSoft.src.field.ImageAttachment.Abstract', {
    extend: 'YZSoft.src.field.AbstractContainerField',
    mixins: [
        'YZSoft.form.field.mixins.Base'
    ],
    requires: [
        'YZSoft.src.model.ImageAttachment',
        'YZSoft.src.device.File'
    ],
    config: {
        titlebar: true,
        single: false
    },
    onCaptureClick: Ext.emptyFn,
    onPickImageClick: Ext.emptyFn,

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.ImageAttachment',
            data: [],
            listeners: {
                scope: me,
                addrecords: 'onDataChanged',
                removerecords: 'onDataChanged'
            }
        });

        me.list = Ext.create('Ext.dataview.DataView', {
            store: me.store,
            scrollable: {
                direction: 'horizontal',
                indicators: false
            },
            inline: {
                wrap: false
            },
            cls: ['yz-noscroll-autosize', 'yz-dataview-imageattachment'],
            itemCls: 'yz-dataview-item-imageattachment',
            itemTpl: [
                '<div class="imageattachment" style="background-image:url({url})">',
                    '<div class="delete"></div>',
                '</div>'
            ],
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

        me.btnAddPic = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-fieldtitlebar', 'yz-button-upload'],
            iconCls: 'yz-glyph yz-glyph-e92b',
            iconAlign: 'right',
            align: 'right',
            scope: me,
            handler: 'onAddPicClick'
        });

        me.titlebar = Ext.create('Ext.TitleBar', {
            xtype: 'titlebar',
            cls: 'yz-titlebar-field',
            titleAlign: 'left',
            title: config.label || RS.$('All__ImageAttachment_Title'),
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [me.btnAddPic]
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.titlebar, {
                xtype: 'container',
                cls: 'yz-field-select-list-wrap',
                scrollable: {
                    direction: 'horizontal',
                    directionLock: true,
                    indicators: false
                },
                layout: 'fit',
                items: [me.list]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.addCls('yz-field-imageattachment');
    },

    updateTitlebar: function (newValue) {
        this.titlebar[newValue ? 'show' : 'hide']();
    },

    updateValue: function (newValue) {
        if (newValue == this.getValue())
            return;

        var me = this,
            data = [],
            newValue = (newValue || '').split(',');

        Ext.each(newValue, function (value) {
            if (value) {
                data.push({
                    FileID: value
                });
            }
        });

        me.store.setData(data);
        me.onDataChanged();
    },

    addAttachment: function (attachmentInfo) {
        var me = this;

        me.store.add({
            FileID: attachmentInfo.FileID
        });
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
            emptycls = 'yz-field-imageattachment-empty',
            count = me.store.getCount();

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
                message: RS.$('All__ImageAttachment_Delete_Message'),
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

    onAddPicClick: function () {
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

    addPic: function (uri) {
        var me = this,
            fileName = uri.substr(uri.lastIndexOf('/') + 1),
            scroller = me.list.getScrollable().getScroller(),
            rec;

        YZSoft.src.device.File.readAsDataURL(uri, function (data, result) {
            if (me.getSingle())
                me.store.removeAll();

            rec = me.store.add({
                FileID: Ext.id(null, 'img'),
                url: data
            })[0];
            rec.newfile = true;

            scroller.scrollToEnd(false);

            var item = me.list.getElement(rec),
                maskel = item,
                mask;

            item.addCls('uploading');

            mask = Ext.create('YZSoft.src.loadmask.CircleProgressMask', {
                borderWidth: 3,
                circleWidth: 50,
                circleHeight: 50,
                renderTo: maskel
            });
            mask.setProgress(0);

            rec.fs = Ext.defer(function () {
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
                            me.onDataChanged();
                        }, 200);
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
            }, 100);
        });
    },

    preview: function (rec) {
        var me = this,
            fileid = rec.data.FileID,
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

    destroy: function () {
        var me = this,
            previews = me.imagePreviews = me.imagePreviews || {};

        Ext.Object.each(previews, function (key, pnl) {
            if (pnl)
                pnl.destroy();
        });

        delete previews;
        me.callParent(arguments);
    }
});
