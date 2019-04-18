
Ext.define('YZSoft.src.field.ScanQRCode.DingTalk', {
    extend: 'YZSoft.src.field.ScanQRCode.Abstract',

    onAddFileClick: function () {
        var me = this,
            app = application.startApp;

        dd.biz.util.scan({
            onSuccess: function (data) {
                var result = data.text;

                me.addScanQRCode(result);
            },
            onFail: function (err) {
            }
        })
    }
});