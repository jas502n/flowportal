
Ext.define('YZSoft.form.Simulate', {
    extend: 'YZSoft.form.FormAbstract',
    isSimulate: true,
    requires: [
        'YZSoft.src.ux.TaskOpt'
    ],
    config: {
        processName: null,
        version: null,
        uid: null
    },

    constructor: function (config) {
        var me = this;

        me.firsttime = true;

        if (window.addEventListener)
            window.addEventListener('message', function (e) { me.onSimulateMessage(e) }, false);
        else if (window.attachEvent)
            window.attachEvent('onmessage', function (e) { me.onSimulateMessage(e) });

        me.formContainer = Ext.create('Ext.Container', {
        });

        me.trace = Ext.create('YZSoft.form.TaskTrace', {
            cls: ['yz-noscroll-autosize','yz-tasktrace'],
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

        var cfg = {
            layout: 'fit',
            items: [me.mainContainer]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    loadForm: function (args) {
        var me = this;

        args = args || {};

        YZSoft.Ajax.request(Ext.apply({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Form.ashx'),
            params: {
                Method: 'GetSimulateInfo',
                processName: me.getProcessName(),
                version: me.getVersion(),
                uid: me.getUid()
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
                var simulateParams = {
                    mobileFormSetting: args.mobileFormSetting,
                    processName: me.getProcessName(),
                    version: me.getVersion(),
                    uid: me.getUid()
                };

                var formInfo = me.formInfo = action.result;

                me.loadUserForm(formInfo, simulateParams, function (success) {
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

    loadUserForm: function (formInfo, simulateParams, fn, scope) {
        var me = this,
            task = formInfo.task,
            step = formInfo.step,
            form;

        form = me.createForm(formInfo.form, {
            model: 'Simulate',
            simulateParams: simulateParams,
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
            steps = formInfo.steps;

        me.setFormData(false, form, formInfo, function () {
            me.trace.store.setData(steps);
            me.formContainer.setItems([form]);
            me.form = form;
        }, me);
    },

    onSimulateMessage: function (e, data) {
        data = data || (((Ext.isString(e.data) && e.data[0] == '{') ? Ext.decode(e.data) : e.data));

        if (!data || data.channel != 'BPM:990')
            return;

        var me = this,
            params = data.params;

        if (params.method == 'call') {
            var method = params.callmethod,
                params = params.params;

            //握手
            e.source.postMessage(Ext.encode({
                channel: 'BPM:2020',
                params: {
                    result: 'hello-ok!' //代表系统会响应此消息，请等待
                }
            }), '*');

            try {
                var callFunc = me[method];

                if (!callFunc) {
                    e.source.postMessage(Ext.encode({
                        channel: 'BPM:2020',
                        params: {
                            result: 'notImplement'  //表单未实现此方法
                        }
                    }), '*');
                }
                else {
                    callFunc.call(me, params, function (data) {
                        e.source.postMessage(Ext.encode({
                            channel: 'BPM:2020',
                            params: {
                                result: 'success',
                                data: data
                            }
                        }), '*');
                    }, function (errorMessage) {
                        e.source.postMessage(Ext.encode({
                            channel: 'BPM:2020',
                            params: {
                                result: 'failure',
                                errorMessage: errorMessage || false
                            }
                        }), '*');
                    });
                }
            }
            catch (err) {
                var errorMessage = Ext.isString(err) ? err : err.message;

                e.source.postMessage(Ext.encode({
                    channel: 'BPM:2020',
                    params: {
                        result: 'failure',
                        errorMessage: Ext.isString(err) ? err : err.message
                    }
                }), '*');
            }
        }
    },

    updateSimulateData: function (params, success, fail) {
        var me = this,
            requestConfig;

        success.call(me, {});

        requestConfig = {
            delay: true
        };

        if (!me.firsttime) {
            Ext.apply(requestConfig, {
                waitMsg: false,
                delay: false
            });
        }

        me.loadForm({
            mobileFormSetting: params.mobileFormSetting,
            params: {
                Method: 'Simulate',
                processName: me.getProcessName(),
                version: me.getVersion(),
                uid: me.getUid()
            },
            requestConfig: requestConfig
        });

        me.firsttime = false;
    }
});