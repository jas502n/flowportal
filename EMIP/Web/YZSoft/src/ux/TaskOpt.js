
Ext.define('YZSoft.src.ux.TaskOpt', {
    singleton: true,

    reject: function (config) {
        var me = this;

        var dlg = Ext.create('YZSoft.src.panel.Comments', {
            title: config.title || RS.$('All_BPM_Reject_Title'),
            fn: function (comments) {
                dlg.hide();

                YZSoft.Ajax.request({
                    method:'POST',
                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/TaskOpt.ashx'),
                    waitMsg: {
                        message: RS.$('All_BPM_Reject_Mask'),
                        autoClose: config.successMask === false
                    },
                    delay: true,
                    params: {
                        Method: 'Reject',
                        TaskID: config.tid
                    },
                    jsonData: {
                        comments: comments,
                        formdata: YZSoft.src.ux.xml.encode('XForm', config.data)
                    },
                    success: function (action) {
                        var message = RS.$('All_BPM_Reject_Mask_Succeed');

                        if (config.successMask !== false) {
                            Ext.Viewport.mask({
                                cls: 'yz-mask-success',
                                message: message,
                                delay: true,
                                fn: function () {
                                    if (config.fn)
                                        config.fn.call(config.scope || me, action.result);
                                }
                            });
                        }
                        else {
                            if (config.fn) {
                                config.fn.call(config.scope || me, action.result, {
                                    message: message
                                });
                            }
                        }

                        if (config.done)
                            config.done.call(config.scope || me, action.result);
                    },
                    failure: function (action) {
                        Ext.Msg.alert(RS.$('All_BPM_Reject_Title_Failed'), action.result.errorMessage);
                    }
                });
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

    returnToInitiator: function (config) {
        var me = this;

        var dlg = Ext.create('YZSoft.src.panel.Comments', {
            title: config.title || RS.$('All_BPM_ReturnToInitiatorTitle'),
            fn: function (comments) {
                dlg.hide();

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/TaskOpt.ashx'),
                    waitMsg: {
                        message: RS.$('All_BPM_ReturnToInitiator_Mask'),
                        autoClose: config.successMask === false
                    },
                    delay: true,
                    params: {
                        Method: 'ReturnToInitiator',
                        TaskID: config.tid
                    },
                    jsonData: {
                        comments: comments,
                        formdata: YZSoft.src.ux.xml.encode('XForm', config.data)
                    },
                    success: function (action) {
                        var message = Ext.String.format(RS.$('All_BPM_ReturnToInitiatorSucceed'), action.result.UserFriendlyName);
                        if (config.successMask !== false) {
                            Ext.Viewport.mask({
                                cls: 'yz-mask-success',
                                message: message,
                                delay: true,
                                fn: function () {
                                    if (config.fn)
                                        config.fn.call(config.scope || me, action.result);
                                }
                            });
                        }
                        else {
                            if (config.fn) {
                                config.fn.call(config.scope || me, action.result, {
                                    message: message
                                });
                            }
                        }

                        if (config.done)
                            config.done.call(config.scope || me, action.result);
                    },
                    failure: function (action) {
                        Ext.Msg.alert(RS.$('All_BPM_ReturnToInitiatorFailedTitle'), action.result.errorMessage);
                    }
                });
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

    recedeback: function (config) {
        var me = this;

        var pnl = Ext.create('YZSoft.src.sheet.SelStep', {
            title: RS.$('All_TaskOpt_RecedeBack_SelStep'),
            singleSelection: false,
            params: {
                method: 'GetRecedeBackSteps',
                stepid: config.pid
            },
            back: function () {
                pnl.hide();
            },
            fn: function (steps) {
                var dlg = Ext.create('YZSoft.src.panel.Comments', {
                    title: config.title || RS.$('All_BPM_RecedeBack'),
                    fn: function (comments) {
                        dlg.hide();

                        var tostepids = [];
                        Ext.each(steps, function (step) {
                            tostepids.push(step.StepID);
                        });

                        YZSoft.Ajax.request({
                            method: 'POST',
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/TaskOpt.ashx'),
                            waitMsg: {
                                message: RS.$('All_BPM_RecedeBack_Mask'),
                                autoClose: config.successMask === false
                            },
                            delay: true,
                            params: {
                                Method: 'RecedeBack',
                                StepID: config.pid
                            },
                            jsonData: {
                                comments: comments,
                                formdata: YZSoft.src.ux.xml.encode('XForm', config.data),
                                toStepIDs: tostepids
                            },
                            success: function (action) {
                                var message = Ext.String.format(RS.$('All_BPM_RecedeBackSucceed'), action.result.tosteps);

                                if (config.successMask !== false) {
                                    Ext.Viewport.mask({
                                        cls: 'yz-mask-success',
                                        message: message,
                                        delay: true,
                                        fn: function () {
                                            pnl.hide();

                                            if (config.fn)
                                                config.fn.call(config.scope || me, action.result);
                                        }
                                    });
                                }
                                else {
                                    if (config.fn) {
                                        config.fn.call(config.scope || me, action.result, {
                                            message: message,
                                            selStepPanel: pnl
                                        });
                                    }
                                }

                                if (config.done)
                                    config.done.call(config.scope || me, action.result);
                            },
                            failure: function (action) {
                                Ext.Msg.alert(RS.$('All_BPM_RecedeBackFailedTitle'), action.result.errorMessage);
                            }
                        });
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
            }
        });

        Ext.Viewport.add(pnl);
        pnl.show();
    },

    pickbackRestart: function (config) {
        var me = this;

        var dlg = Ext.create('YZSoft.src.panel.Comments', {
            title: config.title || RS.$('All_BPM_PickRestartTitle'),
            fn: function (comments) {
                dlg.hide();

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/TaskOpt.ashx'),
                    waitMsg: {
                        message: RS.$('All_TaskOpt_Pickback_Mask'),
                        autoClose: config.successMask === false
                    },
                    delay: true,
                    params: {
                        Method: 'PickbackRestart',
                        TaskID: config.tid,
                        Comments: comments
                    },
                    success: function (action) {
                        var message = RS.$('All_BPM_PickRestartSucceed');
                        
                        if (config.successMask !== false) {
                            Ext.Viewport.mask({
                                cls: 'yz-mask-success',
                                message: message,
                                delay: true,
                                fn: function () {
                                    if (config.fn)
                                        config.fn.call(config.scope || me, action.result);
                                }
                            });
                        }
                        else {
                            if (config.fn) {
                                config.fn.call(config.scope || me, action.result, {
                                    message: message
                                });
                            }
                        }

                        if (config.done)
                            config.done.call(config.scope || me, action.result);
                    },
                    failure: function (action) {
                        Ext.Msg.alert(RS.$('All_BPM_PickRestartFailedTitle'), action.result.errorMessage);
                    }
                });
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

    pickbackExt: function (config) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Task.ashx'),
            delay: true,
            params: {
                Method: 'GetPickbackableSteps',
                TaskID: config.tid
            },
            success: function (action) {
                var items = [],
                    actionSheet;

                Ext.each(action.result, function (step) {
                    items.push({
                        xtype: 'button',
                        text: step.NodeName,
                        cls: 'yz-button-flat yz-button-sheet-action',
                        handler: function () {
                            actionSheet.hide();
                            actionSheet.on({
                                single: true,
                                hide: function () {
                                    Ext.apply(config, {
                                        pid: step.StepID
                                    });
                                    me.doPickbackExtStep2(config);
                                }
                            });
                        }
                    });
                });

                items.push({
                    text: RS.$('All__Cancel'),
                    cls: 'yz-button-flat yz-button-sheet-action',
                    margin: '7 0 0 0',
                    handler: function () {
                        actionSheet.hide();
                    }
                });

                actionSheet = Ext.create('Ext.ActionSheet', {
                    hideOnMaskTap: true,
                    cls: 'yz-sheet-action',
                    padding: 0,
                    items: items,
                    listeners: {
                        order: 'after',
                        hide: function () {
                            this.destroy();
                        }
                    }
                });

                Ext.Viewport.add(actionSheet);
                actionSheet.show();
            },
            failure: function (action) {
            }
        });
    },

    doPickbackExtStep2: function (config) {
        var me = this;

        var dlg = Ext.create('YZSoft.src.panel.Comments', {
            title: config.title || RS.$('All_BPM_PickbackTitle'),
            fn: function (comments) {
                dlg.hide();

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/TaskOpt.ashx'),
                    waitMsg: {
                        message: RS.$('All_TaskOpt_Pickback_Mask'),
                        autoClose: config.successMask === false
                    },
                    delay: true,
                    params: {
                        Method: 'Pickback',
                        TaskID: config.tid,
                        StepID: config.pid,
                        Comments: comments
                    },
                    success: function (action) {
                        var message = RS.$('All_BPM_Pickback_Mask_Succeed');

                        if (config.successMask !== false) {
                            Ext.Viewport.mask({
                                cls: 'yz-mask-success',
                                message: message,
                                delay: true,
                                fn: function () {
                                    if (config.fn)
                                        config.fn.call(config.scope || me, action.result);
                                }
                            });
                        }
                        else {
                            if (config.fn) {
                                config.fn.call(config.scope || me, action.result, {
                                    message: message
                                });
                            }
                        }

                        if (config.done)
                            config.done.call(config.scope || me, action.result);
                    },
                    failure: function (action) {
                        Ext.Msg.alert(RS.$('All_BPM_PickbackFailedTitle'), action.result.errorMessage);
                    }
                });
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

    abort: function (config) {
        var me = this;

        var dlg = Ext.create('YZSoft.src.panel.Comments', {
            title: config.title || RS.$('All__Abort_Title'),
            fn: function (comments) {
                dlg.hide();

                YZSoft.Ajax.request({
                    method: 'POST',
                    url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/TaskOpt.ashx'),
                    waitMsg: {
                        message: RS.$('All_TaskOpt_Abort_Mask'),
                        autoClose: config.successMask === false
                    },
                    delay: true,
                    params: {
                        Method: 'Abort',
                        TaskID: config.tid,
                        Comments: comments
                    },
                    success: function (action) {
                        var message = RS.$('All_TaskOpt_Abort_Mask_Success');

                        if (config.successMask !== false) {
                            Ext.Viewport.mask({
                                cls: 'yz-mask-success',
                                message: message,
                                delay: true,
                                fn: function () {
                                    if (config.fn)
                                        config.fn.call(config.scope || me, action.result);
                                }
                            });
                        }
                        else {
                            if (config.fn) {
                                config.fn.call(config.scope || me, action.result, {
                                    message: message
                                });
                            }
                        }

                        if (config.done)
                            config.done.call(config.scope || me, action.result);
                    },
                    failure: function (action) {
                        Ext.Msg.alert(RS.$('All__Abort_Title_Failed'), action.result.errorMessage);
                    }
                });
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

    inform: function (config) {
        var me = this,
            title = config.title || RS.$('All_TaskOpt_Inform_Title');

        var pnl = Ext.create('YZSoft.src.sheet.SelUser', {
            back: function () {
                pnl.hide();
            },
            fn: function (users) {
                var dlg = Ext.create('YZSoft.src.panel.Comments', {
                    title: title,
                    fn: function (comments) {
                        dlg.hide();

                        var uids = [];
                        Ext.each(users, function (user) {
                            uids.push(user.Account);
                        });

                        YZSoft.Ajax.request({
                            method: 'POST',
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/TaskOpt.ashx'),
                            waitMsg: {
                                message: RS.$('All_BPM_Inform_Mask'),
                                autoClose: config.successMask === false
                            },
                            delay: true,
                            params: {
                                Method: 'Inform',
                                TaskID: config.tid
                            },
                            jsonData: {
                                comments: comments,
                                uids: uids
                            },
                            success: function (action) {
                                var message = Ext.String.format(RS.$('All_BPM_InformSucceed'), action.result.UserNameList);

                                if (config.successMask !== false) {
                                    Ext.Viewport.mask({
                                        cls: 'yz-mask-success',
                                        message: message,
                                        delay: true,
                                        fn: function () {
                                            pnl.hide();

                                            if (config.fn)
                                                config.fn.call(config.scope || me, action.result);
                                        }
                                    });
                                }
                                else {
                                    if (config.fn) {
                                        config.fn.call(config.scope || me, action.result, {
                                            message: message,
                                            selUserPanel: pnl
                                        });
                                    }
                                }

                                if (config.done)
                                    config.done.call(config.scope || me, action.result);
                            },
                            failure: function (action) {
                                Ext.Msg.alert(RS.$('All_BPM_Inform_Title_Failed'), action.result.errorMessage);
                            }
                        });
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
            listeners: {
                order: 'after',
                hide: function () {
                    this.destroy();
                }
            }
        });

        Ext.Viewport.add(pnl);
        pnl.show();
    },

    inviteIndicate: function (config) {
        var me = this,
            title = config.title || RS.$('All_TaskOpt_InviteIndicate_Title');

        var pnl = Ext.create('YZSoft.src.sheet.SelUser', {
            back: function () {
                pnl.hide();
            },
            fn: function (users) {
                var dlg = Ext.create('YZSoft.src.panel.Comments', {
                    title: title,
                    fn: function (comments) {
                        dlg.hide();

                        var uids = [];
                        Ext.each(users, function (user) {
                            uids.push(user.Account);
                        });

                        YZSoft.Ajax.request({
                            method: 'POST',
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/TaskOpt.ashx'),
                            waitMsg: {
                                message: RS.$('All_BPM_InviteIndicate_Mask'),
                                autoClose: config.successMask === false
                            },
                            delay: true,
                            params: {
                                Method: 'InviteIndicate',
                                TaskID: config.tid
                            },
                            jsonData: {
                                comments: comments,
                                uids: uids
                            },
                            success: function (action) {
                                var message = Ext.String.format(RS.$('All_BPM_InviteIndicateSucceed'), action.result.UserNameList);

                                if (config.successMask !== false) {
                                    Ext.Viewport.mask({
                                        cls: 'yz-mask-success',
                                        message: message,
                                        delay: true,
                                        fn: function () {
                                            pnl.hide();

                                            if (config.fn)
                                                config.fn.call(config.scope || me, action.result);
                                        }
                                    });
                                }
                                else {
                                    if (config.fn) {
                                        config.fn.call(config.scope || me, action.result, {
                                            message: message,
                                            selUserPanel: pnl
                                        });
                                    }
                                }

                                if (config.done)
                                    config.done.call(config.scope || me, action.result);
                            },
                            failure: function (action) {
                                Ext.Msg.alert(RS.$('All_BPM_InviteIndicateFailedTitle'), action.result.errorMessage);
                            }
                        });
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
            listeners: {
                order: 'after',
                hide: function () {
                    this.destroy();
                }
            }
        });

        Ext.Viewport.add(pnl);
        pnl.show();
    },

    pickupShareStep: function (config) {
        var me = this;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/TaskOpt.ashx'),
            waitMsg: {
                message: RS.$('All_TaskOpt_CheckOut_Mask'),
                autoClose: config.successMask === false
            },
            delay: true,
            params: {
                Method: 'PickupShareStep',
                StepID: config.pid
            },
            success: function (action) {
                var message = RS.$('All_TaskOpt_CheckOut_Mask_Success');

                if (config.successMask !== false) {
                    Ext.Viewport.mask({
                        cls: 'yz-mask-success',
                        message: message,
                        delay: true,
                        fn: function () {
                            if (config.fn)
                                config.fn.call(config.scope || me, action.result);
                        }
                    });
                }
                else {
                    if (config.fn) {
                        config.fn.call(config.scope || me, action.result, {
                            message: message
                        });
                    }
                }

                if (config.done)
                    config.done.call(config.scope || me, action.result);
            },
            failure: function (action) {
                Ext.Msg.alert(RS.$('All_TaskOpt_CheckOut_Title_Failed'), action.result.errorMessage);
            }
        });
    },

    putbackShareStep: function (config) {
        var me = this;

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/TaskOpt.ashx'),
            waitMsg: {
                message: RS.$('All_TaskOpt_CheckIn_Mask'),
                autoClose: false
            },
            delay: true,
            params: {
                Method: 'PutbackShareStep',
                StepID: config.pid
            },
            success: function (action) {
                Ext.Viewport.mask({
                    cls: 'yz-mask-success',
                    message: RS.$('All_TaskOpt_CheckIn_Mask_Success'),
                    delay: true,
                    fn: function () {
                        if (config.fn)
                            config.fn.call(config.scope || me, action.result);
                    }
                });

                if (config.done)
                    config.done.call(config.scope || me, action.result);
            },
            failure: function (action) {
                Ext.Msg.alert(RS.$('All_TaskOpt_CheckIn_Title_Failed'), action.result.errorMessage);
            }
        });
    },

    transfer: function (config) {
        var me = this,
            title = config.title || RS.$('All_BPM_Transfer_Title');

        var pnl = Ext.create('YZSoft.src.sheet.SelUser', {
            singleSelection: true,
            back: function () {
                pnl.hide();
            },
            fn: function (users) {
                if (users.length == 0)
                    return;

                var user = users[0];
                var dlg = Ext.create('YZSoft.src.panel.Comments', {
                    title: Ext.String.format(title, user.ShortName),
                    fn: function (comments) {
                        dlg.hide();

                        var uids = [];
                        Ext.each(users, function (user) {
                            uids.push(user.Account);
                        });

                        YZSoft.Ajax.request({
                            method: 'POST',
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/TaskOpt.ashx'),
                            waitMsg: {
                                message: RS.$('All_BPM_Transfer_Mask'),
                                autoClose: config.successMask === false
                            },
                            delay: true,
                            params: {
                                Method: 'Transfer',
                                StepID: config.pid,
                                Account: user.Account
                            },
                            jsonData: {
                                comments: comments
                            },
                            success: function (action) {
                                var message = Ext.String.format(RS.$('All_BPM_Transfer_Succeed'), action.result.ShortName);

                                if (config.successMask !== false) {
                                    Ext.Viewport.mask({
                                        cls: 'yz-mask-success',
                                        message: message,
                                        delay: true,
                                        fn: function () {
                                            pnl.hide();

                                            if (config.fn)
                                                config.fn.call(config.scope || me, action.result);
                                        }
                                    });
                                }
                                else {
                                    if (config.fn) {
                                        config.fn.call(config.scope || me, action.result, {
                                            message: message,
                                            selUserPanel: pnl
                                        });
                                    }
                                }

                                if (config.done)
                                    config.done.call(config.scope || me, action.result);
                            },
                            failure: function (action) {
                                Ext.Msg.alert(RS.$('All_BPM_TransferFailedTitle'), action.result.errorMessage);
                            }
                        });
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
            listeners: {
                order: 'after',
                hide: function () {
                    this.destroy();
                }
            }
        });

        Ext.Viewport.add(pnl);
        pnl.show();
    },

    remind: function (config) {
        var me = this;

        var pnl = Ext.create('YZSoft.src.sheet.SelRemindTarget', {
            title: RS.$('All_TaskOpt_Remind_SelTarget'),
            singleSelection: false,
            taskid: config.tid,
            back: function () {
                pnl.hide();
            },
            fn: function (targets) {
                var dlg = Ext.create('YZSoft.src.panel.Comments', {
                    title: config.title || RS.$('All_BPM_Remind'),
                    fn: function (comments) {
                        dlg.hide();

                        YZSoft.Ajax.request({
                            method: 'POST',
                            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/TaskOpt.ashx'),
                            waitMsg: {
                                message: RS.$('All_BPM_Remind_Mask'),
                                autoClose: config.successMask === false
                            },
                            delay: true,
                            params: {
                                Method: 'Remind',
                                TaskID: config.tid
                            },
                            jsonData: {
                                comments: comments,
                                targets: targets
                            },
                            success: function (action) {
                                var message = Ext.String.format(RS.$('All_BPM_RemindSucceed'), action.result.UserNameList);

                                if (config.successMask !== false) {
                                    Ext.Viewport.mask({
                                        cls: 'yz-mask-success',
                                        message: message,
                                        delay: true,
                                        fn: function () {
                                            pnl.hide();

                                            if (config.fn)
                                                config.fn.call(config.scope || me, action.result);
                                        }
                                    });
                                }
                                else {
                                    if (config.fn) {
                                        config.fn.call(config.scope || me, action.result, {
                                            message: message,
                                            selStepPanel: pnl
                                        });
                                    }
                                }

                                if (config.done)
                                    config.done.call(config.scope || me, action.result);
                            },
                            failure: function (action) {
                                Ext.Msg.alert(RS.$('All_BPM_RemindFailedTitle'), action.result.errorMessage);
                            }
                        });
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
            }
        });

        pnl.store.on({
            single: true,
            load: function (store, records, successful) {
                if (successful && records.length == 1)
                    pnl.list.select(records);
            }
        });

        Ext.Viewport.add(pnl);
        pnl.show();
    }
});