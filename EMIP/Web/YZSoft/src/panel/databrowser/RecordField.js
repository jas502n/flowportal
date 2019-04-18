
Ext.define('YZSoft.src.panel.databrowser.RecordField', {
    extend: 'Ext.Container',
    requires: [
    ],
    config: {
        param: null
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            column = config.column,
            value = config.value,
            cfg;

        me.label = Ext.create('Ext.Component', {
            cls:'yz-recorddata-label',
            html: column.displayName || column.columnName
        });

        me.cmpValue = Ext.create('Ext.Component', {
            cls: 'yz-recorddata-value',
            html: me.renderValue(column.dataType, value)
        });

        cfg = {
            layout: {
                type: 'vbox',
                align:'stretch'
            },
            items: [me.label,me.cmpValue]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    renderValue: function (dataType, value) {
        var me = this,
            emptyText = '<div class="yz-recorddata-empty">' + RS.$('All__Empty') + '</div>';

        switch (dataType.name) {
            case 'Decimal':
            case 'Double':
            case 'Single':
            case 'Int16':
            case 'Int32':
            case 'Int64':
            case 'UInt16':
            case 'UInt32':
            case 'UInt64':
            case 'SByte':
            case 'Byte':
                return Ext.isEmpty(value) ? emptyText : value;
            case 'DateTime':
                if (Ext.isDate(value))
                    value = Ext.Date.format(value, 'Y-m-d H:i:s');

                return value || emptyText;
            case 'Char':
            case 'String':
                return value || emptyText;
            case 'Boolean':
                return value || emptyText;
            default:
                return Ext.isEmpty(value) ? emptyText : value;
        }
    },

    onok: function (recs) {
        var me = this,
            steps = [];

        Ext.each(recs, function (rec) {
            steps.push(rec.data);
        });

        if (me.config.fn)
            me.config.fn.call(me.scope, steps, me);
    }
});