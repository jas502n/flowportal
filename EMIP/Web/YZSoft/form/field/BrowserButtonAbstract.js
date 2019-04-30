
Ext.define('YZSoft.form.field.BrowserButtonAbstract', {
    extend: 'Ext.Button',
    mixins: [
        'YZSoft.form.field.mixins.Base'
    ],
    config: {
        cls: ['yz-button-flat', 'yz-button-titlebar'],
        iconCls: 'yz-glyph yz-glyph-e909',
        iconAlign: 'top',
        icon: undefined, //修正系统问题，会导致继承类不iconCls设置无效（不显示icon)
        singleSelection: true,
        datamap: null,
        appendMode: 'RemoveEmptyRow'
    },
    showBrowserWindow: Ext.emptyFn,
    onAfterBlockBind: Ext.emptyFn,

    constructor: function (config) {
        var me = this;

        me.callParent(arguments);
        me.on({
            single: true,
            scope: me,
            afterblockbind: 'onAfterBlockBind'
        });
    },

    doTap: function (btn, e) {
        var me = this;

        e.preventDefault();
        me.showBrowserWindow();
    },

    doMap: function (data) {
       
        var me = this,
            data = Ext.isArray(data) ? data : [data],
            row = me.getRow(),
            datamap = me.getDatamap(),
            singleSelection = me.getSingleSelection();

        if (singleSelection)
            row.doMap(data[0], datamap);
        else
            row.doMapGrid(data, datamap, me.getAppendMode());
    }
});