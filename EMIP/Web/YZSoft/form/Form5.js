
Ext.define('YZSoft.form.Form5', {
    extend: 'Ext.form.Panel',
    config: {
        model: null,
        formInfo: null,
        readOnly: false,
        cls: ['yz-form']
    },
    $autoFireFormLoad: function () {
        return false;
    },
    $setFormData: Ext.emptyFn,

    constructor: function (config) {
        var me = this,
            model = config.model,
            formInfo = config.formInfo,
            params, requestConfig;

        me.callParent(arguments);

        switch (config.model) {
            case 'Simulate':
                params = {
                    Method: 'GetSimulateForm',
                    processName: config.simulateParams.processName,
                    version: config.simulateParams.version,
                    uid: config.simulateParams.uid
                };
                requestConfig = {
                    method: 'POST',
                    jsonData: config.simulateParams.mobileFormSetting,
                    delay: false
                };
                break;
            case 'Process':
                params = {
                    Method: 'GetProcessForm',
                    pid: formInfo.step.StepID
                };
                break;
            case 'Post':
                params = {
                    Method: 'GetPostForm',
                    processName: formInfo.processName,
                    processVersion: formInfo.processVersion,
                    restartTaskID: formInfo.restartTaskID
                };
                break;
            default:
                params = {
                    Method: 'GetReadForm',
                    tid: formInfo.task.TaskID
                };
        }

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/Form/Form.ashx'),
            params: params,
            delay: true,
            success: function (action) {
                me.fireAction('formsettingload', [action.result], 'onFormSettingLoaded', me);
                me.fireAction('formload', [me], 'onFormLoaded', me);
            },
            failure: function (action) {
                me.fireEvent('failure', action.result.errorMessage);
            }
        }, requestConfig));
    },

    onFormSettingLoaded: function (result) {
        var me = this,
            readOnly = me.getReadOnly(),
            fields = me.expandItemsArray(result.form.items);

        Ext.each(fields, function (field) {
            if ('items' in field) {
                Ext.applyIf(field, {
                    xtype: 'fieldset'
                });
            }
            else {
                Ext.applyIf(field, {
                    labelWidth: 100
                });

                if (!field.xtype && !field.xclass)
                    field.xclass = 'Ext.field.Text';
            }

            if (readOnly)
                field.readOnly = true;
        });

        me.setItems(result.form.items);
    },

    onFormLoaded: function () {
    },

    expandItemsArray: function (items) {
        var fields = [],
            getItems;

        getItems = function (item) {
            fields.push(item);

            if (Ext.isArray(item.items)) {
                Ext.each(item.items, getItems);
            }
        };

        Ext.each(items, getItems);

        return fields;
    }
});