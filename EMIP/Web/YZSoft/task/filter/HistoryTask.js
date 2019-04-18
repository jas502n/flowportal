
Ext.define('YZSoft.task.filter.HistoryTask', {
    extend: 'Ext.Container',
    config: {
        scrollable: {
            direction: 'vertical',
            indicators: false
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        cls: ['yz-form']
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

        me.pickStatus = Ext.create('YZSoft.src.component.SquaredSegmentedButton', {
            items: [{
                text: RS.$('All__All'),
                value: 'all'
            }, {
                text: RS.$('All__Running'),
                value: 'Running'
            }, {
                text: RS.$('All_BPM_Approved'),
                value: 'Approved'
            }, {
                text: RS.$('All_BPM_Rejected'),
                value: 'Rejected'
            }, {
                text: RS.$('All_BPM_Aborted'),
                value: 'Aborted'
            }]
        });

        me.pickProcessName = Ext.create('YZSoft.src.field.ProcessNamePicker', {
            label: RS.$('All_BPM_TaskFilter_ProcessName'),
            cls: ['x-field-nopadding', 'yz-field-valuealign-right'],
            margin: '25 0 0 12'
        });

        me.edtSN = Ext.create('Ext.field.Text', {
            cls: ['x-field-nopadding', 'yz-field-searchkeyword']
        });

        me.edtKeyword = Ext.create('Ext.field.Text', {
            cls: ['x-field-nopadding', 'yz-field-searchkeyword']
        });

        me.pickRequestStart = Ext.create('YZSoft.src.field.DatePicker', {
            cls: ['x-field-nopadding', 'yz-field-searchkeyword'],
            flex: 1
        });

        me.pickRequestEnd = Ext.create('YZSoft.src.field.DatePicker', {
            cls: ['x-field-nopadding', 'yz-field-searchkeyword'],
            flex: 1
        });

        me.btnReset = Ext.create('Ext.Button', {
            flex: 1,
            cls: 'yz-button-flat yz-button-dlg-normal',
            text: RS.$('All__Reset'),
            scope: me,
            handler: 'reset'
        });

        me.btnOK = Ext.create('Ext.Button', {
            flex: 1,
            cls: 'yz-button-flat yz-button-dlg-default',
            text: RS.$('All__OK'),
            scope: me,
            handler: 'onok'
        });

        cfg = {
            items: [me.titleBar, {
                xtype: 'container',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                padding: '4 12 10 12',
                items: [{
                    xtype: 'titlebar',
                    title: RS.$('All_BPM_TaskFilter_Status'),
                    titleAlign: 'left',
                    cls: 'yz-titlebar-field',
                    padding: '6 0'
                }, me.pickStatus]
            }, me.pickProcessName, {
                xtype: 'titlebar',
                title: RS.$('All__SN'),
                titleAlign: 'left',
                cls: 'yz-titlebar-field',
                margin: '25 12 0 12'
            }, {
                xtype: 'container',
                margin: '0 12 0 12',
                style: 'background-color:#ededed;padding:8px;border-radius:6px',
                layout: 'fit',
                items: [me.edtSN]
            }, {
                xtype: 'titlebar',
                title: RS.$('All__Keyword'),
                titleAlign: 'left',
                cls: 'yz-titlebar-field',
                margin: '15 12 0 12'
            }, {
                xtype: 'container',
                margin: '0 12 0 12',
                style: 'background-color:#ededed;padding:8px;border-radius:6px',
                layout: 'fit',
                items: [me.edtKeyword]
            }, {
                xtype: 'titlebar',
                title: RS.$('All_BPM_TaskFilter_RequestDate'),
                titleAlign: 'left',
                cls: 'yz-titlebar-field',
                margin: '15 12 0 12'
            }, {
                xtype: 'container',
                margin: '0 12 0 12',
                style: 'background-color:#ededed;padding:8px;border-radius:6px',
                layout: {
                    type: 'hbox'
                },
                items: [me.pickRequestStart, { xtype: 'spacer', width: 26, cls: 'yz-spacer-hline', margin: '0 10' }, me.pickRequestEnd]
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
    },

    reset: function () {
        var me = this;

        me.pickStatus.reset();
        me.pickProcessName.setValue(null);
        me.edtSN.setValue(null);
        me.edtKeyword.setValue(null);
        me.pickRequestStart.setValue(null);
        me.pickRequestEnd.setValue(null);
    },

    onok: function () {
        var me = this,
            status = me.pickStatus.getCheckedButton()[0].config.value,
            endDate = me.pickRequestEnd.getValue(),
            startDate = me.pickRequestStart.getValue();

        if (endDate)
            endDate = Ext.Date.add(endDate, Ext.Date.DAY, 1);

        if (me.config.fn) {
            me.config.fn.call(me.scope, {
                status: status == 'all' ? null : status,
                processName: me.pickProcessName.getValue(),
                sn: me.edtSN.getValue(),
                keyword: me.edtKeyword.getValue(),
                reqStart: startDate,
                reqEnd: endDate,
                byYear: (startDate && endDate) ? 0 : 1
            });
        }
    }
});