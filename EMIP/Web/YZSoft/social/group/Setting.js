Ext.define('YZSoft.social.group.Setting', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.ux.GlobalStore'
    ],
    config: {
        style: 'background-color:#f0f3f5;',
        scrollable: {
            direction: 'vertical',
            indicators: false
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        groupid: null,
        groupName: null
    },

    constructor: function (config) {
        var me = this,
            cfg;

        config = config || {};

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

        me.pnlUsers = Ext.create('YZSoft.social.group.GroupMembersShortcut', {
            groupid: config.groupid
        });

        me.btnGroupName = Ext.create('YZSoft.src.button.ListButton', {
            iconGoCls: 'yz-glyph yz-glyph-e904',
            text: RS.$('All_Group_GroupName'),
            bborder: true,
            desc: config.groupName || '',
            scope: me,
            handler: 'onRename'
        });

        me.fieldImage = Ext.create('YZSoft.src.field.ExpandIconSelect', {
            label: RS.$('All_Group_Icon'),
            valueField: 'Code',
            displayField: false,
            store: YZSoft.src.ux.GlobalStore.getGroupImageStore(),
            autoSelect: false,
            expended: false
        });

        me.btnExit = Ext.create('YZSoft.src.button.ListButton', {
            cls: ['yz-button-flat'],
            padding: '13 10',
            style: 'background-color:white;border-radius:0px;',
            text: RS.$('All_Group_Exit'),
            scope: me,
            handler: 'onExitGroup'
        });

        cfg = {
            defaults: {
                defaults: {
                    padding: '11 10 11 15'
                }
            },
            items: [me.titleBar, me.pnlUsers, {
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-form', 'yz-form-dark', 'yz-container-border-top', 'yz-container-border-bottom', 'yz-list-button-container-left15'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.btnGroupName, me.fieldImage]
            }, {
                xtype: 'container',
                margin: '10 0 0 0',
                cls: ['yz-container-border-top', 'yz-container-border-bottom'],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                items: [me.btnExit]
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            single: true,
            painted: function () {
                me.loadForm();
            }
        });

        me.pnlUsers.on({
            memberChanged: function () {
                me.fireEvent('memberChanged');
                me.loadForm();
            }
        });

        me.fieldImage.on({
            scope: me,
            select: 'onSelectChange'
        });
    },

    onRename: function () {
        var me = this,
            group = me.group;

        if (!group)
            return;

        var pnl = Ext.create('YZSoft.src.panel.Rename', {
            backText: false,
            submitText: RS.$('All__OK'),
            title: RS.$('All_Group_ChangeName'),
            emptyMessage: RS.$('All_Group_EmptyName'),
            value: me.btnGroupName.getDesc(),
            valueParamsName: 'newName',
            url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
            params: {
                Method: 'RenameGroup',
                groupid: me.getGroupid()
            },
            back: function () {
                Ext.mainWin.pop();
            },
            fn: function () {
                Ext.mainWin.pop();
            },
            done: function (value, result) {
                me.btnGroupName.setDesc(value);
                me.fireEvent('groupRenamed', value);
            }
        });

        Ext.mainWin.push(pnl);
    },

    onSelectChange: function (newvalue, record) {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
            params: {
                method: 'UpdateImageFile',
                groupid: me.getGroupid(),
                imageid: newvalue
            },
            success: function (action) {
                me.fireEvent('groupImageChanged', newvalue);
            }
        });
    },

    onExitGroup: function () {
        var me = this;

        Ext.Msg.show({
            message: RS.$('All_Group_ExitConfirmMessage'),
            hideOnMaskTap: true,
            buttons: [{
                text: RS.$('All_Group_ExitConfirm_Exit'),
                flex: 1,
                cls: 'yz-button-flat yz-button-dlg-normal',
                itemId: 'ok'
            }, { xtype: 'spacer', width: 12 }, {
                text: RS.$('All__WrongClick'),
                flex: 1,
                cls: 'yz-button-flat yz-button-dlg-default',
                itemId: 'cancel'
            }],
            fn: function (btn) {
                if (btn != 'ok')
                    return;

                YZSoft.Ajax.request({
                    url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
                    waitMsg: {
                        message: RS.$('All_Group_Exit_Mask'),
                        autoClose: false
                    },
                    delay: true,
                    params: {
                        method: 'ExitGroup',
                        groupid: me.getGroupid()
                    },
                    success: function (action) {
                        Ext.Viewport.mask({
                            cls: 'yz-mask-success',
                            message: RS.$('All_Group_Exit_Mask_Success'),
                            delay: 800,
                            fn: function () {
                                me.fireEvent('exitGroup');
                            }
                        });
                    },
                    failure: function (action) {
                        Ext.Msg.alert(RS.$('All_Group_Exit_Title_Failed'), action.result.errorMessage);
                    }
                });
            }
        });
    },

    loadForm: function () {
        var me = this;

        YZSoft.Ajax.request({
            url: YZSoft.$url('YZSoft.Services.REST/core/Group.ashx'),
            params: {
                method: 'GetGroupAndMembers',
                groupid: me.getGroupid()
            },
            success: function (action) {
                var group = me.group = action.result.group,
                    members = action.result.members,
                    users = [];

                Ext.Array.each(members, function (member) {
                    users.push(member.User);
                });

                me.titleBar.setTitle(Ext.String.format(RS.$('All_Group_Title_FMT'), users.length));
                me.pnlUsers.setUsers(users);
                me.btnGroupName.setDesc(group.Name);
                me.fieldImage.setValue(group.ImageFileID || 'Group99');
            }
        });
    }
});
