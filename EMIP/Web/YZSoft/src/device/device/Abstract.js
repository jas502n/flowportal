
Ext.define('YZSoft.src.device.device.Abstract', {
    extend: 'YZSoft.src.device.Abstract',
    cordova: 'N/A',
    model:'N/A',
    platform: Ext.os.name,
    uuid: 'anonymous',
    version: 'N/A',
    manufacturer: 'N/A',
    isVirtual: false,
    serial: 'N/A',
    name:'N/A',

    openURL: function (url) {
        window.location = url;
    },

    call: function (phoneNumber) {
        this.openURL(Ext.String.format('tel:{0}',phoneNumber));
    },

    sendSMS:function(phoneNumber){
        this.openURL(Ext.String.format('sms:{0}',phoneNumber));
    },

    sendMail:function(email){
        this.openURL(Ext.String.format('mailto:{0}',email));
    }
});
