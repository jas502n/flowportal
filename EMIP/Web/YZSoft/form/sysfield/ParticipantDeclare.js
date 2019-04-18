
Ext.define('YZSoft.form.sysfield.ParticipantDeclare', {
    extend: 'YZSoft.src.field.AbstractContainerField',
    config: {
        declare: null,
        routing: null
    },

    constructor: function (config) {
        var me = this,
            declare = config.declare,
            routing = config.routing,
            cfg;

        me.userField = Ext.create('YZSoft.src.field.Users', {
            label: Ext.String.format((declare.MultiRecipient ? '{0}' : RS.$('All_Form_SelParticipantSingle')), declare.TargetStepName),
            cls: 'yz-field-weight-label',
            singleSelection: !declare.MultiRecipient
        });

        me.routingType = Ext.create('Ext.SegmentedButton', {
            disabled: !declare.MultiRecipient || declare.RoutingType != 'None',
            align: 'right',
            margin: '0 10 0 0',
            defaults: {
                cls: ['yz-button-check', 'yz-border-width-1'],
                margin: '3 0 3 6',
                minHeight: 28
            },
            items: [{
                text: RS.$('All_ConsignRoutingType_Parallel'),
                value: 'Parallel'
            }, {
                text: RS.$('All_ConsignRoutingType_Serial'),
                value: 'Serial'
            }]
        });

        me.fieldRouting = Ext.create('Ext.TitleBar', {
            xtype: 'titlebar',
            cls: ['yz-titlebar-field', 'x-field'],
            titleAlign: 'left',
            title: RS.$('All_Form_SignOrder'),
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [me.routingType]
        });

        cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.userField, me.fieldRouting]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.addCls('x-field-nopadding');
        me.routingType.setValue('Serial');
        if (routing) {
            if (routing.RoutingType)
                me.routingType.setValue(routing.RoutingType);
            me.userField.setValue(routing.Uids);
        }

        if (declare.RoutingType != 'None')
            me.routingType.setValue(declare.RoutingType);
    },

    getValue: function () {
        var me = this;

        return {
            RoutingType: me.routingType.getValue(),
            Uids: me.userField.getValue()
        };
    }
});