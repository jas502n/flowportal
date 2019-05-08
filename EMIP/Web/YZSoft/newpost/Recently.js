
Ext.define('YZSoft.newpost.Recently', {
    extend: 'Ext.dataview.DataView',
    requires: [
        'YZSoft.newpost.Model'
    ],
    config: {
        padding: '0 6',
        scrollable: null,
        inline: {
            wrap: true
        },
        cls: 'yz-dataview-favorite-process',
        itemCls: 'yz-dataview-item-app yz-dataview-item-app',
        baseCls: ' ',
        itemTpl: [
             '<tpl for=".">',
                '<div style="font-size: 14px;margin-bottom:10px">{text}</div>',
                 '<div class="layui-row">',
                 '<tpl for="children">',
                 '<div class="layui-col-xs3" processname={text}>',
                   '<div class="align-self-center shortname" style="background-color:{Color}">{ShortName}</div>',
                    '<div class="flex-fill name">{text}</div>',
                   '</div>',
                  '</tpl>',
                  '</div>',
                    '</div>',
             '</tpl>'
             ]
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.newpost.Model',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/YZApp/App.ashx'),
                extraParams: {
                    method: 'GetTree',
                    process: 'true',
                    expand: 'true',
                    perm: 'read'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children'
                }
            }
        });

        cfg = {
            store: me.store,
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                  
                    if (e.touch.target.className == "layui-col-xs3") {
                        var processname = e.touch.target.getAttribute("processname");
                        var newrecord = {
                            data: {
                                ProcessName: processname
                            }
                        }
                        me.fireEvent('processClick', newrecord);
                    }
                    else if (e.touch.target.parentElement.className == "layui-col-xs3") {
                        var processname = e.touch.target.parentElement.getAttribute("processname");
                        var newrecord = {
                            data: {
                                ProcessName: processname
                            }
                        }
                        me.fireEvent('processClick', newrecord);
                    }
                    else if (e.touch.target.parentElement.parentElement.className == "layui-col-xs3") {
                        var processname = e.touch.target.parentElement.parentElement.getAttribute("processname");
                        var newrecord = {
                            data: {
                                ProcessName: processname
                            }
                        }
                        me.fireEvent('processClick', newrecord);
                    }

                }
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            painted: function () {
                me.store.load({ delay: false, mask: false });
            }
        });

        me.store.load({ delay: false, mask: false });
    }
});