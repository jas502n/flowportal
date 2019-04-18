
Ext.define('YZSoft.src.button.Button', {
    extend: 'Ext.Button',
    config: {
        iconColor: null
    },

    updateIconColor: function (color) {
        var me = this,
            element = me.iconElement;

        if (color)
            element.setStyle('color', color);
    }
});