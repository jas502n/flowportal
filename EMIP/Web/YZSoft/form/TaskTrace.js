
Ext.define('YZSoft.form.TaskTrace', {
    extend: 'Ext.dataview.List',
    requires: [
        'YZSoft.src.model.Step'
    ],
    config: {
        disableSelection: true,
        itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-trace'],
        itemTpl: Ext.create('Ext.XTemplate',
        '<tpl if="!this.isFinished(Finished)">',
            '<div class="yz-layout-columns yz-trace-item-running">',
                '<div class="yz-column-left yz-align-vcenter">',
                    '<div class="indicator"></div>',
                '</div>',
                '<div class="yz-column-center">',
                    '<div class="title">{[this.renderTitleRunning(values)]}</div>',
                '</div>',
                '<div class="yz-column-right">',
        // '<div class="receiveat">{ReceiveAt:this.renderDate}</div>',
                '</div>',
            '</div>',
        '<tpl else>',
            '<div class="yz-layout-columns yz-trace-item-finished">',
                '<div class="yz-column-left yz-align-vcenter">',
                    '<div class="indicator"></div>',
                '</div>',
                '<div class="yz-column-center">',
                    '<div class="title">{[this.renderTitleFinished(values)]}</div>',
                    '<div class="date">{FinishAt:this.renderDate}</div>',
                    '<div class="comments">{Comments:this.renderString}</div>',
                '</div>',
                '<div class="yz-column-right yz-align-vcenter">',
                    '<div class="action">{SelActionDisplayString:this.renderString}</div>',
                '</div>',
            '</div>',
        '</tpl>', {
            isFinished: function (value) {
                return value;
            },
            renderString: function (value) {
                return YZSoft.$1(Ext.util.Format.htmlEncode(value));
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

                if (!step.IsConsignStep && step.OwnerAccount && step.HandlerAccount && step.HandlerAccount != step.OwnerAccount)
                    delegation = Ext.String.format(RS.$('All__Delegation_FMT'), owner);

                return Ext.String.format('[{0}] {1} {2}', encode(recp), encode(step.NodeDisplayName), encode(delegation));
            },
            renderTitleFinished: function (step) {
                var user,
                    handler = step.HandlerDisplayName,
                    owner = step.OwnerDisplayName,
                    encode = Ext.util.Format.htmlEncode,
                    delegation = '';

                //if (step.Share && !step.OwnerAccount)
                //    handler = RS.$('All_BPM_SharePool');

                if (!step.IsConsignStep && step.OwnerAccount && step.HandlerAccount && step.HandlerAccount != step.OwnerAccount)
                    delegation = Ext.String.format(RS.$('All__Delegation_FMT'), owner);

                return Ext.String.format('[{0}] {1} {2}', encode(handler), encode(step.NodeDisplayName), encode(delegation));
            }
        })
    },

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.Step',
            sorters: [{
                property: 'Finished',
                direction: 'ASC'
            }, {
                property: 'StepID',
                direction: 'DESC'
            }]
        });

        var cfg = {
            store: me.store
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});