/*********************************************************************/
//本示例演示了账号转名字功能
/*********************************************************************/
/*--------------------增加按钮，点击启动本表单演示--------------------
{
    xtype: 'button',
    text: '账号转名字',
    iconCls: 'yz-glyph yz-glyph-e974',
    handler: function () {
        var pnl = Ext.create('YZSoft.form.Post', {
            title: '账号转名字',
            processName: '$移动表单控件',
            form: {
                xclass: 'YZSoft.demo.Code2Name'
            },
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
    }
}
---------------------------------------------------------------------*/
Ext.define('YZSoft.demo.Code2Name', {
    extend: 'Ext.form.Panel',
    requires: [
        'Ext.form.FieldSet',
        'YZSoft.src.ux.GlobalStore'
    ],
    config: {
        cls: 'yz-form',
        style: 'background-color:#f3f5f9',
        scrollable: {
            direction: 'vertical',
            indicators: false
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            items: [{
                xtype: 'fieldset',
                padding: '0',
                items: [{
                    xclass: 'YZSoft.src.field.Account',
                    label: '账号转名字',
                    xdatabind: 'iDemoAppFields.Email',
                    value:'99199'
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});