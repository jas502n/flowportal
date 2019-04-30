
Ext.define('YZSoft.src.field.Invoice.WeChat', {
    extend: 'YZSoft.src.field.Invoice.Abstract',

    onAddFileClick: function () {
        var me = this,
            app = application.startApp;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            defaultCameraMode: "normal", //表示进入拍照界面的默认模式，目前有normal与batch两种选择，normal表示普通单拍模式，batch表示连拍模式，不传该参数则为normal模式。（注：用户进入拍照界面仍然可自由切换两种模式）
            isSaveToAlbum: 0, //整型值，0表示拍照时不保存到系统相册，1表示自动保存，默认值是1
            success: function (res) {
                var localIds = res.localIds;

                wx.uploadImage({
                    localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        var serverId = res.serverId; // 返回图片的服务器端ID

                        YZSoft.Ajax.request({
                            waitMsg: {
                                cls: 'yzl-loadmask',
                                message: '识别中...',
                                autoClose: false
                            },
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/WeChat/Core.ashx'),
                            params: {
                                Method: 'DownloadTempMediaFile',
                                cropId: app.corpId,
                                appSecret: app.secret,
                                mediaId: serverId
                            },
                            success: function (action) {
                                var actions = action.result;
                                wx.getLocalImgData({
                                    localId: localIds[0],
                                    success: function (res) {
                                        var localData = res.localData;
                                        YZSoft.Ajax.request({
                                            method: 'POST',
                                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/YZApp/App.ashx'),
                                            async: false,
                                            params: {
                                                method: 'GetInvoiceInfo',
                                                localData: localData
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


                                    }
                                });
                            },
                            failure: function (action) {
                                Ext.Viewport.unmask();
                                Ext.Msg.alert(RS.$('All_Error'), action.result.errorMessage);
                            }
                        });
                    }
                });
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
        wx.previewImage({
            current: url,
            urls: [url]
        });
    }


});