
Ext.define('YZSoft.src.field.CountryPicker', {
    extend: 'YZSoft.src.field.Select',
    requires: [
        'YZSoft.src.ux.GlobalStore',
        'YZSoft.src.model.Country'
    ],
    config: {
        valueField: 'IDDCode',
        displayField: 'Name'
    },

    constructor: function (config) {
        var me = this,
            cfg, data = [];

        me.storeCountry = YZSoft.src.ux.GlobalStore.getCountryStore();
        me.storeCountry.each(function (record) {
            data.push(Ext.apply({}, record.data));
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'YZSoft.src.model.Country',
            grouper: {
                direction: 'ASC',
                sorterFn: function (item1, item2) {
                    var sort1 = item1.data.Order,
                        sort2 = item2.data.Order;

                    return (sort1 > sort2) ? 1 : ((sort1 < sort2) ? -1 : 0);
                },
                groupFn: function (record) {
                    return record.get('Group');
                }
            },
            data: data
        });

        cfg = {
            store: me.store
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onFocus: function () {
        var me = this,
            pnl;

        pnl = Ext.create('YZSoft.src.sheet.SelCountry', {
            store: me.store,
            back: function () {
                pnl.hide();
            },
            fn: function (item) {
                var rec = new YZSoft.src.model.Country(item);
                me.setValue(rec);
                pnl.hide();
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
