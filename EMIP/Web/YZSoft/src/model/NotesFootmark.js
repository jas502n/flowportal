Ext.define('YZSoft.src.model.NotesFootmark', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'ItemID',
        fields: [
            { name: 'ItemID', type: 'int' },
            { name: 'Account', type: 'string' },
            { name: 'Time', type: 'date' },
            { name: 'Rawlat', type: 'float' },
            { name: 'Rawlon', type: 'float' },
            { name: 'Lat', type: 'float' },
            { name: 'Lon', type: 'float' },
            { name: 'LocId', type: 'string' },
            { name: 'LocName', type: 'string' },
            { name: 'LocAddress', type: 'string' },
            { name: 'Contact', type: 'string' },
            { name: 'Comments', type: 'string' },
            { name: 'Attachments', type: 'string' }
        ]
    }
});