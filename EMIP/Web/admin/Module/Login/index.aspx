<%@ Page Language="C#" AutoEventWireup="true" CodeFile="index.aspx.cs" Inherits="Login_index" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link rel="stylesheet" href="../../../assets/layuiadmin/layui/css/layui.css" media="all" />
    <link rel="stylesheet" href="../../../assets/layuiadmin/style/admin.css" media="all" />
    <link href="../../../assets/css/main.css" rel="stylesheet" />
    <link href="../../../assets/css/font.css" rel="stylesheet" />
    <link href="../../../assets/css/app.css" rel="stylesheet" />
    <link href="css.css?v=1.1" rel="stylesheet" />
</head>
<body>
    <form class="layui-form" lay-filter="LAY-filter-Login-form">
    <div class="layui-fluid">
        <div class="layui-row">
            <div class="layui-card">
                <div class="layui-card-header">
                    <i class="iconfont">&#xe600;</i>登录配置<div style="float: right">
                        <button lay-submit="" lay-filter="save" type="button" class="layui-btn">
                            保存设置</button></div>
                </div>
                <div class="app layui-card-body">
                    <div class="layui-row layui-col-space15">
                        <div class="layui-col-md6">
                            <div class="layui-card">
                                <div class="layui-card-header" style="height: 80px; line-height: 80px">
                                    <i class="iconfont" style="font-size: 80px">&#xe768;</i></div>
                                <div class="layui-card-body">
                                    <div class="layui-form-item">
                                        <input type="checkbox" name="WxLogin" lay-skin="switch" lay-text="开启登陆|关闭登陆">
                                    </div>
                                    <div class="wx">
                                        <div class="layui-form-item">
                                            <a class="layui-form-label" href="https://work.weixin.qq.com/api/doc#90000/90135/90665/corpid"
                                                target="_blank">agentid</a>
                                            <div class="layui-input-block">
                                                <input type="text" name="WxAgentId" autocomplete="off" placeholder="请输入agentid" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <a class="layui-form-label" href="https://work.weixin.qq.com/api/doc#90000/90135/90665/corpid"
                                                target="_blank">corpid</a>
                                            <div class="layui-input-block">
                                                <input type="text" name="WxId" autocomplete="off" placeholder="请输入corpid" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <a class="layui-form-label" href="https://work.weixin.qq.com/api/doc#90000/90135/90665/secret"
                                                target="_blank">corpsecret</a>
                                            <div class="layui-input-block">
                                                <input type="text" name="WxSecret" autocomplete="off" placeholder="请输入corpsecret"
                                                    class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-form-item layui-form-text">
                                            <label class="layui-form-label">
                                                注意</label>
                                            <div class="layui-input-block">
                                                <div class="layui-form-mid layui-word-aux" style="text-align: left;">
                                                    默认关联字段为微信企业号后台账号(userid)->bpm的user表account字段<br>
                                                    如有其他关联情况，请在下方输入关联语句
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-form-item layui-form-text">
                                            <label class="layui-form-label">
                                                其他关联</label>
                                            <div class="layui-input-block">
                                                <textarea name="WxLinkSql" placeholder="输入SQL语句，{0}为微信后台账号，sql需返回一个字段做为单点登录账号" class="layui-textarea"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md6">
                            <div class="layui-card">
                                <div class="layui-card-header" style="height: 80px; line-height: 80px">
                                    <i class="iconfont" style="font-size: 80px">&#xe601;</i></div>
                                <div class="layui-card-body">
                                    <div class="layui-form-item">
                                        <input type="checkbox" name="DdLogin" lay-skin="switch" lay-text="开启登陆|关闭登陆">
                                    </div>
                                    <div class="wx">
                                        <div class="layui-form-item">
                                            <a class="layui-form-label">agentid</a>
                                            <div class="layui-input-block">
                                                <input type="text" name="DdAgentId" autocomplete="off" placeholder="请输入agentid" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <a class="layui-form-label" href="https://open-doc.dingtalk.com/microapp/serverapi2/eev437#a-namebq4tsta%E6%9F%A5%E7%9C%8B%E5%BA%94%E7%94%A8%E8%AF%A6%E6%83%85"
                                                target="_blank">appkey</a>
                                            <div class="layui-input-block">
                                                <input type="text" name="DdId" autocomplete="off" placeholder="请输入corpid" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <a class="layui-form-label">appsecret</a>
                                            <div class="layui-input-block">
                                                <input type="text" name="DdSecret" autocomplete="off" placeholder="请输入corpsecret"
                                                    class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <a class="layui-form-label" href="https://open-doc.dingtalk.com/microapp/serverapi2/eev437#a-namebq4tsta%E6%9F%A5%E7%9C%8B%E5%BA%94%E7%94%A8%E8%AF%A6%E6%83%85"
                                                target="_blank">corpid</a>
                                            <div class="layui-input-block">
                                                <input type="text" name="DdCorpId" autocomplete="off" placeholder="请输入corpid" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-form-item layui-form-text">
                                            <label class="layui-form-label">
                                                注意</label>
                                            <div class="layui-input-block">
                                                <div class="layui-form-mid layui-word-aux" style="text-align: left;">
                                                    默认关联字段为钉钉后台账号(userid)->bpm的user表account字段<br>
                                                    如有其他关联情况，请在下方输入关联语句
                                                </div>
                                            </div>
                                        </div>
                                        <div class="layui-form-item layui-form-text">
                                            <label class="layui-form-label">
                                                其他关联</label>
                                            <div class="layui-input-block">
                                                <textarea name="DdLinkSql" placeholder="输入SQL语句，{0}为钉钉后台账号，sql需返回一个字段做为单点登录账号" class="layui-textarea"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <%--   <div class="layui-col-md4">
                            <div class="layui-card">
                                <div class="layui-card-header" style="height: 80px; line-height: 80px">
                                    <i class="iconfont" style="font-size: 80px">&#xe602;</i></div>
                                <div class="layui-card-body">
                                    <div class="layui-form-item">
                                        <input type="checkbox" name="OLogin" lay-skin="switch" lay-text="开启登陆|关闭登陆">
                                    </div>
                                </div>
                            </div>
                        </div>--%>
                    </div>
                </div>
            </div>
        </div>
    </form>
    <script src="../../../assets/layuiadmin/layui/layui.js"></script>
    <script>
        layui.use(['form', 'layer'], function () {
            var form = layui.form;
            var layer = layui.layer;
            load = function () {
                var option = {
                    data: {
                        method: 'LoadLoginConfig'
                    },
                    url: "Module/Login/data/data.ashx",
                    success: function (data) {

                        form.val("LAY-filter-Login-form", {
                            "WxLogin": data.LoginInfo.WxLogin == "0" ? false : true

                  , "WxId": data.LoginInfo.WxId
                   , "WxAgentId": data.LoginInfo.WxAgentId
                    , "WxLinkSql": data.LoginInfo.WxLinkSql
                   , "DdLinkSql": data.LoginInfo.DdLinkSql
                  , "WxSecret": data.LoginInfo.WxSecret
                  , "DdLogin": data.LoginInfo.DdLogin == "0" ? false : true
                  , "DdCorpId": data.LoginInfo.DdCorpId
                  , "DdId": data.LoginInfo.DdId
                   , "DdAgentId": data.LoginInfo.DdAgentId
                  , "DdSecret": data.LoginInfo.DdSecret
                  , "OLogin": data.LoginInfo.OLogin == "0" ? false : true

                        })
                    }
                }
                parent.layui.admin.req(option);

            }
            load();





            form.on('submit(save)', function (data) {

                if (data.field.WxLogin == "on") {
                    data.field.WxLogin = 1;
                }
                else {
                    data.field.WxLogin = 0;
                }
                if (data.field.WxLogin == 1) {

                    if (data.field.WxId == "" || data.field.WxSecret == "" || data.field.WxAgentId == "") {
                        layer.msg("请输入微信参数！");
                        return;
                    }
                }


                if (data.field.DdLogin == "on") {
                    data.field.DdLogin = 1;
                }
                else {
                    data.field.DdLogin = 0;
                }
                if (data.field.DdLogin == 1) {

                    if (data.field.DdId == "" || data.field.DdSecret == "" || data.field.DdAgentId == "" || data.field.DdCorpId == "") {
                        layer.msg("请输入钉钉参数！");
                        return;
                    }
                }

                if (data.field.OLogin == "on") {
                    data.field.OLogin = 1;
                }
                else {
                    data.field.OLogin = 0;
                }
                var option = {
                    data: {
                        method: 'SaveLoginConfig',
                        data: JSON.stringify(data.field)
                    },
                    url: "Module/Login/data/data.ashx",
                    success: function (data) {
                        if (data.code == "0") {
                            layer.msg("保存成功！");
                        }
                    }
                }
                parent.layui.admin.req(option);
                return false;
            });
        })
    </script>
</body>
</html>
