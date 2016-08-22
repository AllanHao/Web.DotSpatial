$(document).ready(function () {
    UI.initPage();
    window.enableMenu = function () {
        var content = '<ul class="ul-menu" ><li class="ul-menu-item icon-form" url="../Project/Default_New.aspx">网站列表</li></ul>';
        $('#menuAccordion').accordion('add', {
            title: '网站管理',
            content: content,
            selected: true

        });
        UI.initPage();
    }
});

var UI = {
    initPage: function () {
       

        buildCalender();
        //实例化树形菜单
        $(".ul-menu li").bind("click", function () {
            var menu = { src: $(this).attr("url"), id: $(this).attr("id"), name: $(this).html() };
            Open(menu.name, menu.src);

        });


        //在右边center区域打开菜单，新增tab
        function Open(text, url) {
            if ($("#tabs").tabs('exists', text)) {
                $('#tabs').tabs('select', text);
            } else {
                var tpl = "<div class=\"iframe_main show\"><iframe frameborder=\"0\" src=\"" + url + "\"></iframe></div>";
                $("#tabs").tabs('add', {
                    title: text,
                    content: tpl,
                    cache: false,
                    closable: true,
                    iconCls: 'icon-menu'
                });
            }

        }

        //绑定tabs的右键菜单
        $("#tabs").tabs({
            onContextMenu: function (e, title) {
                e.preventDefault();
                $('#tabsMenu').menu('show', {
                    left: e.pageX,
                    top: e.pageY
                }).data("tabTitle", title);
            }
        });

        //实例化menu的onClick事件
        $("#tabsMenu").menu({
            onClick: function (item) {
                CloseTab(this, item.name);
            }
        });


        $("#sysExit").bind("click", function () {
            $.messager.confirm("确认", "确认退出本系统?", function (r) {
                if (r) {
                    window.location.href = "../LogOutHandler.ashx";
                }
            });

        });

        $("#editPwd").dialog({
            width: 300,
            height: 180,
            closed: true,
            modal: true,
            autoRowHeight: false,
            pagination: true,
            striped: true,
            remoteSort: false,
            singleSelect: true,
            buttons: [{
                iconCls: 'icon-ok',
                text: '确定',
                handler: function () {
                    EditOK();
                }
            },
            {
                iconCls: 'icon-cancel',
                text: '取消',
                handler: function () {
                    EditCancel();
                }
            }]
        });

        function EditOK() {
            var oldPwd = $.trim($("#txtPwd").val());
            var newPwd = $.trim($("#txtNewPwd").val());
            var newPwd1 = $.trim($("#txtNewPwd1").val());
            if (newPwd.length < 6 || newPwd.length > 16) {
                $.messager.alert("错误提示", "密码长度为6-16个字符", "error");
                return false;
            }
            if (newPwd != newPwd1) {
                $.messager.alert("错误提示", "两次输入的密码不一样", "error");
                return false;
            }
            var args = {};
            args.OldPwd = oldPwd;
            args.NewPwd = newPwd;
            doActionAsync("IWEHAVE.ERP.CenterBP.Agent.ModifyUserInfoPwdBPProxy", args, function (result) {
                if (result != undefined && result) {
                    $.messager.alert("温馨提示", "密码修改成功", "info");
                    $("#editPwd").window("close");
                    Clear();
                }
            });
        }
        function EditCancel() {
            $("#editPwd").window("close");
            Clear();
        }
        function Clear() {
            $("#txtPwd").val("");
            $("#txtNewPwd").val("");
            $("#txtNewPwd1").val("");
        }


        $("#sysPassword").bind("click", function () {
            $("#editPwd").dialog('open');
        });

        //几个关闭事件的实现
        function CloseTab(menu, type) {
            var curTabTitle = $(menu).data("tabTitle");
            var tabs = $("#tabs");

            if (type === "close") {
                tabs.tabs("close", curTabTitle);
                return;
            }

            var allTabs = tabs.tabs("tabs");
            var closeTabsTitle = [];

            $.each(allTabs, function () {
                var opt = $(this).panel("options");
                if (opt.closable && opt.title != curTabTitle && type === "Other") {
                    closeTabsTitle.push(opt.title);
                } else if (opt.closable && type === "All") {
                    closeTabsTitle.push(opt.title);
                }
            });

            for (var i = 0; i < closeTabsTitle.length; i++) {
                tabs.tabs("close", closeTabsTitle[i]);
            }
        }

        function buildCalender() {
            var d = new Date();
            var week = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
            var tpl = "<span style='padding: 0 5px;'>今天是&nbsp;&nbsp;";
            tpl += d.getFullYear() + "年";
            tpl += (d.getMonth() + 1) + "月";
            tpl += d.getDate() + "日&nbsp;&nbsp;";
            tpl += week[d.getDay()] + "&nbsp;&nbsp;";
            tpl += "农历" + GetLunarDay(d.getFullYear(), d.getMonth() + 1, d.getDate());
            tpl += "</span>";
            $("#calender").html(tpl);
        }
    }
};
