
Ext.define('YZSoft.form.field.HistoryFormLink', {
    extend: 'Ext.field.Field',
    requires: [
        'YZSoft.src.field.component.Link'
    ],
    mixins: [
        'YZSoft.form.field.mixins.Base'
    ],
    config: {
        labelWidth: 100,
        cls: 'yz-field-historyformlink',
        activeText:null,
        emptyText: RS.$('All_Uniform_HistoryFormLink_EmptyText'),
        readOnly: false,
        component: {
            xclass: 'YZSoft.src.field.component.Link',
            openText: RS.$('All__Open')
        }
    },

    initialize: function () {
        var me = this,
            component = me.getComponent();

        me.callParent();

        component.element.on({
            scope: me,
            tap: 'onTap'
        });

        me.label.on({
            scope: me,
            tap: 'onTap'
        });
    },

    updateReadOnly: function (newValue) {
        this[newValue ? 'addCls' : 'removeCls']('yz-field-readonly');
    },

    updateEmptyText: function (value) {
        this.getComponent().setEmptyText(value);
    },

    setValue: function (value) {
        var me = this,
            activeText = me.getActiveText();

        me.getComponent().setValue(value);

        if (!Ext.isEmpty(value)) {
            if (Ext.String.startsWith(activeText, '#')) {
                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Task.ashx'),
                    params: {
                        Method: 'GetTaskInfo',
                        TaskID: value
                    },
                    success: function (action) {
                        var fieldName = activeText.substring(1),
                            fieldValue = action.result[fieldName];

                        me.getComponent().setText(fieldValue);
                    },
                    failure: function (action) {
                        Ext.Msg.alert(RS.$('YZStrings.All_Warning'), action.result.errorMessage);
                    }
                });
            }
            else if (activeText){
                me.getComponent().setText(activeText);
            }
        }

        me.callParent(arguments);
    },

    onTap: function () {
        var me = this,
            taskid = me.getValue(),
            pnl;

        if (Ext.isEmpty(taskid))
            return;

        pnl = Ext.create('YZSoft.form.Read', {
            tid: taskid,
            back: function () {
                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
    }
});