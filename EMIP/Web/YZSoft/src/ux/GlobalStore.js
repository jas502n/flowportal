Ext.define('YZSoft.src.ux.GlobalStore', {
    singleton: true,

    getExpenseTypeStore: function () {
        var me = this,
            storeName = 'expenseTypeStore',
            store = Ext.data.StoreManager.lookup(storeName);

        if (!store) {
            Ext.Loader.syncRequire('YZSoft.src.model.ExpenseType');

            store = Ext.create('Ext.data.Store', {
                model: 'YZSoft.src.model.ExpenseType',
                storeId: storeName
            });

            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/MDM/MasterData.ashx'),
                async: false,
                params: {
                    method: 'GetExpenseTypes'
                },
                success: function (action) {
                    store.setData(action.result);
                },
                failure: function (action) {
                    Ext.Msg.alert(RS.$('All__NetworkUnavaliable'), action.result.errorMessage);
                }
            });
        }

        return store;
    },

    getCountryStore: function () {
        var me = this,
            storeName = 'countryStore',
            store = Ext.data.StoreManager.lookup(storeName);

        if (!store) {
            Ext.Loader.syncRequire('YZSoft.src.model.Country');

            store = Ext.create('Ext.data.Store', {
                model: 'YZSoft.src.model.Country',
                storeId: storeName
            });

            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/MDM/MasterData.ashx'),
                async: false,
                params: {
                    method: 'GetCountries'
                },
                success: function (action) {
                    store.setData(action.result);
                },
                failure: function (action) {
                    Ext.Msg.alert(RS.$('All__NetworkUnavaliable'), action.result.errorMessage);
                }
            });
        }

        return store;
    },

    getGroupImageStore: function () {
        var me = this,
            storeName = 'groupImageTypeStore',
            store = Ext.data.StoreManager.lookup(storeName);

        if (!store) {
            Ext.Loader.syncRequire('YZSoft.src.model.ClassicGroupImage');

            store = Ext.create('Ext.data.Store', {
                model: 'YZSoft.src.model.ClassicGroupImage',
                storeId: storeName
            });

            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                async: false,
                params: {
                    method: 'GetClassicsGroupImage'
                },
                success: function (action) {
                    store.setData(action.result);
                },
                failure: function (action) {
                    Ext.Msg.alert(RS.$('All__NetworkUnavaliable'), action.result.errorMessage);
                }
            });
        }

        return store;
    },
});