Ext.define('YZSoft.apps.monthlyreport.model.MonthlyReportTeam', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'Account',
        fields: [
            { name: 'ItemID', type: 'int' },
            { name: 'TaskID', type: 'int' },
            { name: 'Account', type: 'string' },
            { name: 'ShortName', type: 'string' },
            { name: 'Date', type: 'date' },
            { name: 'Done', type: 'string' },
            { name: 'Undone', type: 'string' },
            { name: 'Coordinate', type: 'string' },
            { name: 'Comments', type: 'string' },
            { name: 'Pics', type: 'string' },
            { name: 'Attachments', type: 'string' },
            { name: 'CreateAt', type: 'date' },
            { name: 'IsEmpty', type: 'boolean' },
            { name: 'headsort', convert: function (v, record) {
                return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                    Method: 'GetHeadshot',
                    account: record.data.Account,
                    thumbnail: 'M'
                }));
            } 
            }
        ]
    }
});