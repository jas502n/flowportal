
Ext.define('YZSoft.personal.security.lock.PasswordField', {
    extend: 'YZSoft.src.field.AbstractContainerField',
    config: {
        passwordLength: 4,
        hasValueCls: 'yz-screenlock-password-char-hasvalue',
        layout: {
            type: 'hbox',
            align: 'center',
            pack: 'center'
        },
        cls: ['yz-field-screenlock-password']
    },

    constructor: function (config) {
        var me = this,
            passwordLength = config.passwordLength || me.config.passwordLength,
            items = [], cfg, i;

        for (i = 0; i < passwordLength; i++) {
            items.push({
                xtype: 'component',
                cls: ['yz-screenlock-password-char']
            });
        }

        cfg = {
            items: items
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            scope: me,
            keyclick: 'onKeyClick',
            fullinputed: function (value) {
            }
        });
    },

    onKeyClick: function (keycode) {
        var me = this,
            items = me.getItems().items,
            hasValueCls = me.getHasValueCls(),
            inputItem, i;

        if (keycode != 'backspace') {
            inputItem = me.getFirstEmptyItem();

            if (inputItem) {
                inputItem.value = keycode;
                inputItem.element.addCls(hasValueCls);

                inputItem = me.getFirstEmptyItem();
                if (!inputItem)
                    me.fireEvent('fullinputed', me.getValue());
            }
        }
        else {
            inputItem = me.getLastHasValueItem();

            if (inputItem) {
                inputItem.value = '';
                inputItem.element.removeCls(hasValueCls);
            }
        }
    },

    clear: function () {
        var me = this,
            items = me.getItems().items,
            hasValueCls = me.getHasValueCls();

        Ext.Array.each(items, function (item) {
            item.value = '';
            item.element.removeCls(hasValueCls);
        });
    },

    getFirstEmptyItem: function () {
        var me = this,
            items = me.getItems().items,
            hasValueCls = me.getHasValueCls(),
            inputItem;

        Ext.Array.each(items, function (item) {
            if (!item.element.hasCls(hasValueCls)) {
                inputItem = item;
                return false;
            }
        });

        return inputItem;
    },

    getLastHasValueItem: function () {
        var me = this,
            items = me.getItems().items,
            hasValueCls = me.getHasValueCls(),
            inputItem, i;

        for (i = items.length - 1; i >= 0; i--) {
            var item = items[i];
            if (item.element.hasCls(hasValueCls)) {
                inputItem = item;
                break;
            }
        }

        return inputItem;
    },

    getValue: function () {
        var me = this,
            items = me.getItems().items,
            value = [];

        Ext.Array.each(items, function (item) {
            value.push(item.value);
        });

        return value.join('');
    }
});
