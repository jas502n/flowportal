
Ext.define('YZSoft.src.panel.SoftKeyboardTel', {
    extend: 'Ext.Container',
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
                    flex: 1,
                    cls: ['yz-button-flat', 'yz-button-keyboard'],
                    scope: me,
                    handler: 'onKeyClick'
                }
            },
            items: [
                { items: [{ text: '1' },{ text: '2' }, { text: '3'}] },
                { items: [{ text: '4' }, { text: '5' }, { text: '6'}] },
                { items: [{ text: '7' }, { text: '8' }, { text: '9'}] },
                { items: [me.emptyButton, { text: '0' }, me.backspace] },
            ]
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