
Ext.define('YZSoft.src.viewmodel.DataSourceManager', {
    extend: 'Ext.Evented',

    constructor: function (config) {
        var me = this;

        me.tables = [];

        Ext.apply(me, config);
        me.callParent(arguments);
    },

    getTable: function (ds, filter, callback) {
        var me = this,
            viewmodel = me.viewmodel,
            url = YZSoft.$url('YZSoft.Services.REST/BPM/DataSource.ashx'),
            params,request;

        if (!ds.preventcache) {
            var tbs = me.arrayFilter(me.tables, {
                dsType: ds.dsType,
                datasource: ds.datasource,
                id: ds.id
            }) || [];

            for (var i = 0; i < tbs.length; i++) {
                var tb = tbs[i];
                if (me.objectEqu(tb.filter, filter)) {
                    callback && callback(tb.rows);
                    return;
                }
            }
        }

        params = me.getDSRequestParam(ds, filter);

        request = YZSoft.Ajax.request({
            method:'POST',
            url: url,
            params: params,
            success: function (action) {
                var rows = action.result,
                    table;

                //加入到缓存
                if (!ds.preventcache) {
                    table = {
                        dsType: ds.dsType,
                        datasource: ds.datasource,
                        id: ds.id,
                        filter: filter,
                        rows: rows
                    };
                    me.tables.push(table);
                }

                callback && callback(rows);
            },
            failure: function (action) {
                //YZSoft.Error.raise('从{0}加载数据失败！原因：\n{1}',me.getDSInentity(ds), action.result.errorMessage);
                me.fireEvent('failure', Ext.String.format(RS.$('All_DataSourceMgr_Load_Failed'), me.getDSInentity(ds), action.result.errorMessage));
            }
        });

        viewmodel.registerRequest(request);
    },

    getDSRequestParam: function (ds, filter) {
        var params = {
            datasource: ds.datasource,
            filter: Ext.encode(filter)
        };

        switch (ds.dsType) {
            case 'Table':
                params.method = 'GetDataNoPaged';
                params.tableName = ds.tableName;
                params.orderBy = ds.orderBy;
                break;
            case 'Procedure':
                params.method = 'GetDataNoPaged';
                params.procedureName = ds.procedureName;
                break;
            case 'ESB':
                params.method = 'GetDataNoPaged';
                params.esb = ds.esb;
                break;
        }

        return params;
    },

    getDSInentity: function (ds) {
        switch (ds.dsType) {
            case 'Table':
                return Ext.String.format(RS.$('All_DataSourceMgr_DSID_Table'),ds.tableName);
            case 'Procedure':
                return Ext.String.format(RS.$('All_DataSourceMgr_DSID_Procedure'), ds.procedureName);
            case 'ESB':
                return Ext.String.format(RS.$('All_DataSourceMgr_DSID_ESB'), ds.esb);
        }

        return Ext.encode(ds);
    },

    arrayFilter: function (arr, filter, returnMatchItem) {
        var me = this,
            returnMatchItem = returnMatchItem !== false;

        if (!arr)
            return null;

        if (!filter)
            return arr;

        var rv = [];
        for (var i = 0; i < arr.length; i++) {
            if (me.objectMatchFilter(arr[i], filter) === returnMatchItem)
                rv.push(arr[i]);
        }

        return rv;
    },

    objectMatchFilter: function (srcObject, filterObject) {
        var me = this;

        if (!filterObject)
            return true;

        if (srcObject === filterObject)
            return true;

        for (var p in filterObject) {
            if (!(p in srcObject))
                return false;

            var v1 = filterObject[p],
                v2 = srcObject[p];

            if (Ext.isObject(v1) && Ext.isObject(v2)) {
                if (!me.objectEqu(v1, v2))
                    return false;
            }
            else {
                if (Ext.isString(v1) && Ext.isString(v2)) {
                    v1 = Ext.String.trim((v1 || '').toLowerCase());
                    v2 = Ext.String.trim((v2 || '').toLowerCase());
                }

                if (v1 != v2)
                    return false;
            }
        }
        return true;
    },

    objectEqu: function (object1, object2) {
        var me = this;

        if (!object1 && !object2)
            return true;

        if (!me.objectMatchFilter(object1, object2))
            return false;

        for (var p in object1) {
            if (!(p in object2))
                return false;
        }

        return true;
    }
});