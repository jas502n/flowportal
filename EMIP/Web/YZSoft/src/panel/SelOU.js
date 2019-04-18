
Ext.define('YZSoft.src.panel.SelOU', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.OU'
    ],
    config: {
        style: 'background-color:#fff;'
    },

    constructor: function (config) {
        var me = this,
            config = config || {};

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

        me.cmpTitle = Ext.create('Ext.Component', {
            docked: 'top',
            cls: 'yz-cmp-ou-navigator',
            tpl: [
                '<div class="">',
                    '<tpl if="values.parents.length == 0">',
                        '<span class="ou">',
                            RS.$('All__Org'),
                        '</span>',
                    '<tpl else>',
                        '<tpl for="parents">',
                            '<tpl if="this.isRender(xcount, xindex)">',
                                '<span class="ou {[xindex < xcount ? "parent" : "cur"]}" index="{[xindex]}">{Name:this.renderString}<span class="sp">&gt;</span></span>',
                            '</tpl>',
                        '</tpl>',
                    '</tpl>',
                '</div>', {
                    isRender: function (count, index) {
                        return count - index < 4;
                    },
                    renderString: function (value) {
                        return Ext.util.Format.htmlEncode(value);;
                    }
                }
            ],
            data: {
                parents: []
            },
            listeners: {
                painted: function () {
                    me.cmpTitle.element.on({
                        singletap: function (e, t, eOpts) {
                            var elParent = Ext.get(e.getTarget('.parent')),
                                parents = me.cmpTitle.getData().parents,
                                index = elParent && Number(elParent.getAttribute('index')) - 1;

                            if (elParent) {
                                var params = me.store.getProxy().getExtraParams();

                                Ext.apply(params, {
                                    path: parents[index].FullName
                                });

                                me.store.load({
                                    loadMask: false,
                                    params: {
                                        start: 0
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.OU',
            loadDelay: 250,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Org.ashx'),
                extraParams: {
                    method: 'GetChildOUs',
                    path: ''
                },
                reader: {
                    rootProperty: 'children'
                }
            }
        });

        me.store.on({
            load: function (view, records, successful, operation, eOpts) {
                if (!successful)
                    return;

                var rawData = me.store.getProxy().getReader().rawData;
                me.cmpTitle.setData({
                    parents: rawData.parents
                });
            }
        });

        me.list = Ext.create('Ext.dataview.List', {
            store: me.store,
            loadingText: false,
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            disableSelection: true,
            emptyText: '',
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-full', 'yz-list-item-ou'],
            selectedCls: 'yz-item-selected',
            itemTpl: Ext.create('Ext.XTemplate',
                '<div class="yz-layout-columns">',
                    '<div class="yz-column-center yz-align-vcenter">',
                        '<div class="name">{Name:this.renderString}</div>',
                    '</div>',
                    '<tpl if="!values.isLeaf">',
                        '<div class="yz-column-right yz-align-vcenter">',
                            '<div class="yz-list-item-more"></div>',
                        '</div>',
                    '</tpl>',
                '</div>',{
                    renderString: function (value) {
                        return Ext.util.Format.htmlEncode(value);;
                    }
                }
            ),
            doRefresh: function () {
            },
            listeners: {
                scope: me,
                select: 'onItemSelect',
                deselect: 'onItemDeselect',
                itemtap: function (list, index, target, record, e, eOpts) {
                    var more = e.getTarget('.yz-list-item-more');

                    if (more) {
                        var params = me.store.getProxy().getExtraParams();

                        Ext.apply(params, {
                            path: record.data.FullName
                        });

                        me.store.load({
                            mask: {
                                message:RS.$('All__Loading')
                            },
                            params: {
                                start: 0
                            }
                        });
                    }
                    else {
                        e.stopEvent();
                        me.onok(record);
                    }
                }
            }
        });

        me.list.on({
            single: true,
            painted: function () {
                me.store.load({
                    delay: false
                });
            }
        });

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.cmpTitle, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onok: function (rec) {
        var me = this,
            ou = Ext.apply(rec.data, rec.data.ExtAttrs);

        if (me.config.fn)
            me.config.fn.call(me.scope || me, ou, me);
    }
});