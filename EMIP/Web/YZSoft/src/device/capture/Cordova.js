
Ext.define('YZSoft.src.device.capture.Cordova', {
    extend: 'YZSoft.src.device.capture.Abstract',
    captureAudioOptions: {
        limit: { // Upper limit of sound clips user can record. Value must be equal or greater than 1.
            defaults: 1
        },
        duration: { // Maximum duration of a single sound clip in seconds.
            defaults: 0
        },
        successEnterRight: true
    },
    captureVideoOptions: {
        limit: { // Upper limit of videos user can record. Value must be equal or greater than 1.
            defaults: 1
        },
        duration: { // Maximum duration of a single video clip in seconds.
            defaults: 0
        },
        quality: { // Video quality parameter, 0 means low quality, suitable for MMS messages, and value 1 means high quality.
            defaults: 0
        },
        successEnterRight: true
    },
    captureImageOptions: {
        limit: { // Upper limit of images user can take. Value must be equal or greater than 1.
            defaults: 1
        },
        successEnterRight: true
    },

    doCaptureAudio: function (onSuccess, onError, options) {
        navigator.device.capture.captureAudio(onSuccess, onError, options);
    },

    doCaptureVideo: function (onSuccess, onError, options) {
        navigator.device.capture.captureVideo(onSuccess, onError, options);
    },

    doCaptureImage: function (onSuccess, onError, options) {
        navigator.device.capture.captureImage(onSuccess, onError, options);
    }
});
