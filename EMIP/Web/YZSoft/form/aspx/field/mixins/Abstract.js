
Ext.define('YZSoft.form.aspx.field.mixins.Abstract', {
    requires: [
        'YZSoft.form.document.Uniform'
    ],

    attrDecode: function (str) {
        if (!str || str.indexOf('&') == -1)
            return str;

        var chs = [],
            count = str.length;

        for (var i = 0; i < count; i++) {
            var ch = str.charAt(i);
            if (ch == '&') {
                var index = str.indexOf('#', i);
                if (index != -1) {
                    var flag = str.substring(i + 1, index - i - 1).toLowerCase();
                    if (flag == 'amp') { chs.push("&"); i += 3; continue; }
                    if (flag == 'cln') { chs.push(":"); i += 3; continue; }
                    if (flag == 'sem') { chs.push(";"); i += 3; continue; }
                    if (flag == 'cma') { chs.push(","); i += 3; continue; }
                    if (flag == 'gt') { chs.push(">"); i += 2; continue; }
                }
            }

            chs.push(ch);
        }

        return chs.join('');
    },

    parseKeyValue: function (str, splitchar, lowercaseName) {
        var str = str || '',
            splitchar = splitchar || '',
            splen = splitchar.length,
            idx = str.indexOf(splitchar),
            rv = {};

        if (idx == -1) {
            rv.key = '';
            rv.value = Ext.String.trim(str || '');
        }
        else {
            rv.key = Ext.String.trim(str.substring(0, idx) || '');
            rv.value = Ext.String.trim(str.substring(idx + splen));
        }

        if (lowercaseName)
            rv.key = rv.key.toLowerCase();

        return rv;
    },

    parseVarName: function (varname) {
        return YZSoft.form.document.Uniform.parseVarName(varname);
    },

    parseFormat: function (format) {
        if (!format)
            return null;

        var me = this,
            rv = {},
            segs = format.split(';') || [];

        Ext.each(segs, function (seg) {
            var kv = me.parseKeyValue(seg, ':', true);
            switch (kv.key) {
                case 'type':
                    var type = (me.attrDecode(kv.value) || '').toLowerCase();
                    rv.type = type == 'currency' ? 'currency' : (type == 'number' ? 'number' : 'string');
                    rv.thousandSeparator = type == 'currency';
                    break;
                case 'pfx':
                    rv.perfix = me.attrDecode(kv.value);
                    break;
                case '':
                    var f = me.attrDecode(kv.value) || '',
                        kv = f.split('.') || [],
                        sbf = kv[0],
                        saf = kv[1];

                    rv.digit = Number(sbf || -1);
                    rv.digit = isNaN(rv.digit) ? -1 : rv.digit;

                    rv.decimal = Number(saf || -1);
                    rv.decimal = isNaN(rv.decimal) ? -1 : rv.decimal;
                    break;
            }
        });

        if (rv.type == 'string') {
            rv.perfix = '';
            rv.thousandSeparator = false;
            rv.decimal = -1;
        }
        else if (rv.type == 'number') {
            rv.perfix = '';
        }
        return rv;
    },

    parseListItems: function (childNodes) {
        var rv;

        rv = {
            options: []
        };

        Ext.each(childNodes, function (item) {
            if (item.ctype == 'asp:listitem') {
                var text = item.attrs.innerhtml,
                    value = 'value' in item.attrs ? item.attrs.value : text;

                rv.options.push({
                    text: text,
                    value: value
                });

                if (item.attrs.selected)
                    rv.value = value;
            }
        });

        return rv;
    },

    parseDataSource: function (sDataSource) {
        if (!sDataSource)
            return null;

        var me = this,
            segs = sDataSource.split(';') || [],
            ds;

        ds = {
            datasource: '',
            filter: null,
            orderBy: null,
            preventCache: false
        };

        for (var i = 0; i < segs.length; i++) {
            var seg = segs[i],
                kv = me.parseKeyValue(seg, ':', true);

            switch (kv.key) {
                case 'datasource':
                    ds.datasource = me.parseDSName(me.attrDecode(kv.value));
                    break;
                case 'tablename':
                    ds.tableName = me.attrDecode(kv.value);
                    break;
                case 'procedurename':
                    ds.procedureName = me.attrDecode(kv.value);
                    break;
                case 'esb':
                    ds.esb = me.attrDecode(kv.value);
                    break;
                case 'filter':
                    ds.filter = me.parseFilter(me.attrDecode(kv.value));
                    break;
                case 'filtercolumn':
                    ds.filterColumn = me.attrDecode(kv.value);
                    break;
                case 'displaycolumn':
                    ds.displayColumn = me.attrDecode(kv.value);
                    break;
                case 'orderby':
                    ds.orderBy = me.attrDecode(kv.value);
                    break;
                case 'preventcache':
                    ds.preventCache = me.parseBool(me.attrDecode(kv.value), false);
                    break;
            }
        }

        return ds;
    },

    parseDSName: function (str) {
        return String.Equ(str, 'default') ? '' : str ? str : '';
    },

    parseFilter: function (str) {
        if (!str)
            return null;

        var me = this,
            segs = str.split(',') || [],
            rv = {};

        Ext.each(segs, function (seg) {
            var kv = me.parseKeyValue(seg, '->'),
                key = me.attrDecode(kv.key),
                vseg = me.attrDecode(kv.value) || '',
                vsegs = vseg.split('|') || [],
                value = vsegs[0],
                op = vsegs[1] || '=';

            if (!key)
                return;

            if (me.isConstant(value)) {
                rv[key] = {
                    op: op,
                    value: me.getConstantValue(value)
                };
            }
            else if (Ext.String.startsWith(value, '@@', true)) {
                rv[key] = {
                    op: op,
                    afterBind: value
                };
            }
            else {
                rv[key] = {
                    op: op,
                    field: value
                };
            }
        });

        return rv;
    },

    parseMap: function (str) {
        if (!str)
            return null;

        var me = this,
            segs = str.split(';') || [],
            rv = {};

        Ext.each(segs, function (seg) {
            var kv = me.parseKeyValue(seg, '->'),
                key = me.attrDecode(kv.key),
                value = me.attrDecode(kv.value);

            if (key)
                rv[key] = value;
        });

        return rv;
    },

    isNumber: function (w) {
        if (Ext.isNumber(w))
            return true;

        if (!Ext.isString(w))
            return false;

        var l = w.length, d;

        for (var i = 0; i < l; i++) {
            if (!d && i >= 15) //超过16位
                return false;

            var c = w.charCodeAt(i);


            if (c == 46) {
                if (d) { return false; } else { d = true; }
            }
            else if (c < 48 || c > 57)
                return false;
        }
        return !(l == 0 || (!d && l != 1 && w.charCodeAt(0) == 48));
    },

    isString: function (w) {
        if (!Ext.isString(w))
            return false;

        w = Ext.String.trim(w);

        var l = w.length;
        if (l < 2)
            return false;

        var s = w.charAt(0),
            e = w.charAt(l - 1);

        return (s == e && (s == '\'' || s == '"'));
    },

    isConstant: function (w) {
        return this.isNumber(w) || this.isString(w);
    },

    getConstantValue: function (w) {
        if (this.isNumber(w))
            return Number(w);

        if (this.isString(w)) {
            w = Ext.String.trim(w);
            return w.substr(1, w.length - 2);
        }

        return null;
    },

    parseBool: function (v, defaultValue) {
        defaultValue = defaultValue === true;

        if (v === null || v === undefined || v === '')
            return defaultValue;

        if (v === false || v === 0 || v === '0')
            return false;

        v = v.toLowerCase();
        if (v === 'false')
            return false;

        return true;
    },

    parseSize: function (v, defaultValue) {
        if (!v)
            return defaultValue;

        var id = '__assist_parse_size__',
            el = document.getElementById(id);

        if (!el) {
            el = document.createElement('div');
            el.id = id;
            el.style.position = 'absolute';
            el.style.top = -100000;
            document.body.appendChild(el);
        }

        el.style.width = v;
        return el.scrollWidth || defaultValue;
    },

    parseDisplayColumns: function (str) {
        var me = this,
            rv = [],
            segs, index, columnName, define, item, vs, i, v;

        if (!str)
            return rv;

        segs = str.split(';') || [];

        Ext.each(segs, function (seg) {
            if (!seg)
                return;

            index = seg.indexOf(':');
            if (index == -1)
                return;

            columnName = Ext.String.trim(seg.substr(0, index));
            define = Ext.String.trim(seg.substr(index + 1));

            if (!columnName)
                return;

            item = {
                columnName: columnName
            };

            vs = define.split(',');
            for (i = 0; i < vs.length; i++) {
                v = Ext.String.trim(vs[i] || '');
                switch (i) {
                    case 0:
                        item.displayName = v;
                        break;
                    case 1:
                        item.width = v;
                        break;
                }
            }

            if (item.width)
                item.width = Ext.Number.from(item.width, 0);

            if (!item.width || item.width < 0)
                delete item.width;

            rv.push(item);
        });

        return rv;
    }
});