
Ext.define('YZSoft.form.FormSwitch', {
    extend: 'Ext.Component',
    config: {
        container: null,
        left: 0,
        top: 0,
        pctext: RS.$('All_Form_PCForm'),
        mobiletext: RS.$('All_Form_MobileForm'),
        draggable: true,
        cls: ['yz-formswitch-wrap', 'yz-border-width-1']
    },

    initialize: function () {
        var me = this,
            drag = me.getDraggable(),
            container;

        me.callParent(arguments);

        me.on({
            single: true,
            painted: function () {
                container = drag.getContainer();
                container.on({
                    single: true,
                    resize: function () {
                        var constraint = drag.getConstraint(),
                            minOffset = constraint.min,
                            maxOffset = constraint.max;

                        drag.setOffset(maxOffset.x - 10, maxOffset.y - 10, false);
                        me.element.dom.style.opacity = 0.8;
                    }
                });
            }
        });

        me.setText(me.getPctext());

        me.element.on({
            scope: me,
            tap: 'onTap'
        });
    },

    setText: function (text) {
        this.setHtml(text);
    },

    getText: function () {
        return this.getHtml();
    },

    onTap: function () {
        var me = this,
            text = me.getText();

        if (text == me.getPctext()) {
            me.fireEvent('switchto', 'pc', me);
            me.setText(me.getMobiletext());
        }
        else {
            me.fireEvent('switchto', 'mobile', me);
            me.setText(me.getPctext());
        }
    }
});