
Ext.define('YZSoft.apps.footmark.form.Sign', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.FieldSet',
        'YZSoft.src.device.Geolocation',
        'YZSoft.src.device.Geocoder'
    ],
    config: {
        cls: 'yz-form',
        style: 'background-color:#f3f5f9;',
        scrollable: {
            direction: 'vertical',
            indicators: false
        }
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
                    me.config.back.call(me.scope || me);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack]
        });

        me.position = Ext.create('YZSoft.src.field.GeoCurrentPosition', {
            height: 146,
            name: 'position',
            listeners: {
                positionsucceed: function () {
                    me.btnSign.setDisabled(false);
                }
            }
        });

        me.date = Ext.create('Ext.field.DatePicker', {
            label: RS.$('All__Date'),
            value: Ext.Date.clearTime(new Date()),
            readOnly: true,
            name: 'date'
        });

        me.contact = Ext.create('YZSoft.src.field.ContactPicker', {
            label: RS.$('Footmark_VisitTo'),
            name: 'contact'
        });

        me.btnSign = Ext.create('YZSoft.src.button.TimerButton', {
            width: 130,
            height: 130,
            text: RS.$('Footmark_Sign'),
            disabled: true,
            scope: me,
            handler: 'onSignClick'
        });

        me.cmpMsg = Ext.create('Ext.Component', {
            cls: 'yz-cmp-sign-indicater',
            margin: '16 0 0 0',
            tpl: [
                '<div class="subtitle">' + Ext.String.format(RS.$('Footmark_DaySignCount'), '<span class="count">{count}</span>') + '</div>'
            ],
            data: {
                count: '-'
            }
        });

        var cfg = {
            items: [me.titleBar, {
                xtype: 'fieldset',
                padding: 0,
                items: [me.position, me.date, me.contact]
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                padding: '20 0 0 0',
                items: [me.btnSign]
            }, me.cmpMsg]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.updateSignCount();
    },

    updateSignCount: function () {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/Footmark.ashx'),
            params: {
                method: 'GetSignCount'
            },
            success: function (action) {

                me.cmpMsg.setData({
                    count: action.result
                });
            }
        });
    },

    getData: function () {
        var me = this,
            data = me.getValues(false, false);

        return data;
    },

    onSignClick: function (opts) {
        var me = this,
            data = me.getData(),
            pnl;

        pnl = Ext.create('YZSoft.apps.footmark.form.Submit', {
            value: data,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop();
            },
            done: function () {
                me.updateSignCount();
            }
        });

        Ext.mainWin.push(pnl);
    }
});