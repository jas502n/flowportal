
Ext.define('YZSoft.src.device.File', {
    singleton: true,

    upload: function (opts) {
        var options = new FileUploadOptions(),
            url = opts.url || YZSoft.$url('YZSoft.Services.REST/Attachment/Upload.ashx');

        options.fileKey = opts.fileKey || "file";
        options.fileName = opts.fileName;
        options.mimeType = opts.mimeType || "image/jpeg";
        options.params = opts.params || {};
        options.headers = opts.headers || {};
        options.chunkMode = opts.chunkMode || true;

        var fileTransfer = new FileTransfer();
        fileTransfer.upload(
            opts.file,
            url,
            function (response) {
                response.result = Ext.decode(response.response);

                if (response.result.success) {
                    if (opts.success)
                        opts.success.call(opts.scope || opts, response);
                }
                else {
                    if (opts.failure)
                        opts.failure.call(opts.scope || opts, response);
                    else
                        alert(response.result.errorMessage);
                }
            },
            function (response) {
                response.result = {
                    httpError: true,
                    errorMessage: Ext.encode(response)
                };

                if (opts.failure)
                    opts.failure.call(opts.scope || opts, response);
                else
                    alert(response.result.errorMessage);
            },
            options,
            opts.trustAllHosts || false
        );

        fileTransfer.onprogress = function (progress) {
            if (opts.progress)
                opts.progress.call(opts.scope || opts, progress);
        };

        return fileTransfer;
    },

    /*
    url,
    fileName,
    root - cache
    */
    download: function (opts) {
        var me = this,
            url = opts.url,
            fileName = opts.fileName,
            folder = opts.folder ? (opts.folder + '/') : '',
            root = opts.root || 'cache',
            rootfolder, localFile, ft;

        switch (root) {
            case 'cache':
                rootfolder = cordova.file.cacheDirectory; // tempDirectory;
                if (Ext.os.is.Android)
                    rootfolder = cordova.file.externalCacheDirectory;
                break;
            case 'root':
                rootfolder = cordova.file.documentsDirectory;
                if (Ext.os.is.Android)
                    rootfolder = cordova.file.externalRootDirectory;
                break;
        }

        ft = new FileTransfer();
        window.resolveLocalFileSystemURL(rootfolder, function (entryFolder) {
            localFile = entryFolder.toURL() + folder + fileName;

            ft.onprogress = function (progress) {
                if (opts.progress)
                    opts.progress.call(opts.scope, progress);
            };

            ft.download(
                encodeURI(url),
                localFile,
                function (entry) {
                    if (opts.success)
                        opts.success.call(opts.scope || me, entry);
                },
                function (e) {
                    if (opts.failure)
                        opts.failure.call(opts.scope || me, e, 'download');
                }
            );
        });

        return ft;
    },

    readAsDataURL: function (uri, fn, scope) {
        window.resolveLocalFileSystemURL(uri, function (enter) {
            enter.file(function (file) {
                var reader = new FileReader();

                reader.onload = function (evt) {
                    fn.call(scope, evt.target.result, evt.result);
                };

                reader.readAsDataURL(file);
            });
        });
    }
});
