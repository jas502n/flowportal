
Ext.define('YZSoft.src.panel.social.QQFace', {
    extend: 'Ext.carousel.Carousel',
    requires: [
        'YZSoft.src.panel.social.Faces'
    ],
    config: {
    },

    constructor: function (config) {
        var me = this,
            faces = YZSoft.src.panel.social.Faces.qq,
            screenWidth = Ext.getBody().getSize().width,
            minBoxWidth = 80,
            minBoxCount = 8,
            lineBoxCount, pageItems, pages, cfg, i, j, items = [];

        lineBoxCount = Math.max(Math.floor(screenWidth / minBoxWidth), minBoxCount);
        pageItems = lineBoxCount * 3 - 1;
        pages = Math.floor(faces.length / pageItems) + (faces.length % pageItems ? 1 : 0);

        for (i = 0; i < pages; i++) {
            var buttons = [];

            for (j = 0; j < pageItems; j++) {
                var index = i * pageItems + j,
                    face = faces[index];

                if (!face)
                    break;

                buttons.push({
                    cls: ['yz-button-flat', 'yz-button-qqface'],
                    iconCls: 'yz-icon-qqface-' + face.id,
                    face: face,
                    scope: me,
                    handler: 'onFaceClick'
                });
            }

            buttons.push({
                cls: ['yz-button-flat', 'yz-button-qqface'],
                iconCls: 'yz-icon-qqface-backspace',
                face: {
                    isBackSpace:true
                },
                scope: me,
                handler: 'onFaceClick'
            });

            var pnl = Ext.create('YZSoft.src.container.SquaredContainer', {
                padding:'6 3',
                defaults: {
                    xtype: 'button',
                    iconAlign: 'top'
                },
                minBoxCount: 8,
                minBoxWidth: 80,
                items: buttons
            });

            items.push(pnl);
        }

        cfg = {
            items: items
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);
    },

    onFaceClick: function (button) {
        this.fireEvent('faceClick', button.config.face, button);
    }
});