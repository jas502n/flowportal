
Ext.define('YZSoft.form.aspx.field.mixins.WrapButton', {

    init: function (btn) {
        var me = this;

        me.on({
            single: true,
            scope: me,
            afterblockbind: function (viewmodel, row) {
                var grid = me.getMapToGrid(viewmodel, row);

                if (grid)
                    me.addToGridTitleBar(grid);
                else
                    me.wrapButton();
            }
        });
    },

    getMapToGrid: function (viewmodel, row) {
        var me = this,
            singleSelection = me.getSingleSelection(),
            map = me.getDatamap(),
            tableNames = row.getMapTargetTableNames(map),
            grid;

        if (singleSelection)
            return;

        row.eachChildTable(function (table) {
            if (Ext.Array.contains(tableNames, table.TableName)) {
                grid = table.grid;
                return false;
            }
        }, false);

        return grid;
    },

    addToGridTitleBar: function (grid) {
        var me = this,
            parent = me.getParent();

        parent.remove(me, false);
        grid.titleBar.add(me);
    },

    lookbefore: function (parent,comp) {
        var index = parent.items.indexOf(comp);

        for (var i = index-1; i >= 0; i--) {
            var prev = parent.items.getAt(i);
            if (!prev.isHidden())
                return prev;
        }
    },

    lookafter: function (parent, comp) {
        var index = parent.items.indexOf(comp);

        for (var i = index + 1; i < parent.items.getCount(); i++) {
            var next = parent.items.getAt(i);
            if (!next.isHidden())
                return next;
        }
    },

    wrapButton: function () {
        var me = this,
            parent = me.getParent(),
            appendAfter = me.lookbefore(parent,me) || me.lookafter(parent,me),
            index, wrap, fn;

        if (!appendAfter)
            return false;

        if (appendAfter.isWrap) {
            me.addCls(['yz-container-border-bottom', 'yz-aspxform-browser-button']);
            appendAfter.add(me);
            return true;
        }
        else {
            parent.remove(me, false);
            index = parent.items.indexOf(appendAfter),
            parent.remove(appendAfter, false);
            appendAfter.setFlex(1);
            me.addCls(['yz-container-border-bottom', 'yz-aspxform-browser-button']);

            wrap = Ext.create('YZSoft.form.aspx.field.mixins.WrapContainer', {
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [
                    appendAfter,
                    me
                ]
            });

            parent.insert(index,wrap);
            return true;
        }
    },

    wrap: function () {

    }
});