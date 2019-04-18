Ext.define('YZSoft.src.model.Group', {
    extend: 'Ext.data.Model',
    requires: [
        'YZSoft.src.ux.GlobalStore'
    ],
    config: {
        idProperty: 'GroupID',
        fields: [
            { name: 'GroupID', type: 'int' },
            { name: 'GroupType', type: 'string' },
            { name: 'Name', type: 'string' },
            { name: 'Desc', type: 'string' },
            { name: 'DocumentFolderID', type: 'int' },
            { name: 'FolderID', type: 'int' },
            { name: 'Owner', type: 'string' },
            { name: 'CreateAt', type: 'date' },
            { name: 'ImageFileID', type: 'string' },
            { name: 'Deleted', type: 'boolean' },
            { name: 'DeleteBy', type: 'string' },
            { name: 'DeleteAt', type: 'date' },
            { name: 'MemberCount', type: 'int' },
            { name: 'imageurl', convert: function (v, record) {
                if (record.data.GroupType == 'Chat') {
                    var store = YZSoft.src.ux.GlobalStore.getGroupImageStore(),
                        record = store.getById(record.data.ImageFileID) || store.getById('Group99');

                    return YZSoft.$url(record.data.NameSpace, record.data.Image);
                }
                else {
                    if (record.data.ImageFileID) {
                        return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                            Method: 'ImageStreamFromFileID',
                            scale: 'Scale',
                            width: 161,
                            height: 139,
                            fileid: record.data.ImageFileID
                        }));
                    }
                    else {
                        return YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/group/Group99.png');
                    }
                }
            }
            }
        ]
    }
});