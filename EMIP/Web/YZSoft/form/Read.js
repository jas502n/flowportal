
Ext.define('YZSoft.form.Read', {
    extend: 'YZSoft.form.FormAbstract',
    requires: [
        'YZSoft.src.ux.Push',
        'YZSoft.form.TaskAbstract',
        'YZSoft.src.ux.TaskOpt',
        'YZSoft.src.ux.xml',
        'YZSoft.src.field.PopupRadioList',
        'YZSoft.form.aspx.Form',
        'YZSoft.form.Form',
        'YZSoft.form.aspx.ClassManager',
        'YZSoft.form.document.Uniform',
        'YZSoft.form.aspx.field.Text',
        'YZSoft.form.field.Text',
        'YZSoft.form.field.mixins.TextBase',
        'YZSoft.form.field.mixins.Base',
        'YZSoft.form.field.mixins.Format',
        'YZSoft.form.field.mixins.Value2Display',
        'YZSoft.form.aspx.field.mixins.Abstract',
        'YZSoft.form.aspx.grid.Repeater',
        'YZSoft.form.grid.Repeater',
        'YZSoft.form.FormHeader',
        'YZSoft.src.component.Headshot',
        'YZSoft.src.viewmodel.ViewModel',
        'YZSoft.src.viewmodel.Schema',
        'YZSoft.src.viewmodel.Table',
        'YZSoft.src.viewmodel.BindingCollection',
        'YZSoft.src.viewmodel.DataSourceManager',
        'YZSoft.src.viewmodel.PaddingRequestCollection',
        'YZSoft.src.viewmodel.Row',
        'YZSoft.src.viewmodel.bindable.Express',
        'YZSoft.src.viewmodel.bindable.Abstract',
        'YZSoft.src.viewmodel.Column',
        'YZSoft.src.viewmodel.bindable.XDataBind',
        'YZSoft.src.viewmodel.express.Parser',
        'YZSoft.form.grid.RepeaterItem',
        'YZSoft.form.aspx.field.DataBrowserButton',
        'YZSoft.form.field.DataBrowserButton',
        'YZSoft.form.field.BrowserButtonAbstract',
        'YZSoft.src.viewmodel.bindable.Filter',
        'YZSoft.form.aspx.field.mixins.WrapButton',
        'YZSoft.form.aspx.field.mixins.WrapContainer'
    ],
    isRead: true,
    config: {
        tid: null,
        openAsHandler: null
    },

    constructor: function (config) {
        var me = this;

        me.btnBack = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me);
            }
        });

        me.btnSocial = Ext.create('Ext.Button', {
            text: RS.$('All_Form_ActionBar_Chat'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
            hidden: application.taskSocial === false || config.disablesocial === true,
            scope: me,
            handler: 'onSocial'
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            hidden: config.titleBar === false,
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnSocial]
        });

        me.actionBar = Ext.create('Ext.Container', {
            docked: 'bottom',
            minHeight: 48,
            style: 'background-color:#25a6d8',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
            },
            items: []
        });

        me.formContainer = Ext.create('Ext.Container', {
        });

        me.trace = Ext.create('YZSoft.form.TaskTrace', {
            cls: ['yz-noscroll-autosize', 'yz-tasktrace'],
            scrollable: false
        });

        me.scrollContainer = Ext.create('Ext.Container', {
            style: 'background-color:#f0f3f5;',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.formContainer, me.trace]
        });

        me.mainContainer = Ext.create('Ext.Container', {
            layout: 'card',
            items: [me.scrollContainer]
        });

        if (YZSoft.serverSetting.BPMSiteUrl != 'false') {
            me.cmpSwitch = Ext.create('YZSoft.form.FormSwitch', {
                listeners: {
                    scope: me,
                    switchto: 'onSwitchForm'
                }
            });

            me.mainContainer.add(me.cmpSwitch);
        }

        me.cmpIndicator = Ext.create('Ext.Component', {
            top: 0,
            right: 0,
            cls: 'yz-task-status-indicator'
        });

        me.scrollContainer.getScrollable().getScroller().getElement().appendChild(me.cmpIndicator.element);

        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.actionBar, me.mainContainer]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.loadForm({
            forminfo: function () {
                var formInfo = me.formInfo;

                me.channel = Ext.String.format('Task/{0}', formInfo.task.TaskID);
                me.updateBadget({
                    fn: function () {
                        YZSoft.src.ux.Push.subscribe({
                            cmp: me,
                            channel: me.channel,
                            fn: function () {
                                YZSoft.src.ux.Push.on({
                                    message: 'onNotify',
                                    scope: me
                                });
                            }
                        });
                        me.on({
                            destroy: function () {
                                YZSoft.src.ux.Push.unsubscribe({
                                    cmp: me,
                                    channel: me.channel
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    loadForm: function (args) {
        var me = this;

        args = args || {};

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Form.ashx'),
            params: {
                Method: 'GetTaskReadInfo',
                tid: me.getTid(),
                permisions: 'PickBackRestart,PickBack,PickBackExt,Inform,InviteIndicate,Public,Abort,Delete,Reminder'
            },
            waitMsg: {
                message: '',
                indicator: true,
                transparent: true,
                cls: 'yz-mask-msgtransparent',
                autoClose: false,
                target: me
            },
            success: function (action) {
                var formInfo = me.formInfo = action.result;

                if (args.forminfo)
                    args.forminfo.call(args.scope, action.result);

                me.loadUserForm(formInfo, function (success) {
                    var waitMsg = action.config.waitMsg,
                        target = waitMsg && waitMsg.target;

                    if (target)
                        target.unmask();

                    if (args.fn)
                        args.fn.call(args.scope, success, formInfo);
                });
            },
            failure: function (action) {
                if (args.fn)
                    args.fn.call(args.scope, false);

                me.openformerror(action.result.errorMessage);
            }
        }, args.requestConfig));
    },

    loadUserForm: function (formInfo, fn, scope) {
        var me = this,
            task = formInfo.task,
            step = formInfo.step,
            form;

        form = me.createForm(formInfo.form, {
            model: 'Read',
            formInfo: formInfo,
            readOnly: true,
            scrollable: null,
            listeners: {
                failure: function (errorMessage) {
                    if (fn)
                        fn.call(scope, false);

                    me.openformerror(errorMessage)
                },
                formload: function () {
                    me.onUserFormLoaded(this);

                    if (fn)
                        fn.call(scope, true);
                }
            }
        });

        form.addCls(['yz-form-read']);
    },

    onUserFormLoaded: function (form) {
        var me = this,
            formInfo = me.formInfo,
            task = formInfo.task,
            steps = formInfo.steps,
            openAsHandler = me.getOpenAsHandler(),
            cls = 'yz-task-status-' + (task.TaskState || 'Unknow').toLowerCase();

        me.titleBar.setTitle(task.ProcessName);

        me.applyFormState(form, formInfo);
        me.setFormData(false, form, formInfo, function () {
            me.addCls('yz-task-status-' + (task.TaskState || 'Unknow').toLowerCase());

            me.trace.store.setData(steps);
            me.formContainer.setItems([form]);
            me.form = form;

            if ((task.TaskState || '').toLowerCase() == 'running') {
                if (openAsHandler)
                    me.initMyProcessedForm();
                else
                    me.initMyRequestForm();
            }
            else {
                me.initClosedForm();
            }
        }, me);
    },

    reloadForm: function (message, fn) {
        var me = this;

        me.loadForm({
            requestConfig: {
                waitMsg: {
                    message: message,
                    indicator: true,
                    autoClose: false
                },
                delay: true
            },
            fn: function () {
                if (fn)
                    fn.call();
            }
        });
    },

    initClosedForm: function () {
        var me = this,
            formInfo = me.formInfo,
            step = formInfo.step,
            perm = formInfo.perm;

        //知会
        me.btnInform = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            text: RS.$('All_Form_ActionBar_Inform'),
            iconCls: 'yz-glyph yz-glyph-e970',
            disabled: !perm.Inform,
            handler: function () {
                me.inform();
            }
        });

        me.actionBar.setItems([me.btnInform]);
    },

    initMyProcessedForm: function () {
        var me = this,
            formInfo = me.formInfo,
            step = formInfo.step,
            perm = formInfo.perm;

        //知会
        me.btnInform = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            text: RS.$('All_Form_ActionBar_Inform'),
            iconCls: 'yz-glyph yz-glyph-e970',
            disabled: !perm.Inform,
            handler: function () {
                me.inform(function () {
                    Ext.mainWin.fireEvent('worklistchanged', me);
                });
            }
        });

        //取回
        me.btnPickback = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            text: RS.$('All_Form_ActionBar_Pickback'),
            iconCls: 'yz-glyph yz-glyph-e921',
            disabled: !perm.PickBackExt,
            handler: function () {
                me.pickbackExt(function () {
                    Ext.mainWin.fireEvent('worklistchanged', me);
                });
            }
        });

        me.actionBar.setItems([me.btnInform, me.sp, me.btnPickback]);
    },

    initMyRequestForm: function () {
        var me = this,
            formInfo = me.formInfo,
            step = formInfo.step,
            perm = formInfo.perm;

        //知会
        me.btnInform = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            text: RS.$('All_Form_ActionBar_Inform'),
            iconCls: 'yz-glyph yz-glyph-e970',
            disabled: !perm.Inform,
            handler: function () {
                me.inform(function () {
                    Ext.mainWin.fireEvent('worklistchanged', me);
                });
            }
        });

        //取回重填
        me.btnPickback = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            text: RS.$('All_Form_ActionBar_PickbackRestart'),
            iconCls: 'yz-glyph yz-glyph-e921',
            disabled: !perm.PickBackRestart,
            handler: function () {
                me.pickbackRestart(function () {
                    Ext.mainWin.fireEvent('worklistchanged', me);
                });
            }
        });

        //撤销申请
        me.btnAbort = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            text: RS.$('All_Form_ActionBar_Abort'),
            iconCls: 'yz-glyph yz-glyph-e917',
            disabled: !perm.Abort,
            handler: function () {
                me.abort(function () {
                    Ext.mainWin.fireEvent('worklistchanged', me);
                });
            }
        });

        //催办
        me.btnReminder = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            text: RS.$('All_Form_ActionBar_Remind'),
            iconCls: 'yz-glyph yz-glyph-e91d',
            disabled: !perm.Reminder,
            handler: function () {
                me.remind(function () {
                    Ext.mainWin.fireEvent('worklistchanged', me);
                });
            }
        });

        me.actionBar.setItems([me.btnInform, me.sp, me.btnPickback, me.sp, me.btnAbort, me.sp, me.btnReminder]);
    }
});