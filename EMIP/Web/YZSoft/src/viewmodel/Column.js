
Ext.define('YZSoft.src.viewmodel.Column', {
    extend: 'Ext.Evented',
    inheritableStatics: {
        checkers: {
            Number: { name: 'Number', type: 'reg', reg: new RegExp('^[+-]{0,1}[0-9]*[.]{0,1}[0-9]*$'), errmsg: '' },
            DecimalDefault: { name: 'DecimalDefault', type: 'reg', reg: new RegExp('^[+-]{0,1}[0-9]*[.]{0,1}[0-9]{0,}$'), errmsg: '' },
            Digit: { name: 'Digit', type: 'reg', reg: new RegExp('^[+-]{0,1}[0-9]*$'), errmsg: '' },
            Plus: { name: 'Plus', type: 'reg', reg: new RegExp('^[+]{0,1}[0-9.]*$'), errmsg: '' },
            Boolean: { name: 'Boolean', type: 'reg', reg: new RegExp('^[01]{0,1}$'), errmsg: '' },
            Len: { name: 'Len', type: 'len', errmsg: '' }
        }
    },

    constructor: function (config) {
        var me = this,
            chks = me.self.checkers,
            len;

        Ext.apply(me, config);
        me.callParent([config]);

        me.checkers = [];
        switch (me.Type) {
            case 'Decimal':
            case 'Double':
            case 'Single':
                me.disableIME = true;
                me.isNumber = true;
                me.checkers.push(chks.Number);
                me.checkers.push(chks.DecimalDefault);
                me.decimalColumn = 2;
                break;
            case 'Int16':
            case 'Int32':
            case 'Int64':
            case 'SByte':
                me.disableIME = true;
                me.isNumber = true;
                me.checkers.push(chks.Number);
                me.checkers.push(chks.Digit);
                break;
            case 'UInt16':
            case 'UInt32':
            case 'UInt64':
            case 'Byte':
                me.disableIME = true;
                me.isNumber = true;
                me.checkers.push(chks.Number);
                me.checkers.push(chks.Digit);
                me.checkers.push(chks.Plus);
                break;
            case 'Boolean':
                me.disableIME = true;
                me.checkers.push(chks.Boolean);
                break;
            case 'DateTime':
                me.disableIME = true;
                break;
            case 'String':
                len = me.Length;
                if (len != -1)
                    me.checkers.push(Ext.apply({
                        len: len
                    }, chks.Len));
                break;
            case 'Binary':
                break;
            default:
                break;
        };
    },

    parseValue: function (v) {
        var me = this,
            o = v;

        switch (me.Type) {
            case 'Decimal':
            case 'Double':
            case 'Single':
                try {
                    v = parseFloat(v);
                    v = isNaN(v) ? 0.0 : v;
                }
                catch (e) {
                    v = 0.0;
                };
                break;
            case 'Int16':
            case 'Int32':
            case 'Int64':
            case 'SByte':
            case 'UInt16':
            case 'UInt32':
            case 'UInt64':
            case 'Byte':
                try {
                    v = parseInt(v);
                    v = isNaN(v) ? 0 : v;
                }
                catch (e) {
                    v = 0;
                };
                break;
            case 'Boolean':
                try {
                    v = parseInt(v);
                    v = isNaN(v) ? 0 : v;
                }
                catch (e) {
                    v = 0;
                };
                break;
            case 'DateTime':
            case 'String':
            case 'Binary':
                v = v || '';
                break;
        }

        return v;
    },

    check: function (str) {
        var me = this,
            str = (str === null || str === undefined) ? '':str,
            checkers = me.checkers;

        for (var i = 0; i < checkers.length; i++) {
            var chk = checkers[i];

            switch (chk.type) {
                case 'reg':
                    if (!chk.reg.test(str))
                        return Ext.String.format(RS.$('All_DataType_Error'), str, me.Type);
                    break;
                case 'len':
                    if ((str || '').toString().length > chk.len)
                        return Ext.String.format(RS.$('All_MaxLen_Error'), Ext.String.ellipsis(str, 30), chk.len);
                    break;
            }
        }
    }
});