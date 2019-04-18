
Ext.define('YZSoft.form.Form', {
    extend: 'Ext.form.Panel',
    config: {
        cls: ['yz-form']
    },
    $setFormData: Ext.emptyFn,
    $applyFormState: Ext.emptyFn,
    $autoFireFormLoad: function () {
        return false;
    },
    autoCreateViewModel: true,
    onFormLoaded: Ext.emptyFn,

    constructor: function (config) {
        var me = this,
            task = config && config.formInfo && config.formInfo.task;

        me.postContainer = config.postContainer;//form所在的提交和审批容器
        me.callParent([config]);

        me.on({
            scope: me,
            positionChanged: 'onPositionChanged'
        });

        if (me.autoCreateViewModel)
            me.createViewModel();
    },

    onPositionChanged: function (position) {
        var me = this;

        if (me.viewmodel) {
            me.viewmodel.fireEvent('positionChanged', position);
        }
        else {
            me.on({
                viewmodelCreated: function () {
                    me.viewmodel.fireEvent('positionChanged', position);
                }
            });
        }
    },

    createViewModel: function (globalVars, formulars) {
        var me = this,
            forminfo = me.formInfo,
            formdataset = forminfo.formdataset;

        Ext.create('YZSoft.src.viewmodel.ViewModel', me, {
            tables: formdataset,
            globalVars: globalVars,
            formulars: formulars,
            form: me,
            listeners: {
                failure: function(){
                    me.failed = true;
                },
                initialized: function () {
                    if (!me.failed) 
                        me.fireAction('formload', [me], 'onFormLoaded', me);
                }
            }
        });

        me.fireEvent('viewModelCreated', me.viewmodel);
        me.relayEvents(me.viewmodel, 'failure');
    },

    $getFormData: function () {
        return this.viewmodel.getFormData();
    },

    getAllFields: function (container, matchFn, breakFn) {
        var me = this,
            fields = [];

        var getFields = function (item) {
            if (matchFn(item)) {
                fields.push(item);
            }

            if (item.isContainer) {
                if (!breakFn || !breakFn(item)) {
                    item.items.each(getFields);
                }
            }
        };

        container.items.each(getFields);
        return fields;
    },

    datatypeCheck: function (field) {
        var me = this,
            bind = field.bindings && field.bindings.value,
            column = bind && bind.column,
            row = bind && bind.row,
            value;

        if (column && column.Writeable && column.isVar !== true) {
            value = row.data[column.ColumnName];
            return column.check(value);
        }
    },

    $validate: function (args) {
        var me = this,
            viewmodel = me.viewmodel,
            formInfo = args.formInfo,
            formData = args.formData,
            validationGroup = args.validationGroup,
            allfields;
        
        allfields = me.getAllFields(me, function (comp) {
            return !Ext.isEmpty(comp.config && comp.config.$validators) || comp.$validate || (comp.bindings && comp.bindings.value);
        });

        for (var i = 0; i < allfields.length; i++) {
            var field = allfields[i],
                row = (field.getRow && field.getRow()) || (field.bindings && field.bindings.value && field.bindings.value.row),
                $validators = (field.config && field.config.$validators) || [],
                $validate = field.config && field.config.$validate,
                result;

            result = me.datatypeCheck(field);
            if (result)
                return result;

            for (var j = 0; j < $validators.length; j++) {
                var $validator = $validators[j],
                    $validator = $validator.isInstance ? $validator : $validator.xclass && Ext.create($validator.xclass,$validator);

                if ($validator) {
                    result = $validator.$validate(field, validationGroup, row, viewmodel, formData);
                    if (result)
                        return result;
                }
            }

            if ($validate) {
                result = $validate.call(field,validationGroup, row, viewmodel, formData);
                if (result)
                    return result;
            }
        }
    }
});