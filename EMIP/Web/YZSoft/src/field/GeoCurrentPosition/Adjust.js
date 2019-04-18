
Ext.define('YZSoft.src.field.GeoCurrentPosition.Adjust', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.POI'
    ],

    constructor: function (config) {
        var me = this,
            value = config.value,
            rawpos, pos;

        rawpos = {
            lat: value.rawlat,
            lon: value.rawlon
        };

        pos = {
            lat: value.lat,
            lon: value.lon,
            id: value.id
        };

        me.btnBack = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me);
            }
        });

        me.btnSave = Ext.create('Ext.Button', {
            text: RS.$('All__OK'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
            handler: function () {
                var rec = me.list.getSelection()[0];
                if (!rec)
                    return;

                rec.data.gps = me.map.decodePosition(rec.data.location);

                if (me.config.fn)
                    me.config.fn.call(me.scope || me, rec);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnSave]
        });

        me.cmpMap = Ext.create('Ext.Component', {
            flex: 1,
            cls: 'yz-map-normal',
            html: '<div class="yz-map-wrap"></div>'
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.POI',
            sorters: [{ property: 'distance', direction: 'ASC'}]
        });

        me.list = Ext.create('Ext.dataview.List', {
            flex: 1,
            loadingText: '',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-poi'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns">',
                '<div class="yz-column-center">',
                    '<div class="title">{name:this.renderString}</div>',
                    '<div class="desc">{fulladdress:this.renderString}</div>',
                '</div>',
                '<div class="yz-column-right yz-align-vcenter">',
                    '<div class="selection"></div>',
                '</div>',
            '</div>', {
                renderString: function (value) {
                    return Ext.util.Format.htmlEncode(value);
                }
            }),
            store: me.store,
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            disableSelection: false,
            //emptyText: RS.$('TaskList_EmptyText'),
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    e.stopEvent();
                    me.changePOI(record);
                }
            }
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                me.titleBar,
                me.cmpMap,
                me.list
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.map = me.createMap(pos);
        me.mark = me.map.addMark({
            pos: pos
        });

        YZSoft.src.device.Geocoder.getPOIs({
            radius: 1000,
            pos: rawpos,
            success: function (data) {
                me.store.setData(data.pois);

                if (pos.id) {
                    var record = me.store.getById(pos.id);
                    if (record)
                        me.list.select(record);
                }
            }
        });
    },

    createMap: function (pos) {
        var me = this,
            map;

        map = Ext.create('YZSoft.src.device.Map', {
            renderTo: me.cmpMap.element.down('.yz-map-wrap'),
            zoom: 17,
            center: pos,
            mapStyle: 'normal',
            features: ['bg', 'road', 'point', 'building']
        });

        return map;
    },

    changePOI: function (record) {
        var me = this;
        me.mark.setPosition(record.data.location);
        me.map.map.setCenter(record.data.location);
    }
});