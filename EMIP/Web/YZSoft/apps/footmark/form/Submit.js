
Ext.define('YZSoft.apps.footmark.form.Submit', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.FieldSet'
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
            config = config || {},
            value = config.value;

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

        me.btnSave = Ext.create('Ext.Button', {
            flex: 1,
            cls: 'yz-button-flat yz-button-bordertop',
            padding: '16 3',
            text: RS.$('All__Submit'),
            handler: function () {
                me.save({
                    fn: function (result) {
                        if (me.config.fn)
                            me.config.fn.call(me.scope || me, result);
                    },
                    done: function (result) {
                        if (me.config.done)
                            me.config.done.call(me.scope || me, result);
                    }
                });
            }
        });

        me.actionBar = Ext.create('Ext.Container', {
            docked: 'bottom',
            minHeight: 48,
            style: 'background-color:#fff',
            cls: 'yz-container-border-top',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
            },
            items: [me.btnSave]
        });

        var cfg = {
            items: [me.titleBar, {
                xtype: 'fieldset',
                padding: 0,
                items: [{
                    xtype: 'field',
                    cls: 'yz-field-has-icon yz-field-label-icon-time',
                    label: RS.$('Footmark_SignDate'),
                    html: Ext.Date.format(new Date(), 'H:i')
                }, {
                    xtype: 'field',
                    cls: 'yz-field-has-icon yz-field-label-icon-location',
                    label: RS.$('Footmark_SignAddr'),
                    html: Ext.String.format('{0},{1}', value.position.name, value.position.address)
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xtype: 'textareafield',
                    name: 'Comments',
                    labelAlign: 'top',
                    placeHolder: RS.$('Footmark_SignComments'),
                    maxRows: 8
                }]
            }, {
                xtype: 'fieldset',
                padding: 0,
                items: [{
                    xclass: 'YZSoft.src.field.ImageAttachment',
                    name: 'Attachments'
                }]
            }, me.actionBar]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    getData: function () {
        var me = this,
            data = me.getValues(false, false);

        data.Position = me.config.value.position;

        return data;
    },

    save: function (opts) {
        var me = this,
            data = me.getData();

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/footmark.ashx'),
            waitMsg: {
                message: RS.$('All__Submiting'),
                autoClose: false
            },
            delay: true,
            params: {
                Method: 'Save'
            },
            jsonData: data,
            success: function (action) {
                Ext.Viewport.mask({
                    cls: 'yz-mask-success',
                    message: RS.$('All__Mask_SubmitSuccess'),
                    delay: true,
                    fn: function () {
                        if (opts.fn)
                            opts.fn.call(opts.scope || me, action.result);
                    }
                })

                if (opts.done)
                    opts.done.call(opts.scope || me, action.result);
            },
            failure: function (action) {
                Ext.Msg.alert(RS.$('All__Title_SubmitFailed'), action.result.errorMessage);
            }
        });
    }
});