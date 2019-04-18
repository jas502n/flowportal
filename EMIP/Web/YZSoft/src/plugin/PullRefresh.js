
Ext.define('YZSoft.src.plugin.PullRefresh', {
    extend: 'Ext.plugin.PullRefresh',
    alias: 'plugin.yzpullrefresh',
    config: {
        cls: ['yz-pullrefresh'],
        pullText: RS.$('All__PullRefresh_PullText'),
        releaseText: RS.$('All__PullRefresh_ReleaseText'),
        loadingText: RS.$('All__Refreshing'),
        loadedText: RS.$('All__Refreshing'),
        fetchCopyFields: null,
        fetchCopyFieldsExcept: null,
        pullTpl: [
            '<div class="x-list-pullrefresh-arrow"></div>',
            '<div class="x-loading-spinner">',
                '<span class="x-loading-top"></span>',
                '<span class="x-loading-right"></span>',
                '<span class="x-loading-bottom"></span>',
                '<span class="x-loading-left"></span>',
            '</div>',
            '<div class="x-list-pullrefresh-wrap">',
                '<div class="x-list-pullrefresh-message">{message}</div>',
                '<div class="x-list-pullrefresh-updated">{updated}</div>',
            '</div>'
        ].join('')
    },

    setState: function (value) {
        this.$state = value;

        var me = this,
            state = me.getState(),
            stateFn = state.charAt(0).toUpperCase() + state.slice(1).toLowerCase(),
            fn = "get" + stateFn + "Text",
            message;

        if (me[fn] && Ext.isFunction(me[fn])) {
            message = me[fn].call(me);
        }

        me.innerElement.removeCls(["loaded", "loading", "release", "pull"], Ext.baseCSSPrefix + "list-pullrefresh");
        me.innerElement.addCls(me.getState(), Ext.baseCSSPrefix + "list-pullrefresh");

        me.innerElement.down('.x-list-pullrefresh-message').setHtml(message);
    },

    onLatestFetched: function (operation) {
        var store = this.getList().getStore(),
            oldRecords = store.getData(),
            newRecords = operation.getRecords(),
            length = newRecords.length,
            toInsert = [],
            newRecord, oldRecord, i;

        for (i = 0; i < length; i++) {
            newRecord = newRecords[i];
            oldRecord = oldRecords.getByKey(newRecord.getId());

            if (oldRecord) {
                oldRecord.set(this.fetchCopy(newRecord));
            } else {
                toInsert.push(newRecord);
            }

            oldRecord = undefined;
        }

        store.insert(0, toInsert);
        this.setState('loaded');
        this.fireEvent('latestfetched', this, toInsert);
        if (this.getAutoSnapBack()) {
            this.snapBack();
        }
    },

    fetchCopy: function (record) {
        var me = this,
            fetchcopyFields = me.getFetchCopyFields(),
            fetchCopyFieldsExcept = me.getFetchCopyFieldsExcept(),
            data;

        if (!fetchcopyFields)
            data = Ext.apply({}, record.getData());
        else
            data = Ext.copyTo({}, record.getData(), fetchChcopyFields);

        if (fetchCopyFieldsExcept) {
            Ext.Array.each(fetchCopyFieldsExcept, function (fieldName) {
                delete data[fieldName];
            });
        }

        return data;
    }
});