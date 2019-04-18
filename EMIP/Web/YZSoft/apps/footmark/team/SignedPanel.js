
Ext.define('YZSoft.apps.footmark.team.SignedPanel', {
    extend: 'Ext.Container',
    requires: [
    ],

    constructor: function (config) {
        var me = this,
            config = config || {};

        me.list = Ext.create('Ext.dataview.List', {
            loadingText: '',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-teamusersign'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns">',
                '<div class="yz-column-left">',
                    '<div class="headsort" style="background-image:url({headsort})"></div>',
                '</div>',
                '<div class="yz-column-center">',
                    '<div class="title">{Name:this.renderString}</div>',
                    '<tpl for="Items">',
                        '<div class="positionitem">',
                            '<div class="createat">{Time:this.renderTime}</div>',
                            '<div class="position">{Position:this.renderPosition}</div>',
                            '<tpl if="Comments">',
                                '<div class="comments">{Comments:this.renderString}</div>',
                            '</tpl>',
                        '</div>',
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
                    return Ext.String.format('{0}, {1}', Ext.util.Format.htmlEncode(value.Name), Ext.util.Format.htmlEncode(value.Address))
                },
                renderTime: function (value) {
                    return Ext.Date.format(value,'H:i');
                }
            }),
            store: config.store,
            plugins: [{
                xclass: 'YZSoft.src.plugin.PullRefresh'
            }, {
                xclass: 'YZSoft.src.plugin.ListPaging',
                autoPaging: true
            }],
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            disableSelection: true,
            //emptyText: RS.$('TaskList_EmptyText'),
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    e.stopEvent();
                    me.onItemTap(target, record);
                }
            }
        });

        var cfg = {
            layout: 'fit',
            items: [me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onItemTap: function (target, record) {
        var me = this;
        me.fireEvent('itemtap', record);
    }
});
