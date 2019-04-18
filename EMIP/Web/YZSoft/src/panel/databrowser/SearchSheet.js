
Ext.define('YZSoft.src.panel.databrowser.SearchSheet', {
    extend: 'YZSoft.src.panel.databrowser.SearchPanel',
    config: {
        left: 60,
        top: 0,
        right: 0,
        bottom: 0,
        hideOnMaskTap: true,
        modal: {
            transparent: false
        },
        showAnimation: {
            type: 'slideIn',
            duration: 100,
            easing: 'ease-out',
            direction: 'left'
        },
        hideAnimation: {
            type: 'slideOut',
            duration: 100,
            easing: 'ease-in',
            direction: 'right'
        }
    }
});