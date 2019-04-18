
Ext.define('YZSoft.src.panel.ImageViewer', {
    extend: 'Ext.Container',

    config: {
        doubleTapScale: 1,
        maxScale: 4,
        loadingMask: true,
        previewSrc: false,
        resizeOnLoad: true,
        imageSrc: false,
        initOnActivate: false,
        cls: 'yz-imageviewer-container',
        scrollable: {
            direction: 'both',
            indicators: false
        },
        loadingMessage: RS.$('All__Loading'),
        html: '<figure class="yz-imageviewer-figure"><img class="yz-imageviewer-image"/></figure>',
        errorImage: false,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    },

    duringDestroy: false,

    initialize: function () {
        var me = this;

        if (me.getInitOnActivate()) {
            me.on('activate', me.initViewer, me, {
                delay: 10,
                single: true
            });
        } else {
            me.on('painted', me.initViewer, me, {
                delay: 10,
                single: true
            });
        }
    },

    initViewer: function () {
        var me = this,
            scroller = me.getScrollable().getScroller(),
            element = me.element;

        scroller.setDisabled(true);

        if (me.getLoadingMask()) {
            me.setMasked({
                xtype: 'loadmask',
                message: me.getLoadingMessage()
            });
        }

        me.figEl = element.down('figure');
        me.imgEl = me.figEl.down('img');

        me.figEl.setStyle({
            overflow: 'hidden',
            display: 'block',
            margin: 0
        });

        me.imgEl.setStyle({
            '-webkit-user-drag': 'none',
            '-webkit-transform-origin': '0 0',
            'visibility': 'hidden'
        });

        if (me.getPreviewSrc()) {
            element.setStyle({
                backgroundImage: 'url(' + me.getPreviewSrc() + ')',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                webkitBackgroundSize: 'contain'
            });
        }

        me.on('load', me.onImageLoad, me);
        me.imgEl.addListener({
            scope: me,
            doubletap: me.onDoubleTap,
            pinchstart: me.onImagePinchStart,
            pinch: me.onImagePinch,
            pinchend: me.onImagePinchEnd
        });

        me.figEl.addListener({
            scope: me,
            singletap: 'onSingleTap'
        });

        if (me.getImageSrc()) {
            me.loadImage(me.getImageSrc());
        }
    },

    loadImage: function (src) {
        var me = this;
        if (me.imgEl) {
            me.imgEl.dom.src = src;
            me.imgEl.dom.onload = Ext.Function.bind(me.onLoad, me, me.imgEl, 0);
            if (me.getErrorImage()) {
                me.imgEl.dom.onerror = function () {
                    this.src = me.getErrorImage();
                };
            }
        } else {
            me.setImageSrc(src);
        }
    },

    unloadImage: function () {
        var me = this;

        if (me.getLoadingMask()) {
            me.setMasked({
                xtype: 'loadmask',
                message: me.getLoadingMessage()
            });
        }

        if (me.imgEl) {
            me.imgEl.dom.src = '';
            me.imgEl.setStyle({ visibility: 'hidden' });
        } else {
            me.setImageSrc('');
            me.imgEl.setStyle({ visibility: 'hidden' });
        }
    },

    onLoad: function (el, e) {
        var me = this;
        me.fireEvent('load', me, el, e);
    },

    onImageLoad: function () {
        var me = this,
            parentElement = me.parent.element;

        // get viewport size
        me.viewportWidth = me.viewportWidth || me.getWidth() || parentElement.getWidth();
        me.viewportHeight = me.viewportHeight || me.getHeight() || parentElement.getHeight();

        // grab image size
        me.imgWidth = me.imgEl.dom.width;
        me.imgHeight = me.imgEl.dom.height;

        // calculate and apply initial scale to fit image to screen
        if (me.getResizeOnLoad()) {
            me.scale = me.baseScale = Math.min(me.viewportWidth / me.imgWidth, me.viewportHeight / me.imgHeight);
            me.setMaxScale(me.scale * 4);
        } else {
            me.scale = me.baseScale = 1;
        }

        // calc initial translation
        var tmpTranslateX = (me.viewportWidth - me.baseScale * me.imgWidth) / 2,
            tmpTranslateY = (me.viewportHeight - me.baseScale * me.imgHeight) / 2;

        // set initial translation to center
        me.setTranslation(tmpTranslateX, tmpTranslateY);
        me.translateBaseX = me.translateX;
        me.translateBaseY = me.translateY;

        // apply initial scale and translation
        me.applyTransform();

        // initialize scroller configuration
        me.adjustScroller();

        // show image and remove mask
        me.imgEl.setStyle({
            visibility: 'visible'
        });

        // remove preview
        if (me.getPreviewSrc()) {
            me.element.setStyle({
                backgroundImage: 'none'
            });
        }

        if (me.getLoadingMask()) {
            me.setMasked(false);
        }

        me.fireEvent('imageLoaded', me);
    },

    onImagePinchStart: function (ev) {
        var me = this,
            scroller = me.getScrollable().getScroller(),
            scrollPosition = scroller.position,
            touches = ev.touches,
            element = me.element,
            scale = me.scale;

        // disable scrolling during pinch
        scroller.stopAnimation();
        scroller.setDisabled(true);

        // store beginning scale
        me.startScale = scale;

        // calculate touch midpoint relative to image viewport
        me.originViewportX = (touches[0].pageX + touches[1].pageX) / 2 - element.getX();
        me.originViewportY = (touches[0].pageY + touches[1].pageY) / 2 - element.getY();

        // translate viewport origin to position on scaled image
        me.originScaledImgX = me.originViewportX + scrollPosition.x - me.translateX;
        me.originScaledImgY = me.originViewportY + scrollPosition.y - me.translateY;

        // unscale to find origin on full size image
        me.originFullImgX = me.originScaledImgX / scale;
        me.originFullImgY = me.originScaledImgY / scale;

        // calculate translation needed to counteract new origin and keep image in same position on screen
        me.translateX += (-1 * ((me.imgWidth * (1 - scale)) * (me.originFullImgX / me.imgWidth)));
        me.translateY += (-1 * ((me.imgHeight * (1 - scale)) * (me.originFullImgY / me.imgHeight)));

        // apply new origin
        me.setOrigin(me.originFullImgX, me.originFullImgY);

        // apply translate and scale CSS
        me.applyTransform();
    },

    onImagePinch: function (ev) {
        var me = this;

        // prevent scaling to smaller than screen size
        me.scale = Ext.Number.constrain(ev.scale * me.startScale, me.baseScale - 2, me.getMaxScale());
        me.applyTransform();
    },

    onImagePinchEnd: function (ev) {
        var me = this;

        if (me.scale == me.baseScale) {
            me.setTranslation(me.translateBaseX, me.translateBaseY);
        } else {
            if (me.scale < me.baseScale && me.getResizeOnLoad()) {
                me.resetZoom();
                return;
            }

            me.originReScaledImgX = me.originScaledImgX * (me.scale / me.startScale);
            me.originReScaledImgY = me.originScaledImgY * (me.scale / me.startScale);

            me.setTranslation(me.originViewportX - me.originReScaledImgX, me.originViewportY - me.originReScaledImgY, me.scale);
        }

        me.setOrigin(0, 0);
        me.applyTransform();
        me.adjustScroller();
    },

    onZoomIn: function () {
        var me = this,
            ev = {
                pageX: 0,
                pageY: 0
            },
            myScale = me.scale;

        if (myScale < me.getMaxScale()) {
            myScale = me.scale + 0.05;
        }

        if (myScale >= me.getMaxScale()) {
            myScale = me.getMaxScale();
        }

        ev.pageX = me.viewportWidth / 2;
        ev.pageY = me.viewportHeight / 2;

        me.zoomImage(ev, myScale);
    },

    onZoomOut: function () {
        var me = this,
            ev = {
                pageX: 0,
                pageY: 0
            },
            myScale = me.scale;

        if (myScale > me.baseScale) {
            myScale = me.scale - 0.05;
        }

        if (myScale <= me.baseScale) {
            myScale = me.baseScale;
        }

        ev.pageX = me.viewportWidth / 2;
        ev.pageY = me.viewportHeight / 2;

        me.zoomImage(ev, myScale);
    },

    zoomImage: function (ev, scale, scope) {
        var me = this,
            scroller = me.getScrollable().getScroller(),
            scrollPosition = scroller.position,
            element = me.element;

        var oldScale = me.scale,
            newScale = scale,
            originViewportX = ev ? (ev.pageX - element.getX()) : 0,
            originViewportY = ev ? (ev.pageY - element.getY()) : 0,
            originScaledImgX = originViewportX + scrollPosition.x - me.translateX,
            originScaledImgY = originViewportY + scrollPosition.y - me.translateY,
            originReScaledImgX = originScaledImgX * (newScale / oldScale),
            originReScaledImgY = originScaledImgY * (newScale / oldScale);

        me.scale = newScale;
        setTimeout(function () {
            me.setTranslation(originViewportX - originReScaledImgX, originViewportY - originReScaledImgY, newScale);
            me.applyTransform();
            me.adjustScroller();
            Ext.repaint();
        }, 50);
    },

    resetZoom: function () {
        var me = this;

        if (me.duringDestroy)
            return;

        me.scale = me.baseScale;
        me.setTranslation(me.translateBaseX, me.translateBaseY);
        me.setOrigin(0, 0);
        me.applyTransform();
        me.adjustScroller();
        Ext.repaint();
    },

    onDoubleTap: function (ev, t) {
        var me = this;

        if (!me.getDoubleTapScale())
            return false;

        if (me.scale > me.baseScale)
            me.resetZoom();
        else
            me.zoomImage(ev, me.baseScale * 4);
    },

    onSingleTap: function () {
        var me = this;

        if (me.config.singletap)
            me.config.singletap.call(me.config.scope || me, me);
    },

    setOrigin: function (x, y) {
        this.imgEl.dom.style.webkitTransformOrigin = x + 'px ' + y + 'px';
    },

    setTranslation: function (translateX, translateY, newScale) {
        var me = this;

        if (Ext.isNumber(newScale)) {
            var spaceX = me.viewportWidth - me.imgWidth * newScale,
                spaceY = me.viewportHeight - me.imgHeight * newScale;

            if (spaceX >= 0)
                translateX = spaceX * 0.5;
            else
                translateX = Ext.Number.constrain(translateX, spaceX, 0);

            if (spaceY > 0)
                translateY = spaceY * 0.5;
            else
                translateY = Ext.Number.constrain(translateY, spaceY, 0);
        }

        me.translateX = translateX;
        me.translateY = translateY;

        // transfer negative translations to scroll offset
        me.scrollX = me.scrollY = 0;

        if (me.translateX < 0) {
            me.scrollX = me.translateX;
            me.translateX = 0;
        }
        if (me.translateY < 0) {
            me.scrollY = me.translateY;
            me.translateY = 0;
        }
    },

    resize: function () {
        var me = this;

        // get viewport size
        me.viewportWidth = me.parent.element.getWidth() || me.viewportWidth || me.getWidth();
        me.viewportHeight = me.parent.element.getHeight() || me.viewportHeight || me.getHeight();

        // grab image size
        me.imgWidth = me.imgEl.dom.width;
        me.imgHeight = me.imgEl.dom.height;

        // calculate and apply initial scale to fit image to screen
        if (me.getResizeOnLoad()) {
            me.scale = me.baseScale = Math.min(me.viewportWidth / me.imgWidth, me.viewportHeight / me.imgHeight);
            me.setMaxScale(me.scale * 4);
        } else {
            me.scale = me.baseScale = 1;
        }

        // set initial translation to center
        me.translateX = me.translateBaseX = (me.viewportWidth - me.baseScale * me.imgWidth) / 2;
        me.translateY = me.translateBaseY = (me.viewportHeight - me.baseScale * me.imgHeight) / 2;

        // apply initial scale and translation
        me.applyTransform();

        // initialize scroller configuration
        me.adjustScroller();
    },

    applyTransform: function () {
        var me = this,
            fixedX = Ext.Number.toFixed(me.translateX, 5),
            fixedY = Ext.Number.toFixed(me.translateY, 5),
            fixedScale = Ext.Number.toFixed(me.scale, 8);

        //        if (Ext.os.is.Android) {
        //            me.imgEl.dom.style.webkitTransform =
        //            //'translate('+fixedX+'px, '+fixedY+'px)'
        //            //+' scale('+fixedScale+','+fixedScale+')';
        //            'matrix(' + fixedScale + ',0,0,' + fixedScale + ',' + fixedX + ',' + fixedY + ')';
        //        } else {
        me.imgEl.dom.style.webkitTransform = 'translate3d(' + fixedX + 'px, ' + fixedY + 'px, 0)' + ' scale3d(' + fixedScale + ',' + fixedScale + ',1)';
        //}
    },

    adjustScroller: function () {
        var me = this,
            scroller = me.getScrollable().getScroller(),
            scale = me.scale;

        // disable scrolling if zoomed out completely, else enable it
        if (scale == me.baseScale)
            scroller.setDisabled(true);
        else
            scroller.setDisabled(false);

        // size container to final image size
        var boundWidth = Math.max(me.imgWidth * scale + 2 * me.translateX, me.viewportWidth),
            boundHeight = Math.max(me.imgHeight * scale + 2 * me.translateY, me.viewportHeight);

        me.figEl.setStyle({
            width: boundWidth + 'px',
            height: boundHeight + 'px'
        });

        // update scroller to new content size
        scroller.refresh();

        // apply scroll
        var x = 0;
        if (me.scrollX)
            x = me.scrollX;

        var y = 0;
        if (me.scrollY)
            y = me.scrollY;

        scroller.scrollTo(x * -1, y * -1);
    },

    destroy: function () {
        var me = this;

        me.duringDestroy = true;

        me.un('activate', me.initViewer, me);
        me.un('painted', me.initViewer, me);

        Ext.destroy(me.getScrollable(), me.imgEl);

        me.callParent();
    }
}); 
