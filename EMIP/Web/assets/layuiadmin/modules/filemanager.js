layui.define(['jquery', 'layer', 'laytpl'], function (exports) {
    var $ = layui.jquery;
    var layer = layui.layer;
    var laytpl = layui.laytpl;

    //layer.msg("filemanager");
    var baseServer = "http://139.199.158.165:8081/";
    function renderList(dir) {
        if (!dir) {
            dir = $('#tvFP').text();
        }
        layer.load(2);
        $.get(baseServer + 'api/list', {
            dir: dir
        }, function (res) {
            layer.closeAll('loading');
            if (res.code == 200) {
                for (var i = 0; i < res.data.length; i++) {
                    res.data[i].url = baseServer + 'file/' + res.data[i].url;
                    res.data[i].smUrl = baseServer + 'file/' + res.data[i].smUrl;
                }
                laytpl(fileTpl.innerHTML).render(res.data, function (html) {
                    $('.file-list').html(html);
                });
            } else {
                layer.msg(res.msg, { icon: 2 });
            }
        });
    }
    function ResetDir(dir) {
        var nav = $(".layui-breadcrumb");
        nav.html("");
        nav.append("<span>文件位置：</span>");
        var d = dir.split('/');
        var ndir = "";
        for (var i = 0; i < d.length; i++) {
            ndir += d[i] + "/";
            if (i < d.length - 1) {
                var n = d[i] == "" ? "根目录" : d[i];
                var laydir = "";
                if (d[i] != "") {
                    laydir = ndir.substring(0, ndir.length - 1);
                } else {
                    laydir = ndir;
                }
                var a = $("<a>", { href: "javascript:void(0)", text: n, laydir: laydir });
                a.click(function (obj, a, v) {
                    var dir = $(obj.toElement);
                    DirGoto(dir.attr('laydir'));
                });
                nav.append(a);
                nav.append("<span lay-separator=\"\">/</span>");
            } else {
                nav.append("<a><cite>" + d[i] + "</cite></a>");
            }
        }
    }
    ResetDir("/");
    renderList();

    function DirGoto(dir) {
        $('#tvFP').text(dir);
        ResetDir(dir);
        renderList(dir);

    }
    // 刷新
    $('#btnRefresh').click(function () {
        renderList();
    });

    var mUrl;
    // 列表点击事件
    $('body').on('click', '.file-list-item', function (e) {
        var isDir = $(this).data('dir');
        var name = $(this).data('name');
        mUrl = $(this).data('url');
        $('#copy').attr('data-clipboard-text', mUrl);
        if (isDir) {
            var cDir = $('#tvFP').text();
            cDir += (cDir == '/' ? name : ('/' + name));
            $('#tvFP').text(cDir);

            ResetDir(cDir);
            renderList(cDir);

        } else {
            var $target = $(this).find('.file-list-img');
            $('#dropdownFile').css({
                'top': $target.offset().top + 70,
                'left': $target.offset().left
            });
            $('#dropdownFile').addClass('dropdown-opened');
            if (e !== void 0) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    });
    // 返回上级
    $('#btnBack').click(function () {
        var cDir = $('#tvFP').text();
        if (cDir == '/') {
            // layer.msg('已经是根目录', {icon: 2})
        } else {
            cDir = cDir.substring(0, cDir.lastIndexOf('/'));
            if (!cDir) {
                cDir = '/';
            }
            $('#tvFP').text(cDir);

            ResetDir(cDir);
            renderList(cDir);
        }
    });

    // 点击空白隐藏下拉框
    $('html').off('click.dropdown').on('click.dropdown', function () {
        $('#copy').attr('data-clipboard-text', '');
        $('#dropdownFile').removeClass('dropdown-opened');
    });

    layui.link(layui.cache.base + '../style/filemanager.css');

    exports('filemanager', {})
});