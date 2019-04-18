
Ext.define('YZSoft.social.group.DeleteGroupMember', {
    extend: 'Ext.Panel',
    requires: [
        'YZSoft.src.model.User'
    ],
    listClsSelModeMulti: 'yz-list-selmode-multi',
    config: {
        groupid:null,
        singleSelection: false,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        modal: {
            transparent: true
        },
        showAnimation: {
            type: 'slideIn',
            duration: 350,
            easing: 'ease-out',
            direction: 'up'
        },
        hideAnimation: {
            type: 'slideOut',
            duration: 350,
            easing: 'ease-in',
            direction: 'down'
        }
    },

    constructor: function (config) {
        var me = this,
            config = config || {};

        me.btnBack = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me, me);
            }
        });

        me.btnOK = Ext.create('Ext.Button', {
            text: RS.$('All__Done'),
            disabled: true,
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
            handler: function () {
                var recs = me.storeSel.getData().items;
                if (recs.length)
                    me.onok(recs);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnOK]
        });

        me.storeSel = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.User',
            data: [],
            listeners: {
                scope: me,
                addrecords: 'onSelectionChanged',
                removerecords: 'onSelectionChanged'
            }
        });

        me.listSel = Ext.create('Ext.dataview.DataView', {
            scrollable: {
                direction: 'horizontal',
                directionLock: true,
                indicators: false
            },
            width: 0,
            store: me.storeSel,
            inline: {
                wrap: false
            },
            cls: 'yz-dataview-user-selection',
            itemCls: 'yz-dataview-item-user-selection',
            itemTpl: '<div class="headsort" style="background-image:url({headsort})"></div>',
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    e.stopEvent();
                    me.deselect(record);
                }
            }
        });

        me.searchExpand = Ext.create('YZSoft.src.field.Search', {
            placeHolder: RS.$('All__Search'),
            cancelButton: false,
            expand: true,
            flex: 1,
            listeners: {
                scope: me,
                inputchange: 'onKeywordChange'
            }
        });

        me.searchBarExpand = Ext.create('Ext.Container', {
            docked: 'top',
            layout: 'fit',
            cls: ['yz-searchbar', 'yz-searchbar-expand'],
            layout: {
                type: 'hbox',
                align: 'center'
            },
            items: [me.listSel, me.searchExpand]
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.User',
            autoLoad: false,
            clearOnPageLoad: true,
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                extraParams: {
                    Method: 'GetGroupUsers',
                    groupid: config.groupid
                }
            },
            listeners: {
                load: function () {
                    var recs = [];
                    me.storeSel.each(function (record) {
                        var rec = me.store.getById(record.getId());
                        if (rec)
                            recs.push(rec);
                    });

                    me.list.select(recs, false, true);
                }
            }
        });

        me.list = Ext.create('Ext.dataview.List', {
            loadingText: false,
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            store: me.store,
            pressedDelay: YZSoft.setting.delay.pressedDelay,
            mode: 'MULTI',
            emptyText: '',
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-user', 'yz-list-item-user-multi'],
            selectedCls: 'yz-item-selected',
            itemTpl: Ext.create('Ext.XTemplate',
                '<div class="yz-layout-columns">',
                    '<div class="yz-column-left yz-align-vcenter check-column">',
                        '<div class="check"></div>',
                    '</div>',
                    '<div class="yz-column-left yz-align-vcenter">',
                        '<div class="headsort" style="background-image:url({headsort})"></div>',
                    '</div>',
                    '<div class="yz-column-center yz-align-vcenter">',
                        '<div class="name">{ShortName}</div>',
                    '</div>',
                    '<div class="yz-column-right">',
                    '</div>',
                '</div>'
            ),
            listeners: {
                scope: me,
                select: 'onItemSelect',
                deselect: 'onItemDeselect'
            }
        });

        me.list.on({
            single: true,
            painted: function () {
                me.store.load();
            }
        });

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.searchBarExpand, me.list]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onKeywordChange: function (input, value, e) {
        var me = this,
            store = me.store;

        if (!value) {
            store.clearFilter();
            return;
        }

        store.clearFilter(true);

        store.filter([{
            filterFn: function (item) {
                return (item.data.DisplayName || '').indexOf(value) != -1 ||
                       (item.data.Account || '').indexOf(value) != -1 ||
                       (item.data.HRID || '').indexOf(value) != -1 ||
                       (item.data.Mobile || '').indexOf(value) != -1 ||
                       (item.data.CostCenter || '').indexOf(value) != -1 ||
                       (item.data.OfficePhone || '').indexOf(value) != -1 ||
                       (item.data.HomePhone || '').indexOf(value) != -1 ||
                       (item.data.EMail || '').indexOf(value) != -1;
            }
        }]);
    },

    onItemSelect: function (list, record, supressed, eOpts) {
        var me = this,
            listSel = me.listSel,
            selRec = me.storeSel.getById(record.getId());

        if (!selRec) {
            me.storeSel.add(Ext.apply({}, record.data));

            listSel.getScrollable().getScroller().on({
                single: true,
                maxpositionchange: function (scroller, maxPosition, eOpts) {
                    Ext.defer(function () {
                        me.scrollToRecord(listSel, listSel.getStore().last());
                    }, 1);
                }
            });
        }
    },

    onItemDeselect: function (list, record, eOpts) {
        var me = this,
            selRec = me.storeSel.getById(record.getId());

        if (selRec)
            me.storeSel.remove(selRec);
    },

    deselect: function (record) {
        var me = this,
            list = me.list,
            listrecord = me.store.getById(record.getId());

        me.storeSel.remove(record);
        if (listrecord)
            list.deselect(listrecord);
    },

    onSelectionChanged: function () {
        var me = this,
            list = me.listSel,
            store = list.getStore(),
            selCount = store.getCount();

        var boxWidth = 42,
            maxBoxCount = 8,
            padding = list.element.getPadding('lr'),
            screenWidth = Ext.getBody().getSize().width,
            usableWidth = screenWidth * 2 / 3,
            lineBoxCount, boxWidth;

        lineBoxCount = Math.min(Math.floor(usableWidth / boxWidth), maxBoxCount);
        lineBoxCount = Math.min(store.getCount(), lineBoxCount);

        list.setWidth(lineBoxCount * boxWidth + padding);

        if (selCount) {
            me.btnOK.setText(Ext.String.format(RS.$('All_Group_DeleteMember_FMT'), selCount));
            me.btnOK.setDisabled(false);
        }
        else {
            me.btnOK.setText(RS.$('All__Delete'));
            me.btnOK.setDisabled(true);
        }
    },

    scrollToRecord: function (list, record) {
        if (!record)
            return;

        var me = this,
            scroller = list.getScrollable().getScroller(),
            store = list.getStore(),
            index = store.indexOf(record);

        //make sure the new offsetTop is not out of bounds for the scroller
        var containerSize = scroller.getContainerSize().x,
            size = scroller.getSize().x,
            maxOffset = size - containerSize,
            offset, item;

        if (maxOffset == 0)
            return;

        scroller.scrollTo(maxOffset, 0, true);
    },

    onok: function (recs) {
        var me = this,
            uids = [];

        Ext.each(recs, function (rec) {
            if (rec.data.Account == YZSoft.LoginUser.Account)
                return;
            uids.push(rec.data.Account);
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
            waitMsg: {
                msg: RS.$('All__Deleting'),
                target: me
            },
            delay:false,
            params: {
                method: 'DeleteGroupMembers',
                groupid: me.getGroupid()
            },
            jsonData: uids,
            success: function (action) {
                if (me.config.fn)
                    me.config.fn.call(me.scope, action.result, me);
            }
        });
    }
});