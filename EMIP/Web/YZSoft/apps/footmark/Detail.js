
Ext.define('YZSoft.apps.footmark.Detail', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.NotesFootmark'
    ],

    constructor: function (config) {
        var me = this,
            value = config.value,
            rawpos, pos;

        rawpos = {
            lat: value.Rawlat,
            lon: value.Rawlon
        };

        pos = {
            lat: value.Lat,
            lon: value.Lon
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

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack]
        });

        me.cmpMap = Ext.create('Ext.Component', {
            flex: 1,
            cls: 'yz-map-normal',
            html: '<div class="yz-map-wrap"></div>'
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.NotesFootmark',
            grouper: {
                groupFn: function (record) {
                    return Ext.Date.format(record.get('Time'), RS.$('All__DateFmt_MonthDay'));
                }
            },
            data: [value]
        });

        me.list = Ext.create('Ext.dataview.List', {
            store: me.store,
            grouped: true,
            scrollable: false,
            cls: ['yz-list-flatheader', 'yz-list-footmark', 'yz-noscroll-autosize'],
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-footmark'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns">',
                '<div class="yz-column-left">',
                    '<div class="time">{Time:this.renderTime}</div>',
                '</div>',
                '<div class="yz-column-center">',
                    '<div class="address">{[this.renderPosition(values)]}</div>',
                    '<tpl if="Comments">',
                        '<div class="comments">{Comments:this.renderString}</div>',
                    '</tpl>',
                '</div>',
                '<div class="yz-column-right yz-align-vcenter">',
                    '<div class="go"></div>',
                '</div>',
            '</div>', {
                renderString: function (value) {
                    return Ext.util.Format.htmlEncode(value);
                },
                renderPosition: function (value) {
                    return Ext.String.format('{0}, {1}', Ext.util.Format.htmlEncode(value.LocName), Ext.util.Format.htmlEncode(value.LocAddress))
                },
                renderTime: function (value) {
                    return Ext.Date.format(value, 'H:i');
                }
            }),
            disableSelection: true
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                me.titleBar,
                me.cmpMap,
                me.list, {
                    xtype: 'container',
                    cls: 'yz-form',
                    padding: 0,
                    margin: 0,
                    style: 'background-color:red',
                    items: [{
                        xclass: 'YZSoft.src.field.ImageAttachment',
                        titlebar: false,
                        readOnly: true,
                        value: value.Attachments
                    }]
                }
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.map = me.createMap(pos);
        me.mark = me.map.addMark({
            pos: pos
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
    }
});