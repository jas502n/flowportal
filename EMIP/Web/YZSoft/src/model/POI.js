Ext.define('YZSoft.src.model.POI', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'id',
        fields: [
            { name: 'id', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'type', type: 'string' },
            { name: 'typecode', type: 'string' },
            { name: 'biz_type', type: 'object' },
            { name: 'address', type: 'string' },
            { name: 'tel', type: 'object' },
            { name: 'postcode', type: 'object' },
            { name: 'website', type: 'object' },
            { name: 'email', type: 'object' },
            { name: 'pcode', type: 'string' },
            { name: 'pname', type: 'string' },
            { name: 'citycode', type: 'string' },
            { name: 'cityName', type: 'string' },
            { name: 'adcode', type: 'string' },
            { name: 'gridcode', type: 'string' },
            { name: 'distance', type: 'int' },
            { name: 'navi_poiid', type: 'string' },
            { name: 'entr_location', type: 'string' },
            { name: 'photos', type: 'object' },
            { name: 'fulladdress', convert: function (v, record) {
                var data = record.raw;
                return Ext.String.format('{0}{1}{2}{3}', data.pname == data.cityname ? '' : (data.pname||''), data.cityname||'', data.adname, data.address);
            }
            },
            { name: 'location', convert: function (v, record) {
                var data = record.raw;
                return data.location.split(',');
            }
            }
        ]
    }
});