Ext.define('YZSoft.src.model.ExpenseType', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'Code',
        fields: [
            { name: 'Code', type: 'string' },
            { name: 'Text', type: 'string' },
            { name: 'NameSpace', type: 'string' },
            { name: 'Image', type: 'string' },
            { name: 'imageurl', type: 'string', convert: function (v, record) {
                return YZSoft.$url(record.data.NameSpace, record.data.Image)
            }}
        ]
    }
});