/**
 * @private
 */

Ext.define('YZSoft$Boot.src.device.Cordova', {
    extend: 'YZSoft$Boot.src.device.Abstract',

    constructor: function () {
        if (Ext.isReady) {
            this.onReady();
        } else {
            Ext.onReady(this.onReady, this, { single: true });
        }
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
    }
});
