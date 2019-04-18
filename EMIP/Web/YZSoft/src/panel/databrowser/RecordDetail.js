
Ext.define('YZSoft.src.panel.databrowser.RecordDetail', {
    extend: 'Ext.Container',
    requires: [
    ],
    config: {
        displayColumns: null,
        record: null,
        selected: false,
        style: 'background-color:#fff;'
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            displayColumns = config.displayColumns,
            record = config.record,
            selected = config.selected,
            items = [],
            cfg, item;

        me.btnBack = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me);
            }
        });

        me.btnOK = Ext.create('Ext.Button', {
            text: selected ? RS.$('All_Cancel_Selection') :RS.$('All__Select'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
            handler: function () {
                if (me.config.fn)
                    me.config.fn.call(me.scope, me.getRecord(), me);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnOK]
        });

        Ext.each(displayColumns, function (displayColumn) {
            item = Ext.create('YZSoft.src.panel.databrowser.RecordField', {
                column: displayColumn,
                value: record.data[displayColumn.columnName],
                padding:'10 0'
            });
            items.push(item);
        });

        me.cntItems = Ext.create('Ext.Container', {
            layout: {
                type: 'vbox',
                align:'stretch'
            },
            padding: '0 10',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            items: items
        });

        cfg = {
            layout: 'fit',
            items: [me.titleBar, me.cntItems]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});