function doAction(action, args, callback, callbackArg, errorcallback, displayLoading) {
    if (displayLoading != false) {
        util.LoadMark.Show();
    }
    $.ajax({
        url: "action.ashx",
        type: 'POST',
        async: false,
        data: { action: action, Args: $.toJSON(args), PageGuid: window.$PageGuid },
        success: function (result) {
            if (callback) {
                if (result) {
                    var obj = $.parseJSON(result);
                    if (obj.Success) {
                        util.eraseNull(obj);
                        callback(obj.Data, callbackArg);
                        if (displayLoading != false) {
                            util.LoadMark.Hide();
                        }
                    } else {
                        if (displayLoading != false) {
                            util.LoadMark.Hide();
                        }
                        if (errorcallback) {
                            errorcallback(callbackArg, obj.ResultMsg);
                        } else {
                            $.messager.alert('错误', obj.ResultMsg, 'error');
                        }
                    }
                } else {
                    if (displayLoading != false) {
                        util.LoadMark.Hide();
                    }
                    if (errorcallback) {
                        errorcallback(callbackArg, "未知错误");
                    } else {
                        $.messager.alert('错误', "未知错误", 'error');
                    }
                }
            }
        },
        error: function (result) {
            if (displayLoading != false) {
                util.LoadMark.Hide();
            }
            if (errorcallback) {
                errorcallback(callbackArg, "网络请求错误");
            } else {
                $.messager.alert('错误', "网络请求错误", 'error');
            }
        }
    });
}
/*增加等待页面*/
$(document).ready(function () {
    var tpl = "<div class='loadingPanel hide'></div>";
    $("body").append(tpl);
    $("div.loadingPanel").bind("dblclick", function () {
        util.LoadMark.Hide(0);
        util.ImagePreview.hide();
    });
    $("div.loadingPanel").bind("click", function () {
        if (!$("img.imagePreview").hasClass("hide")) {
            util.ImagePreview.hide();
        }
    });

    util.Grid.reset(); //2015-10-26页面初始化列表列显示隐藏
});


function doActionAsync(action, args, callback, callbackArg, errorcallback, displayLoading) {
    if (displayLoading != false) {
        util.LoadMark.Show();
    }
    $.ajax({
        url: "action.ashx",
        type: 'POST',
        async: true,
        data: { action: action, Args: $.toJSON(args), PageGuid: window.$PageGuid },
        success: function (result) {
            if (callback) {
                if (result) {
                    var obj = $.parseJSON(result);
                    if (obj.Success) {
                        util.eraseNull(obj);
                        callback(obj.Data, callbackArg);
                        if (displayLoading != false) {
                            util.LoadMark.Hide();
                        };
                    } else {
                        if (displayLoading != false) {
                            util.LoadMark.Hide();
                        };
                        if (errorcallback) {
                            errorcallback(callbackArg, obj.ResultMsg);
                        } else {
                            $.messager.alert('错误', obj.ResultMsg, 'error');
                        }
                    }
                } else {
                    if (displayLoading != false) {
                        util.LoadMark.Hide();
                    };
                    if (errorcallback) {
                        errorcallback(callbackArg, "未知错误");
                    } else {
                        $.messager.alert('错误', "未知错误", 'error');
                    }
                }
            }
        },
        error: function (result) {
            if (displayLoading != false) {
                util.LoadMark.Hide();
            };
            if (errorcallback) {
                errorcallback(callbackArg, "网络请求错误");
            } else {
                $.messager.alert('错误', "网络请求错误", 'error');
            }
        }
    });
}

