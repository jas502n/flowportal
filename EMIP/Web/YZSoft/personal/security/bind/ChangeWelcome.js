
Ext.define('YZSoft.personal.security.bind.ChangeWelcome', {
    extend: 'Ext.Container',
    config: {
        phoneNumber: '',
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

        me.btnNext = Ext.create('Ext.Button', {
            margin: '25 10 0 10',
            cls: ['yz-button-flat', 'yz-button-sumbit'],
            text: RS.$('All_Bind_Change_Next'),
            handler: function () {
                if (me.config.fn)
                    me.config.fn.call(me.config.scope || me);
            }
        });

        me.cmpPhoneNumber = Ext.create('Ext.Component', {
            padding: '10 15',
            tpl: [
                '<div class="yz-comments yz-comments-size-m yz-align-hcenter">{desc}</span></div>',
            ],
            data: {
                desc: Ext.String.format(RS.$('All_Bind_Change_Caption_FMT'), config.phoneNumber)
            }
        });

        cfg = {
            items: [me.titleBar, {
                xtype: 'container',
                padding: '42 0 16 0',
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                items: [{
                    xtype: 'image',
                    width: 47,
                    height: 87,
                    src: YZSoft.$url(me, 'images/bind.png')
                }]
            }, me.cmpPhoneNumber, me.btnNext, {
                xtype: 'component',
                padding: '20 15 10 15',
                cls: 'yz-com-changebind-caption',
                tpl: [
                    '<div class="yz-comments yz-comments-size-m yz-align-hcenter">{spec}</div>',
                ],
                data: {
                    spec:RS.$('All_Bind_Change_Value')
                }
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            show: function () {
                me.loadForm();
            }
        });
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
                me.cmpPhoneNumber.setData({
                    phoneNumber: action.result.PhoneBindNumber
                });
            }
        });
    }
});