<%@ Page Language="C#" AutoEventWireup="true" CodeFile="index.aspx.cs" Inherits="OrgSync_index" %>

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
    <link href="css.css?v=1.3" rel="stylesheet" />
    <link href="//at.alicdn.com/t/font_1076139_fn6s1fqg79q.css" rel="stylesheet" />
</head>
<body>
    <form class="layui-form" lay-filter="LAY-filter-Login-form">
    <div class="layui-fluid">
        <div class="layui-row">
            <div class="layui-card">
                <div class="layui-card-header">
                    <i class="iconfont icon-xiaoxi"></i>同步配置<div style="float: right">
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
                                            <button type="button" class="tbbm layui-btn layui-btn-xs">
                                                同步部门</button>
                                            <button type="button" class="tbry layui-btn layui-btn-xs">
                                                同步人员</button>
                                            <button type="button" class="qbtb layui-btn layui-btn-xs">
                                                全部同步</button>
                                            <button type="button" class="wxxz layui-btn layui-btn-xs">
                                                下载同步程序</button>
                                        </div>
                                </div>
                                <div class="layui-card-body">
                                    <div id="wxcs">
                                        <div class="wx">
                                            <div class="layui-form-item">
                                                <a class="layui-form-label" href="https://work.weixin.qq.com/api/doc#90000/90135/90665/corpid"
                                                    target="_blank">corpid</a>
                                                <div class="layui-input-block">
                                                    <input type="text" name="WxCorpId" autocomplete="off" placeholder="请输入corpid" class="layui-input">
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
                                                    部门SQL</label>
                                                <div class="layui-input-block">
                                                    <textarea placeholder="请输入部门SQL" name="WxOuSql" class="layui-textarea"></textarea>
                                                </div>
                                            </div>
                                               <div class="layui-form-item layui-form-text">
                                                <label class="layui-form-label">
                                                    注意</label>
                                                <div class="layui-input-block">
                                                    <div class="layui-form-mid layui-word-aux" style="text-align: left;">
                                                       部门默认获取OUID为1下面的子部门，如不一致则请修改上述SQL语句
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="layui-form-item layui-form-text">
                                                <label class="layui-form-label">
                                                    人员SQL</label>
                                                <div class="layui-input-block">
                                                    <textarea placeholder="请输入人员SQL" name="WxUserSql" class="layui-textarea"></textarea>
                                                </div>
                                            </div>
                                            <div class="layui-form-item layui-form-text">
                                                <label class="layui-form-label">
                                                    注意</label>
                                                <div class="layui-input-block">
                                                    <div class="layui-form-mid layui-word-aux" style="text-align: left;">
                                                        将文件夹"EMIP\Web\admin\Module\OrgSync\WxSync"设置为可读写<br>
                                                        人员同步默认字段：姓名，账号，手机号，邮箱，部门，职位，性别，<br>
                                                        如需同步其他字段，则需修改<br>
                                                        1.修改EMIP\Web\admin\Module\OrgSync\WxSync\Default.aspx.cs中 dt2csv(dt, UserPath, "姓名,帐号,手机号,邮箱,所在部门,职位,性别")新增字段<br>
                                                        2.修改同步人员SQL
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="layui-col-md6">
                            <div class="layui-card">
                                <div class="layui-card-header" style="height: 80px; line-height: 25px; text-align: center">
                                    <i class="iconfont ddicon" style="font-size: 80px; display: block; margin-top: 30px;
                                        margin-bottom: 30px;">&#xe601;</i><div>
                                            <button type="button" class="ddtscs layui-btn layui-btn-xs">
                                                立即同步</button>
                                        </div>
                                </div>
                                <div class="layui-card-body">
                                    <div id="ddcs">
                                        <div class="layui-form-item">
                                            <a class="layui-form-label" href="https://open-doc.dingtalk.com/microapp/serverapi2/eev437#a-namebq4tsta%E6%9F%A5%E7%9C%8B%E5%BA%94%E7%94%A8%E8%AF%A6%E6%83%85"
                                                target="_blank">appkey</a>
                                            <div class="layui-input-block">
                                                <input type="text" name="DdCorpId" autocomplete="off" placeholder="请输入appkey" class="layui-input">
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
                                                部门SQL</label>
                                            <div class="layui-input-block">
                                                <textarea placeholder="请输入部门SQL" name="DdOuSql" class="layui-textarea"></textarea>
                                            </div>
                                        </div>
                                        <div class="layui-form-item layui-form-text">
                                            <label class="layui-form-label">
                                                人员SQL</label>
                                            <div class="layui-input-block">
                                                <textarea placeholder="请输入人员SQL" name="DdUserSql" class="layui-textarea"></textarea>
                                            </div>
                                        </div>
                                    </div>
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
                <i class="iconfont icon-rizhi"></i>同步日志
            </div>
            <div class="app layui-card-body">
                <div class="layui-row layui-col-space15">
                    <div class="layui-col-md6">
                        <iframe id="wxi" width='100%' height='100%' frameborder='0' src="WxSync/Default.aspx">
                        </iframe>
                    </div>
                    <div class="layui-col-md6">
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

        var HtmlUtil = {
            /*1.用浏览器内部转换器实现html转码*/
            htmlEncode: function (html) {
                //1.首先动态创建一个容器标签元素，如DIV
                var temp = document.createElement("div");
                //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
                (temp.textContent != undefined) ? (temp.textContent = html) : (temp.innerText = html);
                //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
                var output = temp.innerHTML;
                temp = null;
                return output;
            },
            /*2.用浏览器内部转换器实现html解码*/
            htmlDecode: function (text) {
                //1.首先动态创建一个容器标签元素，如DIV
                var temp = document.createElement("div");
                //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
                temp.innerHTML = text;
                //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
                var output = temp.innerText || temp.textContent;
                temp = null;
                return output;
            }
        };


        layui.use(['form', 'layer', 'table', 'element', ], function () {
            var form = layui.form;
            var layer = layui.layer;
            var $ = layui.jquery;
            var table = layui.table;
            var element = layui.element;



            load = function () {
                var option = {
                    data: {
                        method: 'LoadOrgSyncConfig'
                    },
                    url: "Module/OrgSync/data/data.ashx",
                    success: function (data) {
                        var ousql = "with cte as  (" +
 "select OUName AS 部门名称,Code AS 部门Code, OUID AS 部门ID," +
 "ISNULL(ParentOUID,0) AS 父部门ID,OrderIndex AS  排序 from BPMSysOUs A where ParentOUID=1" +
 "union all" +
 " select OUName AS 部门名称,Code AS 部门Code,OUID AS 部门ID,ISNULL(ParentOUID,0) AS 父部门ID,OrderIndex AS  排序 from BPMSysOUs K inner join cte c on c.部门ID = k.ParentOUID" +
 ")select 部门名称, 部门ID,父部门ID,排序 from cte  ParentOUID";

                        var usersql = " with aa as( SELECT B.DisplayName,A.UserAccount,B.Mobile,B.EMail,OUID," +
 " (SELECT TOP 1 LeaderTitle FROM BPMSysOUMembers WHERE UserAccount=A.UserAccount) LeaderTitle,case when Sex='Female' then '女'" +
" else '男'end as Sex" +
" FROM  BPMSysOUMembers A INNER JOIN BPMSysUsers B " +
" ON A.UserAccount=B.Account" +
" WHERE B.DisplayName IS NOT NULL AND B.Mobile IS NOT NULL AND Disabled=0)" +
" select DisplayName,UserAccount,Mobile,EMail," +
 " stuff((select ';'+CONVERT(nvarchar(50),OUID) from aa " +
" where a.UserAccount=UserAccount for xml path('')),1,1,'') as OUID,LeaderTitle,Sex" +
" from aa as a group by DisplayName,UserAccount,Mobile,EMail,LeaderTitle,Sex";

                        form.val("LAY-filter-Login-form", {
                            "WxCorpId": data.OrgSyncInfo.WxCorpId
                  , "WxSecret": data.OrgSyncInfo.WxSecret
                  , "DdCorpId": data.OrgSyncInfo.DdCorpId
                  , "DdSecret": data.OrgSyncInfo.DdSecret
                  , 'DdOuSql': HtmlUtil.htmlDecode(data.OrgSyncInfo.DdOuSql) == "" ? ousql : HtmlUtil.htmlDecode(data.OrgSyncInfo.DdOuSql)
                  , 'DdUserSql': HtmlUtil.htmlDecode(data.OrgSyncInfo.DdUserSql) == "" ? usersql : HtmlUtil.htmlDecode(data.OrgSyncInfo.DdUserSql)
                  , 'WxOuSql': HtmlUtil.htmlDecode(data.OrgSyncInfo.WxOuSql) == "" ? ousql : HtmlUtil.htmlDecode(data.OrgSyncInfo.WxOuSql)
                  , 'WxUserSql': HtmlUtil.htmlDecode(data.OrgSyncInfo.WxUserSql) == "" ? ousql : HtmlUtil.htmlDecode(data.OrgSyncInfo.WxUserSql)
                        })
                    }
                }
                parent.layui.admin.req(option);
            }
            load();

            $(".tbbm").click(function () {
                $("#wxi").attr("src", "WxSync/Default.aspx?method=syncou");

            })
            $(".tbry").click(function () {
                $("#wxi").attr("src", "WxSync/Default.aspx?method=syncuser");

            })
            $(".qbtb").click(function () {
                $("#wxi").attr("src", "WxSync/Default.aspx?method=all");

            })
            $(".wxxz").click(function () {
                window.location = "../../../admin/download/OrgSync/WeChatSync.rar";
            })
            form.on('submit(save)', function (data) {
                var option = {
                    type: 'POST',
                    data: {
                        method: 'SaveOrgSyncConfig',
                        data: JSON.stringify(data.field)

                    },
                    url: "Module/OrgSync/data/data.ashx",
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
