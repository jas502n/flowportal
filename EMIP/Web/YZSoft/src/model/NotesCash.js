Ext.define('YZSoft.src.model.NotesCash', {
    extend: 'Ext.data.Model',
    requires: [
        'YZSoft.src.ux.GlobalStore'
    ],
    config: {
        idProperty: 'ItemID',
        fields: [
            { name: 'ItemID', type: 'int' },
            { name: 'Account', type: 'string' },
            { name: 'Type', type: 'string' },
            { name: 'Amount', type: 'number' },
            { name: 'Invoice', type: 'float' },
            { name: 'Comments', type: 'string' },
            { name: 'CreateAt', type: 'date' },
            { name: 'typeimageurl', type: 'string', convert: function (v, record) {
                var store = YZSoft.src.ux.GlobalStore.getExpenseTypeStore(),
                    typeRec = store.getById(record.data.Type);

                if (!record.data.Type) {
                    return YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/expense/empty.png');
                }
                else if (typeRec) {
                    return YZSoft.$url(typeRec.data.NameSpace, typeRec.data.Image);
                }
                else {
                    return YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/expense/unknow.png');
                }
            }
            },
            { name: 'title', type: 'string', convert: function (v, record) {
                var store = YZSoft.src.ux.GlobalStore.getExpenseTypeStore(),
                    typeRec = store.getById(record.data.Type);

                if (record.data.Comments) {
                    return record.data.Comments;
                }
                else if (typeRec) {
                    return typeRec.data.Text;
                }
                else {
                    return RS.$('All__Cash_DefaultText');
                }
            }
            }
        ]
    }
});