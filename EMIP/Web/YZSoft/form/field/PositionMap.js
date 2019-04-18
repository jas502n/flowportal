
Ext.define('YZSoft.form.field.PositionMap', {
    extend: 'Ext.field.Field',
    mixins: [
        'YZSoft.form.field.mixins.Base'
    ],
    config: {
        hidden: true,
        labelWidth: 100,
        label: RS.$('All_Uniform_PositionMap_Label'),
        oulevel:null,
        datamap: null
    },

    performBind: function (viewmodel, row) {
        var me = this;

        me.row = row;

        viewmodel.on({
            scope:me,
            positionChanged: 'onPositionChanged'
        });
    },

    onPositionChanged: function (position) {
        var me = this,
            row = me.row,
            oulevel = me.getOulevel(),
            map = me.getDatamap();

        if (Ext.isEmpty(map))
            return;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Form.ashx'),
            params: {
                method: 'GetPositionInfo',
                OULevel: oulevel,
                memberfullname: position
            },
            success: function (action) {
                row.doMap(action.result,map);
            },
            failure: function (action) {
            }
        });
    }
});