//cookie相关
CookieManage = {
    ExpireHours: 7 * 24,
    SetCookie: function (key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + CookieManage.ExpireHours * 3600000);
        document.cookie = key + "=" + escape(value) + ";expires=" + expires.toUTCString() + "; path=/";
    },
    GetCookie: function (key) {
        var value = "";
        var strCookie = document.cookie;
        var arrCookie = strCookie.split(";");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if ($.trim(arr[0]) == key) {
                value = arr[1];
            }
        }
        return unescape(value);
    },
    DeleteCookie: function (key) {
        var expires = new Date(0);
        document.cookie = key + "=" + " ;expires=" + expires.toUTCString() + "; path=/";
    }
}
util = {
    TemplateChart: {//三级分析页面初始化
        firstCallback: null,
        secondCallback: null,
        threeCallback: null,
        resetCallback: null,
        searchCallback: null,
        selectTabIndex: 0,
        format: {
            first: function () {
                if ($(".bar_second").hasClass("second_erd_expand")) {
                    $(".bar_second").removeClass("second_erd_expand");
                    $(".emer_second").css("width", "66%");
                    $(".emer_second").animate({ right: '-66%' });
                    $(".emer_first").css("width", "100%");
                    if ($(".bar_three").hasClass("three_erd_expand")) {
                        $(".emer_three").animate({ right: '-33%' });
                        $(".bar_three").removeClass("three_erd_expand")
                    }
                    if (!$(".bar_first").hasClass("first_erd_expand")) {
                        //first放大
                        $(".bar_first").addClass("first_erd_expand");
                    }
                    if (util.TemplateChart.firstCallback) {
                        util.TemplateChart.firstCallback();
                    }
                    util.TemplateChart.format.selectStep("first");
                }
            },
            second: function () {
                if ($(".bar_second").hasClass("second_erd_expand")) {
                    if ($(".bar_three").hasClass("three_erd_expand")) {
                        util.TemplateChart.format.collspanthree();
                    }
                    return false;
                }
                $(".bar_second").addClass("second_erd_expand");
                $(".emer_second").animate({ right: '0' });
                $(".emer_first").css("width", "34%");
                if ($(".bar_first").hasClass("first_erd_expand")) {
                    $(".bar_first").removeClass("first_erd_expand");
                }
                //TODO:刷新二级
                if (util.TemplateChart.secondCallback) {
                    util.TemplateChart.secondCallback();
                }
                if (util.TemplateChart.firstCallback) {
                    util.TemplateChart.firstCallback();
                }
                util.TemplateChart.format.selectStep("second");
            },
            //选中第三步
            three: function (isrefresh) {
                if (!$(".bar_second").hasClass("second_erd_expand")) {
                    $.messager.alert("提示", "请先展开二级", "info");
                    return false;
                }

                if ($(".bar_three").hasClass("three_erd_expand")) {
                    if (util.TemplateChart.secondCallback) {
                        util.TemplateChart.secondCallback();
                    }
                    if (isrefresh) {
                        //TODO:加载三级
                        if (util.TemplateChart.threeCallback) {
                            util.TemplateChart.threeCallback();
                        }
                    }
                    return false;
                } else {
                    $(".bar_three").addClass("three_erd_expand");
                    $(".emer_three").animate({ right: '0' });
                    $(".emer_three").css("border-top", "0px");
                    $(".emer_second").css("right", "33%");
                    $(".emer_second").css("width", "33%");
                    $(".emer_second").css("border-right", "0px");
                    //TODO:刷新二级
                    if (util.TemplateChart.secondCallback) {
                        util.TemplateChart.secondCallback();
                    }
                    if (isrefresh) {
                        //TODO:加载三级
                        if (util.TemplateChart.threeCallback) {
                            util.TemplateChart.threeCallback();
                        }
                    }
                }
                util.TemplateChart.format.selectStep("three");
            },
            //折叠第三步
            collspanthree: function () {
                if ($(".bar_three").hasClass("three_erd_expand")) {
                    $(".bar_three").removeClass("three_erd_expand");
                    $(".emer_three").animate({ right: '-33%' });
                    $(".emer_second").css("right", "0");
                    $(".emer_second").css("width", "66%");
                    //TODO:刷新二级
                    if (util.TemplateChart.secondCallback) {
                        util.TemplateChart.secondCallback();
                    }
                    util.TemplateChart.format.selectStep("second");
                }
            },
            //选中步骤
            selectStep: function (step) {
                var item;
                $("div[class='emer_step_div']").each(function () {
                    if ($(this).attr("step") == step) {
                        item = this;
                    }
                    $(this).css("color", "#000");
                    $(this).css("background", "url(../../Images/arrow.png) no-repeat right center");
                });
                if (item) {
                    $(item).css("color", "red");
                    $(item).css("background", "url(../../Images/arrow_select.png) no-repeat right center");
                }
                util.TemplateChart.format.initStep();
            },
            initStep: function () {
                //最后一个步骤不需要背景图片即箭头
                $($("div[class='emer_step_div']")[$("div[class='emer_step_div']").length - 1]).css("background", "");
            },
            //展开查询条件
            expandCondition: function (index) {
                if (!$(".tool_expand").hasClass("tab_erd_expand")) {
                    if (index > -1) {
                        util.TemplateChart.selectTabIndex = index;
                    }
                    if (util.TemplateChart.selectTabIndex > -1) {
                        $('#emer_tabs').tabs('select', util.TemplateChart.selectTabIndex);
                    }

                    $(".emer_tab").css("height", "121px");
                    $(".emer_tab").find(".easyui-tabs").css("height", "121px");
                    $(".emer_tab").find(".tabs-panels").css("height", "92px");
                    var item;
                    $(".emer_tab").find(".tabs-panels").children().each(function () {
                        if ($(this).css("display") == "block") {
                            item = this;
                        }
                    });
                    if (item) {
                        $(item).find(".panel-body").css("height", "92px");
                    }
                    $(".tool_expand").addClass("tab_erd_expand");
                    $(".tool_expand").linkbutton({ iconCls: 'icon-arrow-up' });
                }
            },
            //收起查询条件
            collspanCondition: function (index) {
                if ($(".tool_expand").hasClass("tab_erd_expand")) {
                    $(".emer_tab").css("height", "26px");
                    $(".emer_tab").find(".easyui-tabs").css("height", "26px");
                    $(".emer_tab").find(".tabs-panels").css("height", "0");
                    var item;
                    $(".emer_tab").find(".tabs-panels").children().each(function () {
                        if ($(this).css("display") == "block") {
                            item = this;
                        }
                    });
                    if (item) {
                        $(item).find(".panel-body").css("height", "0");
                    }
                    $(".tool_expand").removeClass("tab_erd_expand");
                    $(".tool_expand").linkbutton({ iconCls: 'icon-arrow-down' });
                    if (index > -1) {
                        util.TemplateChart.selectTabIndex = index;
                    }
                    if (util.TemplateChart.selectTabIndex > -1) {
                        $('#emer_tabs').tabs('unselect', util.TemplateChart.selectTabIndex);
                    }
                }
            }
        },
        init: function (firstCallback, secondCallback, threeCallback, resetCallback, searchCallback, isPos) {

            //是否创建坐标设置模块
            if (isPos) {
                $(".emer_pos").append(" <div class='bar_pos'></div>");
                $(".bar_pos").click(function () {
                    if ($(this).hasClass("pos_erd_expand")) {
                        $(".emer_pos").animate({ left: '-302px' });
                        $(this).removeClass("pos_erd_expand");
                    } else {
                        $(".emer_pos").animate({ left: '0' });
                        $(this).addClass("pos_erd_expand");
                    }

                });
            }
            util.TemplateChart.initEvent(firstCallback, secondCallback, threeCallback, resetCallback, searchCallback);
            //选中第一步
            util.TemplateChart.format.selectStep("first");
        },
        initEvent: function (firstCallback, secondCallback, threeCallback, resetCallback, searchCallback) {
            if (firstCallback) {
                util.TemplateChart.firstCallback = firstCallback;
            }
            if (secondCallback) {
                util.TemplateChart.secondCallback = secondCallback;
            }
            if (threeCallback) {
                util.TemplateChart.threeCallback = threeCallback;
            }
            if (resetCallback) {
                util.TemplateChart.resetCallback = resetCallback;
            }
            if (searchCallback) {
                util.TemplateChart.searchCallback = searchCallback;
            }
            util.TemplateChart.format.initStep();
            //tabs页签选择事件
            $("#emer_tabs").tabs({
                onSelect: function (title, index) {
                    util.TemplateChart.selectTabIndex = index;
                    util.TemplateChart.format.expandCondition();
                }
            });
            //展开和收缩查询条件
            $(".tool_expand").linkbutton({
                onClick: function () {
                    if ($(this).hasClass("tab_erd_expand")) {
                        util.TemplateChart.format.collspanCondition();
                    } else {
                        util.TemplateChart.format.expandCondition();
                    }
                }
            });
            //一级分析
            $('.bar_first').unbind("click");
            $(".bar_first").click(function () {
                util.TemplateChart.format.first();
            });
            //二级分析
            $('.bar_second').unbind("click");
            $(".bar_second").click(function () {
                if ($(this).hasClass("second_erd_expand")) {
                    //first放大
                    util.TemplateChart.format.first();
                }
                else {
                    //first缩小
                    util.TemplateChart.format.second();
                }
            });

            //三级分析
            $('.bar_three').unbind("click");
            $(".bar_three").click(function () {
                if ($(this).hasClass("three_erd_expand")) {
                    util.TemplateChart.format.collspanthree();
                } else {
                    util.TemplateChart.format.three();
                }

            });

            //步骤事件
            $(".emer_step_div").click(function () {
                $("div[class='emer_step_div']").each(function () {
                    $(this).css("color", "#000");
                    $(this).css("background", "url(../../Images/arrow.png) no-repeat right center");
                });
                $(this).css("color", "red");
                $(this).css("background", "url(../../Images/arrow_select.png) no-repeat right center");
                var step = $(this).attr("step");
                if (step) {
                    if (step == "first") {
                        util.TemplateChart.format.first();
                    } else if (step == "second") {
                        util.TemplateChart.format.second();
                    } else if (step == "three") {
                        util.TemplateChart.format.three();
                    }
                }
                util.TemplateChart.format.initStep();
            });


            //重置按钮
            $(".tool_rest").linkbutton({
                onClick: function () {
                    util.TemplateChart.format.expandCondition(0);//重置时回归到第一个tab页签
                    if (util.TemplateChart.resetCallback) {
                        util.TemplateChart.resetCallback();
                    }

                }
            });
            //查询按钮
            $(".tool_search").linkbutton({
                onClick: function () {
                    util.TemplateChart.format.collspanCondition();
                    if (util.TemplateChart.searchCallback) {
                        util.TemplateChart.searchCallback();
                    }
                }
            });
        },
        //重新加载第二级内容
        loadSecond: function (firstCallback, secondCallback) {
            util.TemplateChart.initEvent(firstCallback, secondCallback);
            util.TemplateChart.format.second();
        },
        //重新加载第三级内容
        loadThree: function (secondCallback, threeCallback) {
            util.TemplateChart.initEvent(null, secondCallback, threeCallback);
            util.TemplateChart.format.three(true);
        },
        setStep: function (index, str) {//选中
            var item;
            var step = 0;
            $("div[class='emer_step_div']").each(function () {
                if (step == index) {
                    item = this;
                    if (str) {
                        if ($(this).find("li[class='emer_div_ul_li']").length > 0) {
                            $("li[class='emer_div_ul_li']").remove();
                        }

                        var objStr = "<li class='emer_div_ul_li' style='color:#f00;font-weight:bold;'>" + str + "</li>";

                        $(this).find("ul").append(objStr);
                    }
                }
                $(this).css("color", "#000");
                $(this).css("background", "url(../../Images/arrow.png) no-repeat right center");
                step++;
            });
            //三级若没有选中的状态选中条件
            if (!$(".bar_three").hasClass("three_erd_expand")) {
                if (item) {
                    $(item).css("color", "red");
                    $(item).css("background", "url(../../Images/arrow_select.png) no-repeat right center");
                }
                util.TemplateChart.format.initStep();
            } else {
                util.TemplateChart.format.selectStep("three");
            }
        },//清除二级饼图所选条件
        clearStep: function (index, isNotSelect) {
            var step = 0;
            $("div[class='emer_step_div']").each(function () {
                if (step == index) {
                    if ($(this).find("li[class='emer_div_ul_li']").length > 0) {
                        $("li[class='emer_div_ul_li']").remove();
                    }
                }
                step++;
            });
            if (!isNotSelect) {
                if (!$(".bar_three").hasClass("three_erd_expand")) {
                    util.TemplateChart.format.selectStep("second");
                } else {
                    util.TemplateChart.format.selectStep("three");
                }
            }
        }
    },
    Grid: {
        pageControlList: new Array(),
        //获取datagrid列表右键列菜单
        getContextMenu: function (gridKey, gridType) {
            var cmenu;
            menuKey = gridKey + "_menu";
            var gridKey = "#" + gridKey;
            if ($("#" + menuKey).length == 0) {
                cmenu = $('<div id="' + menuKey + '" style="width:100px;"/>').appendTo('body');
                cmenu.menu({
                    onClick: function (item) {
                        var args = {};
                        args.FieldSetDTO = {};
                        args.FieldSetDTO.PageGUID = window.$PageGuid;
                        args.FieldSetDTO.ControlCode = gridKey;
                        args.FieldSetDTO.ControlType = gridType == "datagrid" ? 1 : 2;
                        args.FieldSetDTO.Code = item.name;
                        args.FieldSetDTO.Name = item.text;
                        if (item.iconCls == 'icon-ok') {
                            if (gridType == "datagrid") {
                                $(gridKey).datagrid('hideColumn', item.name);
                            } else if (gridType == "treegrid") {
                                $(gridKey).treegrid('hideColumn', item.name);
                            }
                            cmenu.menu('setIcon', {
                                target: item.target,
                                iconCls: 'icon-empty'
                            });
                            //新增
                            doActionAsync("IWEHAVE.ERP.Auth.ServiceBP.Agent.InsertPageControlBPProxy", args, function (data) { });
                        } else {
                            if (gridType == "datagrid") {
                                $(gridKey).datagrid('showColumn', item.name);
                            } else if (gridType == "treegrid") {
                                $(gridKey).treegrid('showColumn', item.name);
                            }

                            cmenu.menu('setIcon', {
                                target: item.target,
                                iconCls: 'icon-ok'
                            });
                            //删除
                            doActionAsync("IWEHAVE.ERP.Auth.ServiceBP.Agent.DeletePageControlBPProxy", args, function (data) { });

                        }
                    }
                });
                var fieldList = new Array();
                if (gridType == "datagrid") {
                    var opts = $(gridKey).datagrid('options');
                    if (opts) {
                        fieldList = util.ArrayHelper.append(fieldList, util.Grid.getContextMenuItem(opts.frozenColumns));
                        fieldList = util.ArrayHelper.append(fieldList, util.Grid.getContextMenuItem(opts.columns));

                    }
                } else if (gridType == "treegrid") {
                    var opts = $(gridKey).treegrid('options');
                    if (opts) {
                        fieldList = util.ArrayHelper.append(fieldList, util.Grid.getContextMenuItem(opts.frozenColumns));
                        fieldList = util.ArrayHelper.append(fieldList, util.Grid.getContextMenuItem(opts.columns));

                    }
                }
                util.Grid.initCode(gridKey, fieldList, cmenu);
            } else {
                cmenu = $("#" + menuKey);
            }
            return cmenu;


        },
        getContextMenuItem: function (columnsList) {
            var fieldList = new Array();
            if (columnsList) {
                var maxRowspan = 1;
                $.each(columnsList, function (i, columns) {
                    $.each(columns, function (i, item) {
                        if (item.rowspan) {
                            if (item.rowspan > maxRowspan) {
                                maxRowspan = item.rowspan;
                            }
                        }
                    });
                });
                //查找colspan
                var maxColspan = 1;
                if (maxRowspan <= 1) {
                    $.each(columnsList, function (i, columns) {
                        $.each(columns, function (i, item) {
                            if (item.colspan) {
                                if (item.colspan > maxColspan) {
                                    maxColspan = item.colspan;
                                }
                            }
                        });
                    });
                }

                $.each(columnsList, function (i, columns) {
                    $.each(columns, function (i, item) {
                        if (item.title && item.field) {
                            if (maxColspan <= 1) {
                                if (maxRowspan <= 1) {
                                    fieldList.push(item);
                                } else if (item.rowspan == maxRowspan) {
                                    fieldList.push(item);
                                }
                            }
                        }
                    });
                });

            }
            return fieldList;
        },
        //隐藏列
        hideColumn: function (gridKey, field, gridType) {
            if (gridType == 1) {
                $(gridKey).datagrid('hideColumn', field);
            } else if (gridType == 2) {
                $(gridKey).treegrid('hideColumn', field);
            }
        },
        //显示列
        showColumn: function (gridKey, field, gridType) {
            if (gridType == 1) {
                $(gridKey).datagrid('showColumn', field);
            } else if (gridType == 2) {
                $(gridKey).treegrid('showColumn', field);
            }
        },
        initCode: function (gridKey, fieldList, cmenu) {
            if (util.Grid.pageControlList) {
                var hideColumn = new Array(); //需要隐藏的列
                $.each(util.Grid.pageControlList, function (i, item) {
                    if (item.FieldSets) {
                        $.each(item.FieldSets, function (j, field) {
                            util.Grid.hideColumn(item.ControlCode, field.Code, item.ControlType);
                            hideColumn.push(field.Code);
                        });
                    }
                });
                initMenu(cmenu, fieldList, hideColumn);
            } else {
                initMenu(cmenu, fieldList);
            }
            function initMenu(cmenu, fieldList, hideColumn) {
                for (var i = 0; i < fieldList.length; i++) {
                    var col = fieldList[i];
                    var icon = 'icon-ok';
                    if (hideColumn) {
                        $.each(hideColumn, function (i, item) {
                            if (item == col.field) {
                                icon = 'icon-empty';
                            }
                        });
                    }
                    cmenu.menu('appendItem', {
                        text: col.title,
                        name: col.field,
                        iconCls: icon
                    });

                }
            }


        },
        reset: function () {
            var pageGuid = window.$PageGuid;
            if (pageGuid) {
                doActionAsync("IWEHAVE.ERP.Auth.ServiceBP.Agent.GetPageControlBPProxy", { PageGUID: pageGuid }, function (data) {
                    if (data) {
                        util.Grid.pageControlList = data;
                        $.each(data, function (i, item) {
                            if (item.FieldSets) {
                                $.each(item.FieldSets, function (j, field) {
                                    util.Grid.hideColumn(item.ControlCode, field.Code, item.ControlType);
                                });
                            }
                        });
                    }
                });

            }
        }
    },
    IFrame: {
        execIFrameFunc: function (ifr, funcName, param, callback) {
            try {
                var curWin = ifr.contentWindow;
                if (curWin) {
                    var func = curWin[funcName];
                    if (func != null) {
                        try {
                            if (param != null) {
                                func.call(curWin, param, callback);
                            } else {
                                func.call(curWin, callback);
                            }
                        }
                        catch (ex) {
                        }
                    } else if (callback) {
                        callback({ success: true });
                    }
                }
            } catch (ex) {

            }
        }
    },
    Page: {
        pageIndex: 1,
        pageSize: 10,
        pageSize2: 20,
        pageSize3: 5
    },
    ArrayHelper: {
        //重写Array原型方法
        removeAt: function (array, n) {
            //n表示第几项，从0开始算起。
            if (n < 0)//如果n<0，则不进行任何操作。
                return array;
            else
                return array.slice(0, n).concat(array.slice(n + 1, array.length));
            /*
　　　concat方法：返回一个新数组，这个新数组是由两个或更多数组组合而成的。
　　　　　　　　　这里就是返回this.slice(0,n)/this.slice(n+1,this.length)
　　 　　　　　　组成的新数组，这中间，刚好少了第n项。
　　　slice方法： 返回一个数组的一段，两个参数，分别指定开始和结束的位置。
　　*/
        },
        remove: function (array, v, compare) {//n表示第几项，从0开始算起。
            var index = -1;
            for (var i = 0; i < array.length; i++) {
                if (compare != null) {
                    if (compare(array[i], v)) {
                        index = i;
                        break;
                    }
                }
                else {
                    if (array[i] == v) {
                        index = i;
                        break;
                    }
                }
            }
            return util.ArrayHelper.removeAt(array, index);
        },
        append: function (array, newArray) {
            if (newArray) {
                return array.concat(newArray);
            } else {
                return array;
            }
        }
    },
    Guid: {
        New: function () {
            var guid = "";
            for (var i = 1; i <= 32; i++) {
                var n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
                if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                    guid += "-";
            }
            return guid;
        }
    },
    ImagePreview: {
        getNum: function (w) {
            if (w.indexOf("px") >= 0) {
                return w.substring(0, w.length - 2);
            }
            return w;
        },
        show: function (url) {
            //不存在则添加
            if ($(".imagePreview").length == 0) {
                var tpl = "<img title='点击空白区域关闭预览……' class='imagePreview hide' width='735' height='405'/>"
                $("body").append(tpl);
                $("img.imagePreview").bind("mousewheel", function (e, delta) {
                    if (e.wheelDelta) {
                        delta = e.wheelDelta;
                    } else if (e.originalEvent) {
                        delta = e.originalEvent.wheelDelta;
                    }
                    var w = util.ImagePreview.getNum($("img.imagePreview").css("width"));
                    var h = util.ImagePreview.getNum($("img.imagePreview").css("height"));
                    var t = util.ImagePreview.getNum($("img.imagePreview").css("top"));
                    var l = util.ImagePreview.getNum($("img.imagePreview").css("left"));
                    var nW = (w * 1.2);
                    var nH = (h * 1.2);
                    if (delta > 0) {
                        nW = w * 1.2;
                        nH = h * 1.2;
                    }
                    else {
                        nW = w / 1.2;
                        nH = h / 1.2;
                    }
                    $("img.imagePreview").animate({
                        width: nW + "px",
                        height: nH + "px",
                        top: (t - (nH - h) / 2) + "px",
                        left: (l - (nW - w) / 2) + "px"
                    }, 100);
                    return false;
                });

                var nn6 = document.getElementById && !document.all;
                var isDrag = false;
                var y, x, nTX, nTY;
                var oDragObj;

                function moveMouse(e) {
                    if (isDrag) {
                        oDragObj.style.top = (nn6 ? nTY + e.clientY - y : nTY + event.clientY - y) + "px";
                        oDragObj.style.left = (nn6 ? nTX + e.clientX - x : nTX + event.clientX - x) + "px";
                        return false;
                    }
                }

                function dragDown(e) {
                    var oDragHandle = nn6 ? e.target : event.srcElement;
                    if ($(oDragHandle).hasClass("imagePreview") && !$(oDragHandle).hasClass("hide")) {
                        isDrag = true;
                        oDragObj = oDragHandle;
                        nTY = parseInt(oDragObj.style.top + 0);
                        y = nn6 ? e.clientY : event.clientY;
                        nTX = parseInt(oDragObj.style.left + 0);
                        x = nn6 ? e.clientX : event.clientX;
                        document.onmousemove = moveMouse;
                        return false;
                    }
                }
                document.onmousedown = dragDown;
                document.onmouseup = function () {
                    isDrag = false;
                }

            }
            $("div.loadingPanel").removeClass("hide");
            var w = 735;
            var h = 405;
            setTimeout(function () {
                $("div.loadingPanel").removeClass("hide");
                if (url) {
                    $("img.imagePreview").attr("src", url).removeClass("hide");
                    $("img.imagePreview").animate({
                        width: w + "px",
                        height: h + "px"
                    }, 50);
                } else {
                    w = util.ImagePreview.getNum($("img.imagePreview").css("width"));
                    h = util.ImagePreview.getNum($("img.imagePreview").css("height"));
                }
                var width = document.body.clientWidth;
                var height = document.body.clientHeight;

                if (width > w && height > h) {
                    $("img.imagePreview").css("left", (width - w) / 2 + "px");
                    $("img.imagePreview").css("top", (height - h) / 2 + "px");
                }
                $("img.imagePreview").removeClass("hide");
                $("img.imagePreview").css("display", "block");
            }, 1);
        },
        hide: function () {
            $("div.loadingPanel").addClass("hide");
            $("img.imagePreview").addClass("hide");
            $("img.imagePreview").css("display", "none");
        }
    },
    LoadMark: {
        LoadCount: 0,
        Show: function (w) {
            if ($(".loadingMark").length == 0) {
                var tpl = "<div class='loadingMark hide'></div>"
                $("body").append(tpl);
            }
            util.ImagePreview.hide();
            util.LoadMark.LoadCount++;
            if (util.LoadMark.LoadCount == 1) {
                setTimeout(function () {
                    var width = document.body.clientWidth;
                    var height = document.body.clientHeight;
                    if (w) {
                        $("div.loadingMark").css("width", w + "px");
                    }
                    $("div.loadingMark").css("left", (width - 100) / 2 + "px");
                    $("div.loadingMark").css("top", (height - 23) / 2 + "px");
                    $("div.loadingPanel").removeClass("hide");
                    $("div.loadingMark").removeClass("hide");
                }, 1);
            }
        },
        Hide: function (t) {
            $(".imagePreview").addClass("hide");
            $("img.imagePreview").css("display", "none");
            util.LoadMark.LoadCount--;
            if (util.LoadMark.LoadCount < 0) {
                util.LoadMark.LoadCount = 0;
            }
            if (util.LoadMark.LoadCount == 0) {
                if (t >= 0) {
                    if (t > 0) {
                        setTimeout(function () {
                            $("div.loadingPanel").addClass("hide");
                            $("div.loadingMark").addClass("hide");
                        }, t);
                    } else {
                        $("div.loadingPanel").addClass("hide");
                        $("div.loadingMark").addClass("hide");
                    }
                } else {
                    setTimeout(function () {
                        $("div.loadingPanel").addClass("hide");
                        $("div.loadingMark").addClass("hide");
                    }, 50);
                }
            }

        }
    },
    Navigator: {
        //获取浏览器地址传过来的值
        getUrlParam: function (p) {
            var val = "";
            var param = window.location.search;
            param = param.substring(1);
            params = param.split("&");
            $.each(params, function () {
                var m = this.split("=");
                if (m.length == 2) {
                    if (m[0].toLowerCase() == p.toLowerCase())
                        val = m[1];
                }
            });
            return val;
        }
    },
    DateTime: {
        getMonthLastDay: function (year, month) {
            var new_date = new Date(year, month, 1);                //取当年当月中的第一天        
            var lastDay = (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期
            return year + "-" + month + "-" + lastDay;
        },
        jsonStrToDateTime: function (date) {
            if (date) {
                date = new Date(parseInt(date.replace("/Date(", "").replace(")/", "")));
                date = util.DateTime.Formater("yyyy-MM-dd hh:mm:ss", date);
                date = date.substr(0, date.toString().lastIndexOf(":"));
                return date;
            } else {
                return "";
            }
        },
        jsonStrToDate: function (date, str) {
            if (date) {
                date = new Date(parseInt(date.replace("/Date(", "").replace(")/", "")));
                date = util.DateTime.formater(str, date);
                return date;
            } else {
                return "";
            }
        },
        formater: function (fmtCode, date) {
            function splitDate(d, isZero) {
                var yyyy, MM, dd, hh, mm, ss;
                if (isZero) {
                    yyyy = d.getFullYear();
                    MM = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
                    dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
                    hh = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
                    mm = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
                    ss = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
                } else {
                    yyyy = d.getFullYear();
                    MM = d.getMonth() + 1;
                    dd = d.getDate();
                    hh = d.getHours();
                    mm = d.getMinutes();
                    ss = d.getSeconds();
                }
                return { "yyyy": yyyy, "MM": MM, "dd": dd, "hh": hh, "mm": mm, "ss": ss };
            }

            var result, d, arr_d;

            var patrn_now_1 = /^y{4}-M{2}-d{2}\sh{2}:m{2}:s{2}$/;
            var patrn_now_11 = /^y{4}-M{1,2}-d{1,2}\sh{1,2}:m{1,2}:s{1,2}$/;

            var patrn_now_2 = /^y{4}\/M{2}\/d{2}\sh{2}:m{2}:s{2}$/;
            var patrn_now_22 = /^y{4}\/M{1,2}\/d{1,2}\sh{1,2}:m{1,2}:s{1,2}$/;

            var patrn_now_3 = /^y{4}年M{2}月d{2}日\sh{2}时m{2}分s{2}秒$/;
            var patrn_now_33 = /^y{4}年M{1,2}月d{1,2}日\sh{1,2}时m{1,2}分s{1,2}秒$/;

            var patrn_date_1 = /^y{4}-M{2}-d{2}$/;
            var patrn_date_11 = /^y{4}-M{1,2}-d{1,2}$/;

            var patrn_date_2 = /^y{4}\/M{2}\/d{2}$/;
            var patrn_date_22 = /^y{4}\/M{1,2}\/d{1,2}$/;

            var patrn_date_3 = /^y{4}年M{2}月d{2}日$/;
            var patrn_date_33 = /^y{4}年M{1,2}月d{1,2}日$/;

            var patrn_time_1 = /^h{2}:m{2}:s{2}$/;
            var patrn_time_11 = /^h{1,2}:m{1,2}:s{1,2}$/;
            var patrn_time_2 = /^h{2}时m{2}分s{2}秒$/;
            var patrn_time_22 = /^h{1,2}时m{1,2}分s{1,2}秒$/;

            if (!fmtCode) { fmtCode = "yyyy/MM/dd hh:mm:ss"; }
            if (date) {
                d = new Date(date);
                if (isNaN(d)) {
                    return "";
                }
            } else {
                d = new Date();
            }

            if (patrn_now_1.test(fmtCode)) {
                arr_d = splitDate(d, true);
                result = arr_d.yyyy + "-" + arr_d.MM + "-" + arr_d.dd + " " + arr_d.hh + ":" + arr_d.mm + ":" + arr_d.ss;
            }
            else if (patrn_now_11.test(fmtCode)) {
                arr_d = splitDate(d);
                result = arr_d.yyyy + "-" + arr_d.MM + "-" + arr_d.dd + " " + arr_d.hh + ":" + arr_d.mm + ":" + arr_d.ss;
            }
            else if (patrn_now_2.test(fmtCode)) {
                arr_d = splitDate(d, true);
                result = arr_d.yyyy + "/" + arr_d.MM + "/" + arr_d.dd + " " + arr_d.hh + ":" + arr_d.mm + ":" + arr_d.ss;
            }
            else if (patrn_now_22.test(fmtCode)) {
                arr_d = splitDate(d);
                result = arr_d.yyyy + "/" + arr_d.MM + "/" + arr_d.dd + " " + arr_d.hh + ":" + arr_d.mm + ":" + arr_d.ss;
            }
            else if (patrn_now_3.test(fmtCode)) {
                arr_d = splitDate(d, true);
                result = arr_d.yyyy + "年" + arr_d.MM + "月" + arr_d.dd + "日" + " " + arr_d.hh + "时" + arr_d.mm + "分" + arr_d.ss + "秒";
            }
            else if (patrn_now_33.test(fmtCode)) {
                arr_d = splitDate(d);
                result = arr_d.yyyy + "年" + arr_d.MM + "月" + arr_d.dd + "日" + " " + arr_d.hh + "时" + arr_d.mm + "分" + arr_d.ss + "秒";
            }

            else if (patrn_date_1.test(fmtCode)) {
                arr_d = splitDate(d, true);
                result = arr_d.yyyy + "-" + arr_d.MM + "-" + arr_d.dd;
            }
            else if (patrn_date_11.test(fmtCode)) {
                arr_d = splitDate(d);
                result = arr_d.yyyy + "-" + arr_d.MM + "-" + arr_d.dd;
            }
            else if (patrn_date_2.test(fmtCode)) {
                arr_d = splitDate(d, true);
                result = arr_d.yyyy + "/" + arr_d.MM + "/" + arr_d.dd;
            }
            else if (patrn_date_22.test(fmtCode)) {
                arr_d = splitDate(d);
                result = arr_d.yyyy + "/" + arr_d.MM + "/" + arr_d.dd;
            }
            else if (patrn_date_3.test(fmtCode)) {
                arr_d = splitDate(d, true);
                result = arr_d.yyyy + "年" + arr_d.MM + "月" + arr_d.dd + "日";
            }
            else if (patrn_date_33.test(fmtCode)) {
                arr_d = splitDate(d);
                result = arr_d.yyyy + "年" + arr_d.MM + "月" + arr_d.dd + "日";
            }
            else if (patrn_time_1.test(fmtCode)) {
                arr_d = splitDate(d, true);
                result = arr_d.hh + ":" + arr_d.mm + ":" + arr_d.ss;
            }
            else if (patrn_time_11.test(fmtCode)) {
                arr_d = splitDate(d);
                result = arr_d.hh + ":" + arr_d.mm + ":" + arr_d.ss;
            }
            else if (patrn_time_2.test(fmtCode)) {
                arr_d = splitDate(d, true);
                result = arr_d.hh + "时" + arr_d.mm + "分" + arr_d.ss + "秒";
            }
            else if (patrn_time_22.test(fmtCode)) {
                arr_d = splitDate(d);
                result = arr_d.hh + "时" + arr_d.mm + "分" + arr_d.ss + "秒";
            }
            else {
                alert("没有匹配的时间格式!");
                return;
            }

            return result;
        },
        strToDate: function (str) {
            var dependedVal = str;
            //根据日期字符串转换成日期  
            var regEx = new RegExp("\\-", "gi");
            dependedVal = dependedVal.replace(regEx, "/");
            var milliseconds = Date.parse(dependedVal);
            var dependedDate = new Date(milliseconds);
            return dependedDate;
        },
        StrToDate1: function (date, str) {
            if (date) {
                date = new Date(parseInt(date.replace("/Date(", "").replace(")/", "")));
                date = util.DateTime.formater(str, date);
                return date;
            } else {
                return "";
            }
        },
        daysDiffer: function (startTime, endTime) {
            var sArr, eArr;
            if (startTime.toString().indexOf("/") > -1) {
                sArr = startTime.split("/");
            } else if (startTime.toString().indexOf("-") > -1) {
                sArr = startTime.split("-");
            }
            if (endTime.toString().indexOf("/") > -1) {
                eArr = endTime.split("/");
            } else if (endTime.toString().indexOf("-") > -1) {
                eArr = endTime.split("-");
            }
            var sRDate = new Date(sArr[0], sArr[1], sArr[2]);
            var eRDate = new Date(eArr[0], eArr[1], eArr[2]);
            var result = (eRDate - sRDate) / (24 * 60 * 60 * 1000) + 1;
            return result;
        },
        compareDate: function (date1, date2) {
            return ((Date.parse(date1)) > (Date.parse(date2)));
        }
    },
    Clone: function (obj) {
        //jQuery实现
        var newObject = jQuery.extend(true, {}, obj);
        return newObject;
        //js实现
        //        var type = typeof obj;

        //        if ('object' == type) {
        //            var args = {};
        //            for (attr in obj) {
        //                args[attr] = util.Clone(obj[attr]);
        //            }
        //            return args;
        //        } else if ('array' == type) {
        //            var args = new Array();
        //            for (var i = 0; i < obj.length; i++) {

        //                var value = util.Clone(obj[i]);
        //                if (value !== undefined) args.push(value);
        //            }
        //            return args;

        //        } else if ('string' == type) {
        //            var args = '' + obj.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function () {
        //                var a = arguments[0];
        //                return (a == '\n') ? '\\n' : (a == '\r') ? '\\r' : (a == '\t') ? '\\t' : ""
        //            }) + '';
        //            return args;
        //        }
        //        else {
        //            return obj;
        //        }
    },
    eraseNull: function (obj) {
        if (obj != null) {
            var type = typeof obj;
            if ('object' == type) {
                for (attr in obj) {
                    obj[attr] = util.eraseNull(obj[attr]);
                }
                return obj;
            } else if ('array' == type) {
                for (var i = 0; i < obj.length; i++) {
                    obj[i] = util.eraseNull(obj[i]);
                }
            }
        } else {
            obj = "";
        }
        return obj;
    }
}
function delegate(obj, callback) {
    return function () {
        if (obj) {
            callback.apply(obj, arguments);
        }
    }
}

//+---------------------------------------------------
//| 日期计算
//+---------------------------------------------------
Date.prototype.DateAdd = function (strInterval, Number) {
    var dtTmp = this;
    switch (strInterval) {
        case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));
        case 'n': return new Date(Date.parse(dtTmp) + (60000 * Number));
        case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));
        case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));
        case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
        case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
}


