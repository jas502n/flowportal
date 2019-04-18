
Ext.define('YZSoft.form.Process', {
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

    isProcess: true,
    config: {
        pid: null
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
            hidden: application.taskSocial === false,
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

        me.mainContainer = Ext.create('Ext.Container', {
            layout: 'card',
            items: [{
                xtype: 'container',
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
            }]
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
                Method: 'GetProcessInfo',
                pid: me.getPid(),
                permisions: 'Reject,RecedeRestart,RecedeBack,Transfer,Inform,InviteIndicate,Public,Jump,Abort,Delete'
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
            model: 'Process',
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
            formInfo = me.formInfo,
            task = formInfo.task,
            steps = formInfo.steps,
            subModel = formInfo.subModel;

        me.titleBar.setTitle(task.ProcessName);

        me.applyFormState(form, formInfo);
        me.setFormData(false, form, formInfo, function () {
            me.trace.store.setData(steps);
            me.formContainer.setItems([form]);
            me.form = form;
            me['init' + subModel + 'Form']();
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

    createDirectSendButton: function (directsend) {
        var me = this,
            tagItems = [];

        Ext.each(directsend.toSteps, function (step) {
            tagItems.push(Ext.String.format(RS.$('All__DirectSendItemFmt'), step.NodeName, step.User));
        });

        return {
            iconCls: 'yz-glyph yz-glyph-e627',
            text: Ext.String.format('{0}->{1}', RS.$('All__DirectSend'), tagItems.join(';')),
            handler: function () {
                me.directSend(directsend);
            }
        };
    },

    createApproveButtons: function () {
        var me = this,
            formInfo = me.formInfo,
            step = formInfo.step,
            links = formInfo.links,
            perm = formInfo.perm,
            nodePermisions = formInfo.NodePermisions,
            btns = [];

        if (formInfo.directsend && formInfo.directsend.toSteps.length != 0) {
            me.btnDirectSend = me.createDirectSendButton(formInfo.directsend);
            btns.push(me.btnDirectSend);
        }

        Ext.each(links, function (link) {
            btns.push({
                text: link.DisplayString,
                disabled: !nodePermisions.MobileApprove,
                handler: function () {
                    me.onLinkClick(link);
                }
            });
        });

        return btns;
    },

    initProcessForm: function () {
        var me = this,
            formInfo = me.formInfo,
            step = formInfo.step,
            links = formInfo.links,
            perm = formInfo.perm,
            approveBtns = [];

        //同意按钮
        approveBtns = me.createApproveButtons();

        if (approveBtns == 0) {
            approveBtns.push({
                text: '',
                disabled: true
            });
        }

        if (approveBtns.length == 1) {
            me.btnApprove = Ext.create('Ext.Button', Ext.apply({}, approveBtns[0], {
                flex: 1,
                cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
                padding: '16 3',
                iconCls: 'yz-glyph yz-glyph-e916'
            }));
        }
        else {
            me.btnApprove = Ext.create('Ext.Button', {
                flex: 1,
                cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
                padding: '16 3',
                text: RS.$('All_Form_ActionBar_Approve'),
                iconCls: 'yz-glyph yz-glyph-e916',
                handler: function () {
                    me.showApproveSheet(approveBtns);
                }
            });
        }

        //退回按钮
        me.btnReturn = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            text: RS.$('All_Form_ActionBar_ReturnToInitiator'),
            iconCls: 'yz-glyph yz-glyph-e917',
            disabled: !perm.RecedeRestart,
            handler: function () {
                me.returnToInitiator();
            }
        });

        //拒绝按钮
        me.btnReject = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            text: RS.$('All_Form_ActionBar_Reject'),
            iconCls: 'yz-glyph yz-glyph-e915',
            disabled: !perm.Reject,
            handler: function () {
                me.reject();
            }
        });

        me.btnMore = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            iconCls: 'yz-glyph yz-glyph-e91f',
            handler: function () {
                var sheet = Ext.create('YZSoft.src.sheet.AppsSheet', {
                    title: RS.$('All_Form_More_Operation'),
                    items: [{
                        text: RS.$('All_Form_Inform'),
                        iconCls: 'yz-glyph yz-glyph-e970',
                        disabled: !perm.Inform,
                        handler: function () {
                            sheet.on({
                                single: true,
                                hide: function () {
                                    me.inform();
                                }
                            });
                            sheet.hide();
                        }
                    }, {
                        text: RS.$('All_Form_InviteIndicate'),
                        iconCls: 'yz-glyph yz-glyph-e91c',
                        disabled: !perm.InviteIndicate,
                        handler: function () {
                            sheet.on({
                                single: true,
                                hide: function () {
                                    me.inviteIndicate();
                                }
                            });
                            sheet.hide();
                        }
                    }, {
                        text: RS.$('All_Form_Transfer'),
                        iconCls: 'yz-glyph yz-glyph-e972',
                        disabled: !perm.Transfer,
                        handler: function () {
                            sheet.on({
                                single: true,
                                hide: function () {
                                    me.transfer();
                                }
                            });
                            sheet.hide();
                        }
                    }, {
                        text: RS.$('All_Form_ActionBar_Return'),
                        iconCls: 'yz-glyph yz-glyph-e917',
                        disabled: !perm.RecedeBack,
                        handler: function () {
                            sheet.on({
                                single: true,
                                hide: function () {
                                    me.recedeback();
                                }
                            });
                            sheet.hide();
                        }
                    }, {
                        text: RS.$('All_Form_CheckInShareTask'),
                        iconCls: 'yz-glyph yz-glyph-e923',
                        hidden: !formInfo.shareTask,
                        handler: function () {
                            sheet.on({
                                single: true,
                                hide: function () {
                                    me.putbackShareStep(function () {
                                        Ext.mainWin.fireEvent('sharelistchanged', me);
                                    });
                                }
                            });
                            sheet.hide();
                        }
                    }],
                    listeners: {
                        order: 'after',
                        hide: function () {
                            this.destroy();
                        }
                    }
                });

                Ext.Viewport.add(sheet);
                sheet.show();
            }
        });

        if (step.Finished) {
            me.btnApprove.setDisabled(true);
            me.btnMore.setDisabled(true);
        }

        me.actionBar.setItems([me.btnApprove, me.sp, me.btnReturn, me.sp, me.btnReject, me.sp, me.btnMore]);
    },

    initInformForm: function () {
        var me = this,
            formInfo = me.formInfo,
            perm = formInfo.perm;

        //已阅
        me.btnInformSubmit = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            text: RS.$('All_BPM_InformSubmit'),
            iconCls: 'yz-glyph yz-glyph-e916',
            handler: function () {
                me.informSubmit({
                });
            }
        });

        //知会
        me.btnInform = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            text: RS.$('All_Form_ActionBar_Inform'),
            iconCls: 'yz-glyph yz-glyph-e970',
            handler: function () {
                me.inform();
            }
        });

        me.actionBar.setItems([me.btnInformSubmit, me.sp, me.btnInform]);
    },

    initIndicateForm: function () {
        var me = this,
            formInfo = me.formInfo,
            perm = formInfo.perm;

        //已阅
        me.btnIndicateSubmit = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            text: RS.$('All_BPM_InformSubmit'),
            iconCls: 'yz-glyph yz-glyph-e916',
            handler: function () {
                me.indicateSubmit();
            }
        });

        //知会
        me.btnInform = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            text: RS.$('All_Form_ActionBar_Inform'),
            iconCls: 'yz-glyph yz-glyph-e970',
            handler: function () {
                me.inform();
            }
        });

        //邀请阅示
        me.btnInviteIndicate = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            text: RS.$('All_Form_ActionBar_InviteInvitade'),
            iconCls: 'yz-glyph yz-glyph-e91c',
            handler: function () {
                me.inviteIndicate();
            }
        });

        me.actionBar.setItems([me.btnIndicateSubmit, me.sp, me.btnInform, me.sp, me.btnInviteIndicate]);
    },

    initShareForm: function () {
        var me = this,
            formInfo = me.formInfo,
            step = formInfo.step;

        //获取按钮
        me.btnCheckout = Ext.create('Ext.Button', {
            flex: 1,
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
            padding: '16 3',
            text: RS.$('All_Form_CheckOutShareTask'),
            iconCls: 'yz-glyph yz-glyph-e922',
            handler: function () {
                me.pickupShareStep(function () {
                    Ext.mainWin.fireEvent('worklistchanged', me);
                });
            }
        });

        me.actionBar.setItems([me.btnCheckout]);
    },

    showApproveSheet: function (btns) {
        var me = this,
            btn = me.btnApprove,
            items = [],
            actionSheet;

        if (!btns || btns.length == 0)
            return;

        actionSheet = Ext.create('Ext.ActionSheet', {
            hideOnMaskTap: true,
            cls: 'yz-sheet-action',
            padding: 0,
            listeners: {
                order: 'after',
                hide: function () {
                    this.destroy();
                }
            }
        });

        Ext.each(btns, function (btn) {
            items.push(Ext.apply({}, {
                cls: 'yz-button-flat yz-button-sheet-action',
                handler: function () {
                    actionSheet.hide();
                    btn.handler()
                }
            }, btn));
        });

        items.push({
            text: RS.$('All__Cancel'),
            cls: ['yz-button-flat', 'yz-button-sheet-action'],
            margin: '7 0 0 0',
            handler: function () {
                actionSheet.hide();
            }
        });

        actionSheet.setItems(items);

        Ext.Viewport.add(actionSheet);
        actionSheet.show();
    },

    onLinkClick: function (link) {
        var me = this,
            form = me.form,
            action = link.DisplayString,
            validationGroup = link.ValidationGroup,
            formInfo = me.formInfo,
            step = formInfo.step,
            data;

        data = {
            Header: {
                Method: 'Process',
                PID: step.StepID,
                Action: action
            }
        };

        me.fireEvent('beforeProcess', me, data);
        if (form.fireEvent('beforeProcess', action, validationGroup, form) === false ||
            form.fireEvent('beforeSubmit', 'Process', action, validationGroup, form) === false)
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

                    if (form.fireEvent('Process', action, validationGroup, data, form) === false ||
                        form.fireEvent('Submit', 'Process', action, validationGroup, data, form) === false)
                        return false;

                    me.doAction({
                        title: action,
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

    directSend: function (directsend) {
        var me = this,
            form = me.form,
            action = '',
            validationGroup = directsend.validationGroup,
            formInfo = me.formInfo,
            step = formInfo.step,
            data;

        data = {
            Header: {
                Method: 'DirectSend',
                PID: step.StepID
            }
        };

        me.fireEvent('beforeDirectSend', me, data);
        if (form.fireEvent('beforeDirectSend', action, validationGroup, form) === false ||
            form.fireEvent('beforeSubmit', 'DirectSend', action, validationGroup, form) === false)
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

                    if (form.fireEvent('DirectSend', action, validationGroup, data, form) === false ||
                        form.fireEvent('Submit', 'DirectSend', action, validationGroup, data, form) === false)
                        return false;

                    me.doActionCommentsOnly({
                        title: RS.$('All_Form_DirectSend'),
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

    informSubmit: function () {
        var me = this,
            step = me.formInfo.step,
            data;

        data = {
            Header: {
                Method: 'InformSubmit',
                PID: step.StepID
            }
        };

        me.doActionCommentsOnly({
            title: RS.$('All_BPM_InformSubmit'),
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
    },

    indicateSubmit: function () {
        var me = this,
            step = me.formInfo.step,
            data;

        data = {
            Header: {
                Method: 'IndicateSubmit',
                PID: step.StepID
            }
        };

        me.doActionCommentsOnly({
            title: RS.$('All_BPM_InformSubmit'),
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