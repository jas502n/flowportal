
Ext.define('YZSoft.personal.setting.Lang', {
    extend: 'Ext.form.Panel',
    requires: [
        'YZSoft.src.util.Cookies'
    ],
    config: {
        style: 'background-color:#f0f3f5;',
        scrollable:null,
        layout: {
            type: 'vbox',
            slign: 'stretch'
        },
        cls: ['yz-form', 'yz-form-dark']
    },

    constructor: function (config) {
        var me = this,
            langs = RS.$('All__Languages').split(','),
            curLangName = RS.$('All__Languages_Cur'),
            items = [], cfg, langName;

        Ext.each(langs, function (lang) {
            langName = RS.$('All__Languages_' + lang);

            items.push({
                value: lang,
                label: langName,
                checked: langName == curLangName
            });
        });

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

        me.btnSave = Ext.create('Ext.Button', {
            text: RS.$('All__Save'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
            handler: function () {
                me.save();
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnSave]
        });

        cfg = {
            items: [me.titleBar, {
                xclass: 'Ext.form.FieldSet',
                margin: '10 0 0 0',
                padding: 0,
                defaults: {
                    labelWidth: '60%',
                    xclass: 'Ext.field.Radio',
                    name: 'lcid'
                },
                items: items
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    save: function () {
        var me = this,
            vs = me.getValues();

        try {
            localStorage.setItem('yz-lcid', vs.lcid);
        }
        catch (exp) {
        }

        if (me.config.fn)
            me.config.fn.call(me.scope || me, vs.lcid);
    }
});