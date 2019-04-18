
Ext.define('YZSoft.personal.security.lock.PasswordContainer', {
    extend: 'Ext.Container',
    config: {
        caption: null,
        errorMessage: null,
        style: 'background-color:transparent',
        layout: {
            type: 'vbox',
            align: 'stretch'
        }
    },

    constructor: function (config) {
        var me = this,
            cfg;

        me.edtPassword = Ext.create('YZSoft.personal.security.lock.PasswordField', {
            passwordLength: 4,
            margin: '8 0'
        });

        me.cmpError = Ext.create('Ext.Component', {
            cls: ['yz-align-hvcenter', 'yz-screelock-setting-errmsg'],
            tpl: [
                '{text}'
            ],
            data: {
                text: config.errorMessage || '&nbsp;'
            }
        });

        cfg = {
            items: [{
                xtype: 'container',
                flex: 2
            }, {
                xtype: 'component',
                cls: ['yz-align-hvcenter', 'yz-screelock-setting-caption'],
                tpl: [
                    '{text}'
                ],
                data: {
                    text: config.caption || ''
                }
            }, me.edtPassword, me.cmpError, {
                xtype: 'container',
                flex: 3
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    updateErrorMessage: function (newValue) {
        var me = this;

        me.cmpError.setData({
            text: newValue || '&nbsp;'
        });
    }
});