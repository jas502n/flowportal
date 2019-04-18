Ext.define('YZSoft.src.model.Country', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'IDDCode',
        fields: [
            { name: 'Name', type: 'string' },
            { name: 'Name_en', type: 'string' },
            { name: 'IDDCode', type: 'string' },
            { name: 'Group', type: 'string' },
            { name: 'Order', type: 'string' },
            { name: 'Pinyin', type: 'string' }
        ]
    }
});