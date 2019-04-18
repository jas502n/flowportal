
Ext.define('YZSoft.form.MessageCardProcess', {
    extend: 'YZSoft.form.Process',
    requires: [
        //--------------微信钉钉启动程序附加项-----------------
        'YZSoft.form.Process',
        'YZSoft.form.FormAbstract',
        'YZSoft.src.ux.Push',
        'YZSoft.form.TaskAbstract',
        'YZSoft.src.ux.xml',
        'YZSoft.src.ux.TaskOpt',
        'YZSoft.form.TaskTrace',
        'YZSoft.src.model.Step',
        'YZSoft.form.FormSwitch',
        'YZSoft.form.Form',
        'YZSoft.form.FormHeader',
        'YZSoft.src.component.Headshot'
    ],

    constructor: function (config) {
        var me = this,
            pid = config.pid = Number(config.pid),
            stepInfo, cfg;

        YZSoft.Ajax.request({
            async:false,
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Form.ashx'),
            params: {
                Method: 'GetStepInfo',
                pid: pid
            },
            success: function (action) {
                stepInfo = action.result;
            }
        });

        if (!stepInfo.Finished) {
            cfg = {
                fn: function () {
                    if (application.wechat)
                        WeixinJSBridge.invoke('closeWindow', {}, function (res) { });

                    if (application.dingtalk)
                        dd.biz.navigation.close();
                }
            };

            Ext.apply(cfg, config);
            me.callParent([cfg]);
        }
        else {
            return Ext.create('YZSoft.form.Read', Ext.apply({
                tid: stepInfo.TaskID
            }, config));
        }
    }
});