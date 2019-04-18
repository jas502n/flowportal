Ext.define('YZSoft.personal.setting.Message', {
    extend: 'Ext.Container',
    config: {
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

        me.cntProviders = Ext.create('Ext.Container', {
            cls: ['yz-form', 'yz-form-dark', 'yz-container-border-top', 'yz-container-border-bottom', 'yz-list-button-container-left15'],
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xclass: 'Ext.field.Toggle',
                labelWidth: '60%',
                padding: '6 10 6 15'
            },
            items: []
        });

        cfg = {
            defaults: {
                defaults: {
                    padding: '11 10 11 15'
                }
            },
            items: [me.titleBar, {
                xtype: 'component',
                padding: '10 15',
                tpl: [
                    '<div class="yz-comments yz-comments-size-m">{text}</div>'
                ],
                data: {
                    text: RS.$('All_NotificationType_NewTask')
                }
            }, me.cntProviders]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            show: function () {
                me.loadForm();
            }
        });
    },

    fill: function (data) {
        var me = this,
            providers = data.providers,
            items = [];

        Ext.each(providers, function (provider) {
            items.push({
                label: RS.$('All_Notification_' + provider.ProviderName, provider.ProviderName),
                name: provider.ProviderName,
                value: provider.Enabled,
                listeners: {
                    scope: me,
                    changemanual: 'onNewTaskToggleChanged'
                }
            });
        });

        me.cntProviders.setItems(items);
    },

    loadForm: function () {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/User.ashx'),
            params: {
                method: 'GetCurrentNotificationSetting'
            },
            success: function (action) {
                me.fill(action.result);
            }
        });
    },

    onNewTaskToggleChanged: function () {
        var me = this,
            items = me.cntProviders.getItems().items,
            rejectedNotifys = [];

        Ext.each(items, function (item) {
            if (item.getValue() === 0)
                rejectedNotifys.push(item.getName());
        });

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/core/User.ashx'),
            params: {
                method: 'SaveNotificationSetting',
                rejectedNotifys: rejectedNotifys.join(';')
            },
            success: function (action) {
            },
            failure: function (action) {
                Ext.Msg.alert(RS.$('All__Title_OperationFailed'), action.result.errorMessage);
            }
        });
    }
});
