
Ext.define('YZSoft.form.Post', {
    extend: 'YZSoft.form.FormAbstract',
    requires: [
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
    isPost: true,
    config: {
        processName: null,
        processVersion: null,
        restartTaskID: -1,
        prompt: true     //提交提示框
    },

    constructor: function (config) {
        var me = this,
            prompt = config.prompt;

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

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack]
        });

        me.selPosition = Ext.create('YZSoft.src.field.PopupRadioList', {
            docked: 'top',
            label: RS.$('All_Form_RequestPosition'),
            cls: ['yz-field-valuealign-right']
        });

        me.cntPosition = Ext.create('Ext.Container', {
            cls: 'yz-form',
            items: [{
                xtype: 'fieldset',
                margin: '0 0 6 0',
                padding: 0,
                hidden: prompt === false,
                items: [me.selPosition]
            }]
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

        var cfg = {
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.titleBar, me.cntPosition, me.actionBar, me.formContainer]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.loadForm();
    },

    loadForm: function (args) {
        var me = this;

        args = args || {};

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Form.ashx'),
            params: {
                Method: 'GetPostInfo',
                processName: me.getProcessName(),
                restartTaskID: me.getRestartTaskID()
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

                me.initPosition(formInfo.positions);

                if (args.forminfo)
                    args.forminfo.call(args.scope, action.result);

                me.setProcessVersion(action.result.processVersion);

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
            model: 'Post',
            formInfo: formInfo,
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

        form.addCls(['yz-form-post']);
    },

    onUserFormLoaded: function (form) {
        var me = this,
            formInfo = me.formInfo;

        me.selPosition.on({
            change: function () {
                form.fireEvent('positionChanged', me.selPosition.getValue());
            }
        });
        me.selPosition.fireEvent('change');

        me.applyFormState(form, formInfo);
        me.setFormData(true, form, formInfo, function () {
            me.formContainer.setItems([form]);
            me.form = form;
            me.initPostForm();
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

    initPostForm: function () {
        var me = this,
            formInfo = me.formInfo,
            links = formInfo.links,
            perm = formInfo.perm,
            nodePermisions = formInfo.NodePermisions,
            btns = [];

        Ext.each(links, function (link) {
            if (btns.length != 0)
                btns.push(me.sp);

            btns.push(Ext.create('Ext.Button', {
                flex: 1,
                text: link.DisplayString,
                cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
                padding: '16 3',
                iconCls: 'yz-glyph',
                handler: function () {
                    me.onLinkClick(link);
                }
            }));
        });

        me.actionBar.setItems(btns);
    },

    onLinkClick: function (link) {
        var me = this,
            form = me.form,
            action = link.DisplayString,
            validationGroup = link.ValidationGroup,
            formInfo = me.formInfo,
            data;

        data = {
            Header: {
                Method: 'Post',
                ProcessName: formInfo.processName,
                ProcessVersion: formInfo.processVersion,
                Action: action,
                restartTaskID: formInfo.restartTaskID,
                OwnerMemberFullName: me.selPosition.getValue()
            }
        };

        me.fireEvent('beforePost', me, data);
        if (form.fireEvent('beforePost', action, validationGroup, form) === false ||
            form.fireEvent('beforeSubmit', 'Post', action, validationGroup, form) === false)
            return false;

        me.getFormData(form, formInfo, data, function (formdata) {
            me.validateForm({
                formData: formdata.FormData,
                vars: formdata.vars,
                data: data,
                validationGroup: validationGroup,
                formInfo: formInfo,
                fn: function () {
                    data.FormData = formdata.FormData;
                    me.compressFormData(data.FormData, formInfo.formdataset);

                    if (form.fireEvent('Post', action, validationGroup, data, form) === false ||
                        form.fireEvent('Submit', 'Post', action, validationGroup, data, form) === false)
                        return false;

                    me.doAction({
                        title: action,
                        post: true,
                        prompt: me.getPrompt(),
                        waitMsg: RS.$('All_Form_Submiting'),
                        params: {
                            Method: 'Post'
                        },
                        data: data,
                        fn: function (result) {
                            if (me.config.fn)
                                me.config.fn.call(me.scope || me, result);
                        },
                        done: function (result) {
                            if (me.config.done)
                                me.config.done.call(me.scope || me, result);
                        }
                    });
                }
            });
        });
    },

    initPosition: function (positions) {
        var me = this,
            items = [];

        Ext.each(positions, function (pos) {
            items.push({
                text: pos.name,
                value: pos.value
            });
        });

        me.selPosition.setOptions(items);
    }
});