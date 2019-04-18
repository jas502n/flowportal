
Ext.define('YZSoft.personal.security.bind.BindWelcome', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.button.ListButton'
    ],
    config: {
        promptText: Ext.String.format(RS.$('All_Bind_Welcome_Value'), RS.$('All__MobileAppName')),
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

        me.btnCancel = Ext.create('Ext.Button', {
            text: RS.$('All__Cancel'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.cancel)
                    me.config.cancel.call(me.scope || me);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnCancel]
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
            }, {
                xtype: 'component',
                padding: '10 15',
                tpl: [
                    '<div class="yz-comments">{promptText}</div>',
                ],
                data: {
                    promptText: config.promptText || me.config.promptText
                }
            }, {
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-container-border-top', 'yz-container-border-bottom', 'yz-list-button-container-left10'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xclass: 'YZSoft.src.button.ListButton',
                    iconGoCls: 'yz-glyph yz-glyph-e904',
                    padding: '15 15',
                    text: RS.$('All_Bind_Welcome_Bind'),
                    handler: function () {
                        if (me.config.fn)
                            me.config.fn.call(me.config.scope || me);
                    }
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
