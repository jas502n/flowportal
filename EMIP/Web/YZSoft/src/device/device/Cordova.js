
Ext.define('YZSoft.src.device.device.Cordova', {
    extend: 'YZSoft.src.device.device.Abstract',
    availableListeners: [
        'pause',
        'resume',
        'backbutton',
        'batterycritical',
        'batterylow',
        'batterystatus',
        'menubutton',
        'searchbutton',
        'startcallbutton',
        'endcallbutton',
        'volumeupbutton',
        'volumedownbutton'
    ],

    constructor: function () {
        var me = this;

        if (Ext.isReady) {
            me.onReady();
        } else {
            Ext.onReady(me.onReady, me, { single: true });
        }

        me.callParent(arguments);
    },

    onReady: function () {
        var me = this,
            device = window.device;

        me.cordova = device.cordova;
        me.model = device.model;
        me.platform = device.platform;
        me.uuid = device.uuid;
        me.version = device.version;
        me.manufacturer = device.manufacturer;
        me.isVirtual = device.isVirtual;
        me.serial = device.serial;
        me.name = device.name;
    },

    doAddListener: function (name) {
        var me = this;

        if (!me.addedListeners) {
            me.addedListeners = [];
        }

        if (me.availableListeners.indexOf(name) != -1 && me.addedListeners.indexOf(name) == -1) {
            me.addedListeners.push(name);

            document.addEventListener(name, function () {
                me.fireEvent(name, me);
            });
        }

        me.callParent(arguments);
    }
});
