<%@ Page Language="C#" AutoEventWireup="true" CodeFile="index.aspx.cs" Inherits="Notice_index" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link rel="stylesheet" href="../../../assets/layuiadmin/layui/css/layui.css" media="all" />
    <link rel="stylesheet" href="../../../assets/layuiadmin/style/admin.css" media="all" />
    <link href="../../../assets/css/main.css" rel="stylesheet" />
    <link href="../../../assets/css/animate.min.css" rel="stylesheet" />
    <link href="../../../assets/css/app.css" rel="stylesheet" />
    <link href="css.css?v=1.8" rel="stylesheet" />
    <link href="//at.alicdn.com/t/font_1076139_fn6s1fqg79q.css" rel="stylesheet" />
</head>
<body>
    <form class="layui-form" lay-filter="LAY-filter-Login-form">
    <div class="layui-fluid">
        <div class="layui-row">
            <div class="layui-card">
                <div class="layui-card-header">
                    <i class="iconfont icon-xiaoxi"></i>消息配置<div style="float: right">
                        <button lay-submit="" lay-filter="save" type="button" class="layui-btn">
                            保存设置</button>
                    </div>
                </div>
                <div class="app layui-card-body">
                    <div class="layui-row layui-col-space15">
                        <div class="layui-col-md6">
                            <div class="layui-card">
                                <div class="layui-card-header" style="height: 80px; line-height: 25px; text-align: center">
                                    <i class="iconfont wxicon" style="font-size: 80px; display: block; margin-top: 30px;
                                        margin-bottom: 30px;">&#xe768;</i><div>
                                            <button type="button" class="wxmb layui-btn layui-btn-xs">
                                                消息模板<span class="layui-badge-dot"></span></button>
                                            <button type="button" class="wxcs layui-btn layui-btn-xs" style="display: none">
                                                消息参数</button>
                                            <button type="button" class="wxtscs layui-btn layui-btn-xs">
                                                推送测试</button>
                                            <button type="button" class="wxwjxz layui-btn layui-btn-xs">
                                                文件下载</button>
                                        </div>
                                </div>
                                <div class="layui-card-body">
                                    <div id="wxmb" style="display: none" class="animated fadeInDown">
                                        <table class="layui-table" lay-size="sm">
                                            <colgroup>
                                                <col width="80">
                                                <col>
                                                <col>
                                                <col width="80">
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        消息
                                                    </th>
                                                    <th>
                                                        标题
                                                    </th>
                                                    <th>
                                                        内容
                                                    </th>
                                                    <th>
                                                        是否启用
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div id="wxcs">
                                        <div class="layui-form-item">
                                            <a class="layui-form-label" href="https://work.weixin.qq.com/api/doc#90000/90135/90665/agentid"
                                                target="_blank">agentid</a>
                                            <div class="layui-input-block">
                                                <input type="text" name="WxAgentid" autocomplete="off" placeholder="请输入Agentid" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="wx">
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
                                                        默认推送账号为系统用户账号<br>
                                                        如微信后台账号和用户账号不一致，请在下方输入关联语句
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
                                            <%--<div class="layui-form-item">
                                                    <label class="layui-form-label">推送链接</label>
                                                    <div class="layui-input-block">
                                                        <input type="text" name="WxPushUrl" autocomplete="off" placeholder="请输入推送链接" class="layui-input">
                                                        <div class="layui-form-mid layui-word-aux">不填写推送链接，则所有消息以文本推送</div>
                                                    </div>

                                                </div>--%>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md6">
                            <div class="layui-card">
                                <div class="layui-card-header" style="height: 80px; line-height: 25px;">
                                    <i class="iconfont ddicon" style="font-size: 80px; display: block; margin-top: 30px;
                                        margin-bottom: 30px;">&#xe601;</i><div>
                                            <button type="button" class="ddmb layui-btn layui-btn-xs">
                                                消息模板<span class="layui-badge-dot"></span></button>
                                            <button type="button" class="ddcs layui-btn layui-btn-xs" style="display: none">
                                                消息参数</button>
                                            <button type="button" class="ddtscs layui-btn layui-btn-xs">
                                                推送测试</button>
                                            <button type="button" class="ddwjxz layui-btn layui-btn-xs">
                                                文件下载</button>
                                        </div>
                                </div>
                                <div class="layui-card-body">
                                    <div id="ddmb" style="display: none" class="animated fadeInDown">
                                        <table class="layui-table" lay-size="sm">
                                            <colgroup>
                                                <col width="80">
                                                <col>
                                                <col>
                                                <col width="80">
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        消息
                                                    </th>
                                                    <th>
                                                        标题
                                                    </th>
                                                    <th>
                                                        内容
                                                    </th>
                                                    <th>
                                                        是否启用
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div id="ddcs">
                                        <div class="layui-form-item">
                                            <a class="layui-form-label">agent_id</a>
                                            <div class="layui-input-block">
                                                <input type="text" name="DdAgentid" autocomplete="off" placeholder="请输入agent_id"
                                                    class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <a class="layui-form-label" href="https://open-doc.dingtalk.com/microapp/serverapi2/eev437#a-namebq4tsta%E6%9F%A5%E7%9C%8B%E5%BA%94%E7%94%A8%E8%AF%A6%E6%83%85"
                                                target="_blank">appkey</a>
                                            <div class="layui-input-block">
                                                <input type="text" name="DdId" autocomplete="off" placeholder="请输入appkey" class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-form-item">
                                            <a class="layui-form-label">appsecret</a>
                                            <div class="layui-input-block">
                                                <input type="text" name="DdSecret" autocomplete="off" placeholder="请输入appsecret"
                                                    class="layui-input">
                                            </div>
                                        </div>
                                        <div class="layui-form-item layui-form-text">
                                                <label class="layui-form-label">
                                                    注意</label>
                                                <div class="layui-input-block">
                                                    <div class="layui-form-mid layui-word-aux" style="text-align: left;">
                                                        默认推送账号为系统用户账号<br>
                                                        如钉钉后台账号和用户账号不一致，请在下方输入关联语句
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="layui-form-item layui-form-text">
                                                <label class="layui-form-label">
                                                    其他关联</label>
                                                <div class="layui-input-block">
                                                    <textarea name="DdLinkSql" placeholder="输入SQL语句，{0}为钉钉后台账号，sql需返回一个字段做为推送账号" class="layui-textarea"></textarea>
                                                </div>
                                            </div>
                                        <%-- <div class="layui-form-item">
                                                <label class="layui-form-label">推送链接</label>
                                                <div class="layui-input-block">
                                                    <input type="text" name="DdPushUrl" autocomplete="off" placeholder="请输入推送链接" class="layui-input">
                                                    <div class="layui-form-mid layui-word-aux">不填写推送链接，则所有消息以文本推送</div>
                                                </div>
                                            </div>--%>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-row" style="margin-top: 10px">
            <div class="layui-card">
                <div class="layui-card-header">
                    <i class="iconfont icon-rizhi"></i>消息日志
                </div>
                <div class="app layui-card-body">
                    <div class="layui-row layui-col-space15">
                        <div class="layui-col-md6">
                            <div class="layui-tab">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">成功</li>
                                    <li>失败</li>
                                </ul>
                                <div class="layui-tab-content">
                                    <div class="layui-tab-item layui-show">
                                        <table id="wxlogsuccess" lay-filter="wxlogsuccess">
                                        </table>
                                    </div>
                                    <div class="layui-tab-item">
                                        <table id="wxlogerror" lay-filter="wxlogerror">
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md6">
                            <div class="layui-tab">
                                <ul class="layui-tab-title">
                                    <li class="layui-this">成功</li>
                                    <li>失败</li>
                                </ul>
                                <div class="layui-tab-content">
                                    <div class="layui-tab-item layui-show">
                                        <table id="ddlogsuccess" lay-filter="ddlogsuccess">
                                        </table>
                                    </div>
                                    <div class="layui-tab-item">
                                        <table id="ddlogerror" lay-filter="ddlogerror">
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </form>
    <script type="text/html" id="toolbar">
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" type="button" lay-event="Refresh">刷新</button>
        </div>
    </script>
    <script src="../../../assets/jquery-1.9.1.min.js"></script>
    <script src="../../../assets/layuiadmin/layui/layui.js"></script>
    <script>
        layui.use(['form', 'layer', 'table', 'element', 'laydate'], function () {
            var form = layui.form;
            var layer = layui.layer;
            var $ = layui.jquery;
            var table = layui.table;
            var element = layui.element;
            var laydate = layui.laydate;

            load = function () {
                var option = {
                    data: {
                        method: 'LoadNoticeConfig'
                    },
                    url: "Module/Notice/data/data.ashx",
                    success: function (data) {
                      
                        form.val("LAY-filter-Login-form", {
                            "WxAgentid": data.NoticeInfo.WxAgentid
                  , "WxId": data.NoticeInfo.WxId
                  , "WxSecret": data.NoticeInfo.WxSecret
                   , "WxLinkSql": data.NoticeInfo.WxLinkSql ==null ? "" : unescape(data.NoticeInfo.WxLinkSql)
                  , "DdLinkSql": data.NoticeInfo.DdLinkSql == null ? "" : unescape(data.NoticeInfo.DdLinkSql)
                            //, "WxPushUrl": data.NoticeInfo.WxPushUrl
                  , "DdAgentid": data.NoticeInfo.DdAgentid
                  , "DdId": data.NoticeInfo.DdId
                  , "DdSecret": data.NoticeInfo.DdSecret
                            //, "DdPushUrl": data.NoticeInfo.DdPushUrl
                        })
                        var wxhtml = "";
                        var ddhtml = "";
                        var trindex = 0;
                        var MessageCat = "";
                        var title = "";
                        $.each(data.NotifyMessages, function (i, val) {
                            trindex = i;
                            MessageCat = val.MessageCat;
                            switch (MessageCat) {
                                case "NewTaskNormal":
                                    title = "新任务通知";
                                    break;
                                case "Approved":
                                    title = "审批通知";
                                    break;
                                case "Rejected":
                                    title = "拒绝通知";
                                    break;
                                case "Aborted":
                                    title = "撤销通知";
                                    break;
                                case "Deleted":
                                    title = "删除通知";
                                    break;
                                case "StepStopHumanOpt":
                                    title = "步骤中止通知";
                                    break;
                                case "StepStopVoteFinished":
                                    title = "投票中止通知";
                                    break;
                                case "TimeoutNotify":
                                    title = "超时通知";
                                    break;
                                case "RecedeBack":
                                    title = "退回通知";
                                    break;
                                case "IndicateTask":
                                    title = "阅示通知";
                                    break;
                                case "InformTask":
                                    title = "知会通知";
                                    break;
                                case "IndicateTask":
                                    title = "阅示通知";
                                    break;
                                case "ManualRemind":
                                    title = "催办通知";
                                    break;
                                case "NoParticipantException":
                                    title = "异常通知";
                                    break;
                            }
                            $.each(val.MessageItems, function (i, val) {
                                if (val.ProviderName == "WeChat" && trindex > 0) {
                                    wxhtml += '<tr>' +
                                             '<td>' + title + '</td>' +
                                              '<td><textarea placeholder="请输入标题" class="layui-textarea">' + val.Title + '</textarea></td>' +
                                              '<td><textarea placeholder="请输入内容" class="layui-textarea">' + val.Message + '</textarea></td>' +
                                              '<td><input type="checkbox" lay-skin="switch" lay-text="是|否" ' + (val.Enabled == true ? "checked" : "") + '></td>' +
                                              '</tr>';
                                }
                                if (val.ProviderName == "DingTalk" && trindex > 0) {
                                    ddhtml += '<tr>' +
                                             '<td>' + title + '</td>' +
                                              '<td><textarea placeholder="请输入标题" class="layui-textarea">' + val.Title + '</textarea></td>' +
                                              '<td><textarea placeholder="请输入内容" class="layui-textarea">' + val.Message + '</textarea></td>' +
                                              '<td><input type="checkbox" lay-skin="switch" lay-text="是|否" ' + (val.Enabled == true ? "checked" : "") + '></td>' +
                                              '</tr>';
                                }
                            });
                        });
                        $("#wxmb table tbody").append(wxhtml);
                        $("#ddmb table tbody").append(ddhtml);
                        form.render('checkbox');
                    }

                }
                parent.layui.admin.req(option);
            }
            load();

            $(".wxmb").click(function () {
                $("#wxmb").show();
                $("#wxcs").hide();
                $(this).hide();
                $(".wxcs").show();
            })

            $(".wxcs").click(function () {
                $("#wxmb").hide();
                $("#wxcs").show();
                $(this).hide();
                $(".wxmb").show();
            })
            $(".ddmb").click(function () {
                $("#ddmb").show();
                $("#ddcs").hide();
                $(this).hide();
                $(".ddcs").show();
            })

            $(".ddcs").click(function () {
                $("#ddmb").hide();
                $("#ddcs").show();
                $(this).hide();
                $(".ddmb").show();
            })
            $(".wxtscs").click(function () {
                var WxAgentid = $("input[name=WxAgentid]").val();
                var WxId = $("input[name=WxId]").val();
                var WxSecret = $("input[name=WxSecret]").val();
                if (WxAgentid == "" || WxId == "" || WxSecret == "") {
                    layer.msg("请完善参数！");
                    return;
                }

                parent.layui.admin.popup({
                    title: '微信推送测试'
          , shade: 0.1
          , anim: -1
          , area: ['280px', '290px']
          , id: 'layadmin-layer-skin-test'
          , skin: 'layui-anim layui-anim-upbit'
          , content: '<input type="text" name="WxAccount" placeholder="请输入账号"  value="" autocomplete="off" class="layui-input"><textarea name="WxContent" placeholder="请输入推送内容" class="layui-textarea">微信推送测试</textarea>',
                    btn: ['推送', '取消'],
                    yes: function (index, layero) {
                        var _index = index;
                        var WxAccount = layero.find("input[name=WxAccount]").val();
                        var WxContent = layero.find("textarea[name=WxContent]").val();

                        if (WxAccount == "") {
                            parent.layui.admin.popup({
                                title: false,
                                content: "请输入账号！"
                            })

                        }
                        else if (WxContent == "") {
                            parent.layui.admin.popup({
                                title: false,
                                content: "请输入推送内容！"
                            })

                        }
                        else {
                            var option = {
                                data: {
                                    method: 'WxPushTest',
                                    WxAgentid: WxAgentid,
                                    WxId: WxId,
                                    WxSecret: WxSecret,
                                    Account: WxAccount,
                                    WxContent: WxContent
                                },
                                url: "Module/Notice/data/data.ashx",
                                success: function (data) {
                                    if (data.code == 0) {
                                        parent.layui.admin.popup({
                                            title: false,
                                            content: "推送成功！"
                                        })
                                    }
                                }
                            }
                            parent.layui.admin.req(option);
                        }
                    }
                })
            })
            $(".ddtscs").click(function () {
                var DdAgentid = $("input[name=DdAgentid]").val();
                var DdId = $("input[name=DdId]").val();
                var DdSecret = $("input[name=DdSecret]").val();
                if (DdAgentid == "" || DdId == "" || DdSecret == "") {
                    layer.msg("请完善参数！");
                    return;
                }
                parent.layui.admin.popup({
                    title: '钉钉推送测试'
          , shade: 0.1
          , anim: -1
          , area: ['280px', '290px']
          , id: 'layadmin-layer-skin-test'
          , skin: 'layui-anim layui-anim-upbit'
          , content: '<input type="text" name="DdAccount" placeholder="请输入账号"  value="" autocomplete="off" class="layui-input"><textarea name="DdContent" placeholder="请输入推送内容" class="layui-textarea">钉钉推送测试</textarea>',
                    btn: ['推送', '取消'],
                    yes: function (index, layero) {
                        var _index = index;
                        var DdAccount = layero.find("input[name=DdAccount]").val();
                        var DdContent = layero.find("textarea[name=DdContent]").val();
                        if (DdAccount == "") {
                            parent.layui.admin.popup({
                                title: false,
                                content: "请输入账号！"
                            })

                        }

                        else if (DdContent == "") {
                            parent.layui.admin.popup({
                                title: false,
                                content: "请输入推送内容！"
                            })

                        }
                        else {
                            var option = {
                                data: {
                                    method: 'DdPushTest',
                                    DdAgentid: DdAgentid,
                                    DdId: DdId,
                                    DdSecret: DdSecret,
                                    Account: DdAccount,
                                    DdContent: DdContent
                                },
                                url: "Module/Notice/data/data.ashx",
                                success: function (data) {
                                    if (data.code == 0) {
                                        parent.layui.admin.popup({
                                            title: false,
                                            content: "推送成功！"
                                        })
                                    }
                                }
                            }
                            parent.layui.admin.req(option);
                        }
                    }
                })
            })
            $(".wxwjxz").click(function () {
                window.location = "../../../admin/download/Notice/WeChatProvider.rar";

            })
            $(".ddwjxz").click(function () {
                window.location = "../../../admin/download/Notice/DingTalkProvider.rar";

            })
            table.render({
                elem: '#wxlogsuccess'
              , url: '../../../admin/Module/Notice/data/data.ashx?method=WxLogSuccess'
              , page: true
                , toolbar: '#toolbar'
                , limit: 10
              , cols: [[
                { field: 'MessageID', title: '消息ID', width: 80, fixed: 'left' }
                , { field: 'Address', title: '接收人', width: 100 }
                , { field: 'Title', title: '标题', width: 100 }
                , { field: 'Message', title: '内容' }
                , { field: 'Ca', title: '创建时间', width: 120 }
                , { field: 'Sa', title: '发送时间', width: 120 },
                 , { field: 'Extra', title: '参数', width: 100 }
              ]]
            });
            table.on('toolbar(wxlogsuccess)', function (obj) {

                switch (obj.event) {
                    case 'Refresh':
                        table.reload('wxlogsuccess');
                        break;
                };
            });
            table.on('toolbar(wxlogerror)', function (obj) {

                switch (obj.event) {
                    case 'Refresh':
                        table.reload('wxlogerror');
                        break;
                };
            });
            table.on('toolbar(ddlogsuccess)', function (obj) {

                switch (obj.event) {
                    case 'Refresh':
                        table.reload('ddlogsuccess');
                        break;
                };
            });
            table.on('toolbar(ddlogerror)', function (obj) {

                switch (obj.event) {
                    case 'Refresh':
                        table.reload('ddlogerror');
                        break;
                };
            });

            table.render({
                elem: '#wxlogerror'
         , url: '../../../admin/Module/Notice/data/data.ashx?method=WxLogError'
          , page: true
    , toolbar: '#toolbar'
           , limit: 10
              , cols: [[
                  { field: 'MessageID', title: '消息ID', width: 80, fixed: 'left' }
                , { field: 'Address', title: '接收人', width: 100 }
                , { field: 'Title', title: '标题', width: 100 }
                , { field: 'Message', title: '内容' }
                , { field: 'Ca', title: '创建时间', width: 120 }
                , { field: 'Error', title: '失败原因', width: 120 },
                , { field: 'Extra', title: '参数', width: 100 }
              ]]
            });
            table.render({
                elem: '#ddlogsuccess'
          , url: '../../../admin/Module/Notice/data/data.ashx?method=DdLogSuccess'
          , page: true
                  , toolbar: '#toolbar'
            , limit: 10
          , cols: [[
            { field: 'MessageID', title: '消息ID', width: 80, fixed: 'left' }
            , { field: 'Address', title: '接收人', width: 100 }
            , { field: 'Title', title: '标题', width: 100 }
            , { field: 'Message', title: '内容' }
            , { field: 'Ca', title: '创建时间', width: 120 }
            , { field: 'Sa', title: '发送时间', width: 120 },
             , { field: 'Extra', title: '参数', width: 100 }
          ]]
            });
            table.render({
                elem: '#ddlogerror'
         , url: '../../../admin/Module/Notice/data/data.ashx?method=DdLogError'
          , page: true
                  , toolbar: '#toolbar'
           , limit: 10
              , cols: [[
                { field: 'MessageID', title: '消息ID', width: 80, fixed: 'left' }
                , { field: 'Address', title: '接收人', width: 100 }
                , { field: 'Title', title: '标题', width: 100 }
                , { field: 'Message', title: '内容' }
                , { field: 'Ca', title: '创建时间', width: 120 }
                , { field: 'Error', title: '失败原因', width: 120 },
                 , { field: 'Extra', title: '参数', width: 100 }
              ]]
            });

            form.on('submit(save)', function (data) {
                var wechat = new Array();
                $("#wxmb table tbody tr").each(function () {
                    var Title = $(this).find("td").eq(1).find("textarea").val();
                    var Message = $(this).find("td").eq(2).find("textarea").val();
                    var Enabled = $(this).find("td").eq(3).find("input").prop('checked');
                    wechat.push({
                        Title: Title,
                        Message: Message,
                        Enabled: Enabled
                    })
                })

                var dingtalk = new Array();
                $("#ddmb table tbody tr").each(function () {
                    var Title = $(this).find("td").eq(1).find("textarea").val();
                    var Message = $(this).find("td").eq(2).find("textarea").val();
                    var Enabled = $(this).find("td").eq(3).find("input").prop('checked');
                    dingtalk.push({
                        Title: Title,
                        Message: Message,
                        Enabled: Enabled
                    })
                })
                var DdLinkSql = "";
                if (data.field.DdLinkSql != "") {
                    DdLinkSql = escape(data.field.DdLinkSql);
                }
                var WxLinkSql = "";
                if (data.field.DdLinkSql != "") {
                    WxLinkSql = escape(data.field.WxLinkSql);
                }

                data.field.DdLinkSql = DdLinkSql;
                data.field.WxLinkSql = WxLinkSql;
                var option = {
                    type: 'POST',
                    data: {
                        method: 'SaveNoticeConfig',
                        formdata: JSON.stringify(data.field),
                        wechat: JSON.stringify(wechat),
                        dingtalk: JSON.stringify(dingtalk)

                    },
                    url: "Module/Notice/data/data.ashx",
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
