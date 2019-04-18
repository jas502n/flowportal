
Ext.define('YZSoft.src.loadmask.CircleProgressMask', {
    extend: 'Ext.Mask',
    xtype: 'circleprogressmask',

    config: {
        borderWidth: 5,
        circleWidth: 50,
        circleHeight: 50,
        message: '',
        cls: 'yz-mask-cicprogress'
    },

    constructor: function (config) {
        this.callParent([config]);
    },

    getTemplate: function () {
        return [{
            reference: 'innerElement',
            cls: 'yz-cic-loader-inner',
            children: [{
                reference: 'indicatorBg',
                cls: 'yz-cic-loader-bg',
                children: [{
                    reference: 'messageElement',
                    cls: 'yz-cic-loader-message'
                }]
            }, {
                reference: 'spiner_holder_one_0_25',
                classList: ['yz-cic-loader-spiner-holder-one', 'yz-cic-loader-animate-0-25-a'],
                children: [{
                    reference: 'spiner_holder_two_0_25',
                    classList: ['yz-cic-loader-spiner-holder-two', 'yz-cic-loader-animate-0-25-b'],
                    children: [{
                        reference: 'spiner1',
                        cls: 'yz-cic-loader-loader-spiner'
                    }]
                }]
            }, {
                reference: 'spiner_holder_one_25_50',
                classList: ['yz-cic-loader-spiner-holder-one', 'yz-cic-loader-animate-25-50-a'],
                children: [{
                    reference: 'spiner_holder_two_25_50',
                    classList: ['yz-cic-loader-spiner-holder-two', 'yz-cic-loader-animate-25-50-b'],
                    children: [{
                        reference: 'spiner2',
                        cls: 'yz-cic-loader-loader-spiner'
                    }]
                }]
            }, {
                reference: 'spiner_holder_one_50_75',
                classList: ['yz-cic-loader-spiner-holder-one', 'yz-cic-loader-animate-50-75-a'],
                children: [{
                    reference: 'spiner_holder_two_50_75',
                    classList: ['yz-cic-loader-spiner-holder-two', 'yz-cic-loader-animate-50-75-b'],
                    children: [{
                        reference: 'spiner3',
                        cls: 'yz-cic-loader-loader-spiner'
                    }]
                }]
            }, {
                reference: 'spiner_holder_one_75_100',
                classList: ['yz-cic-loader-spiner-holder-one', 'yz-cic-loader-animate-75-100-a'],
                children: [{
                    reference: 'spiner_holder_two_75_100',
                    classList: ['yz-cic-loader-spiner-holder-two', 'yz-cic-loader-animate-75-100-b'],
                    children: [{
                        reference: 'spiner4',
                        cls: 'yz-cic-loader-loader-spiner'
                    }]
                }]
            }]
        }];
    },

    updateMessage: function (newMessage) {
        if (this.initialConfig.hiddenMessage)
            return;

        var cls = Ext.baseCSSPrefix + 'has-message';

        if (newMessage) {
            this.addCls(cls);
        } else {
            this.removeCls(cls);
        }

        this.messageElement.setHtml(newMessage);
    },

    updateCircleWidth: function (width) {
        this.innerElement.setWidth(width);
    },

    updateCircleHeight: function (height) {
        this.innerElement.setHeight(height);
    },

    updateBorderWidth: function (width) {
        this.indicatorBg.setBorder(width);
        this.spiner1.setBorder(width);
        this.spiner2.setBorder(width);
        this.spiner3.setBorder(width);
        this.spiner4.setBorder(width);
    },

    setProgress: function (progress) {
        var transformPropertyName = Ext.browser.getVendorProperyName('transform');
        progress = Math.floor(progress);

        if (progress < 25) {
            var angle = -90 + (progress / 100) * 360;
            this.spiner_holder_two_0_25.dom.style[transformPropertyName] = 'rotate(' + angle + 'deg)';
        }
        else if (progress >= 25 && progress < 50) {
            var angle = -90 + ((progress - 25) / 100) * 360;
            this.spiner_holder_two_0_25.dom.style[transformPropertyName] = 'rotate(0deg)';
            this.spiner_holder_two_25_50.dom.style[transformPropertyName] = 'rotate(' + angle + 'deg)';
        }
        else if (progress >= 50 && progress < 75) {
            var angle = -90 + ((progress - 50) / 100) * 360;
            this.spiner_holder_two_0_25.dom.style[transformPropertyName] = 'rotate(0deg)';
            this.spiner_holder_two_25_50.dom.style[transformPropertyName] = 'rotate(0deg)';
            this.spiner_holder_two_50_75.dom.style[transformPropertyName] = 'rotate(' + angle + 'deg)';
        }
        else if (progress >= 75 && progress <= 100) {
            var angle = -90 + ((progress - 75) / 100) * 360;
            this.spiner_holder_two_0_25.dom.style[transformPropertyName] = 'rotate(0deg)';
            this.spiner_holder_two_25_50.dom.style[transformPropertyName] = 'rotate(0deg)';
            this.spiner_holder_two_50_75.dom.style[transformPropertyName] = 'rotate(0deg)';
            this.spiner_holder_two_75_100.dom.style[transformPropertyName] = 'rotate(' + angle + 'deg)';
        }
        this.updateMessage(progress + '%');
    }
});
