
Ext.define('YZSoft.src.device.camera.Cordova', {
    extend: 'YZSoft.src.device.camera.Abstract',
    source: {
        library: 0,
        camera: 1,
        album: 2
    },
    destination: {
        data: 0,
        file: 1,
        native: 2
    },
    encoding: {
        jpeg: 0,
        jpg: 0,
        png: 1
    },
    media: {
        picture: 0,
        video: 1,
        allmedia: 2
    },
    direction: {
        back: 0,
        front: 1
    },
    captureOptions: {
        quality: {
            name: 'quality'
        },
        destinationType: {
            name: 'destination',
            enum: 'destination'
        },
        sourceType: {
            name: 'source',
            enum: 'source'
        },
        targetWidth: {
            name: 'width'
        },
        targetHeight: {
            name: 'height'
        },
        encodingType: {
            name: 'encoding',
            enum: 'encoding'
        },
        mediaType: {
            name: 'media',
            enum: 'media'
        },
        allowEdit: {
            name: 'allowEdit'
        },
        correctOrientation: {
            defaults: true
        },
        saveToPhotoAlbum: true,
        popoverOptions: true,
        cameraDirection: {
            name: 'direction',
            enum: 'direction'
        }
    },

    doCapture: function (onSuccess, onError, options) {
        navigator.camera.getPicture(onSuccess, onError, options);
    },

    doCleanUp: function (onSuccess, onError) {
        navigator.camera.cleanup(onSuccess, onError);
    }
});
