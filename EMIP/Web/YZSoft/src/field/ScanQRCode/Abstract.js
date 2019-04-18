
Ext.define('YZSoft.src.field.ScanQRCode.Abstract', {
    extend: 'YZSoft.src.field.AbstractContainerField',
    mixins: [
    // 'YZSoft.form.field.mixins.Base'
    ],
    requires: [
        'YZSoft.src.model.ScanQRCode'
    ],
    config: {
        titlebar: true,
        appendOnly: false
    },
    onAddFileClick: Ext.emptyFn,
    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.ScanQRCode',
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
                '<div class="yz-column-left"><textarea class="x-input-el x-input-text x-form-field" readonly="readonly" style="width:70vw">{FileID}</textarea></div>', {
                    renderString: function (value) {
                        return Ext.util.Format.htmlEncode(value);
                    }

                })
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
    addScanQRCode: function (res) {
        var me = this;
        var FileID = {
            FileID: res
        }
        me.store.removeAll();
        me.store.add(FileID);
        me.onDataChanged();

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
        //        var me = this;
        //        var FileID = {
        //            FileID: "1"
        //        }
        //        me.store.add(FileID);
        //        me.onDataChanged();
        alert("PC不支持");

    }

});