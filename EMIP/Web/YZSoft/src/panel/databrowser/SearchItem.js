
Ext.define('YZSoft.src.panel.databrowser.SearchItem', {
    extend: 'Ext.Container',
    requires: [
    ],
    config: {
        param: null
    },
    isSearchItem: true,

    constructor: function (config) {
        var me = this,
            config = config || {},
            param = config.param,
            supportOp = param.supportOp,
            items = [],
            cfg;

        param.displayName = param.displayName || param.name;
        param.dataType = param.dataType || {};
        param.dataType.name = param.dataType.name || 'String';
        param.dataType.fullName = param.dataType.fullName || 'System.String';

        me.label1 = Ext.create('Ext.Component', {
            cls:'yz-databrowser-filter-label',
            html: param.displayName
        });

        items.push(me.label1);

        switch (param.dataType.name) {
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
                if (supportOp) {
                    me.input1 = me.createField('Ext.field.Number', {
                        flex: 1,
                        op: '>=',
                        placeHolder: RS.$('All__From')
                    });

                    me.input2 = me.createField('Ext.field.Number', {
                        flex: 1,
                        op: '<=',
                        placeHolder: RS.$('All__To')
                    });

                    items.push(me.createHBox(me.input1, me.input2));
                }
                else {
                    me.input1 = me.createField('Ext.field.Number', {
                    });

                    items.push(me.input1);
                }

                break;
            case 'DateTime':
                if (supportOp) {

                    me.input1 = me.createField('YZSoft.src.field.DatePicker', {
                        flex: 1,
                        op: '>=',
                        placeHolder: RS.$('All__From')
                    });

                    me.input2 = me.createField('YZSoft.src.field.DatePicker', {
                        flex: 1,
                        op: '<=',
                        placeHolder: RS.$('All__To')
                    });

                    items.push(me.createHBox(me.input1, me.input2));
                }
                else {
                    me.input1 = me.createField('YZSoft.src.field.DatePicker', {
                    });

                    items.push(me.input1);
                }

                break;
            case 'Char':
            case 'String':
                me.input1 = me.createField('Ext.field.Text', {
                    op: supportOp ? 'like':'='
                });

                items.push(me.input1);
                break;
            case 'Boolean':
                me.input1 = Ext.create('Ext.SegmentedButton', {
                    defaults: {
                        cls: ['yz-button-check', 'yz-border-width-1'],
                        minHeight: 28,
                        minWidth:120
                    },
                    items: [{
                        text: RS.$('YZStrings.All_Yes'),
                        value: 1
                    }, {
                        text: RS.$('YZStrings.All_No'),
                        value: 0
                    }]
                });

                items.push(me.input1);
                break;
        }

        cfg = {
            layout: {
                type: 'vbox',
                align:'stretch'
            },
            items: items
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    createField: function (xclass, config) {
        Ext.apply(config, {
            cls: 'yz-field-box-solid',
            autoComplete: false
        });

        return Ext.create(xclass, config);
    },

    createHBox: function (input1,input2) {
        return Ext.create('Ext.Container', {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [input1, {
                xtype: 'component',
                cls: 'yz-databrowser-field-sp',
                html: '~',
            }, input2]
        });
    },

    reset: function () {
        var me = this;

        Ext.each([me.input1, me.input2], function (input) {
            input && input.setValue(null);
        });
    },

    getParams: function () {
        var me = this,
            param = me.getParam(),
            rv = [], value, param1;

        Ext.each([me.input1, me.input2], function (input) {
            if (!input)
                return;

            value = input.getValue();


            if (!Ext.isEmpty(value)) {
                param1 = {
                    name: param.name,
                    dataType: param.dataType,
                    op: input.config.op || '=',
                    value: value
                }
                rv.push(param1);
            }
        });

        return rv;
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