/*农历部分*/

var CalendarData = new Array(100);
var madd = new Array(12);
var tgString = "甲乙丙丁戊己庚辛壬癸";
var dzString = "子丑寅卯辰巳午未申酉戌亥";
var numString = "一二三四五六七八九十";
var monString = "正二三四五六七八九十冬腊";
var weekString = "日一二三四五六";
var sx = "鼠牛虎兔龙蛇马羊猴鸡狗猪";
var cYear, cMonth, cDay, TheDate;
CalendarData = new Array(0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96, 0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A, 0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA, 0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA, 0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D, 0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B, 0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F, 0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96, 0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95, 0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95);
madd[0] = 0;
madd[1] = 31;
madd[2] = 59;
madd[3] = 90;
madd[4] = 120;
madd[5] = 151;
madd[6] = 181;
madd[7] = 212;
madd[8] = 243;
madd[9] = 273;
madd[10] = 304;
madd[11] = 334;

function GetBit(m, n) {
    return (m >> n) & 1;
}
function e2c() {
    TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
    var total, m, n, k;
    var isEnd = false;
    var tmp = TheDate.getYear();
    if (tmp < 1900) {
        tmp += 1900;
    }
    total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;

    if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
        total++;
    }
    for (m = 0; ; m++) {
        k = (CalendarData[m] < 0xfff) ? 11 : 12;
        for (n = k; n >= 0; n--) {
            if (total <= 29 + GetBit(CalendarData[m], n)) {
                isEnd = true; break;
            }
            total = total - 29 - GetBit(CalendarData[m], n);
        }
        if (isEnd) break;
    }
    cYear = 1921 + m;
    cMonth = k - n + 1;
    cDay = total;
    if (k == 12) {
        if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
            cMonth = 1 - cMonth;
        }
        if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
            cMonth--;
        }
    }
}

