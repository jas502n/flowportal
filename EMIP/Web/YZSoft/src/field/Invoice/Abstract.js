
Ext.define('YZSoft.src.field.Invoice.Abstract', {
    extend: 'YZSoft.src.field.AbstractContainerField',
    mixins: [
     'YZSoft.form.field.mixins.Base'
    ],
    requires: [
        'YZSoft.src.model.ImageAttachment'
    ],
    config: {
        titlebar: true,
        appendOnly: false
    },
    onAddFileClick: Ext.emptyFn,
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
            scrollable: false,
            disableSelection: true,
            cls: ['yz-noscroll-autosize', 'yz-dataview-imageattachment'],
            itemCls: 'yz-dataview-item-imageattachment',
            itemTpl: [
                '<div class="imageattachment" style="background-image:url({url})"></div>'
            ],
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    e.stopEvent();
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
            title: config.label || '',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [me.btnAddFile, me.list]
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.titlebar]
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

        var FileID = {
            FileID: newValue
        }
        me.store.removeAll();
        me.store.add(FileID);
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
    addInvoice: function (res, res2) {
        var me = this;
        me.store.removeAll();
        me.store.add(res);
        me.onDataChanged();

        var row = me.getRow();
        var datamap = {
            word: 'BX_DETAIL.MC',
            TotalAmount: 'BX_DETAIL.JEHJ',
            TotalTax: 'BX_DETAIL.SSHJ',
            AmountInFiguers: 'BX_DETAIL.JSHJ'
        }
        row.doMap(res2, datamap);
   
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
    onAddFileClick: function () {
        alert("PC不支持");

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
    }

});