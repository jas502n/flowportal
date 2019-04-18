
Ext.define('YZSoft.src.field.ScanQRCode.WeChat', {
    extend: 'YZSoft.src.field.ScanQRCode.Abstract',

    onAddFileClick: function () {
        var me = this,
            app = application.startApp;
        
        wx.scanQRCode({
            desc: '扫码',
            needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
            scanType: ["qrCode"], // 可以指定扫二维码还是条形码（一维码），默认二者都有
            success: function (res) {
                var result = res.resultStr
            
                 me.addScanQRCode(result);
            },
            error: function (res) {
                if (res.errMsg.indexOf('function_not_exist') > 0) {
                    alert('版本过低请升级')
                }
            }
        });
    }


});