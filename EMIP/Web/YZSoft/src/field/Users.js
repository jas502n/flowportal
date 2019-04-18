
Ext.define('YZSoft.src.field.Users', {
    extend: 'YZSoft.src.field.AbstractContainerField',
    xtype: 'yzusersfield',
    requires: [
        'YZSoft.src.model.User'
    ],
    config: {
        titlebar: true,
        singleSelection: false,
        stringValue: null
    },

    constructor: function (config) {
        var me = this;

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.User',
            data: [],
            listeners: {
                scope: me,
                addrecords: 'onDataChanged',
                removerecords: 'onDataChanged'
            }
        });

        me.list = Ext.create('Ext.dataview.DataView', {
            scrollable: null,
            store: me.store,
            inline: {
                wrap: false
            },
            cls: 'yz-dataview-user-selection',
            itemCls: 'yz-dataview-item-user-selection',
            itemTpl: [
                '<div class="headsort" style="background-image:url({headsort})"></div>',
                '<div class="name">{ShortName}</div>',
            ],
            listeners: {
                itemtap: function (list, index, target, record, e, eOpts) {
                    e.stopEvent();

                    if (!me.getReadOnly())
                        me.store.remove(record);
                }
            }
        });

        me.btnAdd = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-addlistitem'],
            iconCls: 'yz-glyph yz-glyph-e907',
            iconAlign: 'top',
            scope: me,
            handler: 'onAddUserClick'
        });

        me.titlebar = Ext.create('Ext.TitleBar', {
            cls: 'yz-titlebar-field',
            titleAlign: 'left',
            title: config.label || RS.$('All__SelectEmployee'),
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: []
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.titlebar, {
                xtype: 'container',
                cls: 'yz-field-select-list-wrap',
                scrollable: {
                    direction: 'horizontal',
                    directionLock: true,
                    indicators: false
                },
                layout: {
                    type: 'hbox',
                    align: 'top'
                },
                items: [
                    me.list, me.btnAdd
                ]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.addCls('yz-field-userselect');
    },

    updateTitlebar: function (newValue) {
        this.titlebar[newValue ? 'show' : 'hide']();
    },

    setValue: function (users) {
        var me = this,
            uids = [];

        users = users ? (Ext.isArray(users) ? users : [users]) : [];

        Ext.each(users, function (user) {
            if (Ext.isString(user))
                uids.push(user);
        });

        if (uids.length == 0) {
            if (me.singleSelection && users.length > 1)
                users = [users[0]];

            me.store.setData(users);
            return;
        }

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Org.ashx'),
            params: {
                method: 'UserFromUIDs'
            },
            jsonData: uids,
            scope: me,
            success: function (action) {
                var nusers = [];
                Ext.each(users, function (user) {
                    if (Ext.isString(user)) {
                        var nuser = action.result[user];
                        if (nuser)
                            nusers.push(nuser);
                    }
                    else {
                        nusers.push(user);
                    }
                });
                me.setValue(nusers);
            },
            failure: function (action) {
                alert(action.result.errorMessage);
            }
        });
    },

    getValue: function () {
        var me = this,
            rv = [];

        me.store.each(function (record) {
            rv.push(record.data.Account);
        });

        return rv;
    },

    setFormValue: function (value) {
        if (Ext.isString(value))
            value = value ? value.split(',') : [];

        this.setValue(value);
    },

    getSubmitValue: function () {
        return this.getValue().join(',');
    },

    onDataChanged: function () {
        var me = this,
            emptycls = 'yz-field-imageattachment-empty',
            count = me.store.getCount();

        if (count)
            me.removeCls(emptycls);
        else
            me.addCls(emptycls);

        me.fireEvent('change', me.getValue());
    },

    onAddUserClick: function () {
        var me = this,
            singleSelection = me.getSingleSelection(),
            pnl;

        pnl = Ext.create('YZSoft.src.sheet.SelUser', {
            singleSelection: singleSelection,
            back: function () {
                pnl.hide();
            },
            fn: function (users) {
                pnl.hide();

                if (singleSelection) {
                    me.store.setData(users);
                }
                else {
                    me.store.add(users);
                }
            },
            listeners: {
                order: 'after',
                hide: function () {
                    this.destroy();
                }
            }
        });

        Ext.Viewport.add(pnl);
        pnl.show();
    }
});
