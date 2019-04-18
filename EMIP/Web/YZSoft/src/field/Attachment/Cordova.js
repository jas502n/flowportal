
Ext.define('YZSoft.src.field.Attachment.Cordova', {
    extend: 'YZSoft.src.field.Attachment.Abstract',
    requires: [
        'YZSoft.src.device.Camera'
    ],

    onCaptureClick: function () {
        var me = this;

        YZSoft.src.device.Camera.capture({
            source: 'camera',
            quality: 75,
            destination: 'file',
            encoding: 'jpeg',
            allowEdit: false,
            saveToPhotoAlbum: false,
            success: function (uri) {
                Ext.defer(function () {
                    me.addFile(uri);
                }, 10);
            }
        });
    },

    onPickImageClick: function () {
        var me = this;

        window.imagePicker.getPictures(
            function (results) {
	            for (var i = 0; i < results.length; i++) {
	                me.addFile(results[i]);
	            }
	        }, function (error) {
	        }, {
	            maximumImagesCount: 5
	        }
        );
    }
});
