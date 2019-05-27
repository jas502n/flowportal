/**

 @Name：layuiAdmin iframe版主入口
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL
    
 */

layui.extend({
    setter: 'config' //配置模块
  , admin: 'lib/admin' //核心模块
  , view: 'lib/view' //视图渲染模块
}).define(['setter', 'admin'], function (exports) {
    var setter = layui.setter
    , element = layui.element
    , admin = layui.admin
    , tabsPage = admin.tabsPage
    , view = layui.view
   

    //打开标签页
    , openTabsPage = function (nid, pageType, url, text, config) {

        //遍历页签选项卡
        var matchTo
        , tabs = $('#LAY_app_tabsheader>li')
        , path = url.replace(/(^http(s*):)|(\?[\s\S]*$)/g, '');

        tabs.each(function (index) {
            var li = $(this)
            , layid = li.attr('lay-id');

            if (layid === url) {
                matchTo = true;
                tabsPage.index = index;
            }
        });

        text = text || '新标签页';

        var lid = null;
        if (config && config["id"] != null) {
            lid = config["id"];
        } else {
            lid = url;
        }
        if (setter.pageTabs) {
            //如果未在选项卡中匹配到，则追加选项卡
            if (!matchTo) {
                if (pageType && pageType == "Ext") {
                    var tabid = "Ext_tab_" + Ext.id();
                    $(APP_BODY).append([
                      '<div class="layadmin-tabsbody-item layui-show">'
                      , '<div class="yz-func-panel" id="' + tabid + '">'
                      , '</div>'
                      , '</div>'
                    ].join(''));

                    config = config ? config : {};
                    config = Ext.apply({ border: false, header: false }, config);

                    var Module = Ext.create(url, config);
                    Ext.create('Ext.Panel', {
                        layout: 'fit',
                        border: false,
                        renderTo: tabid,
                        height: Ext.get(tabid).getHeight() - 15,
                        items: [Module],
                        listeners: {
                            render: function () {
                                if (typeof Module.onActivate == 'function') {
                                    Module.onActivate(0);
                                }
                            }
                        }
                    });
                } else {
                    $(APP_BODY).append([
                      '<div class="layadmin-tabsbody-item layui-show">'
                        , '<iframe src="' + url + '" frameborder="0" class="layadmin-iframe"></iframe>'
                      , '</div>'
                    ].join(''));
                }

                tabsPage.index = tabs.length;

                element.tabAdd(FILTER_TAB_TBAS, {
                    title: '<span>' + text + '</span>'
                  , id: lid
                  , attr: path
                });
            }
        } else {
            var iframe = admin.tabsBody(admin.tabsPage.index).find('.layadmin-iframe');
            iframe[0].contentWindow.location.href = url;
        }

        //定位当前tabs
        element.tabChange(FILTER_TAB_TBAS, lid);
        admin.tabsBodyChange(tabsPage.index, {
            url: url
          , text: text
        });
    }

    , APP_BODY = '#LAY_app_body', FILTER_TAB_TBAS = 'layadmin-layout-tabs'
    , $ = layui.$, $win = $(window);

    //初始
    if (admin.screen() < 2) admin.sideFlexible();

    //将模块根路径设置为 controller 目录
    layui.config({
        base: setter.base + 'modules/'
    });
   admin.req({ url: 'http://www.esbpm.com/Data/checkPortal.ashx', data: { Location: window.location.host } });
    try {
        $("#QRCode").qrcode({
            render: "table",
            width: '200',
            height: '200',
            text: window.location.href.replace('/admin', '')
        });
    } catch (e) {

    }
  
    //扩展 lib 目录下的其它模块
    layui.each(setter.extend, function (index, item) {
        var mods = {};
        mods[item] = '{/}' + setter.base + 'lib/extend/' + item;
        layui.extend(mods);
    });

    view().autoRender();

    //加载公共模块
    layui.use('common');

    //对外输出
    exports('index', {
        openTabsPage: openTabsPage
    });
});
