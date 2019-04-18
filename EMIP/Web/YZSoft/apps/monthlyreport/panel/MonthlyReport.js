
Ext.define('YZSoft.apps.monthlyreport.panel.MonthlyReport', {
    extend: 'Ext.Container',
    requires: [
        'Ext.form.FieldSet'
    ],
    config: {
        account: null,
        date: null,
        report: null,
        editable:true,
        style: 'background-color:#f0f3f5;'
    },

    constructor: function (config) {
        var me = this,
            report = config.report,
            cfg, leavingTypes;

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

        me.btnEdit = Ext.create('Ext.Button', {
            text: RS.$('All__Modify'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
            hidden: config.editable === false,
            handler: function () {
                me.$edit();
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnEdit]
        });

        me.edtDate = Ext.create('Ext.field.Field', {
            label: RS.$('All__MonthNo'),
            cls: ['yz-field-valuealign-right', 'yz-form-field-light']
        });

        me.edtDone = Ext.create('Ext.field.Field', {
            label: RS.$('MonthlyReport_Done'),
            labelAlign: 'top',
            minHeight: 60,
            padding: '0 0 8 0'
        });

        me.edtUndone = Ext.create('Ext.field.Field', {
            label: RS.$('MonthlyReport_UndoneJob'),
            labelAlign: 'top',
            minHeight: 60,
            padding: '0 0 8 0'
        });

        me.edtCoordinate = Ext.create('Ext.field.Field', {
            label: RS.$('MonthlyReport_CoordinateJob'),
            labelAlign: 'top',
            minHeight: 60,
            padding: '0 0 8 0'
        });

        me.edtComments = Ext.create('Ext.field.Field', {
            label: RS.$('All__Comments'),
            labelAlign: 'top',
            minHeight: 80
        });

        me.edtAttachments = Ext.create('YZSoft.src.field.ImageAttachment', {
            label: RS.$('All__Attachments'),
            readOnly: true
        });

        cfg = {
            items: [me.titleBar, {
                xtype: 'container',
                cls: 'yz-form yz-form-read',
                defaults: {
                    padding: 0
                },
                items: [{
                    xtype: 'fieldset',
                    items: [me.edtDate]
                }, {
                    xtype: 'fieldset',
                    padding: '0 0',
                    defaults: {
                        cls: 'yz-form-field-dark'
                    },
                    items: [me.edtDone, me.edtUndone, me.edtCoordinate]
                }, {
                    xtype: 'fieldset',
                    items: [me.edtComments]
                }, {
                    xtype: 'fieldset',
                    items: [me.edtAttachments]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        if (report) {
            me.fill(report);
        }
        else {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/MonthlyReport.ashx'),
                params: {
                    method: 'TryGetReport',
                    account: config.account,
                    date: config.date
                },
                success: function (action) {
                    var report = action.result.report;

                    if (report)
                        me.fill(report);
                }
            });
        }
    },

    fill: function (report) {
        var me = this;

        me.edtDate.setHtml(Ext.Date.format(report.Date, RS.$('All__DataFMT_MonthInYear')));
        me.edtDone.setHtml(Ext.util.Format.htmlEncode(report.Done));
        me.edtUndone.setHtml(Ext.util.Format.htmlEncode(report.Undone));
        me.edtCoordinate.setHtml(Ext.util.Format.htmlEncode(report.Coordinate));
        me.edtComments.setHtml(Ext.util.Format.htmlEncode(report.Comments));
        me.edtAttachments.setValue(report.Attachments);
    },

    $edit: function () {
        var me = this,
            uid = me.getAccount(),
            report = me.getReport(),
            pnl;

        pnl = Ext.create('YZSoft.form.Post', {
            title: RS.$('MonthlyReport_Post_Title'),
            processName: '$月报',
            prompt: false,
            restartTaskID: report.TaskID,
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop(2);
            },
            done: function () {
                if (me.config.done)
                    me.config.done.call(me.scope || me, report);
            }
        });

        Ext.mainWin.push(pnl);
    }
});