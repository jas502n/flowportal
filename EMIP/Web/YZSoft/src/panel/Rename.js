
Ext.define('YZSoft.src.panel.Rename', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.FieldSet'
    ],
    config: {
        valueParamsName: 'value',
        url: null,
        params: null,
        multiline: false,
        value: '',
        backText: '',
        emptyMessage: null,
        cls: 'yz-form',
        style: 'background-color:#f3f5f9;',
        scrollable: false
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            itemid = config.itemid;

        me.btnBack = Ext.create('Ext.Button', {
            text: config.backText === false ? '' : (config.backText || RS.$('All__Back')),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me);
            }
        });

        me.btnSave = Ext.create('Ext.Button', {
            text: config.submitText || RS.$('All__Finished'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
            handler: function () {
                me.save({
                    fn: function (value, result) {
                        if (me.config.fn)
                            me.config.fn.call(me.scope || me, value, result);
                    },
                    done: function (value, result) {
                        if (me.config.done)
                            me.config.done.call(me.scope || me, value, result);
                    }
                });
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnSave]
        });

        if (config.multiline) {
            me.editor = Ext.create('Ext.field.TextArea', {
                cls: ['comments'],
                value: config.value,
                maxRows: 4
            });
        }
        else {
            me.editor = Ext.create('Ext.field.Text', {
                value: config.value
            });
        }

        var cfg = {
            items: [me.titleBar, {
                xtype: 'fieldset',
                cls: ['yz-container-border-top', 'yz-container-border-bottom'],
                margin: '10 0',
                padding: 6,
                items: [me.editor]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        Ext.mainWin.getActiveItem().on({
            single: true,
            hide: function () {
                Ext.defer(function () {
                    if (!Ext.os.is.iOS)
                        me.editor.focus();
                }, 10);
            }
        });
    },

    save: function (opts) {
        var me = this,
            url = me.getUrl(),
            value = me.editor.getValue(),
            emptyMessage = me.getEmptyMessage(),
            params = me.getParams();

        params = Ext.apply({}, params);
        params[me.getValueParamsName() || 'value'] = value;

        if (emptyMessage && !value) {
            Ext.Msg.alert(RS.$('All__Title_Information'), emptyMessage, function () {
                Ext.defer(function () {
                    if (!Ext.os.is.iOS)
                        me.editor.focus();
                }, 10);
            });
            return;
        }

        YZSoft.Ajax.request({
            url: url,
            waitMsg: {
                message: RS.$('All__Updating'),
                autoClose: false
            },
            delay: true,
            params: params,
            success: function (action) {
                Ext.Viewport.mask({
                    cls: 'yz-mask-success',
                    message: RS.$('All__Mask_RenameSuccess'),
                    delay: true,
                    fn: function () {
                        if (opts.fn)
                            opts.fn.call(opts.scope || me, value, action.result);
                    }
                });

                if (opts.done)
                    opts.done.call(opts.scope || me, value, action.result);
            },
            failure: function (action) {
                Ext.Msg.alert(RS.$('All__Title_RenameFailed'), action.result.errorMessage);
            }
        });
    }
});