
Ext.define('YZSoft.src.component.Headshot', {
    extend: 'Ext.Img',
    config: {
        cls: ['yz-headshort'],
        uid: null
    },

    applyUid: function (uid) {
        var me = this,
            url;

        url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'GetHeadshot',
            account: uid,
            thumbnail: 'M'
        }));

        me.setSrc(url);
    }
});