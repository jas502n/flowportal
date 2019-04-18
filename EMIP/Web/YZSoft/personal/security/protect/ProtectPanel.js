
Ext.define('YZSoft.personal.security.protect.ProtectPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.Device'
    ],
    config: {
        togProtectConfig:null,
        style: 'background-color:#f0f3f5;',
        scrollable: {
            direction: 'vertical',
            indicators: false
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        }
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
            model: 'YZSoft.src.model.Device',
            autoLoad: false,
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
                extraParams: {
                    method: 'GetMyDevices'
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
            scrollable: false,
            disableSelection: true,
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            cls: ['yz-noscroll-autosize'],
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-device'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<div class="yz-layout-columns">',
                '<div class="yz-column-center">',
                    '<div class="name">{Name:this.renderString}</div>',
                    '<div class="desc">{Description:this.renderString}</div>',
                '</div>',
                '<div class="yz-column-right yz-align-vcenter">',
                    '<div class="more"></div>',
                '</div>',
            '</div>', {
                renderString: function (value) {
                    return Ext.util.Format.htmlEncode(value);
                }
            }),
            plugins: [{
                xclass: 'YZSoft.src.plugin.PullRefresh'
            }, {
                xclass: 'YZSoft.src.plugin.ListPaging',
                autoPaging: true
            }, {
                xclass: 'YZSoft.src.plugin.ListOptions',
                items: [{
                    text: RS.$('All__Delete'),
                    padding: '0 20',
                    style: 'background-color:#e84134',
                    handler: function (record) {
                        YZSoft.Ajax.request({
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
                            params: {
                                Method: 'DeleteDevice',
                                uuid: record.data.UUID
                            },
                            success: function (action) {
                                me.store.remove(record);
                            },
                            failure: function (action) {
                                Ext.Msg.alert(RS.$('All__Title_DeleteFailed'), action.result.errorMessage);
                            }
                        });
                    }
                }]
            }],
            //emptyText: RS.$('TaskList_EmptyText'),
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    e.stopEvent();
                    me.rename(record);
                }
            }
        });

        me.list.on({
            single: true,
            painted: function () {
                me.store.load();
            }
        });

        me.togProtect = Ext.create('Ext.field.Toggle', Ext.apply({
            label: RS.$('All_Bind_Final_Protect'),
            value: false
        }, config.togProtectConfig));

        cfg = {
            defaults: {
                defaults: {
                    padding: '5 10'
                }
            },
            items: [me.titleBar, {
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-form', 'yz-container-border-top', 'yz-container-border-bottom'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.togProtect]
            }, {
                xtype: 'component',
                padding: '10 15',
                tpl: [
                    '<div class="yz-comments">{message}</div>',
                    '<div class="yz-comments" style="margin-top:40px;">{device}</div>'
                ],
                data: {
                    message: Ext.String.format(RS.$('All_Bind_Final_Desc'), RS.$('All__MobileAppName')),
                    device:RS.$('All_Bind_Device')
                }
            }, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.togProtect.getComponent().on({
            scope: me,
            changemanual: 'onToggleChange'
        });

        me.loadForm();
    },

    loadForm: function () {
        var me = this;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Org.ashx'),
            params: {
                method: 'GetUserCommonInfo'
            },
            success: function (action) {
                me.togProtect.setValue(action.result.AppLoginProtect);
            }
        });
    },

    onToggleChange: function (cmp, thumb, newvalue, oldValue) {
        var me = this;

        if (newvalue == 0) {
            Ext.Msg.show({
                title: RS.$('All_Bind_CloseWarning_Title'),
                message: RS.$('All_Bind_CloseWarning_Message'),
                hideOnMaskTap: true,
                buttons: [{
                    text: RS.$('All_Bind_Close'),
                    flex: 1,
                    cls: 'yz-button-flat yz-button-dlg-normal',
                    itemId: 'ok'
                }, { xtype: 'spacer', width: 12 }, {
                    text: RS.$('All_Bind_NotClose'),
                    flex: 1,
                    cls: 'yz-button-flat yz-button-dlg-default',
                    itemId: 'cancel'
                }],
                fn: function (btn) {
                    if (btn == 'cancel') {
                        me.togProtect.setValue(1);
                        return;
                    }

                    YZSoft.Ajax.request({
                        url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
                        waitMsg: {
                            message: RS.$('All_Bind_Close_Mask'),
                            autoClose: false
                        },
                        delay: true,
                        params: {
                            method: 'SetLoginProtect',
                            value: false
                        },
                        success: function (action) {
                            Ext.Viewport.mask({
                                cls: 'yz-mask-success',
                                message: RS.$('All_Bind_Close_Mask_Success'),
                                delay: 800
                            });
                        },
                        failure: function (action) {
                            Ext.Msg.alert(RS.$('All_Bind_Close_Title_Failed'), action.result.errorMessage);
                        }
                    });
                }
            });
        }
        else {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
                waitMsg: {
                    message: RS.$('All_Bind_Open_Mask'),
                    autoClose: false
                },
                delay: true,
                params: {
                    method: 'SetLoginProtect',
                    value: true
                },
                success: function (action) {
                    Ext.Viewport.mask({
                        cls: 'yz-mask-success',
                        message: RS.$('All_Bind_Open_Mask_Success'),
                        delay: 800
                    });
                },
                failure: function (action) {
                    Ext.Msg.alert(RS.$('All_Bind_Open_Title_Failed'), action.result.errorMessage);
                }
            });
        }
    },

    rename: function (record) {
        var pnl = Ext.create('YZSoft.src.panel.Rename', {
            backText: RS.$('All_Bind_Final_Title'),
            title: RS.$('All_Bind_DeviceRename_Title'),
            emptyMessage: RS.$('All_Bind_DeviceRename_EmptyName'),
            value: record.data.Name,
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/Safe.ashx'),
            params: {
                Method: 'RenameDevice',
                uuid: record.data.UUID
            },
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop();
            },
            done: function (value, result) {
                record.set('Name', value);
            }
        });

        Ext.mainWin.push(pnl);
    }
});
