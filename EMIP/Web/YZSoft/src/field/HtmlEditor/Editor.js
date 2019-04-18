
Ext.define('YZSoft.src.field.HtmlEditor.Editor', {
    extend: 'Ext.Container',
    requires: [
    ],

    constructor: function (config) {
        var me = this,
            config = config || '',
            cfg;

        me.editor = Ext.create('Ext.Container', {
            padding: 10,
            scrollable: {
                direction: 'vertical'
            },
            html: config.value
        });

        cfg = {
            layout: 'fit',
            items: [
                me.editor
            ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    }
});
