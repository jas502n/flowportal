
Ext.define('YZSoft.src.plugin.ListOptions', {
    extend: 'Ext.Component',
    alias: 'plugin.listoptions',
    requires: 'Ext.Anim',
    config: {
        list: null,
        items: null
    },

    init: function (list) {
        this.setList(list);
    },

    updateList: function (list) {
        if (list) {
            if (list.initialized) {
                this.attachListeners();
            }
            else {
                list.on({
                    initialize: 'attachListeners',
                    scope: this,
                    single: true
                });
            }
        }
    },

    attachListeners: function () {
        var list = this.getList(),
            scrollerElement = list.getScrollable().getScroller().getContainer();

        this.scrollerElement = scrollerElement;

        scrollerElement.onBefore({
            dragstart: 'onScrollerDragStart',
            scope: this
        });
    },

    onScrollerDragStart: function (e, target) {
        var row = e.getTarget('.x-list-item');
        if (row && Math.abs(e.deltaX) > Math.abs(e.deltaY) && e.deltaX < 0) {
            if (!this.animating)
                this.onDragStart(e, Ext.getCmp(row.id));

            return false;
        }
    },

    onDragStart: function (e, row) {
        var me = this,
            list = me.getList(),
            store = list.getStore();

        //directionLock
        e.stopPropagation();

        me.scrollerElement.on({
            scope: me,
            drag: 'onDrag',
            dragend: 'onDragEnd'
        });

        me.dragRow = row;
        me.dragRecord = row.getRecord();

        if (!me.dragRow.trans) {
            me.dragRow.trans = Ext.create('Ext.util.Translatable', {
                element: me.dragRow.getInnerHtmlElement()
            });
        }

        me.showOptions(me.dragRow, me.dragRecord);
        me.dragRow.trans.translate(0, 0);
        row.addCls('yz-list-item-option-dragging');
    },

    onDrag: function (e) {
        var me = this,
            row = me.dragRow;

        row.trans.translate(e.deltaX, 0);
    },

    onDragEnd: function (e) {
        var me = this,
            list = me.getList(),
            row = me.dragRow,
            record = me.dragRecord,
            offset = e.deltaX;

        me.scrollerElement.un({
            scope: me,
            drag: 'onDrag',
            dragend: 'onDragEnd'
        });

        row.trans.on({
            scope: me,
            single: true,
            animationend: function () {
                row.removeCls('yz-list-item-option-dragging');
                me.animating = false;
                if (!pos)
                    Ext.destroy(row.optionWrap);
            }
        });

        var anim = {
            duration: 100
        };

        if (Ext.os.is.ios)
            anim.easing = 'ease-in';

        var pos = me.getGetFinalyPosition(offset);
        me.animating = true;
        row.trans.translate(pos, 0, anim);

        if (pos != 0) {
            Ext.Viewport.mask({
                xtype: 'mask',
                transparent: true
            });

            var box = row.optionContainer.element.getBox();
            me.optsPanel = me.createOptions({
                height: box.height,
                style: 'position:absolute'
            });
            me.optsPanel.element.setBox(box);
            me.optsPanel.renderTo(Ext.getBody());

            var mask = Ext.Viewport.getMasked();
            mask.on({
                scope: me,
                tap: 'onMaskTap'
            });
        }
    },

    onMaskTap: function () {
        this.endOptions({
            duration: 100
        });
    },

    getGetFinalyPosition: function (offset) {
        var me = this,
            row = me.dragRow,
            cnt = row.optionContainer,
            buttons = cnt.getItems().items,
            cntwidth = cnt.element.getWidth(),
            half = -cntwidth / 2;

        if (offset < half)
            return -cntwidth;

        return 0;
    },

    showOptions: function (target, racord) {
        var me = this;

        Ext.DomHelper.append(target.element.dom, '<div class="yz-list-option-wrap"></div>');

        target.optionWrap = target.element.down('.yz-list-option-wrap');
        target.optionContainer = me.createOptions({
            height: target.optionWrap.getHeight(true)
        });
        target.optionContainer.renderTo(target.element.down('.yz-list-option-wrap'));
    },

    createOptions: function (config) {
        var me = this,
            list = me.getList(),
            row = me.dragRow,
            record = me.dragRecord,
            items = [];

        Ext.each(me.getItems(), function (item) {
            var newItem = Ext.apply({}, item);
            newItem.handler = function () {
                me.endOptions({
                    fn: function () {
                        item.handler.call(item.scope, record, list, row);
                    }
                });
            };
            items.push(newItem);
        });

        return Ext.create('Ext.Container', Ext.apply({
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'button',
                cls: 'yz-button-flat yz-button-list-option'
            },
            items: items
        }, config));
    },

    endOptions: function (opts) {
        var me = this,
            list = me.getList(),
            row = me.dragRow,
            mask = Ext.Viewport.getMasked();

        mask.un({
            scope: me,
            tap: 'onMaskTap'
        });

        if (opts.duration) {
            row.trans.on({
                single: true,
                scope: me,
                animationend: function () {
                    Ext.destroy(row.optionWrap);
                    Ext.Viewport.unmask();
                    if (opts.fn)
                        opts.fn.call(me);
                }
            });

            Ext.destroy(me.optsPanel);
            row.trans.translate(0, 0, { duration: opts.duration });
        }
        else {
            Ext.destroy(me.optsPanel);
            row.trans.translate(0, 0);
            Ext.destroy(row.optionWrap);
            Ext.Viewport.unmask();
            Ext.defer(function () {
                if (opts.fn)
                    opts.fn.call(me);
            }, 10);
        }
    }
});
