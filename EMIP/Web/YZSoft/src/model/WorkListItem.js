Ext.define('YZSoft.src.model.WorkListItem', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'StepID',
        fields: [
            { name: 'StepID', type: 'int' },
            { name: 'TaskID', type: 'int' },
            { name: 'SerialNum', type: 'string' },
            { name: 'ProcessName', type: 'string' },
            { name: 'ProcessVersion', type: 'string' },
            { name: 'OwnerAccount', type: 'string' },
            { name: 'OwnerDisplayName', type: 'string' },
            { name: 'AgentAccount', type: 'string' },
            { name: 'AgentDisplayName', type: 'string' },
            { name: 'CreateAt', type: 'date' },
            { name: 'NodeName', type: 'string' },
            { name: 'ReceiveAt', type: 'date' },
            { name: 'Share', type: 'boolean' },
            { name: 'TimeoutFirstNotifyDate', type: 'date' },
            { name: 'TimeoutDeadline', type: 'date' },
            { name: 'TimeoutNotifyCount', type: 'int' },
            { name: 'Description', type: 'string' },
            { name: 'Progress', type: 'float' },
            { name: 'Owner', type: 'string' },
            { name: 'ShortName', type: 'string' },
            { name: 'Color', type: 'string' },
            { name: 'perm', type: 'object' }
        ]
    }
});