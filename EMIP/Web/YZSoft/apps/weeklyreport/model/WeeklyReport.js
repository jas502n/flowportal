Ext.define('YZSoft.apps.weeklyreport.model.WeeklyReport', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'Week',
        fields: [
            { name: 'Week', type: 'int' },
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
            { name: 'IsEmpty', type: 'boolean' },
            { name: 'FirstDate', type: 'date' },
            { name: 'LastDate', type: 'date' }
        ]
    }
});