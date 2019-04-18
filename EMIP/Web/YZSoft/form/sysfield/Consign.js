
Ext.define('YZSoft.form.sysfield.Consign', {
    extend: 'YZSoft.src.field.AbstractContainerField',
    config: {
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.userField = Ext.create('YZSoft.src.field.Users', {
            label: config.label || '',
            cls: 'yz-field-weight-label'
        });

        me.routingType = Ext.create('Ext.SegmentedButton', {
            align: 'right',
            margin: '0 10 0 0',
            defaults: {
                cls: ['yz-button-check', 'yz-border-width-1'],
                margin: '3 0 3 6',
                minHeight: 28
            },
            items: [{
                text: RS.$('All_ConsignRoutingType_Parallel'),
                value: 'Parallel',
                pressed: true
            }, {
                text: RS.$('All_ConsignRoutingType_Serial'),
                value: 'Serial'
            }]
        });

        me.returnType = Ext.create('Ext.SegmentedButton', {
            align: 'right',
            margin: '0 10 0 0',
            defaults: {
                cls: ['yz-button-check', 'yz-border-width-1'],
                margin: '3 0 3 6',
                minHeight: 28
            },
            items: [{
                text: RS.$('All_ConsignReturnType_Return'),
                value: 'Return',
                pressed: true
            }, {
                text: RS.$('All_ConsignReturnType_Forward'),
                value: 'Forward'
            }]
        });

        cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.userField, {
                xtype: 'titlebar',
                cls: ['yz-titlebar-field', 'x-field','yz-field-noborder'],
                titleAlign: 'left',
                title: RS.$('All_ConsignRoutingType'),
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [me.routingType]
            }, {
                xtype: 'titlebar',
                cls: ['yz-titlebar-field', 'x-field'],
                titleAlign: 'left',
                title: RS.$('All_ConsignReturnType'),
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [me.returnType]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.addCls('x-field-nopadding');
    },

    getValue: function () {
        var me = this,
            uids = me.userField.getValue();

        me.routingType.getValue();

        return {
            enabled: uids.length == 0 ? false : true,
            routingType: me.routingType.getValue(),
            returnType: me.returnType.getValue(),
            uids: uids
        };
    }
});