/*
*   @config
*   url : url of iframe
*   params : url params
*   
*   @example
*   Ext.create('YZSoft.src.panel.IFramePanel', {
*       url: config.url || 'YZSoft/Maintenance/Module.aspx',
*       params: { ProdcuteCode: '101' }
*     });
*/

Ext.define('YZSoft.src.panel.IFramePanel', {
    extend: 'Ext.Container',
    autoReload: false,
    config: {
        layout: 'fit'
    },

    constructor: function (config) {
        var me = this;

        config.id = config.id || Ext.id();
        me.idframe = config.id + '_frm';

        config = config || {};

        var params = config.params || {},
            url = config.url ? Ext.String.urlAppend(config.url, Ext.Object.toQueryString(params)) : '';

        var cfg = {
            html: url ? '<iframe id="' + me.idframe + '" src="' + url + '" frameborder="0" width="100%" height="100%"></iframe>' : '<iframe id="' + me.idframe + '" frameborder="0" width="100%" height="100%"></iframe>'
        };

        //ios touch
        if (Ext.os.is.iOS)
            cfg.html = '<div class="yz-iframe-touch-cnt" style="width:100%;height:100%">' + cfg.html + '</div>';

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        me.addCls('yz-iframe-container');

        me.on({
            scope: me,
            afterrender: function () {
                me.iframe = document.getElementById(me.idframe);
                me.iframe.containerPanel = me;
                me.contentWindow = document.frames ? document.frames[me.idframe] : me.iframe.contentWindow;

                //me.contentWindow = Ext.isIE ? me.iframe.contentWindow : window.frames[me.idframe];

                me.fireEvent('yzafterrender');
            },
            activate: function () {
                if (me.autoReload)
                    me.reload();
            },
            beforeclose: function () {
                try {
                    Ext.apply(me, me.contentWindow.YZSoft.window.result);
                }
                catch (exp) {
                }
            }
        });
    },

    load: function (url, params) {
        var me = this;

        me.params = params || me.params;
        me.url = url;
        url = Ext.String.urlAppend(url, Ext.Object.toQueryString(me.params));
        me.iframe.src = url;
    },

    reload: function () {
        var me = this,
            params = me.params || {},
            url = Ext.String.urlAppend(me.url, Ext.Object.toQueryString(params));

        me.iframe.src = url;
    },

    print: function () {
        var me = this;

        if (me.contentWindow) {
            me.contentWindow.focus();
            me.contentWindow.print();
        }
    }
});
