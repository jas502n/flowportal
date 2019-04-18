
Ext.define('YZSoft.src.tab.Main', {
    extend: 'Ext.tab.Panel',
    requires: [
        'YZSoft.src.device.Device',
        'YZSoft.src.device.Push',
        'YZSoft.src.ux.Push'
    ],
    config: {
        tabBar: {
            cls: ['yz-tab-main']
        },
        tabBarPosition: 'bottom',
        layout: {
            animation: false
        }
    },

    constructor: function (config) {
        var me = this;

        document.documentElement.classList.add(RS.$('All__Languages_css'));
        var extCssFile = RS.$('All__Ext_cssfile');
        if (extCssFile)
            YZLoader.loadCss(YZSoft.$url('YZSoft/resources/css/' + extCssFile), function () { });

//        //导致无法拷贝数据
//        if (Ext.os.is.iOS) {
//            window.ontouchstart = function (e) {
//                e.preventDefault();
//            };
//        }

        me.callParent(arguments);

        YZSoft.src.device.Device.on({
            scope: me,
            backbutton: 'onBackButton',
            pause: 'onPause',
            resume: 'onResume'
        });

        me.on({
            backbutton: function (firewin) {
                var activeItem = me.getActiveItem(firewin);
                if (activeItem.fireEvent)
                    return activeItem.fireEvent('backbutton', firewin);
            }
        });

        Ext.Viewport.getLayout().setAnimation({
            duration: 300,
            easing: 'ease-out',
            type: 'slide',
            direction: 'left'
        });

        Ext.mainWin.getLayout().setAnimation({
            duration: 300,
            easing: 'ease-out',
            type: 'slide',
            direction: 'left'
        });

        if (navigator.splashscreen) {
            Ext.defer(function () {
                navigator.splashscreen.hide();
            }, 0);
        }

        //MM1MM
        //Ext.Loader.loadScriptFile(YZSoft.$url('YZSoft$Local', 'YZSoft$Local/AMap/maps.js'), Ext.emptyFn, Ext.emptyFn, null, false);
        Ext.Loader.loadScriptFile('http://webapi.amap.com/maps?v=1.3&key=ecd458f7499e18a34d31f4f82ed70b0d', Ext.emptyFn, Ext.emptyFn, null, false);

        YZSoft.src.device.Push.register();
        YZSoft.src.device.Push.on({
            notification: function (event) {
                //alert(event.message);
            },
            openNotification: function (event) {
                //alert(event.message);
            }
        });
    },

    onPause: function () {
        var me = this;
        me.pauseTime = new Date();
        YZSoft.src.ux.Push.pause();
    },

    onResume: function() {
        var me = this,
            elapsed = me.pauseTime ? Ext.Date.getElapsed(me.pauseTime) : 0;

        YZSoft.src.ux.Push.resume();
        if (YZSoft.LoginUser.ScreenLock && elapsed >= 30000) {

            if (!me.pnlUnlock) {
                me.pnlUnlock = Ext.create('YZSoft.personal.security.lock.Unlock', {
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    hidden: true,
                    fn: function () {
                        me.pnlUnlock.hide(false);
                    },
                    beforeRelogin: function () {
                        var app = application.app;

                        me.pnlUnlock.hide(false);
                        app.removeAllWins();
                        YZSoft.src.ux.Push.stop();
                        app.restore();
                    },
                    relogin: function (result) {
                        application.app.launchApp(result);
                    },
                    listeners: {
                        order: 'after',
                        show: function () {
                            me.breakBackButton = true;
                            this.setZIndex(998);
                        },
                        hide: function () {
                            me.breakBackButton = false;
                            this.setZIndex(0);
                            this.reset();
                        }
                    }
                });

                Ext.Viewport.add(me.pnlUnlock);
            }

            me.pnlUnlock.show();
        }
    },

    onBackButton: function () {
        var me = this,
            loadMask, popupWin, activeItem;

        if (me.breakBackButton)
            return;

        loadMask = Ext.Viewport.getMasked();
        if (loadMask && !loadMask.isHidden())
            return;

        if (Ext.util && Ext.util.InputBlocker && Ext.util.InputBlocker.blocking)
            return;

        popupWin = me.getPopWin();

        if (popupWin) {
            if (popupWin.fireEvent &&
                popupWin.fireEvent('backbutton', me) === false)
                return;

            popupWin.hide();
            return;
        }

        activeItem = Ext.mainWin.getActiveItem();
        if (activeItem.fireEvent &&
            activeItem.fireEvent('backbutton', me) === false)
            return;

        if (activeItem != me && Ext.mainWin.getPreviousItem()) {
            Ext.mainWin.pop();
        }
        else {
            Ext.Msg.show({
                message: RS.$('All__ClickToExitApp'),
                hideOnMaskTap: true,
                buttons: [{
                    text: RS.$('All__WrongClick'),
                    flex: 1,
                    cls: 'yz-button-flat yz-button-dlg-default',
                    itemId: 'cancel'
                }],
                listeners: {
                    backbutton: function () {
                        navigator.app.exitApp();
                        return false;
                    }
                }
            });
        }
    },

    getPopWin: function () {
        var me = this,
            items = Ext.Viewport.getItems().items,
            i, item;

        for (i = items.length - 1; i >= 0; i--) {
            item = items[i];

            if (item.isInner === false && !item.isHidden())
                return item;
        }
    }
});