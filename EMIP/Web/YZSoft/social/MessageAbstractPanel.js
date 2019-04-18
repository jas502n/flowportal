Ext.define('YZSoft.social.MessageAbstractPanel', {
    extend: 'Ext.Container',

    findRecord: function (store, resType, resId) {
        var me = this,
            index;

        index = store.findBy(function (record) {
            return record.data.resType == resType && record.data.resId == resId;
        });

        return index != -1 ? store.getAt(index) : null;
    },

    openSocialPanel: function (record, config) {
        var me = this,
            pnl;

        switch (record.data.resType) {
            case 'Task':
                pnl = Ext.create('YZSoft.social.chat.TaskChatPanel', Ext.apply({
                    title: record.data.resName,
                    tid: Number(record.data.resId),
                    back: function () {
                        Ext.mainWin.pop();
                    }
                }, config));
                break;
            case 'Group':
                pnl = Ext.create('YZSoft.social.chat.GroupChatPanel', Ext.apply({
                    title: record.data.resName,
                    groupid: Number(record.data.resId),
                    editable: record.data.ext.GroupType == 'Chat',
                    back: function () {
                        Ext.mainWin.pop();
                    }
                }, config));

                me.relayEvents(pnl, ['groupRenamed', 'groupImageChanged', 'exitGroup']);
                break;
            case 'SingleChat':
                pnl = Ext.create('YZSoft.social.chat.SingleChatPanel', Ext.apply({
                    title: record.data.resName,
                    groupid: Number(record.data.resId),
                    back: function () {
                        Ext.mainWin.pop();
                    }
                }, config));
                break;
            case 'TaskApproved':
            case 'TaskRejected':
                pnl = Ext.create('YZSoft.social.notify.NotifyPanel', Ext.apply({
                    title: record.data.resName,
                    resType: record.data.resType,
                    resId: record.data.resId,
                    back: function () {
                        Ext.mainWin.pop();
                    }
                }, config));
                break;
            case 'ProcessRemind':
                pnl = Ext.create('YZSoft.social.notify.NotifyPanel', Ext.apply({
                    title: record.data.resName,
                    resType: record.data.resType,
                    resId: record.data.resId,
                    channel:'processRemind',
                    back: function () {
                        Ext.mainWin.pop();
                    }
                }, config));
                break;
            default:
                break;
        }

        if (!pnl)
            return;

        Ext.mainWin.push(pnl);
    }
});