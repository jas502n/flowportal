
Ext.define('YZSoft.apps.speak.Rename', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.FieldSet'
    ],
    config: {
        cls: 'yz-form',
        style: 'background-color:#f3f5f9;',
        scrollable: false
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            itemid = config.itemid;

        me.btnBack = Ext.create('Ext.Button', {
            text: RS.$('AudioRecord_BackToList'),
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
            text: RS.$('All__Finished'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
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

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnSave]
        });

        me.comments = Ext.create('Ext.field.TextArea', {
            cls: ['comments'],
            value: config.comments,
            maxRows: 4
        });
        delete config.comments;

        var cfg = {
            items: [me.titleBar, {
                xtype: 'fieldset',
                cls: ['yz-container-border-top', 'yz-container-border-bottom'],
                margin: '10 0',
                padding: 6,
                items: [me.comments]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    save: function (opts) {
        var me = this;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/Speak.ashx'),
            waitMsg: {
                message: RS.$('All__Updating'),
                autoClose: false
            },
            delay: true,
            params: {
                Method: 'Rename',
                itemid: me.config.itemid,
                comments: me.comments.getValue()
            },
            success: function (action) {
                Ext.Viewport.mask({
                    cls: 'yz-mask-success',
                    message: RS.$('All__Mask_RenameSuccess'),
                    delay: true,
                    fn: function () {
                        if (opts.fn)
                            opts.fn.call(opts.scope || me, action.result);
                    }
                });

                if (opts.done)
                    opts.done.call(opts.scope || me, action.result);
            },
            failure: function (action) {
                Ext.Msg.alert(RS.$('All__Title_RenameFailed'), action.result.errorMessage);
            }
        });
    }
});