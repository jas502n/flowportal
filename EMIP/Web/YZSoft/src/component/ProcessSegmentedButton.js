
Ext.define('YZSoft.src.component.ProcessSegmentedButton', {
    extend: 'YZSoft.src.component.SquaredSegmentedButton',
    config: {
        minBoxCount: 3,
        minBoxWidth: 150,
        scrollable: null,
        cls: 'yz-layout-columnbuttons'
    },

    constructor: function (config) {
        var me = this,
            items = [],
            processeNames, cfg;

        YZSoft.Ajax.request({
            async: false,
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Process.ashx'),
            params: {
                method: 'GetAllProcessNames'
            },
            success: function (action) {
                processeNames = action.result;
            }
        });

        items.push({
            text: RS.$('All__All'),
            value: null,
            isAll:true
        });

        Ext.each(processeNames, function (processName) {
            items.push({
                text: processName,
                value: processName
            });
        });

        cfg = {
            items: items
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});