Ext.define('YZSoft.src.model.Step', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'StepID',
        fields: [
            { name: 'StepID', type: 'int' },
            { name: 'TaskID', type: 'int' },
            { name: 'ProcessName', type: 'string' },
            { name: 'ProcessVersion', type: 'string' },
            { name: 'NodeName', type: 'string' },
            { name: 'NodeDisplayName', type: 'string' },
            { name: 'SelAction', type: 'string' },
            { name: 'SelActionDisplayString', type: 'string' },
            { name: 'OwnerAccount', type: 'string' },
            { name: 'OwnerDisplayName', type: 'string' },
            { name: 'AgentAccount', type: 'string' },
            { name: 'AgentDisplayName', type: 'string' },
            { name: 'RecipientAccount', type: 'string' },
            { name: 'RecipientDisplayName', type: 'string' },
            { name: 'HandlerAccount', type: 'string' },
            { name: 'HandlerDisplayName', type: 'string' },
            { name: 'Comments', type: 'string' },
            { name: 'Memo', type: 'string' },
            { name: 'FinishAt', type: 'date' },
            { name: 'ReceiveAt', type: 'date' },
            { name: 'Finished', type: 'boolean' },
            { name: 'IsConsignStep', type: 'boolean' },
            { name: 'Share', type: 'boolean' },
            { name: 'AutoProcess', type: 'boolean' }
        ]
    }
});