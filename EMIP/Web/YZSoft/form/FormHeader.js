
Ext.define('YZSoft.form.FormHeader', {
    extend: 'Ext.Container',
    config: {
        cls: 'yz-form-header',
        task: null
    },

    constructor: function (config) {
        config = config || {};

        var me = this,
            task = config.task || {},
            encode = Ext.util.Format.htmlEncode,
            caption = task.OwnerShortName;

        if (task.AgentAccount && task.AgentAccount != task.OwnerAccount)
            caption += [
                '<div class="delegation">',
                    Ext.String.format(RS.$('All_BPM_DelegationBy_FMT'), encode(task.AgentShortName)),
                '</div>'
            ].join('');

        var cfg = {
            layout: {
                type: 'hbox'
            },
            items: [{
                xclass: 'YZSoft.src.component.Headshot',
                uid: task.OwnerAccount
            }, {
                xtype: 'container',
                layout: 'vbox',
                cls: 'mcnt',
                items: [{
                    xtype: 'component',
                    cls: 'username',
                    html: caption
                }, {
                    xtype: 'component',
                    html: Ext.String.format(RS.$('All_Form_TaskSN_FMT'), task.SerialNum),
                    cls: 'sn'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});