
Ext.define('YZSoft.personal.about.About', {
    extend: 'Ext.Container',
    requires: [
        'YZSoft.src.device.StatusBar'
    ],
    config: {
        layout: 'fit',
        images: [
            'YZSoft/personal/about/slides/1.png',
            'YZSoft/personal/about/slides/2.png',
            'YZSoft/personal/about/slides/3.png',
            'YZSoft/personal/about/slides/4.png',
            'YZSoft/personal/about/slides/5.png',
            'YZSoft/personal/about/slides/6.png',
            'YZSoft/personal/about/slides/7.png',
            'YZSoft/personal/about/slides/8.png',
            'YZSoft/personal/about/slides/9.png'
        ],
        nameSpace: 'YZSoft$Local' //YZSoft - 使用服务器上的图片, YZSoft$Local - 使用手机app文件夹中的图片
    },

    constructor: function (config) {
        config = config || {};

        var me = this,
            images = config.images || me.config.images,
            nameSpace = config.nameSpace || me.config.nameSpace,
            slides = [], cfg;

        me.btnBack = Ext.create('Ext.Button', {
            text: RS.$('All__Back'),
            cls: ['yz-button-flat', 'yz-button-titlebar'],
            iconCls: 'yz-glyph yz-glyph-e913',
            iconAlign: 'left',
            align: 'left',
            handler: function () {
                if (me.config.back)
                    me.config.back.call(me.scope || me);
            }
        });

        me.titleBar = Ext.create('Ext.TitleBar', {
            docked: 'top',
            title: config.title || '',
            cls: ['yz-titlebar', 'yz-titlebar-light'],
            items: [me.btnBack]
        });

        Ext.each(images, function (image) {
            slides.push({
                style: {
                    backgroundImage: 'url(' + YZSoft.$url(nameSpace, image) + ')'
                }
            });
        });

        cfg = {
            items: [me.titleBar, {
                xclass: 'Ext.carousel.Carousel',
                flex: 1,
                direction: 'vertical',
                defaults: {
                    cls: 'yz-about-slide'
                },
                items: slides
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.on({
            painted: function () {
                YZSoft.src.device.StatusBar.styleLightContent();
            }
        });
    }
});