Ext.define('YZSoft.src.panel.CompanyContactPanel', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.device.Device',
        'YZSoft.src.device.StatusBar'
    ],
    config: {
        uid: null
    },

    constructor: function (config) {
        var me = this,
            uid = config && config.uid;

        config = config || {};

        //头像url
        var url = Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'GetHeadshot',
            account: config.uid,
            thumbnail: 'M'
        }));

        me.btnBack = Ext.create('Ext.Button', {
            text: RS.$('All__Back'),
            cls: ['yz-button-flat', 'yz-button-contact-back'],
            pressedCls: '',
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            top: application.statusbarOverlays ? 22 : 10,
            left: 0,
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me);
            }
        });

        me.cmpName = Ext.create('Ext.Component', {
            padding: '10 0 0 0',
            tpl: '<div class="name">{name}</div>',
            data: {}
        });

        me.cmpPosition = Ext.create('Ext.Component', {
            padding: '5 0 25 0',
            tpl: '<div class="pos">{position}</div>',
            data: {}
        });

        me.btnSMS = Ext.create('Ext.Button', {
            text: RS.$('All__SMS'),
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-contact-callout'],
            padding: '10 10',
            pressedCls: '',
            iconCls: 'yz-glyph yz-glyph-e901',
            iconAlign: 'left',
            flex: 1,
            scope: me,
            handler: 'onSMS'
        });

        me.btnCall = Ext.create('Ext.Button', {
            text: RS.$('All__Call'),
            cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-contact-callout'],
            padding: '10 10',
            pressedCls: '',
            iconCls: 'yz-glyph yz-glyph-e96a',
            iconAlign: 'left',
            flex: 1,
            scope: me,
            handler: 'onCall'
        });

        me.caption = Ext.create('Ext.Container', {
            cls: 'yz-contact-caption',
            style: 'background-image:url(YZSoft$Local/resources/images/contact/companybg.png)',
            padding: application.statusbarOverlays ? '48 0 22 0' : '38 0 22 0',
            layout: {
                type: 'vbox',
                pack: 'center',
                align: 'stretch'
            },
            items: [me.btnBack, {
                cls: 'yz-pull-top',
                style: 'background-color:#f0f3f5;'
            }, {
                xtype: 'container',
                layout: {
                    type: 'vbox',
                    pack: 'center',
                    align: 'center'
                },
                items: [{
                    xtype: 'image',
                    cls: ['yz-headshort'],
                    width: 76,
                    height: 76,
                    src: url
                }, me.cmpName, me.cmpPosition]
            }, {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'center'
                },
                padding: '0 30',
                items: [me.btnSMS, { xtype: 'spacer', width: 25 }, me.btnCall]
            }]
        });

        me.edtEMail = Ext.create('Ext.field.Field', {
            label: RS.$('All__EMail'),
            cls: ['yz-field-valuealign-right', 'yz-form-field-light', 'yz-form-field-labeldark']
        });

        me.edtMobile = Ext.create('Ext.field.Field', {
            label: RS.$('All__Mobile'),
            cls: ['yz-field-valuealign-right', 'yz-form-field-light', 'yz-form-field-labeldark']
        });

        me.edtOfficePhone = Ext.create('Ext.field.Field', {
            label: RS.$('All__FixedPhone'),
            cls: ['yz-field-valuealign-right', 'yz-form-field-light', 'yz-form-field-labeldark']
        });

        me.edtOffice = Ext.create('Ext.field.Field', {
            label: RS.$('All__Office'),
            cls: ['yz-field-valuealign-right', 'yz-form-field-light', 'yz-form-field-labeldark']
        });

        me.edtHRID = Ext.create('Ext.field.Field', {
            label: RS.$('All__HRID'),
            cls: ['yz-field-valuealign-right', 'yz-form-field-light', 'yz-form-field-labeldark']
        });

        me.edtDateHired = Ext.create('Ext.field.Field', {
            label: RS.$('All__DateJoinedCompany'),
            cls: ['yz-field-valuealign-right', 'yz-form-field-light', 'yz-form-field-labeldark']
        });

        me.edtCostCenter = Ext.create('Ext.field.Field', {
            label: RS.$('All__CosterCenter'),
            cls: ['yz-field-valuealign-right', 'yz-form-field-light', 'yz-form-field-labeldark']
        });

        me.edtSupervisor = Ext.create('YZSoft.src.button.ListButton', {
            text: RS.$('All__Supervisor'),
            cls: ['yz-button-flat', 'yz-button-list', 'yz-button-list-sizem'],
            pressedCls: '',
            iconGoCls: 'yz-glyph yz-glyph-e904',
            scope: me,
            handler: 'onSupervisorClick'
        });

        cfg = {
            style: 'background-color:#f0f3f5;',
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.caption, {
                xtype: 'container',
                cls: 'yz-form yz-form-read',
                defaults: {
                    padding: 0,
                    margin: '10 0 0 0'
                },
                items: [{
                    xtype: 'fieldset',
                    items: [me.edtEMail]
                }, {
                    xtype: 'fieldset',
                    items: [me.edtMobile, me.edtOfficePhone, me.edtOffice]
                }, {
                    xtype: 'fieldset',
                    items: [me.edtHRID, me.edtDateHired, me.edtCostCenter, me.edtSupervisor]
                }]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.loadUserInfo(uid);

        me.on({
            show: function () {
                YZSoft.src.device.StatusBar.styleLightContent();
            },
            hide: function () {
                YZSoft.src.device.StatusBar.styleDefault();
            }
        });
    },

    loadUserInfo: function (uid) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/BPM/Org.ashx'),
            params: {
                method: 'GetCompanyContactInfo',
                uid: uid
            },
            success: function (action) {
                var result = action.result,
                    user = me.user = result.user,
                    userCommonInfo = me.userCommonInfo = result.userCommonInfo,
                    positions = me.positions = result.positions,
                    supervisors = me.supervisors = result.supervisors;

                if (user.Sex == 'Male')
                    me.addCls('yz-sex-male');
                if (user.Sex == 'Female')
                    me.addCls('yz-sex-female');

                me.cmpName.setData({
                    name: user.ShortName
                });

                me.cmpPosition.setData({
                    position: me.getPositionDesc(positions)
                });

                if (!user.Mobile)
                    me.btnSMS.setDisabled(true);

                if (me.getPhones(user).length == 0)
                    me.btnCall.setDisabled(true);

                me.edtEMail.setHtml(user.EMail);

                me.edtMobile.setHtml(user.Mobile);
                me.edtOfficePhone.setHtml(user.OfficePhone);
                me.edtOffice.setHtml(user.Office);

                me.edtHRID.setHtml(user.HRID);
                me.edtDateHired.setHtml(user.DateHired ? Ext.Date.format(user.DateHired, RS.$('All__DateFmt_YMD')) : '');
                me.edtCostCenter.setHtml(user.CostCenter);
                me.edtSupervisor.setDesc(me.getSupervisorDesc(supervisors));
            }
        });
    },

    getPositionDesc: function (positions) {
        var rv = [],
            enc = Ext.util.Format.htmlEncode;

        Ext.each(positions, function (pos) {
            if (pos.LeaderTitle)
                rv.push(Ext.String.format('{0}-{1}', enc(pos.LeaderTitle), enc(pos.OUName)));
            else
                rv.push(Ext.String.format('{0}', enc(pos.OUName)));
        });

        return rv[0];
    },

    getSupervisorDesc: function (supervisors) {
        var rv = [],
            enc = Ext.util.Format.htmlEncode;

        Ext.each(supervisors, function (spv) {
            if (spv.FGYWs)
                rv.push(Ext.String.format('{0}({1})', enc(spv.ShortName), enc(spv.FGYWs)));
            else
                rv.push(Ext.String.format('{0}', enc(spv.ShortName)));
        });

        return rv.join(',');
    },

    getPhones: function (user) {
        var rv = [];

        if (user) {
            Ext.each(['Mobile', 'OfficePhone', 'HomePhone'], function (propertyName) {
                var phone = user[propertyName];
                if (phone)
                    rv.push(phone);
            });
        }

        return rv;
    },

    onSMS: function () {
        var me = this,
            user = me.user;

        if (user && user.Mobile)
            YZSoft.src.device.Device.sendSMS(user.Mobile);
    },

    onCall: function () {
        var me = this,
            user = me.user,
            phones = me.getPhones(user),
            items = [], actionSheet;

        if (phones.length == 0)
            return;

        if (phones.length == 1) {
            YZSoft.src.device.Device.call(phones[0]);
            return;
        }

        Ext.each(phones, function (phone) {
            items.push({
                text: phone,
                cls: 'yz-button-flat yz-button-sheet-action',
                handler: function () {
                    actionSheet.hide();
                    actionSheet.on({
                        single: true,
                        hide: function () {
                            YZSoft.src.device.Device.call(phone);
                        }
                    });
                }
            });
        });

        items.push({
            xtype: 'button',
            text: RS.$('All__Cancel'),
            cls: 'yz-button-flat yz-button-sheet-action yz-button-sheet-topborder',
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

    onSupervisorClick: function () {
        var me = this,
            supervisors = me.supervisors,
            items = [], actionSheet;

        if (supervisors.length == 0)
            return;

        if (supervisors.length == 1) {
            me.openUser(supervisors[0].Account);
            return;
        }

        Ext.each(supervisors, function (spv) {
            items.push({
                text: spv.ShortName,
                cls: 'yz-button-flat yz-button-sheet-action',
                handler: function () {
                    actionSheet.hide();
                    actionSheet.on({
                        single: true,
                        hide: function () {
                            me.openUser(spv.Account);
                        }
                    });
                }
            });
        });

        items.push({
            xtype: 'button',
            text: RS.$('All__Cancel'),
            cls: 'yz-button-flat yz-button-sheet-action yz-button-sheet-topborder',
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

    openUser: function (uid) {
        var me = this,
            pnl;

        pnl = Ext.create('YZSoft.src.panel.CompanyContactPanel', {
            uid: uid,
            back: function () {
                Ext.mainWin.pop();
            }
        });

        Ext.mainWin.push(pnl);
    }
});