function GetcDateString() {
    var tmp = "";
    //    tmp += tgString.charAt((cYear - 4) % 10);
    //    tmp += dzString.charAt((cYear - 4) % 12);
    //    tmp += "(";
    //    tmp += sx.charAt((cYear - 4) % 12);
    //    tmp += ")年 ";
    if (cMonth < 1) {
        tmp += "(闰)";
        tmp += monString.charAt(-cMonth - 1);
    } else {
        tmp += monString.charAt(cMonth - 1);
    }
    tmp += "月";
    tmp += (cDay < 11) ? "初" : ((cDay < 20) ? "十" : ((cDay < 30) ? "廿" : "三十"));
    if (cDay % 10 != 0 || cDay == 10) {
        tmp += numString.charAt((cDay - 1) % 10);
    }
    return tmp;
}

function GetLunarDay(solarYear, solarMonth, solarDay) {
    //solarYear = solarYear<1900?(1900+solarYear):solarYear;
    if (solarYear < 1921 || solarYear > 2020) {
        return "";
    } else {
        solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
        e2c(solarYear, solarMonth, solarDay);
        return GetcDateString();
    }
}

// 计算当前日期在本年度的周数
Date.prototype.getWeekOfYear = function (weekStart) { // weekStart：每周开始于周几：周日：0，周一：1，周二：2 ...，默认为周日
    weekStart = (weekStart || 0) - 0;
    if (isNaN(weekStart) || weekStart > 6)
        weekStart = 0;
    var year = this.getFullYear();
    var firstDay = new Date(year, 0, 1);
    var firstWeekDays = 7 - firstDay.getDay() + weekStart;
    var dayOfYear = (((new Date(year, this.getMonth(), this.getDate())) - firstDay) / (24 * 3600 * 1000)) + 1;
    return Math.ceil((dayOfYear - firstWeekDays) / 7) + 1;
}
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};


