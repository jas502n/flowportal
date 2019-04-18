
Ext.define('YZSoft.src.util.Cookies', {
    singleton: true,

    set: function (name, value) {
        var argv = arguments,
            argc = arguments.length,
            expires = (argc > 2) ? argv[2] : null,
            path = (argc > 3) ? argv[3] : '/',
            domain = (argc > 4) ? argv[4] : null,
            secure = (argc > 5) ? argv[5] : false;

        document.cookie = name + "=" +
            escape(value) +
            ((expires === null) ? "" : ("; expires=" + expires.toUTCString())) +
            ((path === null) ? "" : ("; path=" + path)) +
            ((domain === null) ? "" : ("; domain=" + domain)) +
            ((secure === true) ? "; secure" : "");
    },

    get: function (name) {
        var parts = document.cookie.split('; '),
            len = parts.length,
            item, i, ret;

        for (i = 0; i < len; ++i) {
            item = parts[i].split('=');
            if (item[0] === name) {
                ret = item[1];
                return ret ? unescape(ret) : '';
            }
        }
        return null;
    },

    clear: function (name, path) {
        if (this.get(name)) {
            path = path || '/';
            document.cookie = name + '=' + '; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=' + path;
        }
    }
});