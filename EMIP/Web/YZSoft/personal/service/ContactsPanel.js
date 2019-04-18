
Ext.define('YZSoft.personal.service.ContactsPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.ServiceContacts',
        'YZSoft.src.device.Device'
    ],
    config: {
        style: 'background-color:#f0f3f5;',
        layout: 'fit'
    },

    constructor: function (config) {
        var me = this,
            cfg;

        config = config || {};

        me.btnBack = Ext.create('Ext.Button', {
            text: RS.$('All__Back'),
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

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.ServiceContacts',
            autoLoad: false,
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/ServiceCenter.ashx'),
                extraParams: {
                    method: 'GetAllContacts',
                    product: 'BPM'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children',
                    totalProperty: 'total'
                }
            }
        });

        me.list = Ext.create('Ext.dataview.List', {
            loadingText: '',
            store: me.store,
            disableSelection: true,
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-servicecontacts'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns">',
                '<div class="yz-column-left">',
                    '<div class="icon"></div>',
                '</div>',
                '<div class="yz-column-center">',
                    '<div class="name">{ServiceCenter:this.renderString}</div>',
                    '<div class="tel">{Tel:this.renderString}</div>',
                '</div>',
                '<div class="yz-column-right yz-align-vcenter">',
                    '<div class="more"></div>',
                '</div>',
            '</div>', {
                renderString: function (value) {
                    return Ext.util.Format.htmlEncode(value);
                }
            }),
            //emptyText: RS.$('TaskList_EmptyText'),
            listeners: {
                scope: me,
                itemtap: 'onItemTap'
            }
        });

        me.list.on({
            single: true,
            painted: function () {
                me.store.load();
            }
        });

        cfg = {
            defaults: {
            },
            items: [me.titleBar, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onItemTap: function (list, index, target, record, e, eOpts) {
        e.stopEvent();

        YZSoft.src.device.Device.call(record.data.Tel);
    }
});
