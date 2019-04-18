
Ext.define('YZSoft.task.filter.WorkList', {
    extend: 'Ext.Container',
    config: {
        scrollable: false,
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
            title: config.title || RS.$('All__Filter'),
            cls: ['yz-titlebar'],
            items: [me.btnBack]
        });

        me.labProcess = Ext.create('Ext.TitleBar', {
            cls: 'yz-titlebar-field',
            titleAlign: 'left',
            title: RS.$('All_BPM_TaskFilter_ProcessName'),
            padding: '6 0'
        });

        me.pickProcess = Ext.create('YZSoft.src.component.ProcessSegmentedButton', {
        });

        me.btnReset = Ext.create('Ext.Button', {
            flex: 1,
            cls: 'yz-button-flat yz-button-dlg-normal',
            text: RS.$('All__Reset'),
            handler: function () {
                me.pickProcess.reset();
            }
        });

        me.btnOK = Ext.create('Ext.Button', {
            flex: 1,
            cls: 'yz-button-flat yz-button-dlg-default',
            text: RS.$('All__OK'),
            handler: function () {
                var button = me.pickProcess.getCheckedButton()[0],
                    processName = button.config.isAll ? '' : button.config.value;

                if (config.fn)
                    config.fn.call(me.scope, processName);
            }
        });

        cfg = {
            items: [me.titleBar, {
                xtype: 'container',
                flex: 1,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                scrollable: {
                    direction: 'vertical',
                    indicators: false
                },
                padding: '4 12 10 12',
                items: [me.labProcess, me.pickProcess]
            }, {
                docked: 'bottom',
                style: 'background-color:#f0f3f5',
                cls: 'yz-container-border-top',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaults: {
                    padding: '12 3'
                },
                padding: '5 12',
                items: [me.btnReset, { xtype: 'spacer', width: 12 }, me.btnOK]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
