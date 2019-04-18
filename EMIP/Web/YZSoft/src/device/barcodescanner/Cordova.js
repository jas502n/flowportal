
Ext.define('YZSoft.src.device.barcodescanner.Cordova', {
    extend: 'YZSoft.src.device.barcodescanner.Abstract',
    formats: {
        'all_1D': 61918,
        'aztec': 1,
        'codabar': 2,
        'code_128': 16,
        'code_39': 4,
        'code_93': 8,
        'data_MATRIX': 32,
        'ean_13': 128,
        'ean_8': 64,
        'itf': 256,
        'maxicode': 512,
        'msi': 131072,
        'pdf_417': 1024,
        'plessey': 262144,
        'qr_CODE': 2048,
        'rss_14': 4096,
        'rss_EXPANDED': 8192,
        'upc_A': 16384,
        'upc_E': 32768,
        'upc_EAN_EXTENSION': 65536
    },
    orientation: {
        portrait: 'portrait',
        landscape: 'landscape'
    },
    scanOptions: {
        preferFrontCamera: {
            defaults: false
        },
        showFlipCameraButton: {
            defaults: false
        },
        prompt: {
            defaults: RS.$('All__BarcodeScan_Prompt')
        },
        formats: {
            defaults: 'all',
            enum: 'formats'
        },
        orientation: {
            defaults: 'portrait',
            enum: 'orientation'
        },
        successEnterRight: true
    },

    doScan: function (onSuccess, onError, options) {
        cordova.plugins.barcodeScanner.scan(onSuccess, onError, options);
    },

    doEncode: function (type, data, onSuccess, onError, options) {
        cordova.plugins.barcodeScanner.encode(type, data, onSuccess, onError, options);
    }
});