Ext.define('YZSoft.App.AppInfo', {
    extend: 'Ext.Container',

    constructor: function(config) {
        var me = this,
        displayColumns = config.displayColumns,
        formstate = {},
        formservice;

        me.selection = [];
        me.btnBack = Ext.create('Ext.Button', {
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function() {
                if (me.config.back) me.config.back.call(me.scope || me);
            }
        });
        me.search = Ext.create('YZSoft.src.field.Search', {
            placeHolder: RS.$('All__Search'),
            flex: 1,
            margin: 0,
            listeners: {
                scope: me,
                beforeactivesearch: 'onActiveSearch',
                cancelsearch: 'onCancelSearch',
                searchClick: 'onSearchClick'
            }
        });

        me.titleBar = Ext.create('Ext.Container', {
            docked: 'top',
            cls: ['yz-searchbar', 'yz-padding-0'],
            style: (application.statusbarOverlays ? 'padding-top:27px': '') + 'border-bottom-width:0px!important',
            padding: '1 0 0 0',
            minHeight: 0,
            layout: {
                type: 'hbox',
                align: 'center'
            },
            items: [me.btnBack, me.search]
        });

        YZSoft.Ajax.request({
            method: 'POST',
            url: YZSoft.$url('YZSoft.Services.REST.Mobile/YZApp/App.ashx'),
            async: false,
            params: {
                method: 'GetColumns',
                appname: config.title
            },
            success: function(action) {
                displayColumns = action.result.displayname;
                formstate = action.result.formstate;
                formservice = action.result.formservice;
            }
        });
        //创建store
        var fields = [];
        Ext.each(displayColumns,
        function(column) {
            fields.push("primarykeyyzapp");
            fields.push(column.name);
        });
        me.store = Ext.create('Ext.data.Store', {
            fields: fields,
            autoLoad: false,
            loadDelay: true,
            clearOnPageLoad: true,
            pageSize: 10 || YZSoft.setting.pageSize.defaultSize,
            proxy: {
                type: 'ajax',
                url: YZSoft.$url('YZSoft.Services.REST.Mobile/YZApp/App.ashx'),
                extraParams: {
                    method: 'GetApplistInfo',
                    appname: config.title
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children',
                    totalProperty: 'total'
                }
            }
        });

        me.actionBar = Ext.create('Ext.Container', {
            docked: 'bottom',
            minHeight: 48,
            hidden: true,
            style: 'background-color:#25a6d8',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {},
            items: []
        });
        me.btnok=Ext.create('Ext.Button', {
                        flex: 1,
                        text: '删除',
                        cls: ['yz-button-flat', 'yz-button-flat-del','yz-button-noflex', 'yz-button-action-del'],
                        padding: '16 3',
                         disabled:true,
                        iconCls: 'yz-glyph',
                        handler: function() {
                            me.deletedata();
                        }
                    })
        me.list = me.createList(me.store, displayColumns);

        me.list.on({
            single: true,
            painted: function() {
          
             var newValue =true;
             if (formstate.del.show&&!formstate.del.mdel) 
             {
             newValue=false;
             }
                me.list[newValue ? 'removeCls': 'addCls']('yz-list-selmode-m');
                me.list[newValue ? 'addCls': 'removeCls']('yz-list-selmode-s');

                var btns = [];
                if (formstate.add.show) {
                    me.actionBar.show();

                    btns.push(Ext.create('Ext.Button', {
                        flex: 1,
                        text: '新增',
                        cls: ['yz-button-flat', 'yz-button-noflex', 'yz-button-action-approve'],
                        padding: '16 3',
                        iconCls: 'yz-glyph',
                        handler: function() {
                            me.onAddClick(formservice, formstate.add.state);
                        }
                    }));
                }

                if (formstate.del.show&&!formstate.del.mdel) {
                    me.actionBar.show();

                    btns.push(me.btnok);
                }
                me.actionBar.setItems(btns);
                me.store.load();
            }
        });
        var cfg = {
            layout: 'fit',
            items: [me.titleBar, me.list, me.actionBar]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        Ext.mainWin.on({
            worklistchanged: function() {
                me.store.loadPage(1, {
                    delay: false,
                    mask: false
                });
            }
        });

        YZSoft.src.device.Device.on({
            resume: function() {
            
                me.store.loadPage(1, {
                    delay: false,
                    mask: false
                });
            }
        });

        me.on({
            scope: me,
            searchClick: 'onSearch',
             selectionchange: 'onSelectionChange'
        });
    },
    createList: function(store, displayColumns) {
        var me = this,
        displayColumns = displayColumns || [],
        items = [];
        for (var i = 0; i < displayColumns.length; i++) {
            var displayColumn = displayColumns[i];
            items.push(['<div class="yz-layout-columns item">', '<div class="label">', displayColumn.text || displayColumn.name, '</div>', '<div class="sp"></div>', '<div class="yz-column-center text">', '{[this.renderValue(values,' + i + ')]}', '</div> ', '</div>'].join(''));
        }
        return Ext.create('Ext.dataview.List', {
            store: store,
            cls: 'yz-list-firstitemnotopborder',
            loadingText: false,
            scrollable: {
                direction: 'vertical',
                indicators: false
            },
            plugins: [{
                xclass: 'YZSoft.src.plugin.PullRefresh'
            },
            {
                xclass: 'YZSoft.src.plugin.ListPaging',
                autoPaging: true
            }],

            pressedDelay: YZSoft.setting.delay.pressedDelay,
            disableSelection: true,
            emptyText: '尚无数据',
            itemCls: ['yz-list-item-flat', 'yz-list-item-border', 'yz-list-item-databrowser'],
            selectedCls: 'yz-item-selected',
            itemTpl: Ext.create('Ext.XTemplate', '<div class="yz-layout-columns" style="border-bottom:1px solid #eee">', '<div class="yz-column-left yz-align-vcenter yz-list-item-check-column">', '<div class="check"></div>', '</div>', '<div class="yz-column-center body" style="padding:10px">', items.join(''), '</div>', '<div class="yz-column-right yz-align-vcenter yz-list-item-more-column">', '<div class="yz-list-item-more"></div>', '</div>', '</div>', {
                renderValue: function(values, columnIndex) {
                    var column = displayColumns[columnIndex],
                    value = values[column.name];
                    return value;
                }
            }),
            listeners: {
                scope: me,
                itemtap: 'onItemTap'
            }
        });
    },
    onWorkListChanged: function(message) {
        this.store.loadPage(1, {
            delay: false,
            mask: false
        });
    },
    onActiveSearch: function(search) {
        var me = this;
        search.cancel.show();
        // me.btnFilter.hide();
    },
    onAddClick: function(formservice, state) {

        var me = this,
        pnl;
        var del = {
            show: false
        };
        pnl = Ext.create('YZSoft.app.FormApplication', {
            title: "新增",
            del: del,
            app: formservice,
            state: state,
            key: "",
            back: function() {
                Ext.mainWin.pop();
            },
            fn: function() {
                Ext.mainWin.pop();
                 me.reset(me);

                me.store.loadPage(1, {
                    delay: false,
                    mask: false
                });
            }
        });
        Ext.mainWin.push(pnl);
    },
    onItemTap: function(list, index, target, record, e, eOpts) {

        var me = this,
        pnl;

        if (e.getTarget('.yz-list-item-check-column')) {
          
            if (me.isRecordSelected(record)) {
                me.deselect(record);
            } else {
                me.select(record);
            }
        } else {
            var formservice = JSON.parse(me.config.record).formservice;
            var state = JSON.parse(me.config.record).formstate.edit.state;
            var del = JSON.parse(me.config.record).formstate.del;
            pnl = Ext.create('YZSoft.app.FormApplication', {
                title: "编辑",
                app: formservice,
                state: state,
                key: record.data.primarykeyyzapp,
                del: del,
                appname: me.config.title,
                back: function() {
                    Ext.mainWin.pop();
                },
                fn: function() {
                   
                      me.reset(me);
                    Ext.mainWin.pop();
                    me.store.loadPage(1, {
                        delay: false,
                        mask: false
                    });
                }
            });
            Ext.mainWin.push(pnl);
        }
    },
    onCancelSearch: function(search) {
        var me = this,
        keyword = search.getValue();

        search.cancel.hide();
        //me.btnFilter.show();
        search.setValue('');
        if (keyword) me.onClearSearch(210);
    },

    onSearchClick: function(search, value, e) {
        var me = this;

        me.store.loadPage(1, {
            params: {
                kwd: value,
            },
            mask: false,
            delay: false
        });
    },

    onClearSearch: function(delay) {
        var me = this;

        me.store.loadPage(1, {
            params: {
                kwd: '',
            },
            mask: false,
            delay: delay || 250
        });
    },
    select: function(record, deep) {
        var me = this;

        me.selection.push(Ext.clone(record.data));
        me.list.doItemSelect(me.list, record);
         me.fireEvent('selectionchange');

    },

    deselect: function(record) {
        var me = this,
        selitem = me.getSelectedItem(record);

        Ext.Array.remove(me.selection, selitem);
        me.list.doItemDeselect(me.list, record);
         me.fireEvent('selectionchange');

    },
    getSelectedItem: function(record) {
        var me = this,
        selection = me.selection;

        return Ext.Array.findBy(selection,
        function(selitem) {
            if (me.isEquRecord(selitem, record)) return true;
        });
    },
    isRecordSelected: function(record) {
        return !! this.getSelectedItem(record);
    },
   deletedata:function(){
    var me = this;
   var _this=me;
    var del=JSON.parse(me.config.record).formstate.del;
     var state=del.state;
      if (me.selection.length == 0)
            return;
         var  ids = [];
        Ext.each(me.selection, function (rec) {
            ids.push(rec["primarykeyyzapp"]);
        });
       
              Ext.Msg.show({
                title: '删除确认',
                    cls: 'yzlg-messagebox',
                    message: '您确定要删除选中项吗？',
                    hideOnMaskTap: true,
                    buttons: [{
                        text: "是",
                        width:100,
                        margin: '0 10 0 0',
                        cls: 'yzlg-button-flat yzlg-button-action-hot',
                        itemId: 'ok',
                        handler: function (button) {
                            Ext.Msg.hide();                     
                            YZSoft.Ajax.request({
                                method: 'POST',
                                url: YZSoft.$url('YZSoft.Services.REST.Mobile/YZApp/App.ashx'),
                                waitMsg: {
                                    message: "删除中...",
                                    autoClose: true
                                },
                                delay: true,
                                params: {
                                    Method: "del",
                                    sql: state,
                                    key: ids.join(',')
                                },
                                success: function (action) {
                                    if (action.result.code == "-1") {
                                        Ext.Msg.alert("删除失败", action.result.msg);
                                    } else {
                                        Ext.Viewport.mask({
                                            cls: 'yz-mask-success',
                                            message: "删除成功",
                                            delay: true,
                                            fn: function () {
                                              _this.store.load();
                                               _this.reset(_this);
                                            }
                                        })
                                    }

                                },
                                failure: function (action) {
                                    Ext.Msg.alert("删除失败", action.result.errorMessage);
                                }
                            });
                        }


                    }, {
                        text: "否",
                       width:100,
                        cls: 'yzlg-button-flat yzlg-button-action-hot',
                        itemId: 'cancle'
                    }]
                });
   
   
   },
    isEquRecord: function(selitem, record) {
        var me = this;

        for (var p in record.data) {
            if (p == 'id') continue;

            if (! (p in selitem)) return false;
 
           try {
               if (record.data[p].getTime() !== selitem[p].getTime()) return false;
            } catch (e) {
                 if (record.data[p]!== selitem[p]) return false;
           }
              
        
            
        }

        return true;
    },
       onSelectionChange: function () {
        var me = this,
            rows = me.selection;

        me.btnok.setDisabled(!rows.length);

        if (rows.length)
            me.btnok.setText(Ext.String.format('{0}({1})', "删除", rows.length));
        else
            me.btnok.setText("删除");
    },
    reset:function(_this){
    
     _this.selection = [];
    _this.btnok.setText("删除");
     _this.btnok.setDisabled(true);
    
    }
});