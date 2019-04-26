
Ext.define('YZSoft.form.FormAbstract', {
    extend: 'YZSoft.form.TaskAbstract',
    requires: [
        'YZSoft.src.ux.xml',
        'YZSoft.src.ux.Push'
    ],
    config: {
        form: null,
        style: 'background-color:#f0f3f5;'
    },
    sp: {
        xtype: 'spacer',
        cls: 'yz-button-sp-approve',
        width: 2
    },

    openformerror: function (errorMessage) {
        var me = this;

        me.setItems([{
            xtype: 'component',
            cls: 'yz-component-error',
            html: errorMessage
        }]);
    },

    createForm: function (form, args) {
        var me = this,
            form = me.getForm() || form,
            pnl;

        pnl = Ext.create(form.xclass, Ext.merge({
            postContainer: me
        }, args, form.config));
        return pnl;
    },

    applyFormState: function (form, formInfo) {
        var me = this;

        if (form.$applyFormState) {
            form.$applyFormState(formInfo);
        }
    },

    setFormData: function (postModel, form, formInfo, fn, scope) {
        var me = this;

        if (form.$setFormDataExt) {
            form.$setFormDataExt(postModel, formInfo, fn, scope);
            return;
        }

        if (form.$setFormData) {
            form.$setFormData(postModel, formInfo);
            fn.call(scope);
            return;
        }

        fn.call(scope);
    },

    getFormData: function (form, formInfo, data, fn, scope) {
        var me = this;

        if (form.$getFormDataExt) {
            form.$getFormDataExt(formInfo, data, function (formdata) {
                fn.call(scope, formdata);
            });
            return;
        }

        if (form.$getFormData) {
            var formdata = form.$getFormData(formInfo, data);
            fn.call(scope, formdata);
            return;
        }

        fn.call(scope, {});
    },

    validateForm: function (args) {
        var me = this,
            form = me.form;

        if (form.$validateExt) {
            form.$validateExt(args, function () {
                args.fn.call(args.scope);
            });
            return;
        }

        if (form.$validate) {
            var result = form.$validate(args);

            if (Ext.isString(result)) {
                Ext.Msg.alert(RS.$('All__Title_FormValidationFailed'), result);
            }
            else if (result !== false) {
                args.fn.call(args.scope);
            }

            return;
        }

        args.fn.call(args.scope, {});
    },

    compressFormData: function (data, dataset) {
        var me = this;

        Ext.Object.each(data, function (tableName, rows) {
            var srcTable = dataset[tableName];
            if (srcTable) {
                Ext.Object.each(srcTable.Columns, function (columnName, column) {
                    if (column.Writeable === false) {
                        Ext.each(rows, function (row) {
                            delete row[columnName];
                        });
                    }
                });
            }
        });
    },

    encodeHeader: function (header) {
        if (header.ConsignUsers)
            header.ConsignUsers = Ext.encode(header.ConsignUsers);

        if (header.InviteIndicateUsers)
            header.InviteIndicateUsers = Ext.encode(header.InviteIndicateUsers);

        if (header.Context)
            header.Context = Ext.encode(header.Context);

        if (header.UrlParams)
            header.UrlParams = Ext.encode(header.UrlParams);
    },

    onSwitchForm: function (formtype) {
        var me = this;

        if (formtype == 'pc') {
            me.showPCForm();
        }
        else {
            if (me.pcForm) {
                me.pcForm.hide();
                me.mainContainer.setActiveItem(0);
            }
        }
    },

    showPCForm: function () {
        var me = this,
            formInfo = me.formInfo,
            task = formInfo && formInfo.task,
            taskid = task && task.TaskID,
            url = YZSoft.serverSetting.BPMSiteUrl ? YZSoft.serverSetting.BPMSiteUrl + 'YZSoft/Forms/ReadForm.aspx' : YZSoft.$url('EMIP/assist/PCFormError/Default.aspx');

        if (!task)
            return;

        if (!me.pcForm) {
            YZSoft.Ajax.request({
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Form.ashx'),
                params: {
                    Method: 'GetReadFormToken',
                    taskid: taskid
                },
                success: function (action) {
                    me.pcForm = Ext.create('YZSoft.src.panel.IFramePanel', {
                        url: url,
                        params: {
                            tid: taskid,
                            mobile: 1,
                            account: YZSoft.LoginUser.Account,
                            readFormToken: action.result.token
                        }
                    });

                    me.mainContainer.add(me.pcForm);
                    me.mainContainer.setActiveItem(me.pcForm);
                }
            });
        }
        else {
            me.mainContainer.setActiveItem(me.pcForm);
        }
    },

    ajaxPost: function (config) {
        var me = this,
            config = config || {},
            data = config.data,
            header = data.Header,
            maskExt, xmlData;

        me.encodeHeader(header);
        xmlData = YZSoft.src.ux.xml.encode('XForm', data);
//        var dlg = Ext.create('YZSoft.src.panel.Signature', {
//            title: config.title || RS.$('All_BPM_ReturnToInitiatorTitle'),
//            fn: function (comments) {
//                dlg.hide();
//                YZSoft.Ajax.request({
//                    method: 'POST',
//                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Post.ashx'),
//                    waitMsg: Ext.apply({
//                        message: config.waitMsg,
//                        autoClose: false
//                    }, maskExt),
//                    delay: true,
//                    params: config.params,
//                    jsonData: xmlData,
//                    success: function (action) {
//                        Ext.Viewport.mask(Ext.apply({
//                            cls: 'yz-mask-success',
//                            message: config.successMessage || action.result.message,
//                            delay: true,
//                            fn: function () {
//                                if (config.fn)
//                                    config.fn.call(config.scope || me, action.result);
//                            }
//                        }, maskExt));

//                        if (config.done)
//                            config.done.call(config.scope || me, action.result);
//                    },
//                    failure: function (action) {
//                        Ext.Msg.alert(RS.$('All_Form_Approve_Title_Failed'), action.result.errorMessage);
//                    }
//                });
//              
//            },
//            listeners: {
//                order: 'after',
//                hide: function () {
//                    this.destroy();
//                }
//            }
//        });

//        Ext.Viewport.add(dlg);
//        dlg.show();

 YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Post.ashx'),
                    waitMsg: Ext.apply({
                        message: config.waitMsg,
                        autoClose: false
                    }, maskExt),
                    delay: true,
                    params: config.params,
                    jsonData: xmlData,
                    success: function (action) {
                        Ext.Viewport.mask(Ext.apply({
                            cls: 'yz-mask-success',
                            message: config.successMessage || action.result.message,
                            delay: true,
                            fn: function () {
                                if (config.fn)
                                    config.fn.call(config.scope || me, action.result);
                            }
                        }, maskExt));

                        if (config.done)
                            config.done.call(config.scope || me, action.result);
                    },
                    failure: function (action) {
                        Ext.Msg.defaultAllowedConfig.showAnimation = false;
                        Ext.Msg.defaultAllowedConfig.hideAnimation = false;
                        Ext.Msg.alert(RS.$('All_Form_Approve_Title_Failed'), action.result.errorMessage);
                    }
                });
         
    },

    doAction: function (config) {
        var me = this,
            formInfo = me.formInfo,
            declares = formInfo.ParticipantDeclares,
            routings = formInfo.Routing,
            positions = formInfo.positions,
            nodePermisions = formInfo.NodePermisions,
            data = config.data,
            header = data.Header,
            dlg;

        if (config.prompt !== false) {
            dlg = Ext.create('YZSoft.form.SubmitSheet', Ext.apply({
                title: config.title,
                post: config.post,
                positions: positions,
                inviteIndicate: nodePermisions.InviteIndicate,
                consign: nodePermisions.Consign,
                declares: declares,
                routings: routings,
                hideOnMaskTap: true,
                fn: function (submitInfo) {
                    Ext.apply(header, submitInfo);

                    me.ajaxPost(Ext.apply({}, {
                        fn: function (result) {
                            dlg.hide(false);
                            if (config.fn)
                                config.fn.call(config.scope || me, result);
                        }
                    }, config));
                },
                listeners: {
                    order: 'after',
                    hide: function () {
                        this.destroy();
                    }
                }
            }, config.submitsheet));

            Ext.Viewport.add(dlg);
            dlg.show();
        }
        else {
            me.ajaxPost(Ext.apply({}, {
                fn: function (result) {
                    if (config.fn)
                        config.fn.call(config.scope || me, result);
                }
            }, config));
        }
    },

    doActionCommentsOnly: function (config) {
        var me = this,
            data = config.data,
            header = data.Header,
            dlg;

        dlg = Ext.create('YZSoft.src.panel.Comments', {
            title: config.title,
            fn: function (comments) {
                dlg.hide();

                Ext.apply(header, {
                    Comment: comments
                });

                me.ajaxPost(config);
            },
            listeners: {
                order: 'after',
                hide: function () {
                    this.destroy();
                }
            }
        });

        Ext.Viewport.add(dlg);
        dlg.show();
    },

    getPostResultMessage: function (rv) {
        var ar;

        ar = [];
        for (var i = 0; i < rv.Accounts.length; i++)
            ar.push(rv.Accounts[i].DisplayName);
        var toUserList = ar.join(';');

        ar = [];
        for (var i = 0; i < rv.Indicators.length; i++)
            ar.push(rv.Indicators[i].Account);

        var indicateMessage = ar.length != 0 ? ('\n' + Ext.String.format(RS.$('Form_Result_Indicator'), ar.join(';'))) : '';
        var customMessage = rv.CustomMessage ? ('\n[' + rv.CustomMessage + ']') : '';

        var msg = '';
        switch (rv.PostResult) {
            case 'HasSentToOtherUsers':
                msg = Ext.String.format(RS.$('Form_SendToOthUsers'), rv.SN, toUserList, indicateMessage, customMessage);
                break;
            case 'InWaitingOtherUsers':
                msg = Ext.String.format(RS.$('Form_WaitingOthUsers'), rv.SN, toUserList, indicateMessage, customMessage);
                break;
            case 'TaskInWaiting':
                msg = Ext.String.format(RS.$('Form_TaskInWaiting'), rv.SN, indicateMessage, customMessage);
                break;
            case 'TaskFinishedApproved':
                msg = Ext.String.format(RS.$('Form_TaskFinishedApproved'), rv.SN, customMessage);
                break;
            case 'TaskFinishedRejected':
                msg = Ext.String.format(RS.$('Form_TaskFinishedRejected'), rv.SN, customMessage);
                break;
        }
        return msg;
    },

    onSocial: function (button) {
        var me = this,
            formInfo = me.formInfo,
            pnl;

        if (!formInfo)
            return;

        pnl = Ext.create('YZSoft.social.chat.TaskChatPanel', Ext.apply({
            title: formInfo.task.ProcessName,
            tid: formInfo.task.TaskID,
            disableform: true,
            back: function () {
                Ext.mainWin.pop();
            }
        }));

        Ext.mainWin.push(pnl);

        button.setBadgeText('');
    },

    updateBadget: function (args) {
        var me = this,
            formInfo = me.formInfo,
            task = formInfo.task;

        args = args || {};

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Social.ashx'),
            params: {
                Method: 'GetNewMesssageCount',
                resType: 'Task',
                resId: task.TaskID
            },
            success: function (action) {
                var count = action.result;

                me.btnSocial.setBadgeText(count || '');

                if (args.fn)
                    args.fn.call(args.fn.scope, action);
            },
            failure: function (action) {
            }
        });
    },

    onNotify: function (message) {
        var me = this;

        if (message.channel != me.channel || message.clientid == YZSoft.src.ux.Push.clientid)
            return;

        this.updateBadget();
    }
});