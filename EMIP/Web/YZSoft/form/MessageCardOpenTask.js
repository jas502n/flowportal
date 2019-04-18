
Ext.define('YZSoft.form.MessageCardOpenTask', {
    extend: 'YZSoft.form.Read',
    requires: [
        //--------------微信钉钉启动程序附加项-----------------
        'YZSoft.form.Read',
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
        var me = this;

        config.tid = Number(config.tid);

        me.callParent([config]);
    }
});