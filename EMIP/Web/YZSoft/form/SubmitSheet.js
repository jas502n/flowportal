
Ext.define('YZSoft.form.SubmitSheet', {
    extend: 'Ext.Sheet',
    config: {
        post: false,
        positions: null,
        inviteIndicate: false,
        consign: false,
        declares: null,
        routings: null,
        hideOnMaskTap: true,
        cls: ['yz-sheet-flat', 'yz-form'],
        enter: 'top',
        exit: 'top',
        top: 0,
        left: 0,
        right: 0,
        showAnimation: {
            type: 'slideIn',
            duration: 250,
            easing: 'ease-out'
        },
        hideAnimation: {
            type: 'slideOut',
            duration: 250,
            easing: 'ease-in'
        }
    },

    constructor: function (config) {
        var me = this,
            post = config.post === true,
            positions = config.positions,
            declares = config.declares,
            routings = config.routings || {},
            inviteIndicate = config.inviteIndicate,
            consign = config.consign,
            declareItems = me.declareItems = [],
            moreItems = [],
            topItems = [];

        me.btnBack = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            text: RS.$('All__Cancel'),
            align: 'left',
            handler: function () {
                me.hide();
            }
        });

        me.btnSubmit = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            text: RS.$('All_Form_Send'),
            align: 'right',
            handler: function () {
                var value = me.getValue(),
                    err = me.check(value)

                if (err) {
                    Ext.Msg.alert(RS.$('All_Form_SubmitValidation_Title_Failed'), err);
                    return;
                }

                if (me.config.fn)
                    me.config.fn.call(me.scope || me, me.getValue());
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            title: config.title || '',
            cls: ['yz-titlebar', 'yz-titlebar-submitsheet'],
            items: [me.btnBack, me.btnSubmit]
        });

        //if (post)
        //    me.selPosition = me.createPositionField(positions);

        me.edtComments = Ext.create('Ext.field.TextArea', {
            placeHolder: post ? RS.$('All_BPM_PostComments') : RS.$('All_BPM_SignComments'),
            maxRows: 6
        });

        Ext.each(declares, function (declare) {
            var item = Ext.create('YZSoft.form.sysfield.ParticipantDeclare', {
                declare: declare,
                routing: routings[declare.TargetStepName]
            });
            declareItems.push(item);
        });

        topItems.push(me.edtComments);

        Ext.each(declareItems, function (item) {
            topItems.push(item);
        });

        me.lstInviteIndicateUsers = Ext.create('YZSoft.src.field.Users', {
            label: RS.$('All__Title_InviteIndicateUsers'),
            cls: 'yz-field-weight-label'
        });

        me.fieldConsign = Ext.create('YZSoft.form.sysfield.Consign', {
            label: RS.$('All__Title_ConsignUsers')
        });

        if (inviteIndicate) {
            moreItems.push({
                xtype: 'fieldset',
                margin: '6 0 0 0',
                padding: 0,
                items: [me.lstInviteIndicateUsers]
            });
        }

        if (consign) {
            moreItems.push({
                xtype: 'fieldset',
                margin: '6 0 0 0',
                padding: 0,
                items: [me.fieldConsign]
            });
        }

        me.cntMore = Ext.create('Ext.Container', {
            hidden: true,
            items: moreItems
        });

        me.cntScrollArea = Ext.create('Ext.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [/*{
                xtype: 'fieldset',
                margin: '6 0 0 0',
                padding: 0,
                hidden: !post,
                items: post ? [me.selPosition] : []
            }, */{
                xtype: 'fieldset',
                margin: '6 0 0 0',
                padding: '6 0 0 0',
                items: topItems
            }, me.cntMore, {
                xtype: 'container',
                margin: 0,
                cls: ['yz-container-border-top', 'yz-container-border-bottom'],
                hidden: moreItems.length == 0,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'button',
                    cls: ['yz-button-flat', 'yz-button-bottom-expand'],
                    iconCls: 'yz-glyph yz-glyph-e942',
                    //pressedCls: '',
                    handler: function () {
                        if (me.cntMore.isHidden()) {
                            me.cntMore.show();
                            this.addCls('yz-button-bottom-expanded');
                        }
                        else {
                            me.cntMore.hide();
                            this.removeCls('yz-button-bottom-expanded');
                        }
                    }
                }]
            }]
        });

        var cfg = {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [me.titleBar, me.cntScrollArea]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            show: function () {
                me.setScrollable({
                    direction: 'vertical',
                    indicators: false
                });
                me.onContentHeightChanged();
            }
        });

        me.cntMore.on({
            scope: me,
            show: 'onContentHeightChanged',
            hide: 'onContentHeightChanged'
        });
    },

    onContentHeightChanged: function (height) {
        var me = this,
            height = me.cntScrollArea.element.getHeight() + me.titleBar.element.getHeight(),
            maxheight = Ext.Viewport.element.getHeight(),
            finalHeight = Math.min(height, maxheight);

        me.setHeight(finalHeight);
    },

    getValue: function () {
        var me = this,
            declareItems = me.declareItems,
            Routing = {},
            rv;

        Ext.each(declareItems, function (item) {
            var declare = item.getDeclare();
            Routing[declare.TargetStepName] = item.getValue();
        });

        rv = {
            Comment: Ext.String.trim(me.edtComments.getValue() || ''),
            InviteIndicateUsers: [],
            ConsignEnabled: false,
            ConsignUsers: [],
            ConsignRoutingType: 'Parallel',
            ConsignReturnType: 'Return',
            Context: {
                Routing: Routing
            }
        };

        //if (me.selPosition) {
        //    Ext.apply(rv, {
        //        OwnerMemberFullName: me.selPosition.getValue()
        //    });
        //}

        if (me.getInviteIndicate()) {
            Ext.apply(rv, {
                InviteIndicateUsers: me.lstInviteIndicateUsers.getValue()
            });
        }

        if (me.getConsign()) {
            var consign = me.fieldConsign.getValue();
            Ext.apply(rv, {
                ConsignEnabled: consign.enabled,
                ConsignUsers: consign.uids,
                ConsignRoutingType: consign.routingType,
                ConsignReturnType: consign.returnType
            });
        }

        return rv;
    },

    check: function (value) {
        var me = this,
            declareItems = me.declareItems || [],
            err;

        Ext.each(declareItems, function (item) {
            var declare = item.getDeclare(),
                uids = value.Context.Routing[declare.TargetStepName].Uids;

            if (!declare.JumpIfNoParticipants && uids.length == 0) {
                err = Ext.String.format(RS.$('All_BPM_Post_MissFreeRoutingDeclare'), declare.TargetStepName);
                return false;
            }
        });

        return err;
    },

    createPositionField: function (positions) {
        var me = this,
            items = [];

        Ext.each(positions, function (pos) {
            items.push({
                text: pos.name,
                value: pos.value
            });
        });

        return Ext.create('Ext.field.Select', {
            label: RS.$('All_Form_RequestPosition'),
            cls: ['yz-field-valuealign-right'],
            value: positions[0].value,
            options: items
        });
    }
});