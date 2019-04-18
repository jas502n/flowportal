
Ext.define('YZSoft.src.device.contacts.Cordova', {
    extend: 'YZSoft.src.device.contacts.Abstract',

    doPickContact: function (onSuccess, onError) {
        navigator.contacts.pickContact(onSuccess, onError);
    }
});