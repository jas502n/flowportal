Ext.define('YZSoft.src.ux.xml', {
    singleton: true,

    xmlNodeNameEncode: function (value) {
        return !value ? value : String(value).replace(/@/g, '_x0040_').replace(/:/g, '_x003A_').replace('$', '_x0024_');
    },

    xmlValueEncode: function (value) {
        var rv = '';
        for (var i = 0; i < value.length; i++) {
            var ch = value.charAt(i);
            var code = ch.charCodeAt(0);
            var j = '<>"&\''.indexOf(ch);
            if (j != -1) {
                rv += '&' + ['lt', 'gt', 'quot', 'amp', 'apos'][j] + ';';
            }
            else if (code < 32 && code != 10 && code != 13) {
                //rv += '&#' + code + ';'; //忽略非打印字符，非打印字符是不会显示的会引起以后查询时的误解
            }
            else {
                rv += ch;
            }
        }
        return rv;
    },

    pad: function(n) {
        return n < 10 ? '0' + n : n;
    },

    encodeDate: function(o) {
        return o.getFullYear() + '-'
        + this.pad(o.getMonth() + 1) + '-'
        + this.pad(o.getDate()) + 'T'
        + this.pad(o.getHours()) + ':'
        + this.pad(o.getMinutes()) + ':'
        + this.pad(o.getSeconds());
    },

    encode: function (nodename, jsondata, opt, deep) {
        var n = this.xmlNodeNameEncode(nodename),
            d = jsondata,
            hs = this.getHeadSpace(deep);

        if (!Ext.isDefined(d) || d === null) {
            return hs + this.encodeItem(n, '');
        }
        else if (Ext.isString(d)) {
            return hs + this.encodeItem(n, this.xmlValueEncode(d));
        }
        else if (typeof d == 'number') {
            return hs + this.encodeItem(n, d);
        }
        else if (Ext.isBoolean(d)) {
            return hs + this.encodeItem(n, d);
        }
        else if(Ext.isDate(d)){
            return hs + this.encodeItem(n, this.encodeDate(d));
        }
        var vs = Ext.isArray(d) ? jsondata : [d];
        deep = deep || 0;
        var rv = [];
        if (deep == 0)
            rv.push('<?xml version="1.0"?>');
        if (vs.length == 0) {
            rv.push(hs + '<' + n + '>');
            rv.push(hs + '</' + n + '>');
        }
        else {
            for (var i = 0; i < vs.length; i++) {
                var v = vs[i];
                rv.push(hs + '<' + n + '>');

                for (var p in v) {
                    var pv = v[p];
                    rv.push(this.encode(p, pv, null, deep + 1));

                }
                rv.push(hs + '</' + n + '>');
            }
        }
        return rv.join('\r\n');
    },

    getHeadSpace: function (deep) {
        var spc = '';
        for (var i = 0; i < deep * 4; i++)
            spc += ' ';
        return spc;
    },

    encodeItem: function (p, v) {
        return '<' + p + '>' + v + '</' + p + '>';
    }
});