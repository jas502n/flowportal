Ext.define('YZSoft.src.model.RemindTarget', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'StepID',
        fields: [
            { name: 'StepID', type: 'int' },
            { name: 'NodeDisplayName', type: 'string' },
            { name: 'Account', type: 'string' },
            { name: 'ShortName', type: 'string' },
            { name: 'ElapsedMinutes', type: 'int' }
        ]
    }
});