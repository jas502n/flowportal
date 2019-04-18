
YZSoft.amapClientKey = 'ecd458f7499e18a34d31f4f82ed70b0d';
YZSoft.amapWebServicesKey = 'a0d17e08c1d72ec3d0bbb353b7df7879';

Ext.define('YZSoft.src.device.AMapAbstract', {
    extend: 'YZSoft.src.device.Abstract',
    keyWebServices: YZSoft.amapWebServicesKey,
    requires: [
        'YZSoft.src.device.GPS'
    ],

    encodePosition: function (pos) {
        var local;

        if (Ext.isObject(pos)) {
            switch (pos.coordsys) {
                default:
                    local = YZSoft.src.device.GPS.gcj_encrypt(pos.lat, pos.lon);
                    break;
            }
            return [local.lon, local.lat];
        }
        else {
            return pos;
        }
    },

    decodePosition: function (pos) {
        var wsg84 = YZSoft.src.device.GPS.gcj_decrypt(pos[1], pos[0]);
        return {
            lat: wsg84.lat,
            lon: wsg84.lon
        };
    },

    relayAMapEvents: function (object, events, prefix) {
        var i, ln, oldName, newName;

        if (typeof prefix == 'undefined') {
            prefix = '';
        }

        if (typeof events == 'string') {
            events = [events];
        }

        if (Ext.isArray(events)) {
            for (i = 0, ln = events.length; i < ln; i++) {
                oldName = events[i];
                newName = prefix + oldName;

                object.on(oldName, this.createEventRelayer(newName), this);
            }
        }

        return this;
    }
});