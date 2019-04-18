
Ext.define('YZSoft.src.component.SquaredSegmentedButton', {
    extend: 'YZSoft.src.container.SquaredContainer',
    config: {
        minBoxCount: 3,
        minBoxWidth: 150,
        scrollable: null,
        cls: 'yz-layout-columnbuttons',
        itemDefaults: {
            xtype: 'button',
            cls: ['yz-button-check', 'yz-button-squared-button', 'yz-border-width-1']
        },
        emptyElementConfig: {
            xtype: 'component',
            cls: ['yz-button-check'],
            style:'border:none'
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        cfg = {
            itemDefaults: {
                scope: me,
                handler: 'onButtonClick'
            }
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.reset();
    },

    onButtonClick: function (button) {
        this.setCheckedButton(button);
        this.fireEvent('itemClick', button);
    },

    getCheckedButton: function () {
        return [this.curButton];
    },

    setCheckedButton: function (button) {
        var me = this,
            curButton = me.curButton;

        if (curButton == button)
            return;

        if (curButton)
            curButton.removeCls('x-button-pressed');

        button.addCls('x-button-pressed');
        me.curButton = button;
    },

    reset: function () {
        this.setCheckedButton(this.getAt(0).getAt(0));
    }
});