
Ext.define('YZSoft.src.device.map.AMap', {
    extend: 'YZSoft.src.device.map.Abstract',
    mapStyle: {
        normal: 'normal',
        dark: 'dark',
        light: 'light',
        fresh: 'fresh',
        blue_night: 'blue_night'
    },
    createMapOptions: {
        view: true,
        layers: true,
        zoom: {
            defaults: 11
        },
        center: {
            convert: 'encodePosition'
        },
        labelzIndex: true,
        zooms: true,
        lang: true,
        cursor: true,
        animateEnable: true,
        isHotspot: true,
        defaultLayer: true,
        rotateEnable: true,
        resizeEnable: {
            defaults: true
        },
        showIndoorMap: true,
        indoorMap: true,
        expandZoomRange: true,
        dragEnable: true,
        zoomEnable: true,
        doubleClickZoom: true,
        keyboardEnable: true,
        jogEnable: true,
        scrollWheel: true,
        touchZoom: true,
        mapStyle: { //设置地图显示样式 目前支持normal（默认样式）、dark（深色样式）、light（浅色样式）、fresh(osm清新风格样式)、blue_night
            enum: 'mapStyle'
        },
        features: true, //设置地图上显示的元素种类 支持'bg'（地图背景）、'point'（POI点）、'road'（道路）、'building'（建筑物）
        showBuildingBlock: true //设置地图显示3D楼块效果，移动端也可使用。推荐使用。
    },

    constructor: function (config) {
        var me = this,
            dom = config.renderTo.isComponent ? config.renderTo.element.dom : config.renderTo.dom,
            options = me.getDeviceOptions('createMapOptions', config);

        me.map = new AMap.Map(dom, options);

        if (config.showToolBar)
            me.showToolBar();

        me.callParent(arguments);

        me.relayAMapEvents(me.map, [
            'complete',
            'click',
            'dblclick',
            'mapmove',
            'hotspotclick',
            'hotspotover',
            'hotspotout',
            'movestart',
            'moveend',
            'zoomchange',
            'zoomstart',
            'zoomend',
            'mousemove',
            'mousewheel',
            'mouseover',
            'mouseout',
            'mouseup',
            'mousedown',
            'rightclick',
            'dragstart',
            'dragging',
            'dragend',
            'resize',
            'touchstart',
            'touchmove',
            'touchend'
        ]);
    },

    showToolBar: function () {
        var me = this,
            map = me.map;

        AMap.plugin(["AMap.ToolBar"], function () {
            map.addControl(new AMap.ToolBar());
        });
    },

    addMark: function (opts) {
        var me = this,
            map = me.map;

        var marker = new AMap.Marker({
            map: map,
            icon: YZSoft.$url('YZSoft$Local', 'YZSoft$Local/resources/images/map/mark.png'),
            position: me.encodePosition(opts.pos)
        });

        //map.setFitView();

        return marker;
    }
});