$(document).keydown(function (e) {
    var ev = window.event || e;
    var code = ev.keyCode || ev.which;
    if (code == 116) {
        var topWin = window.top;
        if (topWin.reloadCurrentTab) {
            topWin.reloadCurrentTab();
            if (ev.preventDefault) {
                ev.preventDefault();
            } else {
                ev.keyCode = 0;
                ev.returnValue = false;
            }
        }
    }
});

Auth = {
    splitCode: function (code) {
        var codeArray = code.split("$");
        return codeArray;
    },
    setDisabled: function (key, disabled, menuKey) {
        var authBtn = null;
        if (window.$Auth) {
            for (var i = 0; i < window.$Auth.length; i++) {
                var item = window.$Auth[i];
                if (item.Type != 3) {
                    if (item.Code == key) {
                        authBtn = item;
                        break;
                    }
                } else {
                    if (item.ItemCode == key && item.MenuCode == menuKey) {
                        authBtn = item;
                        break;
                    }
                }
            }
        }
        if (authBtn) {
            if (!authBtn.IsControl) {
                //1按钮，2链接
                if (authBtn.Type == 1) {
                    $("#" + key).linkbutton({ disabled: true });
                } else if (authBtn.Type == 2) {
                    $("#" + key).addClass("hide");
                    // $("#" + key).one("click", function () { $.messager.alert("提示", "你没有执行此操作的权限", "error"); });
                } else if (authBtn.Type == 3) {
                    $("#" + authBtn.MenuCode).menu("disableItem", $("#" + authBtn.ItemCode));
                }
            }
            else {
                //1按钮，2链接
                if (authBtn.Type == 1) {
                    $("#" + key).linkbutton({ disabled: disabled });
                } else if (authBtn.Type == 2) {
                    if (disabled) {
                        $("#" + key).addClass("hide");
                    } else {
                        $("#" + key).removeClass("hide");
                    }
                } else if (authBtn.Type == 3) {
                    if (disabled) {
                        $("#" + authBtn.MenuCode).menu("disableItem", $("#" + authBtn.ItemCode));
                    } else {
                        $("#" + authBtn.MenuCode).menu("enableItem", $("#" + authBtn.ItemCode));
                    }
                }
            }
        } else {
            if (menuKey) {
                if (disabled) {
                    $("#" + menuKey).menu("disableItem", $("#" + key));
                }
                else {
                    $("#" + menuKey).menu("enableItem", $("#" + key));
                }
            }
            else {
                $("#" + key).linkbutton({ disabled: disabled });
            }
        }
    },
    reset: function () {
        if (window.$Auth) {
            $.each(window.$Auth, function (index, item) {
                var key = item.Code;
                if (item.Type == 3) {
                    var codes = Auth.splitCode(key);
                    if (codes.length == 2) {
                        item.MenuCode = codes[0];
                        item.ItemCode = codes[1];
                    }
                }
                if (!item.IsControl) {
                    //1按钮，2链接
                    if (item.Type == 1) {
                        $("#" + key).linkbutton({ disabled: true });
                    } else if (item.Type == 2) {
                        $("#" + key).addClass("hide");
                        //$("#" + key).one("click", function () { $.messager.alert("提示", "你没有执行此操作的权限", "error"); });
                    } else if (item.Type == 3) {
                        $("#" + item.MenuCode).menu("disableItem", $("#" + item.ItemCode));
                    }
                }
            });
        }
    }
}
function GetThemeKeyByUnitCode(unitCode, callback) {
    doActionAsync("IWEHAVE.ERP.GISCenter.ServiceBP.Agent.GetThemeIDByUnitCodeBPProxy", { UnitCode: unitCode }, callback);
}
function FormatParser() {
    return function (s) {
        var t = Date.parse(s);
        if (!isNaN(t)) {
            return new Date(t);
        } else {
            return new Date();
        }
    }
}
function FormatFormatter() {
    return function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        if (m < 10) {
            m = '0' + m;
        }
        if (d < 10) {
            d = '0' + d;
        }
        return y + '/' + m + '/' + d
    }
}