
Ext.define('YZSoft.src.field.Invoice.DingTalk', {
    extend: 'YZSoft.src.field.Invoice.Abstract',
    requires: [
        'YZSoft.src.ux.File'
    ],
    onAddFileClick: function () {
        var me = this,
            app = application.startApp;

        dd.biz.util.uploadImage({
            multiple: false, //是否多选，默认false
            max: 1, //最多可选个数
            onSuccess: function (result) {
                var mediaUrl = result[0];

                YZSoft.Ajax.request({
                    waitMsg: {
                        cls: 'yzl-loadmask',
                        message: '识别中...',
                        autoClose: false
                    },
                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/DingTalk/Core.ashx'),
                    params: {
                        Method: 'DownloadTempMediaFile',
                        mediaUrl: mediaUrl,
                        ext: YZSoft.src.ux.File.getExtension(mediaUrl)
                    },
                    success: function (action) {
                        var actions = action.result;
                        YZSoft.Ajax.request({
                            method: 'POST',
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/YZApp/App.ashx'),
                            async: false,
                            params: {
                                method: 'GetDdInvoiceInfo',
                                mediaUrl: mediaUrl
                            },
                            success: function (action) {
                                Ext.Viewport.unmask();
                                if (action.result.baidusuccess == "false") {
                                    Ext.Msg.show({
                                        title: '无法识别',
                                        message: '请重新扫描!',
                                        hideOnMaskTap: true,
                                        buttons: [{
                                            text: $rs.YesISee,
                                            flex: 1,
                                            cls: 'yz-button-flat yz-button-action-hot',
                                            itemId: 'ok'
                                        }]
                                    });

                                } else {
                                    var FileID = FileID = {
                                        FileID: actions.FileID
                                    }

                                    var data = {
                                        word: action.result.word,
                                        TotalAmount: action.result.TotalAmount,
                                        TotalTax: action.result.TotalTax,
                                        AmountInFiguers: action.result.AmountInFiguers
                                    }
                                    me.addInvoice(FileID, data);
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                Ext.Viewport.unmask();
                                alert(JSON.stringify(XMLHttpRequest));
                            }
                        });




                    },
                    failure: function (action) {
                        Ext.Msg.alert(RS.$('All_Error'), action.result.errorMessage);
                    }
                });
            },
            onFail: function (err) {
            }
        });
    },
    preview: function (rec) {
        var me = this,
            fileid = rec.data.FileID,
            url;

        if (!fileid)
            return;

        url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'ImageStreamFromFileID',
            fileid: fileid,
            dc: +new Date()
        }));

        url = YZSoft.$abs(url);
        dd.biz.util.previewImage({
            current: url,
            urls: [url],
            onSuccess: function (result) {
            },
            onFail: function (err) {
            }
        });
    }
});