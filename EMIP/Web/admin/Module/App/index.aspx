<%@ Page Language="C#" AutoEventWireup="true" CodeFile="index.aspx.cs" Inherits="App_index" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link rel="stylesheet" href="../../../assets/layuiadmin/layui/css/layui.css" media="all" />
    <link rel="stylesheet" href="../../../assets/layuiadmin/style/admin.css" media="all" />
    <link href="../../../assets/css/main.css" rel="stylesheet" />
    <link href="../../../assets/layuiadmin/layui/css/eleTree/eleTree.css?v=1.6" rel="stylesheet"type="text/css" />
    <link href="//at.alicdn.com/t/font_1076139_i1iz34nakgq.css" rel="stylesheet" />
    <link href="../../../assets/css/app.css" rel="stylesheet" />
</head>
<body>
    <form class="layui-form">
    <div class="layui-fluid">
        <div class="layui-row">
            <div class="layui-card">
                <div class="layui-card-header">
                    <i class="iconfont">&#xe62f;</i>应用管理
                </div>
                <div class="app layui-card-body">
                    <table class="layui-hide" id="applist" lay-filter="bar">
                    </table>
                    <script type="text/html" id="toolbar">
                            <div class="layui-btn-container">
                                <button class="layui-btn layui-btn-sm" type="button" lay-event="AddApp">新增</button>
                                <button class="layui-btn layui-btn-sm" type="button" lay-event="Refresh"><i class="layui-icon layui-icon-refresh"></i></button>
                            </div>
                    </script>
                    <script type="text/html" id="tbar">

                            <a class="layui-btn  layui-btn-xs" lay-event="edit">编辑</a>
                            <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>


                            <a class="layui-btn layui-btn-normal layui-btn-xs"  style="display:{{d.Type=="SYSTEM"?"":"none"}}" lay-event="bd">绑定</a>
                    </script>
                </div>
            </div>
        </div>
    </div>
    <script src="../../../assets/layuiadmin/layui/layui.js"></script>
    <script>
            layui.config({
                base: '../../../assets/layuiadmin/' //静态资源所在路径
            }).extend({
                index: 'lib/index' //主入口模块
            }).use(['index', 'form', 'element','table', 'colorpicker'], function () {
          
                var table = layui.table;
                var admin = layui.admin;
                var view = layui.view;

                table.render({
                    elem: '#applist'
                  , url: '../../../Admin/Module/App/data/data.ashx?method=GetApplist'
                     , response: {
                         statusName: 'code'
                        , statusCode: 0
                        , msgName: 'msg'
                        , dataName: 'Applist'
                     }
                  , toolbar: '#toolbar'
                  , title: '主页App列表'
                  , cols: [[
                    { field: 'AppName', title: '应用名称', width: 150, fixed: 'left', unresize: true }
                    , { field: 'Sort', title: '排序', width: 80 }
                    , { field: 'Id', title: 'ID', width: 80 }
                    , {
                        field: 'Icon', title: '应用图标', width: 150, templet: function (d) {
                            return '<i style="color:' + d.IconColor + ';font-size:' + d.IconSize + 'px" class="iconfont ' + d.Icon + '"></i>'
                        }
                    }
                    , { field: 'IconColor', title: '图标颜色', width: 150 }
                    , { field: 'IconSize', title: '图标大小', width: 150 }
                    , { field: 'BADGE', title: '角标', width: 150 }
                      , { field: 'ViewType', title: '应用分类', width: 150 }
                     , { field: 'Type', title: '页面类别',width: 150 }
                    , { field: 'AppUrl', title: '应用路径' }
                    , {
                        field: 'Enable', title: '是否启用', width: 100
                    }
                    , { fixed: 'right', title: '操作', toolbar: '#tbar', width: 180 }
                  ]]
                  , page: false
                });

                //头工具栏事件
                table.on('toolbar(bar)', function (obj) {
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        case 'AddApp':
                            layui.setter.views = "../../../Admin/Module/App/";
                            admin.popup({
                                title: '新增',
                                area: ['500px', '650px'],
                                id: 'LAY-popup-right-editApp'
                              , success: function () {
                                  layui.view(this.id).render('Edit');
                              }
                            });
                            break;
                        case 'Refresh':
                            table.reload('applist');
                            break;
                    };
                });

                //监听行工具事件
                table.on('tool(bar)', function (obj) {
                    var data = obj.data;
                    if (obj.event === 'del') {
                        layer.confirm('确定删除吗？', function (index) {
                            var option = {
                                data: {
                                    method: 'DeletApp',
                                    id: data.Id
                                },
                                url: "../../../Admin/Module/App/data/data.ashx",
                                success: function (data) {
                                    layer.msg('删除成功！', {
                                        icon: 1,
                                        time: 500
                                    }, function () {
                                        table.reload('applist');
                                        layer.closeAll();
                                    });



                                }
                            }
                            layui.admin.req(option);
                        });
                    } else if (obj.event === 'edit') {
                        layui.setter.views = "../../../Admin/Module/App/";
                        admin.popup({
                         
                            title: '编辑',
                            area: ['500px', '650px'],
                            id: 'LAY-popup-right-editApp'
                          , success: function () {
                              layui.view(this.id).render('Edit', data);
                            }
                        });
                    }
                    else if (obj.event === 'bd') {
                        layui.setter.views = "../../../Admin/Module/App/";
                        admin.popupRight({
                            title: '绑定',
                             area: ['550px'],
                            id: 'LAY-popup-right-editApp'
                          , success: function () {
                              layui.view(this.id).render('Bd', data);
                            }
                        });
                    }
                });
            });
    </script>
    </form>
</body>
</html>
