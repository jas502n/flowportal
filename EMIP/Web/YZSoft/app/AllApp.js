
Ext.define('YZSoft.App.AllApp', {
    extend: 'Ext.dataview.DataView',
    requires: [
        'YZSoft.app.model.YZApp.AllAppInfo'
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
                '<div style="font-size: 14px;margin-bottom:10px">{GroupName}</div>',
                 '<div class="layui-row">',
                 '<tpl for="App">',
                 '<div class="layui-col-xs3" {[this.renderString(values)]}>',
                  '<div class="align-self-center shortname"   style="background-color:{IconColor}"><i style="color:white;font-size:{IconSize}px" class="iconfont {Icon}"></i>',
                    '<tpl if="Badge &gt; 1">',
            '<span class="appbadge">{Badge}</span>',
             '</tpl>',
                '</div>',
                    '<div class="flex-fill name">{AppName}</div>',
                   '</div>',
                  '</tpl>',
                  '</div>',
                    '</div>',
             '</tpl>',
          {
              renderString: function (string) {
                  var rv = "";
                  if (string.AppUrl != "") {
                      rv += "AppUrl='" + string.AppUrl + "' ";
                  }
                  if (string.json != "") {
                      rv += "json='" + string.Json + "' ";
                  }
                  if (string.Type != "") {
                      rv += "Type='" + string.Type + "' ";
                  }
                  if (string.AppName != "") {
                      rv += "AppName='" + string.AppName + "' ";
                  }
                  return rv;
              }
          }

        ]
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.app.model.YZApp.AllAppInfo',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/YZApp/App.ashx'),
                extraParams: {
                    method: 'GetMApplist'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'Applist'
                }
            }
        });

        cfg = {
            store: me.store,
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {

                    if (e.touch.target.className == "layui-col-xs3") {
                        var AppUrl = e.touch.target.getAttribute("AppUrl");
                        var app = e.touch.target.getAttribute("json");
                        var Type = e.touch.target.getAttribute("Type");
                        var AppName = e.touch.target.getAttribute("appname");
                        me.openapp(Type, app, AppName, AppUrl);
                    }
                    else if (e.touch.target.parentElement.className == "layui-col-xs3") {
                        var AppUrl = e.touch.target.parentElement.getAttribute("AppUrl");
                        var app = e.touch.target.parentElement.getAttribute("json");
                        var Type = e.touch.target.parentElement.getAttribute("Type");
                        var AppName = e.touch.target.parentElement.getAttribute("appname");
                        me.openapp(Type, app, AppName, AppUrl);
                    }
                    else if (e.touch.target.parentElement.parentElement.className == "layui-col-xs3") {
                        var AppUrl = e.touch.target.parentElement.parentElement.getAttribute("AppUrl");
                        var app = e.touch.target.parentElement.parentElement.getAttribute("json");
                        var Type = e.touch.target.parentElement.parentElement.getAttribute("Type");
                        var AppName = e.touch.target.parentElement.parentElement.getAttribute("appname");
                        me.openapp(Type, app, AppName, AppUrl);
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
    },
    openapp: function (Type, app, AppName, AppUrl) {

        var me = this;
        if (Type == "SYSTEM") {
            if (app == "" || app == null) {
                me.fireEvent('appClickError', AppName);

            } else {
                me.fireEvent('appClick', app, AppName, Type, AppUrl);
            }
        } else {

            if (AppUrl == "" || AppUrl == null) {
                me.fireEvent('appClickError', AppName);

            } else {
                me.fireEvent('appClick', app, AppName, Type, AppUrl);
            }

        }

    }
});