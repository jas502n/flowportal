
Ext.define('YZSoft.personal.security.lock.UnlockSoftKeyboard', {
    extend: 'Ext.Container',
    sp:{
        xtype:'container',
        flex:3,
        cls:''
    },
    spside: {
        xtype: 'container',
        flex: 3,
        cls:''
    },
    emptyButton: {
        text: '',
        disabled: true,
        cls: ['yz-button-flat', 'yz-button-keyboard', 'yz-button-keyboard-func', 'yz-button-keyboard-empty']
    },
    backspace: {
        text: '',
        keycode: 'backspace',
        iconCls: 'yz-glyph yz-glyph-e94d',
        cls: ['yz-button-flat', 'yz-button-keyboard', 'yz-button-keyboard-func', 'yz-button-keyboard-backspace']
    },
    config: {
        cls: ['yz-keyboard-tel']
    },

    constructor: function (config) {
        var me = this,
            cfg;


        cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                defaults: {
                    xtype: 'button',
                    cls: ['yz-button-flat', 'yz-button-keyboard'],
                    scope: me,
                    handler: 'onKeyClick'
                }
            },
            items: [
                { items: [me.spside, { text: '1' }, me.sp, { text: '2' }, me.sp, { text: '3' }, me.spside] },
                { items: [me.spside, { text: '4' }, me.sp, { text: '5' }, me.sp, { text: '6' }, me.spside] },
                { items: [me.spside, { text: '7' }, me.sp, { text: '8' }, me.sp, { text: '9' }, me.spside] },
                { items: [me.spside, me.emptyButton, me.sp, { text: '0' }, me.sp, me.backspace, me.spside] }, ]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onKeyClick: function (btn) {
        var me = this,
            keycode = btn.config.keycode || btn.config.text;

        me.fireEvent('keyclick', keycode, btn);
    }
});