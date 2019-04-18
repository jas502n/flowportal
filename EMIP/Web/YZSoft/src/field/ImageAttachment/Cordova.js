
Ext.define('YZSoft.src.field.ImageAttachment.Cordova', {
    extend: 'YZSoft.src.field.ImageAttachment.Abstract',
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
                    me.addPic(uri);
                }, 100);
            }
        });
    },

    onPickImageClick: function () {
        var me = this;

//        YZSoft.src.device.Camera.capture({
//            source: 'library',
//            quality: 75,
//            destination: 'file',
//            encoding: 'jpeg',
//            allowEdit: false,
//            saveToPhotoAlbum: false,
//            success: function (uri) {
//                Ext.defer(function () {
//                    me.addPic(uri);
//                }, 100);
//            }
//        });

        window.imagePicker.getPictures(
        	function (results) {
        	    for (var i = 0; i < results.length; i++) {
        	        me.addPic(results[i]);
        	    }
        	}, function (error) {
        	}, {
                maximumImagesCount: me.getSingle() ? 1:5
        	}
        );
    }
});
