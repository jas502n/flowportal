
Ext.define('YZSoft.src.panel.SelGroup', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.Group'
    ],
    config: {
        store: null,
        style: 'background-color:#fff;'
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            singleSelection = 'singleSelection' in config ? config.singleSelection : me.config.singleSelection,
            params = config.params;

        me.btnBack = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me, me);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack]
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.Group',
            autoLoad: false,
            loadDelay: true,
            clearOnPageLoad: true,
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                extraParams: {
                    method: 'GetUserGroupsAndMemberCount'
                }
            }
        });

        me.list = Ext.create('Ext.dataview.List', {
            loadingText: '',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            store: me.store,
            plugins: [{
                xclass: 'YZSoft.src.plugin.PullRefresh'
            }],
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            disableSelection: true,
            emptyText: '',
            cls: ['yz-list-flatheader', 'yz-list-country'],
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-selgroup'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns  yz-align-vcenter">',
                '<div class="yz-column-left yz-align-vcenter">',
                    '<div class="image" style="background-image:url({imageurl})"></div>',
                '</div>',
                '<div class="yz-column-center">',
                    '<div class="title">{Name:this.renderString}<span class="membercount">({MemberCount})</span></div>',
                '</div>',
            '</div>', {
                renderString: function (value) {
                    return Ext.util.Format.htmlEncode(value);
                }
            })
        });

        me.list.on({
            itemtap: function (list, index, target, record, e, eOpts) {
                e.stopEvent();
                me.onok(record);
            }
        });

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.list.on({
            single: true,
            painted: function () {
                me.store.load();
            }
        });
    },

    onok: function (rec) {
        var me = this;

        if (me.config.fn)
            me.config.fn.call(me.scope, rec.data, me);
    }
});