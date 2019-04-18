<%@ Page Language="C#" AutoEventWireup="true" CodeFile="center.aspx.cs" Inherits="center" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link rel="stylesheet" href="../assets/layuiadmin/layui/css/layui.css" media="all" />
    <link rel="stylesheet" href="../assets/layuiadmin/style/admin.css" media="all" />
    <link href="../assets/css/main.css" rel="stylesheet" />
    <style>
        .bg {
            background: url(../assets/images/undraw_mobile_apps_4wgf.png) no-repeat center 0%;
            background-size: 95%;
            width: 50vw;
            height: 60vh;
        }
    </style>
</head>
<body>
    <div class="layui-fluid">
        <div class="layui-row">
            <div class="layui-col-xs6">
                <div class="layui-card">
                    <div class="layui-card-header">
                        更新日志
                    </div>
                    <div class="layui-card-body">
                        <ul class="layui-timeline">
                            <li class="layui-timeline-item">
                                <i class="layui-icon layui-timeline-axis"></i>
                                <div class="layui-timeline-content layui-text">
                                    <h3 class="layui-timeline-title">登陆管理</h3>
                                    <p>
                                        1.微信、钉钉登陆
                                    </p>
                                </div>
                            </li>
                            <li class="layui-timeline-item">
                                <i class="layui-icon layui-timeline-axis"></i>
                                <div class="layui-timeline-content layui-text">
                                    <h3 class="layui-timeline-title">应用管理</h3>
                                    <p>
                                        1.应用增删改查<br>
                                        2.自定义html<br>
                                        3.自定义ext<br>
                                        4.流程发起
                                    </p>
                                </div>
                            </li>
                            <li class="layui-timeline-item">
                                <i class="layui-icon layui-timeline-axis"></i>
                                <div class="layui-timeline-content layui-text">
                                    <h3 class="layui-timeline-title">消息管理</h3>
                                    <p>
                                        1.微信、钉钉消息推送
                                    </p>
                                </div>
                            </li>
                            <li class="layui-timeline-item">
                                <i class="layui-icon layui-timeline-axis"></i>
                                <div class="layui-timeline-content layui-text">
                                    <h3 class="layui-timeline-title">组织管理</h3>
                                    <p>1.微信、钉钉组织架构同步</p>

                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="layui-col-xs6">
                <div class="bg"></div>
            </div>
        </div>
    </div>
</body>
</html>
