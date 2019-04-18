
Ext.define('YZSoft.apps.cash.Form', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.FieldSet',
        'Ext.field.Number',
        'Ext.field.DatePicker',
        'YZSoft.src.ux.GlobalStore'
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
            itemid = config.itemid;

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
            title: config.title || RS.$('All_Apps_CashMemo'),
            cls: ['yz-titlebar'],
            items: [me.btnBack]
        });

        me.btnSave = Ext.create('Ext.Button', {
            flex: 1,
            cls: 'yz-button-flat yz-button-action-save',
            padding: '16 3',
            text: RS.$('All__Save'),
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
            style: 'background-color:#25a6d8',
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
                padding:'0',
                items: [{
                    xtype: 'numberfield',
                    label: RS.$('All__Amount'),
                    name: 'Amount'
                }, {
                    xclass: 'YZSoft.src.field.DatePicker',
                    label: RS.$('All__Date'),
                    name: 'Date',
                    value: Ext.Date.clearTime(new Date())
                }, {
                    xclass: 'YZSoft.src.field.ImageAttachment',
                    name: 'Invoice'
                }, {
                    xclass: 'YZSoft.src.field.ExpandIconSelect',
                    label: RS.$('All__Type'),
                    name: 'Type',
                    valueField: 'Code',
                    textProperty: 'Text',
                    store: YZSoft.src.ux.GlobalStore.getExpenseTypeStore(),
                    autoSelect: false,
                    expended: itemid ? false : true
                }]
            }, {
                xtype: 'fieldset',
                items: [{
                    xtype: 'textareafield',
                    label: RS.$('All__Comments'),
                    name: 'Comments',
                    labelAlign: 'top'
                }]
            }, me.actionBar]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (itemid)
            me.loadForm(itemid);
    },

    getData: function () {
        var me = this,
            data = me.getValues(false, false);

        return data;
    },

    save: function (opts) {
        var me = this,
            data = me.getData();

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/Cash.ashx'),
            waitMsg: {
                message: RS.$('All__Saving'),
                autoClose: false
            },
            delay: true,
            params: {
                Method: me.config.itemid ? 'Update':'Save',
                itemid: me.config.itemid
            },
            jsonData: data,
            success: function (action) {
                Ext.Viewport.mask({
                    cls: 'yz-mask-success',
                    message: RS.$('All__Saving_Mask_Succeed'),
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
                Ext.Msg.alert(RS.$('All__Title_SaveFailed'), action.result.errorMessage);
            }
        });
    },

    loadForm: function (itemid) {
        var me = this;

        YZSoft.Ajax.request({
            scope: me,
            waitMsg: {
                message: '',
                autoClose: true,
                indicator: true,
                target: me
            },
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/Cash.ashx'),
            params: {
                method: 'GetCash',
                itemid: itemid
            },
            success: function (action) {
                me.setValues(action.result);
            },
            failure: function (action) {
                me.setItems([{
                    xtype: 'component',
                    cls: 'yz-component-error',
                    html: action.result.errorMessage
                }]);
            }
        });
    }
});