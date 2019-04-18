
Ext.define('YZSoft.src.device.Abstract', {
    extend: 'Ext.Evented',

    getDeviceOptions: function (mapName, args) {
        var me = this,
            map = me[mapName],
            opts = {};

        Ext.Object.each(map, function (key, value) {
            if (value === true) {
                if (args.hasOwnProperty(key))
                    opts[key] = args[key];
            }
            else {
                var argsname = value.name || key,
                    convert = value.convert || 'enumConvert',
                    $enum = value.enum,
                    options;

                options = Ext.apply({
                    enum: $enum
                }, value.options);

                if (args.hasOwnProperty(argsname)) {
                    value = args[argsname];
                    opts[key] = me[convert](value, options);
                }
                else {
                    if (value.hasOwnProperty('defaults')) {
                        value = value.defaults;
                        opts[key] = me[convert](value, options);
                    }
                }
            }
        });

        return opts;
    },

    enumConvert: function (value, options) {
        var me = this,
            $enum = options.enum;

        if ($enum) {
            if (Ext.isString($enum))
                $enum = me[$enum];

            return $enum.hasOwnProperty(value) ? $enum[value] : value;
        }

        return value;
    }
});