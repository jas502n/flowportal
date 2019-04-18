Ext.define('YZSoft.apps.dailyreport.model.DailyReport', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'Day',
        fields: [
            { name: 'Day', type: 'int' },
            { name: 'ItemID', type: 'int' },
            { name: 'TaskID', type: 'int' },
            { name: 'Account', type: 'string' },
            { name: 'Date', type: 'date' },
            { name: 'Done', type: 'string' },
            { name: 'Undone', type: 'string' },
            { name: 'Coordinate', type: 'string' },
            { name: 'Comments', type: 'string' },
            { name: 'Pics', type: 'string' },
            { name: 'Attachments', type: 'string' },
            { name: 'CreateAt', type: 'date' },
            { name: 'IsEmpty', type: 'boolean' }
        ]
    }
});