
Ext.define('YZSoft.app.FormApplication', {
    extend: 'YZSoft.form.FormAbstract',
    requires: [
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
    isFormApplication: true,
    config: {
        app: null,
        key: null,
        state: null
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

        me.btnSubmit = Ext.create('Ext.Button', {
            text: RS.$('All__Submit'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            align: 'right',
            hidden: true,
            scope: me,
            handler: 'onSaveClick'
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar'],
            items: [me.btnBack, me.btnSubmit]
        });
        me.actionBar = Ext.create('Ext.Container', {
            docked: 'bottom',
            minHeight: 48,
            hidden: true,
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
    items: [me.titleBar, me.formContainer, me.actionBar]
};

Ext.apply(cfg, config);
me.callParent([cfg]);

me.loadForm();
},

loadForm: function (args) {
    var me = this;

    args = args || {};

    if (me.config.del.show) {
        me.actionBar.show();
        var btns = [];

        btns.push(Ext.create('Ext.Button', {
            flex: 1,
            text: '删除',
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-del'],
            padding: '16 3',
            iconCls: 'yz-glyph',
            handler: function () {

                 Ext.Msg.show({
                    cls: 'yzlg-messagebox',
                    message: "是否删除",
                    hideOnMaskTap: true,
                    buttons: [{
                        text: "是",
                        flex: 0.2,
                        cls: 'yzlg-button-flat yzlg-button-action-hot',
                        itemId: 'ok',
                        handler: function (button) {
                            Ext.Msg.hide();                     
                            YZSoft.Ajax.request({
                                method: 'POST',
                                url: YZSoft.$url('YZSoft.Services.REST.Mobile/YZApp/App.ashx'),
                                waitMsg: {
                                    message: "删除中...",
                                    autoClose: true
                                },
                                delay: true,
                                params: {
                                    Method: "del",
                                    sql: me.config.del.state,
                                    key: me.config.key
                                },
                                success: function (action) {
                                    if (action.result.code == "-1") {
                                        Ext.Msg.alert("删除失败", action.result.msg);
                                    } else {
                                        Ext.Viewport.mask({
                                            cls: 'yz-mask-success',
                                            message: "删除成功",
                                            delay: true,
                                            fn: function () {
                                              
                                                if (me.config.fn)
                                                    me.config.fn.call(me.scope || me, action.result);
                                            }
                                        })
                                    }

                                },
                                failure: function (action) {
                                    Ext.Msg.alert("删除失败", action.result.errorMessage);
                                }
                            });
                        }


                    }, {
                        text: "否",
                        flex: 0.2,
                        cls: 'yzlg-button-flat yzlg-button-action-hot',
                        itemId: 'cancle'
                    }]
                });
            }
        }));
        me.actionBar.setItems(btns);
    }
    YZSoft.Ajax.request(Ext.apply({
        url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Form.ashx'),
        params: {
            Method: 'GetFormStateInfo',
            app: me.getApp(),
            key: me.getKey(),
            formState: me.getState()
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

    form.addCls(['yz-form-showeditindicator']);
},

onUserFormLoaded: function (form) {
    var me = this,
            formInfo = me.formInfo;

    //me.titleBar.setTitle(formInfo.appShortName);

    me.applyFormState(form, formInfo);
    me.setFormData(true, form, formInfo, function () {
        me.formContainer.setItems([form]);
        me.form = form;
        me.initSubmit();
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

initSubmit: function () {
    var me = this,
            formInfo = me.formInfo;

    me.btnSubmit.setHidden(!formInfo.showSaveButton);
},

onSaveClick: function () {
    var me = this,
            form = me.form,
            formInfo = me.formInfo,
            data;

    data = {
        Header: {
            Method: 'SaveFormApplication',
            FormApplicationName: formInfo.app,
            FormState: formInfo.formstate,
            PrimaryKey: formInfo.key
        }
    };

    me.getFormData(form, formInfo, data, function (formdata) {
        me.validateForm({
            formData: formdata.FormData,
            vars: formdata.vars,
            data: data,
            validationGroup: formInfo.validationGroup,
            formInfo: formInfo,
            fn: function () {
                data.FormData = formdata.FormData;

                me.form.fireEvent('beforePost', me.form, data);
                me.fireEvent('beforePost', me, data);

                me.compressFormData(data.FormData, formInfo.formdataset);

                me.doAction({
                    title: RS.$('All_Submit'),
                    post: true,
                    prompt: false,
                    waitMsg: RS.$('All__Submiting'),
                    successMessage: RS.$('All__Mask_SubmitSuccess'),
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
}
});