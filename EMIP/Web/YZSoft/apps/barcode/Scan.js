
Ext.define('YZSoft.apps.barcode.Scan', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.device.BarcodeScanner'
    ],
    config: {
        cls: 'yz-panel-scan'
    },

    constructor: function (config) {
        var me = this;

        config = config || {};

        me.scan();

        me.btnBack = Ext.create('Ext.Button', {
            text: RS.$('All__Back'),
            cls: ['yz-button-flat', 'yz-button-scan-back'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me);
            }
        });

        me.btnList = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e91f',
            iconAlign: 'left',
            handler: function () {
                //if (!me.pnlList) {
                me.pnlList = Ext.create('YZSoft.apps.barcode.ListPanel', {
                    title: RS.$('BarcodeScan_History'),
                    back: function () {
                        Ext.mainWin.pop();
                    }
                });
                //}
                Ext.mainWin.push(me.pnlList);
            }
        });

        me.barcode = Ext.create('Ext.Component', {
            cls: 'barcode',
            style: 'text-align:center',
            tpl: '<div>{barcode}</dic>',
            data: {
                barcode: ''
            }
        });

        me.productName = Ext.create('Ext.Component', {
            cls: 'productname',
            html: ''
        });

        me.comments = Ext.create('Ext.field.TextArea', {
            cls: ['comments'],
            maxRows: 4
        });

        me.btnSave = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'btn-save'],
            text: RS.$('BarcodeScan_Scan'),
            handler: function () {
                if (me.btnSave.scanmode) { //扫描
                    delete me.value;
                    me.scan();
                }
                else {  //保存
                    me.save({
                        fn: function () {
                            me.btnSave.scanmode = true;
                            me.btnSave.setText(RS.$('BarcodeScan_Continue'));
                        }
                    });
                }
            }
        });

        var cfg = {
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [{
                xtype: 'container',
                cls: 'cnt-topic',
                layout: {
                    type: 'vbox',
                    pack: 'center',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'container',
                    cls: 'cnt-btn',
                    items: [me.btnBack]
                }, {
                    xtype: 'container',
                    cls: 'cnt-btn',
                    style: 'right:0px;',
                    items: [me.btnList]
                }, me.barcode]
            }, {
                xtype: 'container',
                cls: 'cnt-productname',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'component',
                    cls: 'title',
                    html: RS.$('BarcodeScan_ProductDesc')
                }, me.productName]
            }, {
                xtype: 'container',
                cls: 'cnt-comments',
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'component',
                    cls: 'title',
                    html: RS.$('All__Comments')
                }, me.comments]
            }, me.btnSave]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    scan: function () {
        var me = this;

        YZSoft.src.device.BarcodeScanner.scan({
            successEnterRight: true,
            success: function (result) {
                me.value = {
                    BarcodeValue: result.text,
                    Format: result.format
                };

                if (!result.cancelled) {
                    me.btnSave.scanmode = false;
                    me.btnSave.setText(RS.$('All__Save'));

                    me.barcode.setData({ barcode: me.value.BarcodeValue });
                    me.productName.setHtml('');

                    YZSoft.Ajax.request({
                        url: YZSoft.$url('YZSoft.Services.REST.Mobile/MDM/MasterData.ashx'),
                        params: {
                            Method: 'GetBarcodeInfo',
                            barcode: me.value.BarcodeValue,
                            format: me.value.Format
                        },
                        success: function (action) {
                            var productName = action.result.ProductName || '';
                            me.value.ProductName = productName;
                            me.productName.setHtml(productName);
                        },
                        failure: function (action) {
                            Ext.Msg.alert(RS.$('BarcodeScan_GetProductInfo_Failed'), action.result.errorMessage);
                        }
                    });
                }
                else {
                    me.btnSave.scanmode = true;
                    me.btnSave.setText(RS.$('BarcodeScan_Continue'));

                    //Ext.mainWin.getLayout().getAnimation().disable();
                    //Ext.mainWin.pop();
                    //Ext.mainWin.getLayout().getAnimation().enable();
                }
            }
        });
    },

    getData: function () {
        var me = this;

        return Ext.apply({
            Comments: me.comments.getValue()
        }, me.value);
    },

    save: function (opts) {
        var me = this,
            data = me.getData();

        if (!data.BarcodeValue)
            return;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/Apps/Barcode.ashx'),
            waitMsg: {
                message: RS.$('All__Saving'),
                autoClose: false
            },
            delay: true,
            params: {
                Method: 'Save'
            },
            jsonData: data,
            success: function (action) {
                Ext.Viewport.mask({
                    cls: 'yz-mask-success',
                    message: RS.$('All__Saving_Mask_Succeed'),
                    delay: true,
                    fn: function () {
                        if (opts.fn)
                            opts.fn.call(opts.scope || me, action.result);
                    }
                })

                if (opts.done)
                    opts.done.call(opts.scope || me, action.result);
            },
            failure: function (action) {
                Ext.Msg.alert(RS.$('All__Title_SaveFailed'), action.result.errorMessage);
            }
        });
    }
});