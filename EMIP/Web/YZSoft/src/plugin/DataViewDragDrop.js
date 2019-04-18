
Ext.define('YZSoft.src.plugin.DataViewDragDrop', {
    extend: 'Ext.Evented',
    alias: 'plugin.dataviewdragdrop',
    config: {
        disabled: false,
        dataview: null
    },

    init: function (dataview) {
        var me = this;

        me.setDataview(dataview);

        if (dataview.initialized) {
            me.doInit();
        }
        else {
            dataview.on({
                scope: this,
                single: true,
                initialize: 'doInit'
            });
        }
    },

    doInit: function () {
        var me = this,
            dataview = me.getDataview();

        dataview.container.element.on({
            scope: me,
            delegate: '> div.x-dataview-item',
            dragstart: 'onItemDragStart'
        });
    },

    onItemDragStart: function (e) {
        if (this.getDisabled())
            return;

        var me = this,
            dataview = me.getDataview(),
            elCnt = dataview.container.element,
            item = Ext.get(e.getTarget()),
            items = dataview.container.getViewItems(),
            offset = item.getOffsetsTo(elCnt);

        elCnt.addCls('yz-relative');

        if (!item)
            return;

        me.startIndex = Ext.Array.indexOf(items, item.dom);
        me.dorpIndicator = me.dorpIndicator || me.createDropIndicator(item);

        me.dragger = Ext.create('Ext.util.Draggable', {
            element: item,
            constraint: me.getContainerConstraint(elCnt,item),
            listeners: {
                scope: me,
                dragstart: 'onDragStart',
                drag:'onDrag',
                dragend: 'onDragEnd'
            }
        });

        me.dragger.onDragStart(e);

        item.setLeft(offset[0]);
        item.setTop(offset[1]);

        me.moveIndicator(me.dorpIndicator.dom.parentNode, item.dom);
    },

    getContainerConstraint: function (cnt, item) {
        var width = cnt.getWidth(),
            height = cnt.getHeight(),
            elWidth = item.getWidth(),
            elHeight = item.getHeight(),
            offset = item.getOffsetsTo(cnt);

        return {
            min: { x: -offset[0], y: -offset[1] },
            max: { x: width - offset[0] - elWidth + 1, y: height - offset[1] - elHeight }
        };
    },

    onDragStart: function (dragable, e) {
        e.stopEvent();
    },

    onDrag: function (dragable, e) {
        e.stopEvent();

        var me = this,
            beforeItem = me.getBefore(e);

        if (beforeItem)
            me.moveIndicator(beforeItem.parentNode, beforeItem);
        else
            me.moveIndicator(me.dorpIndicator.dom.parentNode, null);
    },

    onDragEnd: function (dragable, e) {
        e.stopEvent();

        var me = this,
            dataview = me.getDataview(),
            dragger = me.dragger,
            item = dragger.getElement(),
            items = dataview.container.getViewItems(),
            index = Ext.Array.indexOf(items, me.dorpIndicator.dom);

        if (me.startIndex < index)
            index--;

        me.dragger.destroy();
        me.dorpIndicator.destroy();
        delete me.dorpIndicator;

        item.setLeft(null);
        item.setTop(null);

        if (me.startIndex != index)
            me.fireEvent('moved', me.startIndex, index);
    },

    createDropIndicator: function (item) {
        var me = this,
            element = me.getDataview().container.element,
            dorpIndicator;

        dorpIndicator = item.dom.cloneNode(true);
        dorpIndicator.id = dorpIndicator.id + '_ghost';
        dorpIndicator = Ext.get(dorpIndicator);
        dorpIndicator.removeCls('x-draggable');
        dorpIndicator.removeCls('x-dragging');
        dorpIndicator.addCls('yz-dd-dataview-indicator');

        dorpIndicator.appendTo(element);
        return dorpIndicator;
    },

    getBefore: function (e) {
        var me = this,
            dragger = me.dragger,
            dragitem = dragger.getElement(),
            dataview = me.getDataview(),
            elBody = dataview.container.element,
            xy = dragitem.getOffsetsTo(elBody),
            x = xy[0] + dragitem.getWidth() / 2,
            y = xy[1] + dragitem.getHeight() / 2,
            items = dataview.container.getViewItems();

        return Ext.Array.findBy(items, function (item) {
            var item = Ext.get(item),
                exy = item.getOffsetsTo(elBody),
                et = exy[1],
                eb = exy[1] + item.getHeight(),
                ecx = exy[0] + item.getWidth() / 2;

            if (!item.hasCls('x-dataview-item'))
                return;

            if (item.hasCls('x-dragging'))
                return;

            if (item.hasCls('yz-dd-dataview-indicator'))
                return;

            if (y < et || (y <= eb && x <= ecx)) {
                return true;
            }
        });
    },

    moveIndicator: function (parentNode, before) {
        parentNode.insertBefore(this.dorpIndicator.dom, before);
    }
});
