
Ext.define('YZSoft.src.field.GeoCurrentPosition', {
    extend: 'YZSoft.src.field.AbstractContainerField',
    requires: [
        'YZSoft.src.model.POI'
    ],
    config: {
        cls: ['x-field', 'yz-field-currentposition']
    },

    constructor: function (config) {
        var me = this;

        me.titleBar = Ext.create('Ext.TitleBar', {
            cls: 'yz-titlebar-field',
            titleAlign: 'left',
            title: RS.$('All__Locating'),
            layout: {
                type: 'hbox',
                align: 'stretch'
            }
        });

        me.cmpMap = Ext.create('Ext.Component', {
            cls: 'yz-map-current-position',
            flex: 1,
            html: '<div class="yz-map-wrap"></div>'
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.titleBar, me.cmpMap]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (!config.value) {
//            me.on({
//                single: true,
//                painted: function () {
//                    Ext.defer(function () {
                        YZSoft.src.device.Geolocation.getCurrentPosition({
                            enableHighAccuracy: true,
                            timeout: 5000,
                            success: function (pos) {
                                YZSoft.src.device.Geocoder.getAddress({
                                    radius: 500,
                                    pos: pos,
                                    extensions: 'all',
                                    success: function (data) {
                                        var cmp = data.regeocode.addressComponent,
                                id, name, address;

                                        if (data.regeocode.aois.length) {
                                            name = data.regeocode.aois[0].name;
                                            address = cmp.province + cmp.city + cmp.district + cmp.street + cmp.streetNumber;
                                            id = data.regeocode.aois[0].id;
                                        }
                                        else {
                                            name = cmp.street + cmp.streetNumber;
                                            address = cmp.province + cmp.city + cmp.district + cmp.street + cmp.streetNumber;
                                            id = cmp.adcode;
                                        }

                                        me.setValue({
                                            rawlat: pos.lat,
                                            rawlon: pos.lon,
                                            lat: pos.lat,
                                            lon: pos.lon,
                                            id: id,
                                            name: name,
                                            address: address
                                        });

                                        me.fireEvent('positionsucceed', me.getValue());
                                    }
                                });
                            },
                            failure: function () {
                                me.titleBar.setTitle(RS.$('All__Locating_Failed'));
                            }
                        });
//                    },10);
//                }
            //});
        }
    },

    updateValue: function (newValue) {
        var me = this,
            map = me.map,
            center;

        center = {
            lat: newValue.lat,
            lon: newValue.lon
        };

        if (!map) {
            map = me.map = me.createMap(center);
            me.mark = map.addMark({
                pos: center
            });
        }
        else {
            var centerlocal = map.encodePosition(center);
            me.mark.setPosition(centerlocal);
            map.map.setCenter(centerlocal);
        }

        me.titleBar.setTitle(newValue.name || '');
    },

    createMap: function (pos) {
        var me = this,
            map;

        map = Ext.create('YZSoft.src.device.Map', {
            renderTo: me.cmpMap.element.down('.yz-map-wrap'),
            zoom: 16,
            center: pos,
            mapStyle: 'normal',
            features: ['bg', 'road', 'point'],
            resizeEnable: false,
            touchZoom: false,
            scrollWheel: false,
            dragEnable: false,
            isHotspot: false,
            doubleClickZoom: false,
            zoomEnable: false
        });

        map.on({
            scope: me,
            click: 'onMapClick'
        });

        return map;
    },

    onMapClick: function () {
        var me = this;

        var pnl = Ext.create('YZSoft.src.field.GeoCurrentPosition.Adjust', {
            title: RS.$('All__Locating_Adjust'),
            value: me.getValue(),
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function (rec) {
                var value = me.getValue(),
                    gps = rec.data.gps;

                me.setValue({
                    rawlat: value.rawlat,
                    rawlon: value.rawlon,
                    lat: gps.lat,
                    lon: gps.lon,
                    id: rec.getId(),
                    name: rec.data.name,
                    address: rec.data.fulladdress
                });

                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
    }
});