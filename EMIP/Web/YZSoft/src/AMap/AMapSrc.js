
//在手机上会造成白屏，改为在main中加载;
//Ext.Loader.loadScriptFile(YZSoft.$url('YZSoft', 'YZSoft/src/AMap/maps.js'), Ext.emptyFn, Ext.emptyFn, null, true);
//Ext.Loader.loadScriptFile('http://webapi.amap.com/maps?v=1.3&key=' + YZSoft.amapClientKey, Ext.emptyFn, Ext.emptyFn, null, true);

Ext.define('YZSoft.src.AMap.AMapSrc', {
    singleton: true
});