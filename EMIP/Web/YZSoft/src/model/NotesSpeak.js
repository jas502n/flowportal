Ext.define('YZSoft.src.model.NotesSpeak', {
    extend: 'Ext.data.Model',
    requires: [
        'YZSoft.src.ux.GlobalStore'
    ],
    config: {
        idProperty: 'ItemID',
        fields: [
            { name: 'ItemID', type: 'int' },
            { name: 'Account', type: 'string' },
            { name: 'Date', type: 'date' },
            { name: 'FileID', type: 'string' },
            { name: 'Duration', type: 'number' },
            { name: 'Comments', type: 'string' },
            { name: 'CreateAt', type: 'date' },
            { name: 'playing', type: 'boolean', defaultValue:false }
        ]
    }
});