
Ext.define('YZSoft.src.xform.Repeater', {
    extend: 'Ext.Container',
    xtype: 'yzrepeater',
    isRepeaterContainer: true,
    config: {
        template: null,
        blockCount: 1,
        minBlockCount: 0,
        allowAddRecord: true,
        addButton: {
            text: RS.$('All_Form_AddRecord'),
            cls: ['yz-button-flat', 'yz-button-noflex'],
            iconCls: 'yz-glyph yz-glyph-e907',
            padding: '7 10',
            style: 'background-color:white;border-radius:0px;'
        },
        repeaterItemConfig: {
            title: RS.$('All_Form_RecordTitle_FMT'),
            delButton: {
                text: RS.$('All__Delete')
            }
        }
    },

    constructor: function (config) {
        config = config || {};

        var me = this,
            initBlocks = 'initBlocks' in config ? config.initBlocks : 1,
            addButton = config.addButton,
            cfg;

        me.cntItems = Ext.create('Ext.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            }
        });

        me.optionBar = Ext.create('Ext.Container', {
            cls: ['yz-container-border-top', 'yz-container-border-bottom', 'yz-repeatable-optcontainer'],
            layout: {
                type: 'vbox',
                align: 'stretch'
            }
        });

        cfg = {
            items: [me.cntItems, me.optionBar]
        };

        Ext.apply(cfg, config);

        me.callParent([cfg]);
        me.addCls('yz-repeatable-container');

        me.cntItems.on({
            scope: me,
            add: 'updateIndex',
            remove: 'updateIndex'
        });
    },

    initialize: function () {
        var me = this,
            addButtonConfig = me.getAddButton();

        me.btnAdd = Ext.create('Ext.Button', Ext.apply({
            handler: function () {
                me.addBlock();
            }
        }, addButtonConfig));

        me.optionBar.add(me.btnAdd);
    },

    updateBlockCount: function (blockCount) {
        var me = this,
            items = [], i;

        for (i = 0; i < blockCount; i++) {
            items.push(me.createRepeaterItem());
        }

        me.cntItems.setItems(items);
        me.updateIndex();
    },

    updateAllowAddRecord: function (newValue) {
        this[newValue ? 'removeCls' : 'addCls']('yz-repeatable-container-denyaddrecord');
    },

    getRepeaterItem: function (index) {
        return this.cntItems.getAt(index);
    },

    getRepeaterItems: function () {
        return this.cntItems.getItems().items;
    },

    createRepeaterItem: function (template, silence) {
        var me = this,
            template = template || me.getTemplate(),
            repeaterItemConfig = me.getRepeaterItemConfig(),
            repeaterItem;

        repeaterItem = Ext.create('YZSoft.src.xform.RepeaterItem', Ext.apply({
            items: template
        }, repeaterItemConfig));

        if (silence !== true)
            me.fireEvent('blockCreated', me, repeaterItem);

        repeaterItem.on({
            scope: me,
            deleteclick: 'onBlockDeleteClick'
        });

        return repeaterItem;
    },

    updateIndex: function () {
        var me = this,
            items = me.cntItems.getItems().items,
            ln = items.length,
            i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            item.fireEvent('indexChanged', i, ln);
        }
    },

    onBlockDeleteClick: function (block) {
        var me = this,
            minBlockCount = me.getMinBlockCount();

        if (me.cntItems.getItems().items.length > minBlockCount)
            me.cntItems.remove(block);

        me.fireEvent('delete', block);
    },

    addBlock: function () {
        var me = this,
            repeaterItem = me.createRepeaterItem();

        me.cntItems.add(repeaterItem);
        me.fireEvent('insert', repeaterItem);
        return repeaterItem;
    }
});