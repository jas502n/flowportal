
Ext.define('YZSoft.src.panel.SelRemindTarget', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.RemindTarget'
    ],
    config: {
        singleSelection: true,
        params: null,
        style: 'background-color:#fff;'
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            taskid = config.taskid;

        me.btnBack = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me, me);
            }
        });

        me.btnOK = Ext.create('Ext.Button', {
            text: RS.$('All__OK'),
            disabled: true,
            cls: ['yz-button-flat', 'yz-button-titlebar', 'yz-button-disable-gray'],
            align: 'right',
            handler: function () {
                var recs = me.list.getSelection();
                if (recs.length)
                    me.onok(recs);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            style: 'z-index:1',
            items: [me.btnBack, me.btnOK]
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.RemindTarget',
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Task.ashx'),
                extraParams: {
                    method: 'GetRemindTarget',
                    taskid: taskid
                },
                reader: {
                    type: 'json'
                }
            }
        });

        me.list = Ext.create('Ext.dataview.List', {
            loadingText: false,
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            store: me.store,
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            mode: 'MULTI',
            emptyText: '',
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-selstep'],
            itemTpl: Ext.create('Ext.XTemplate',
                '<div class="yz-layout-columns yz-selstep-item-remindtarget yz-align-vcenter">',
                    '<div class="yz-column-left">',
                    '</div>',
                    '<div class="yz-column-center">',
                        '<div class="title">{[this.renderTitle(values)]}</div>',
                        '<div class="date">{ElapsedMinutes:this.renderDate}</div>',
                    '</div>',
                    '<div class="yz-column-right yz-align-vcenter">',
                        '<div class="selection"></div>',
                    '</div>',
                '</div>',{
                renderDate: function (value) {
                    return Ext.Date.toElapsedString(value);
                },
                renderTitle: function (step) {
                    var encode = Ext.util.Format.htmlEncode;

                    return Ext.String.format('{0}<span class="recp">[{1}]</span>', encode(step.NodeDisplayName), encode(step.ShortName));
                }
            })
        });

        me.list.on({
            single: true,
            painted: function () {
                me.store.load();
            }
        });

        me.list.on({
            selectionchange: function (list) {
                me.btnOK.setDisabled(list.getSelectionCount() == 0);
            }
        });

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    getTargets: function (recs) {
        var me = this,
            tmp = {}, rv = [];

        Ext.each(recs, function (rec) {
            var stepid = rec.data.StepID,
                uid = rec.data.Account;

                tmp[stepid] = tmp[stepid] || [];
                tmp[stepid].push(uid);
        });

        Ext.Object.each(tmp, function (stepid) {
            rv.push({
                stepid: Number(stepid),
                uids: tmp[stepid]
            });
        });

        return rv;
    },

    onok: function (recs) {
        var me = this,
            targets = me.getTargets(recs);

        if (me.config.fn)
            me.config.fn.call(me.scope, targets, me);
    }
});