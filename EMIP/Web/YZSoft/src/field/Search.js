
Ext.define('YZSoft.src.field.Search', {
    extend: 'Ext.field.Text',
    requires: ['YZSoft.src.field.component.SearchInput'],
    activeCls: 'yz-field-search-active',
    config: {
        cls: 'yz-field-search',
        clearIcon: false,
        cancelButton: true,
        cancelText: RS.$('All__Cancel'),
        focusOnMaskTap: true,
        expand: false,
        active: false,
        component: {
            xtype: 'yzsearchinput',
            type: 'search',
            fastFocus: true
        }
    },

    getElementConfig: function () {
        var prefix = Ext.baseCSSPrefix;

        return {
            reference: 'element',
            className: 'x-container',
            children: [{
                reference: 'label',
                cls: prefix + 'form-label',
                children: [{
                    reference: 'labelspan',
                    tag: 'span'
                }]
            }, {
                reference: 'wrap',
                cls: 'yz-search-wrap',
                children: [{
                    reference: 'innerElement',
                    cls: prefix + 'component-outer',
                    children: []
                }, {
                    reference: 'cancel',
                    tag: 'div',
                    cls: 'yz-search-cancel',
                    html: RS.$('All__Cancel')
                }, {
                    reference: 'mask',
                    classList: ['yz-search-field-mask']
                }]
            }]
        };
    },

    constructor: function (config) {
        var me = this;

        me.callParent([config]);

        me.mask.on({
            scope: me,
            tap: 'onMaskTap'
        });

        me.cancel.on({
            scope: me,
            tap: 'onCancelTap'
        });

        me.getComponent().on({
            scope: me,
            inputtap: 'onInputTap'
        });

        me.getComponent().input.on({
            scope: me,
            keypress: 'onKeyPress'
        });
    },

    updateCancelText: function (newValue) {
        this.cancel.setHtml(newValue);

    },

    updateCancelButton: function (newValue, oldValue) {
        var me = this,
            cls = 'yz-field-search-cancelable';

        if (newValue)
            me.addCls(cls);
        else
            me.removeCls(cls);
    },

    updateExpand: function (newValue, oldValue) {
        var me = this,
            cls = 'yz-field-search-expand';

        if (newValue) {
            me.removeCls('yz-anim-search-active');
            me.removeCls('yz-anim-search-cancel');
            me.addCls('yz-anim-search-expand');
            me.addCls(cls);
        }
        else {
            if (oldValue !== undefined) {
                me.removeCls('yz-anim-search-active');
                me.removeCls('yz-anim-search-cancel');
                me.addCls('yz-anim-search-expand');
                me.removeCls(cls);
                me.removeCls(me.activeCls);
            }
        }
    },

    updateActive: function (newValue, oldValue) {
        var me = this;

        if (newValue) {
            me.removeCls('yz-anim-search-expand');
            me.removeCls('yz-anim-search-cancel');
            me.addCls(me.activeCls);
        }
    },

    onMaskTap: function (e) {
        var me = this,
            cmp = me.getComponent(),
            focusOnMaskTap = me.getFocusOnMaskTap(),
            expand = me.getExpand();

        e.stopEvent();
        me.activeSearch();

        if (expand) {
            me.focus();
        }
        else {
            cmp.element.on({
                single: true,
                transitionend: function (ev, el, o) {
                    if (me.fireEvent('afteractivesearch', me) === false)
                        return;

                    if (focusOnMaskTap) {

                        Ext.defer(function () {
                            if (!Ext.os.is.iOS)
                                me.focus();
                        }, 10);
                    }
                }
            });
        }
    },

    onCancelTap: function (e) {
        var me = this;

        e.stopEvent();
        me.blur();

        me.cancelSearch();
    },

    onInputTap: function (input, e) {
    },

    activeSearch: function () {
        var me = this;

        me.fireEvent('beforeactivesearch', me);

        me.removeCls('yz-anim-search-expand');
        me.removeCls('yz-anim-search-cancel');
        me.addCls('yz-anim-search-active');
        me.addCls(me.activeCls);

        me.fireEvent('activesearch', me);
    },

    cancelSearch: function () {
        var me = this;

        if (me.fireEvent('beforecancelsearch', me) !== false) {
            me.removeCls('yz-anim-search-expand');
            me.removeCls('yz-anim-search-active');
            me.addCls('yz-anim-search-cancel');
            me.removeCls(me.activeCls);
        }

        me.fireEvent('cancelsearch', me);
    },

    onKeyUp: function (e) {
        var me = this;

        me.callParent(arguments);
        me.fireEvent('inputchange', me, me.getValue(), e);
    },

    onPaste: function (e) {
        var me = this;

        me.callParent(arguments);
        me.fireEvent('inputchange', me, me.getValue(), e);
    },

    onKeyPress: function (e) {
        var me = this;

        if (e.browserEvent.keyCode == 13) {
            me.fireEvent('searchClick', me, me.getValue(), e);
        }
    }
});