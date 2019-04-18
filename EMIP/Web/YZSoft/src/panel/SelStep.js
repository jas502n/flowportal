
Ext.define('YZSoft.src.panel.SelStep', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.model.Step'
    ],
    config: {
        singleSelection: true,
        params: null,
        style: 'background-color:#fff;'
    },

    constructor: function (config) {
        var me = this,
            config = config || {},
            singleSelection = 'singleSelection' in config ? config.singleSelection : me.config.singleSelection,
            params = config.params;

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
            hidden: singleSelection,
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
            model: 'YZSoft.src.model.Step',
            sorters: [{
                property: 'Finished',
                direction: 'ASC'
            }, {
                property: 'StepID',
                direction: 'DESC'
            }],
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Task.ashx'),
                extraParams: params,
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
            disableSelection: singleSelection,
            mode: singleSelection ? 'SINGLE' : 'MULTI',
            emptyText: '',
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-selstep'],
            itemTpl: Ext.create('Ext.XTemplate',
            '<tpl if="!this.isFinished(Finished)">',
                '<div class="yz-layout-columns yz-selstep-item-running yz-align-vcenter">',
                    '<div class="yz-column-left">',
                    '</div>',
                    '<div class="yz-column-center">',
                        '<div class="title">{[this.renderTitleRunning(values)]}</div>',
                    '</div>',
                    '<div class="yz-column-right yz-align-vcenter">',
                        '<div class="selection"></div>',
                    '</div>',
                '</div>',
            '<tpl else>',
                '<div class="yz-layout-columns yz-selstep-item-finished yz-align-vcenter">',
                    '<div class="yz-column-left">',
                    '</div>',
                    '<div class="yz-column-center">',
                        '<div class="title">{[this.renderTitleFinished(values)]}</div>',
                        '<div class="date">{FinishAt:this.renderDate}</div>',
                    '</div>',
                    '<div class="yz-column-right yz-align-vcenter">',
                        '<div class="selection"></div>',
                    '</div>',
                '</div>',
            '</tpl>', {
                isFinished: function (value) {
                    return value;
                },
                renderString: function (value) {
                    return Ext.util.Format.htmlEncode(value);
                },
                renderDate: function (value) {
                    return Ext.Date.toFriendlyString(value);
                },
                renderTitleRunning: function (step) {
                    var user,
                    recp = step.RecipientDisplayName,
                    owner = step.OwnerDisplayName,
                    encode = Ext.util.Format.htmlEncode,
                    delegation = '';

                    if (step.Share && !step.OwnerAccount)
                        recp = RS.$('All_BPM_SharePool');

                    if (!step.IsConsignStep && step.HandlerAccount && step.HandlerAccount != step.OwnerAccount)
                        delegation = Ext.String.format(RS.$('All__Delegation_FMT'), owner);

                    return Ext.String.format('{0}<span class="recp">[{1}{2}]</span>', encode(step.NodeDisplayName), encode(recp), encode(delegation));
                },
                renderTitleFinished: function (step) {
                    var user,
                    handler = step.HandlerDisplayName,
                    owner = step.OwnerDisplayName,
                    encode = Ext.util.Format.htmlEncode,
                    delegation = '';

                    if (!step.IsConsignStep && step.HandlerAccount != step.OwnerAccount)
                        delegation = Ext.String.format(RS.$('All__Delegation_FMT'), owner);

                    return Ext.String.format('{0}<span class="recp">[{1}{2}]</span>', encode(step.NodeDisplayName), encode(handler), encode(delegation));
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
            },
            itemtap: function (list, index, target, record, e, eOpts) {
                if (me.getSingleSelection()) {
                    e.stopEvent();
                    me.onok([record]);
                }
            }
        });

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onok: function (recs) {
        var me = this,
            steps = [];

        Ext.each(recs, function (rec) {
            steps.push(rec.data);
        });

        if (me.config.fn)
            me.config.fn.call(me.scope, steps, me);
    }
});