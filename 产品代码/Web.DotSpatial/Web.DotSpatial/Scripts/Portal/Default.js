(function ($) {

    $(document).ready(function () {
        Main.init();
    });
    Main = {
        init: function () {
            Main.fn.initPage();
            Main.data.loadMenuData();
            Main.top.buildCalender();
            Main.top.buildWeather();
            Main.top.loadCurrentUser();
        },
        fn: {
            initPage: function () {
                //退出按钮
                $("#sysExit").bind("click", function () {
                    $.messager.confirm("确认", "确认退出本系统?", function (r) {
                        if (r) {
                            window.location.href = "../PartHandler/LogOutHandler.ashx";
                        }
                    });

                });


                //绑定tabs的右键菜单
                $("#tabs").tabs({
                    tabPosition: 'bottom',
                    narrow: true,//各页签之间没有间距
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
                        Main.fn.closeTab(this, item.name);
                    }
                });
                $("#sysPassword").bind("click", function () {
                    $("#editPwd").dialog('open');
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
                    args.Password = oldPwd;
                    args.NewPassword = newPwd;
                    doActionAsync("IWEHAVE.ERP.Auth.ServiceBP.Agent.ModifyUserPwdBPProxy", args, function (result) {
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

                $("#editPwd").dialog({
                    width: 300,
                    height: 160,
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
            },
            closeTab: function (menu, type) {//几个关闭事件的实现
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
            },
            open: function (text, url, iconCls) {  //在右边center区域打开菜单，新增tab
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
            },
            formatMenu: function () {
                //实例化树形菜单
                $(".ul-menu li").bind("click", function () {
                    var pageUrl = "";
                    //if ($(this).attr("url") && $(this).attr("url").length > 5) {
                    //    pageUrl = $(this).attr("url").substr(5);
                    //}
                    //else {
                        pageUrl = $(this).attr("url");
                    //}

                    var menu = { src: pageUrl, id: $(this).attr("id"), name: $(this).html() };
                    Main.fn.open(menu.name, menu.src);
                    Main.fn.open(menu.name, menu.src, "icon-menu");
                });
            }
        },
        data: {

            loadMenuData: function () {
                doActionAsync("IWEHAVE.ERP.Auth.ServiceBP.Agent.GetAllMenuTreeBPProxy", { MenuType: 2 }, function (data) {
                    if (data) {
                        var firstMenuArray = new Array(); //第一级菜单
                        $.each(data, function (i, item) {
                            firstMenuArray.push(item);
                        });
                        //创建菜单
                        Main.data.createCategoryMenu(firstMenuArray);
                        Main.data.moveTree();
                    }
                });
            },
            formatNode: function () {
                this.attributes = {};
               

                this.attributes.url = this.PageUrl;
                this.attributes.IsCategory = this.IsCategory;
                this.attributes.iconCls = this.iconCls;
                this.id = this.ID;
                this.text = this.Name;
                if (!this.Leaf) {
                    this.state = "closed";
                } else {
                    this.iconCls = "icon-menu";
                }
                if (this.children) {
                    $.each(this.children, function (i, item) {
                        Main.data.formatNode.call(item);
                    });
                }
            },
            createCategoryMenu: function (data) {
                //创建一级菜单
                var str = " <div class='easyui-accordion' data-options='fit:true,border:false' id='menuAccordion'>";
                $.each(data, function (i, item) {
                    str += Main.data.getOneAccord(item);
                });
                str += "</div>";
                $("#westMenu").append(str);
                //知识普及:$.parser.parse($('#menuAccordion'));parser只渲染menuAccordion的子孙元素，并不包括menuAccordion自身，而它的子孙元素并不包含任何Easyui支持的控件class，所以这个地方就得不到你想要的效果了，应该这样写： $.parser.parse($('#menuAccordion').parent());渲染menuAccordion的父节点的所有子孙元素就可以了，不管你的javascript输出什么DOM，直接渲染其父节点就可以保证页面能被正确解析。
                //创建完所有DOM之后重新渲染一下easyui的控件
                $.parser.parse($('#westMenu')); //重新渲染一下该组件，使之成为easyui可识别的组件，这里渲染westMenu以下的所有子元素
                $("#menuAccordion").accordion({});
                Main.fn.formatMenu();
            },
            getOneAccord: function (data) {
                var str = "<div title='" + data.Name + "' style=' overflow: auto;' >";
                str += "<ul id='" + data.ID + "' class='ul-menu'>";
                if (data.children) {
                    str += Main.data.getManTree(data.children);
                }
                str += "</ul>";
                str += "</div>";
                return str;
            },
            getManTree: function (data) {
                var str = "";
                $.each(data, function (i, item) {
                    // str += "<li class='ul-menu-item' style='background: url(../../Scripts/easyui1.4.4/themes/icons/back.png) no-repeat;background-position: 10px 12px;' icon='../../Scripts/easyui1.4.4/themes/icons/back.png' url='" + item.PageUrl + "' id='" + item.ID + "'>" + item.Name + "</li>";
                    str += "<li class='ul-menu-item selected' style='background: url(" + item.Icon + ") no-repeat;background-position: 10px 12px;' icon='" + item.Icon + "' url='" + item.PageUrl + "' id='" + item.ID + "'>" + item.Name + "</li>";
                });
                return str;
            },
            clickTree: function () {

            },
            moveTree: function () {
                //鼠标移入
                $(".ul-menu-item").mouseover(function () {
                    changeBackground($(".ul-menu-item"), false);
                    //截取icon url
                    var style1 = "background:#58b7f7 url(" + getPicUrl($(this).attr("icon")) + ") no-repeat;background-position: 10px 12px;color: #fff;";
                    $(this).attr("style", style1);

                });
                ////鼠标移出事件
                $(".ul-menu-item").mouseout(function () {
                    changeBackground($(".ul-menu-item"), false);
                });
                //var item = null;
                $(".ul-menu-item").click(function () {
                    changeBackground($(".ul-menu-item"), true);
                    var style1 = "background:#58b7f7 url(" + getPicUrl($(this).attr("icon")) + ") no-repeat;background-position: 10px 12px;color: #fff;";
                    $(this).attr("style", style1);
                    if (!$(this).hasClass("li_selected")) {
                        $(this).addClass("li_selected");
                    }
                });
                function changeBackground(data, isClick) {
                    if (data.length > 0) {
                        $.each(data, function (i, item) {
                            if (isClick) {
                                var style = "background: url(" + $(item).attr("icon") + ") no-repeat;background-position: 10px 12px;";
                                $(item).attr("style", style);
                                if ($(item).hasClass("li_selected")) {
                                    $(this).removeClass("li_selected");
                                }
                            } else {
                                if (!$(item).hasClass("li_selected")) {
                                    var style = "background: url(" + $(item).attr("icon") + ") no-repeat;background-position: 10px 12px;";
                                    $(item).attr("style", style);
                                }
                            }

                        });
                    }
                }

                function getPicUrl(str) {
                    var strArray = str.split("/");
                    var png = strArray[strArray.length - 1];
                    var index = png.lastIndexOf(".")
                    var pngName = png.substr(0, index);


                    var lastIndex = str.lastIndexOf("/")

                    var imgSubStr = str.substr(0, lastIndex + 1);
                    var newName = pngName + "_hover.png";
                    var newUrl = imgSubStr + newName;
                    return newUrl;
                }

            }


        },
        top: {
            buildCalender: function () {
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
            },
            buildWeather: function () {
                var d = new Date();
                $.ajax({
                    url: "../PartHandler/GetWeatherHandler.ashx",
                    type: 'POST',
                    async: true,
                    data: { City: '北京' },
                    success: function (result) {
                        var tpl = "";
                        if (result) {
                            result = eval("(" + result + ")");
                            tpl += "<span style='padding:0 5px'>" + result.City + "</span>";
                            if (result.Icon) {
                                tpl += "<img src='../Images/weather/" + result.Icon + "' width='20' height='20' title='" + result.Weather + "'/>";
                            } else {
                                tpl += "<span>" + result.Weather + "</span>";
                            }
                            tpl += "<span style='padding:0 5px'>" + result.Temperture + "</span>";
                            $("#weather").html(tpl);
                        }
                    },
                    error: function (result) {
                        $.messager.alert("温馨提示", "获取天气失败,请刷新重试!", "error");
                        return false;
                    }
                });
            },
            loadCurrentUser: function () {
                doActionAsync("IWEHAVE.ERP.Auth.ServiceBP.Agent.GetCurrentUserBPProxy", {}, function (data) {
                    if (data) {
                        $("#usrbt").text(data.Name);
                        $("#sysOrg").text(data.OrgName);
                    }
                }, null, null, false);
            }
        }
    };
})(jQuery);