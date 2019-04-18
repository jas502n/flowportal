
Ext.define('YZSoft.src.button.TimerButton', {
    extend: 'YZSoft.src.button.Button',
    config: {
        cls: ['yz-button-flat', 'yz-button-timer']
    },

    template: [{
        tag: 'span',
        reference: 'badgeElement',
        hidden: true
    }, {
        tag: 'span',
        className: Ext.baseCSSPrefix + 'button-icon',
        reference: 'iconElement'
    }, {
        tag: 'div',
        children: [{
            tag: 'div',
            reference: 'textElement'
        }, {
            tag: 'div',
            className: 'yz-button-label-timer',
            reference: 'timerElement'
        }]
    }],

    constructor: function () {
        var me = this;

        me.callParent(arguments);

        me.updatetime();

        me.timer = setInterval(function () {
            me.updatetime();
        }, 100);
    },

    updatetime: function () {
        this.timerElement.setHtml(Ext.Date.format(new Date(), 'H:i'));
    },

    destroy: function () {
        var me = this;

        if (me.timer) {
            clearInterval(me.timer);
            delete me.timer;
        }

        me.callParent(arguments);
    }
});