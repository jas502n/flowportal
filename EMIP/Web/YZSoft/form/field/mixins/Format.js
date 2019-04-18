
Ext.define('YZSoft.form.field.mixins.Format', {

    removeFormat: function (v) {
        var me = this,
            format = me.getFormat();

        if (Ext.isEmpty(v) || !format.isValid)
            return v;

        v = v.replace(format.perfix + '', '');
        v = format.thousandSeparator ? v.replace(/,/g, '') : v;
        return v;
    },

    getFormattedValue: function (v) {
        var me = this,
            format = me.getFormat();

        if (isNaN(v) || Ext.isEmpty(v) || !format.isValid)
            return v;

        v = parseFloat(v);
        var neg = null;

        v = (neg = v < 0) ? v * -1 : v;
        v = format.decimal != -1 ? v.toFixed(format.decimal) : v;

        if (format.thousandSeparator) {
            var v = String(v);
            var ps = v.split('.');
            ps[1] = ps[1] ? ps[1] : null;
            var whole = ps[0];
            var r = /(\d+)(\d{3})/;
            while (r.test(whole))
                whole = whole.replace(r, '$1,$2');

            v = whole + (ps[1] ? '.' + ps[1] : '');
        }

        return Ext.String.format('{0}{1}{2}', (neg ? '-' : ''), (Ext.isEmpty(format.perfix) ? '' : format.perfix + ''), v);
    }
});