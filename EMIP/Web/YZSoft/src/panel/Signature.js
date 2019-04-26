
Ext.define('YZSoft.src.panel.Signature', {
    extend: 'Ext.Panel',

    config: {
        cls: 'yz-msgbox',
        modal: true,
        hideOnMaskTap: true,
        centered: true,
        width: 400,
        height: 300
    },

    constructor: function (config) {
        var me = this;
        me.btnOK = Ext.create('Ext.Button', {
            text: RS.$('All__OK'),
            cls: 'yz-button-flat yz-button-dlg-default',
            flex: 1,
            handler: function () {
                var comments = $("#Signature").jSignature("getData");
                
                if ($("#Signature").jSignature('getData', 'native').length == 0) {
                    Ext.Msg.alert("提示", "请输入签名！");

                }
                else {
                    if (me.config.fn)
                        me.config.fn.call(me.scope, comments, me);
                }
            }
        });

        me.btnCancel = Ext.create('Ext.Button', {
            text: '撤销',
            cls: 'yz-button-flat yz-button-dlg-normal',
            flex: 1,
            handler: function () {
                $("#Signature").jSignature("reset");
            }
        });
        me.iframe = Ext.create('Ext.Panel', {
            html: "<div id='Signature'></div>"
        });
        var cfg = {
            layout: 'fit',
            items: [{
                docked: 'top',
                xtype: 'titlebar',
                cls: 'yz-titlebar-panel',
                title: "手写签名"
            }, me.iframe, {
                docked: 'bottom',
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [me.btnCancel, { xtype: 'spacer', width: 20 }, me.btnOK]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },
    show: function () {
        $("#Signature").jSignature({ width: 400, height: 200 });

    }
});