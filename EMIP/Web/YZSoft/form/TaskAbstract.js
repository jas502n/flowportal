/*
config
    pid,
    title
*/
Ext.define('YZSoft.form.TaskAbstract', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.ux.TaskOpt'
    ],

    reject: function (done) {
        var me = this,
            form = me.form,
            formInfo = me.formInfo,
            step = formInfo.step,
            data;

        data = {
            Header: {
                Method: 'Save',
                PID: step.StepID
            }
        };

        me.getFormData(form, formInfo, data, function (formdata) {
            data.FormData = formdata.FormData;
            me.compressFormData(data.FormData, formInfo.formdataset);

            YZSoft.src.ux.TaskOpt.reject({
                tid: me.formInfo.task.TaskID,
                data: data,
                fn: function (result) {
                    if (me.config.fn)
                        me.config.fn.call(me.scope || me);
                },
                done: function (result) {
                    if (done)
                        done.call(me.scope || me);

                    if (me.config.done)
                        me.config.done.call(me.scope || me);
                }
            });
        });
    },

    returnToInitiator: function (done) {
        var me = this,
            form = me.form,
            formInfo = me.formInfo,
            step = formInfo.step,
            data;

        data = {
            Header: {
                Method: 'Save',
                PID: step.StepID
            }
        };

        me.getFormData(form, formInfo, data, function (formdata) {
            data.FormData = formdata.FormData;
            me.compressFormData(data.FormData, formInfo.formdataset);

            YZSoft.src.ux.TaskOpt.returnToInitiator({
                tid: me.formInfo.task.TaskID,
                data: data,
                fn: function (result, opt) {
                    if (me.config.fn)
                        me.config.fn.call(me.scope || me);
                },
                done: function (result) {
                    if (done)
                        done.call(me.scope || me);

                    if (me.config.done)
                        me.config.done.call(me.scope || me);
                }
            });
        });
    },

    recedeback: function (done) {
        var me = this,
            form = me.form,
            formInfo = me.formInfo,
            step = formInfo.step,
            data;

        data = {
            Header: {
                Method: 'Save',
                PID: step.StepID
            }
        };

        me.getFormData(form, formInfo, data, function (formdata) {
            data.FormData = formdata.FormData;
            me.compressFormData(data.FormData, formInfo.formdataset);

            YZSoft.src.ux.TaskOpt.recedeback({
                pid: me.formInfo.step.StepID,
                data: data,
                successMask: false,
                fn: function (result, opt) {
                    me.reloadForm(opt.message, function () {
                        opt.selStepPanel.hide();
                    });
                },
                done: function (result) {
                    if (done)
                        done.call(me.scope || me);

                    if (me.config.done)
                        me.config.done.call(me.scope || me);
                }
            });
        });
    },

    pickbackRestart: function (done) {
        var me = this;

        YZSoft.src.ux.TaskOpt.pickbackRestart({
            tid: me.formInfo.task.TaskID,
            successMask: false,
            fn: function (result, opt) {
                me.reloadForm(opt.message, function () {
                });
            },
            done: function (result) {
                if (done)
                    done.call(me.scope || me);

                if (me.config.done)
                    me.config.done.call(me.scope || me);
            }
        });
    },

    pickbackExt: function (done) {
        var me = this;

        YZSoft.src.ux.TaskOpt.pickbackExt({
            tid: me.formInfo.task.TaskID,
            successMask: false,
            fn: function (result, opt) {
                me.reloadForm(opt.message, function () {
                });
            },
            done: function (result) {
                if (done)
                    done.call(me.scope || me);

                if (me.config.done)
                    me.config.done.call(me.scope || me);
            }
        });
    },

    abort: function (done) {
        var me = this;

        YZSoft.src.ux.TaskOpt.abort({
            tid: me.formInfo.task.TaskID,
            successMask: false,
            fn: function (result, opt) {
                me.reloadForm(opt.message, function () {
                });
            },
            done: function (result) {
                if (done)
                    done.call(me.scope || me);

                if (me.config.done)
                    me.config.done.call(me.scope || me);
            }
        });
    },

    inform: function (done) {
        var me = this;

        YZSoft.src.ux.TaskOpt.inform({
            tid: me.formInfo.task.TaskID,
            successMask: false,
            fn: function (result, opt) {
                me.reloadForm(opt.message, function () {
                    opt.selUserPanel.hide();
                });
            },
            done: function (result) {
                if (done)
                    done.call(me.scope || me);

                if (me.config.done)
                    me.config.done.call(me.scope || me);
            }
        });
    },

    transfer: function (done) {
        var me = this;

        YZSoft.src.ux.TaskOpt.transfer({
            pid: me.formInfo.step.StepID,
            successMask: false,
            fn: function (result, opt) {
                me.reloadForm(opt.message, function () {
                    opt.selUserPanel.hide();
                });
            },
            done: function (result) {
                if (done)
                    done.call(me.scope || me);

                if (me.config.done)
                    me.config.done.call(me.scope || me);
            }
        });
    },

    remind: function (done) {
        var me = this;

        YZSoft.src.ux.TaskOpt.remind({
            tid: me.formInfo.task.TaskID,
            successMask: false,
            fn: function (result, opt) {
                me.reloadForm(opt.message, function () {
                    opt.selStepPanel.hide();
                });
            },
            done: function (result) {
                if (done)
                    done.call(me.scope || me);

                if (me.config.done)
                    me.config.done.call(me.scope || me);
            }
        });
    },

    inviteIndicate: function (done) {
        var me = this;

        YZSoft.src.ux.TaskOpt.inviteIndicate({
            tid: me.formInfo.task.TaskID,
            successMask: false,
            fn: function (result, opt) {
                me.reloadForm(opt.message, function () {
                    opt.selUserPanel.hide();
                });
            },
            done: function (result) {
                if (done)
                    done.call(me.scope || me);

                if (me.config.done)
                    me.config.done.call(me.scope || me);
            }
        });
    },

    putbackShareStep: function (done) {
        var me = this;

        YZSoft.src.ux.TaskOpt.putbackShareStep({
            pid: me.formInfo.step.StepID,
            fn: function (result) {
                if (me.config.fn)
                    me.config.fn.call(me.scope || me);
            },
            done: function (result) {
                if (done)
                    done.call(me.scope || me);

                if (me.config.done)
                    me.config.done.call(me.scope || me);
            }
        });
    },

    pickupShareStep: function (done) {
        var me = this;

        YZSoft.src.ux.TaskOpt.pickupShareStep({
            pid: me.formInfo.step.StepID,
            successMask: false,
            fn: function (result, opt) {
                me.setPid(result.stepid);
                me.reloadForm(opt.message, function () {
                });
            },
            done: function (result) {
                if (done)
                    done.call(me.scope || me);

                if (me.config.done)
                    me.config.done.call(me.scope || me);
            }
        });
    }
});