
//阻止微信浏览器下拉滑动效果（ios11.3 橡皮筋效果）
//https://segmentfault.com/a/1190000014134234
document.body.addEventListener('touchmove', function (e) {
    e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
}, { passive: false }); //passive 参数不能省略，用来兼容ios和android

Ext.define('EMIP.view.Main', {
    extend: 'YZSoft.src.tab.Main',
    requires: [
        'YZSoft.src.ux.Push',
        'YZSoft.social.MainPanel',
        'YZSoft.social.MessagePanel',
        'YZSoft.social.MessageAbstractPanel',
        'YZSoft.src.model.NotifyTopic',
        'YZSoft.src.util.MessageConverter',
        'YZSoft.src.panel.social.Faces',
        'YZSoft.src.util.Image',
        'YZSoft.src.device.Device',
        'YZSoft.src.device.device.Cordova',
        'YZSoft.src.device.device.Abstract',
        'YZSoft.src.device.Abstract',
        'YZSoft.src.ux.GlobalStore',
        'YZSoft.src.field.Search',
        'YZSoft.src.field.component.SearchInput',
        'YZSoft.src.plugin.PullRefresh',
        'YZSoft.social.SearchPanel',
        'YZSoft.src.model.User',
        'YZSoft.task.MainPanel',
        'YZSoft.src.plugin.SwipeTabs',
        'YZSoft.src.device.Push',
        'YZSoft.src.device.push.JPush',
        'YZSoft.src.device.push.Abstract',
        'YZSoft.task.WorkListPanel',
        'YZSoft.src.model.WorkListItem',
        'YZSoft.src.plugin.ListPaging',
        'YZSoft.task.ShareTaskPanel',
        'YZSoft.task.MyProcessedPanel',
        'YZSoft.src.model.TaskItem',
        'YZSoft.task.MyRequestPanel',
        'YZSoft.apps.MainPanel',
        'YZSoft.src.container.SquaredContainer',
        'YZSoft.personal.MainPanel',
        'YZSoft.src.button.ListButton',
        'YZSoft.src.button.Button'
    ],

    constructor: function (config) {
        var me = this,
            items = [];

        application.pushPhase('constructorMainWin');

        if (!YZSoft.src.ux.Push.inited) {
            YZSoft.src.ux.Push.init({
            });
        }

        var cfg = {
            activeItem: 0,
            defaults: {
                tab: {
                    flex: 1
                }
            },
            items: [{
                xclass: 'YZSoft.social.MainPanel',
                title: RS.$('All_Module_Notification'),
                iconCls: ['yz-glyph', 'yz-glyph-tab-message'],
                tab: {
                    flex: 1,
                    cls: 'yz-badge-flag',
                    badgeText: ''
                }
            }, {
                xclass: 'YZSoft.task.MainPanel',
                title: RS.$('All_Module_Workflow'),
                iconCls: ['yz-glyph', 'yz-glyph-tab-task'],
                tab: {
                    flex: 1,
                    cls: 'yz-badge-module',
                    badgeText: ''
                }
            }, {
                xclass: 'YZSoft.post.Panel',
                title: RS.$('All_Module_Process'),
                iconCls: ['yz-glyph', 'yz-glyph-tab-post']
            },  {
                xclass: 'YZSoft.app.Panel',
                title: RS.$('All_Module_Apps'),
                iconCls: ['yz-glyph', 'yz-glyph-tab-apps']
            },

            {
                xclass: 'YZSoft.apps.MainPanel',
                title: RS.$('All_Module_Apps'),
                iconCls: ['yz-glyph', 'yz-glyph-tab-apps']
            }, 
            {
                xclass: 'YZSoft.personal.MainPanel',
                title: RS.$('All_Module_My'),
                iconCls: ['yz-glyph', 'yz-glyph-tab-personal']
            }]
        };

        Ext.apply(cfg, config);
        me.callParent([cfg]);

        application.pushPhase('MainWinCreated');
        //YZSoft.showPhase();
        //YZSoft.showjs();
        //YZSoft.showashx();
    }
});