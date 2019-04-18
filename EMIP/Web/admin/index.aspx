<%@ Page Language="C#" AutoEventWireup="true" CodeFile="index.aspx.cs" Inherits="Application_index" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>移动中心</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <link rel="stylesheet" href="../assets/layuiadmin/layui/css/layui.css" media="all">
    <link rel="stylesheet" href="../assets/layuiadmin/style/admin.css" media="all">
    <link href="../assets/css/main.css" rel="stylesheet" />
</head>
<body class="layui-layout-body">
    <div id="LAY_app">
        <div class="layui-layout layui-layout-admin">
            <div class="layui-header">
                <!-- 头部区域 -->
                <ul class="layui-nav layui-layout-left">
                    <li class="layui-nav-item layadmin-flexible" lay-unselect><a href="javascript:;"
                        layadmin-event="flexible" title="侧边伸缩"><i class="layui-icon layui-icon-shrink-right"
                            id="LAY_app_flexible"></i></a></li>
                </ul>
                <ul class="layui-nav layui-layout-right" lay-filter="layadmin-layout-right">
                    <li class="layui-nav-item layui-hide-xs" lay-unselect><a href="javascript:;" layadmin-event="theme">
                        <i class="layui-icon layui-icon-theme"></i></a></li>
                    <li class="layui-nav-item layui-hide-xs" lay-unselect><a href="javascript:;" layadmin-event="fullscreen">
                        <i class="layui-icon layui-icon-screen-full"></i></a></li>
                    <li class="layui-nav-item">
                        <a href="javascript:;">
                            <i class="layui-icon layui-icon-website"></i>
                        </a>
                        <dl class="layui-nav-child">
                            <div id="QRCode" style=" padding:15px 20px"></div>
                        </dl>
                    </li>
                    <li class="layui-nav-item"><a href="javascript:;" class="fly-nav-avatar">
                        <img src="http://doc.qizhixiong.com/data/upload/avatar/default_160.jpg?v=1550198068">
                    </a>
                        <dl class="layui-nav-child">
                            <dd>
                                <a href="login/2018/?action=logout" style="text-align: center;">退出</a></dd>
                        </dl>
                    </li>
                </ul>
            </div>
            <!-- 侧边菜单 -->
            <div class="layui-side layui-side-menu">
                <div class="layui-side-scroll">
                    <div class="layui-logo" lay-href="2.html">
                        <span>移动中心</span>
                    </div>
                    <ul class="layui-nav layui-nav-tree" lay-shrink="all" id="LAY-system-side-menu" lay-filter="layadmin-system-side-menu">
                        <li data-name="home" class="layui-nav-item layui-nav-itemed"><a href="javascript:;"
                            lay-tips="主页" lay-direction="2"><i class="layui-icon layui-icon-home"></i><cite>移动中心</cite>
                        </a>
                            <dl class="layui-nav-child">
                                <dd>
                                    <a lay-href="Module/Login/"><cite>登录管理</cite></a>
                                </dd>
                                <dd>
                                    <a lay-href="Module/App/"><cite>应用管理</cite></a>
                                </dd>
                                <dd>
                                    <a lay-href="Module/Notice/"><cite>消息管理</cite></a>
                                </dd>
                                <dd>
                                    <a lay-href="Module/OrgSync/"><cite>组织管理</cite></a>
                                </dd>
                            </dl>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 页面标签 -->
            <div class="layadmin-pagetabs" id="LAY_app_tabs">
                <div class="layui-icon layadmin-tabs-control layui-icon-prev" layadmin-event="leftPage">
                </div>
                <div class="layui-icon layadmin-tabs-control layui-icon-next" layadmin-event="rightPage">
                </div>
                <div class="layui-icon layadmin-tabs-control layui-icon-down">
                    <ul class="layui-nav layadmin-tabs-select" lay-filter="layadmin-pagetabs-nav">
                        <li class="layui-nav-item" lay-unselect><a href="javascript:;"></a>
                            <dl class="layui-nav-child layui-anim-fadein">
                                <dd layadmin-event="closeThisTabs">
                                    <a href="javascript:;">关闭当前标签页</a></dd>
                                <dd layadmin-event="closeOtherTabs">
                                    <a href="javascript:;">关闭其它标签页</a></dd>
                                <dd layadmin-event="closeAllTabs">
                                    <a href="javascript:;">关闭全部标签页</a></dd>
                            </dl>
                        </li>
                    </ul>
                </div>
                <div class="layui-tab" lay-unauto lay-allowclose="true" lay-filter="layadmin-layout-tabs">
                    <ul class="layui-tab-title" id="LAY_app_tabsheader">
                        <li lay-id="center.aspx" class="layui-this"><i class="layui-icon layui-icon-home"></i>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- 主体内容 -->
            <div class="layui-body" id="LAY_app_body">
                <div class="layadmin-tabsbody-item layui-show">
                    <iframe src="center.aspx" frameborder="0" class="layadmin-iframe"></iframe>
                </div>
            </div>
            <!-- 辅助元素，一般用于移动设备下遮罩 -->
            <div class="layadmin-body-shade" layadmin-event="shade">
            </div>
        </div>
    </div>
    <!--登录遮罩-->
    <script src="../assets/layuiadmin/layui/layui.js"></script>
    <script src="../assets/jquery-1.9.1.min.js" type="text/javascript"></script>
    <script src="../assets/jquery.qrcode.min.js" type="text/javascript"></script>
    <script>
        layui.config({
            version: '123441222',
            base: '../assets/layuiadmin/' //静态资源所在路径
        }).extend({
            index: 'lib/index' //主入口模块
        }).use('index', function () {
        });
    </script>
</body>
</html>
