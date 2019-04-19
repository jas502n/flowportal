<%@ Page Language="C#" AutoEventWireup="true" CodeFile="index.aspx.cs" Inherits="App_index" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link rel="stylesheet" href="../../../assets/layuiadmin/layui/css/layui.css" media="all" />
    <link rel="stylesheet" href="../../../assets/layuiadmin/style/admin.css" media="all" />
    <link href="../../../assets/css/main.css" rel="stylesheet" />
    <link href="../../../assets/layuiadmin/layui/css/eleTree/eleTree.css?v=1.6" rel="stylesheet"
        type="text/css" />
    <link href="//at.alicdn.com/t/font_1076139_i1iz34nakgq.css" rel="stylesheet" />
    <link href="../../../assets/css/app.css" rel="stylesheet" />
    <style>
       .ontr{
        background-color:#f2f2f2!important;
       }
       
    </style>
</head>
<body>
    <form class="layui-form">
    <div class="layui-fluid">
        <div class="layui-row">
            <div class="layui-card">
                <div class="layui-card-header">
                    <i class="iconfont">&#xe62f;</i>应用权限
                </div>
                <div class="app layui-card-body">
                    <div class="layui-row layui-col-space10">
                        <div class="layui-col-xs4">
                            <div>
                                <table class="layui-table" lay-size="sm">
                                    <thead>
                                        <tr>
                                            <th>
                                                安全组
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody id="qzz">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="layui-col-xs8">
                            <div id="applist">
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="../../../assets/layuiadmin/layui/layui.js"></script>
    <script>
        var sid = "";
        layui.use(['form'], function () {
            var form = layui.form;
            $ = layui.jquery;
            load = function () {
                var option = {
                    data: {
                        method: 'LoadGroups'
                    },
                    url: "Module/App/data/data.ashx",
                    success: function (data) {
                        var html = "";
                        for (var i = 0; i < data.Groups.length; i++) {
                            html += "<tr class='azz' data-sid=" + data.Groups[i].SID + "><td>" + data.Groups[i].GroupName + "</td></tr>";
                        }
                        $("#qzz").html(html);
                    }
                }
                parent.layui.admin.req(option);

            }
            load();
            $("body").on('click', '.azz', function (e) {
                $(".azz").removeClass("ontr");
                $(this).addClass("ontr");
                sid = $(this).data("sid");
                var option = {
                    data: {
                        method: 'LoadApp',
                        sid: sid
                    },
                    url: "Module/App/data/data.ashx",
                    success: function (data) {
                        var html = "";
                        for (var i = 0; i < data.applist.length; i++) {
                            html += '<fieldset class="layui-elem-field">' +
                                    '<legend>' + data.applist[i].GroupName + '</legend>' +
                                    '<div class="layui-field-box">';
                            for (var j = 0; j < data.applist[i].data.length; j++) {
                                html += '<input type="checkbox" lay-filter="appcheck" data-id=' + data.applist[i].data[j].id + '  ' + (data.applist[i].data[j].check == true ? 'checked==' : '') + ' name="like[write]" title="' + data.applist[i].data[j].appname + '">';
                            }
                            html += '</div></fieldset>';
                        }
                        $("#applist").html(html);
                        form.render('checkbox');
                    }
                }
                parent.layui.admin.req(option);
            })

            form.on('checkbox(appcheck)', function (data) {
                var appid = $(data.elem).data("id");
                var check = data.elem.checked;
                var option = {
                    data: {
                        method: 'updateapp',
                        sid: sid,
                        appid: appid,
                        check: check
                    },
                    url: "Module/App/data/data.ashx",
                    success: function (data) {
                       
                    }
                }
                parent.layui.admin.req(option);
            });
        });
    </script>
    </form>
</body>
</html>
