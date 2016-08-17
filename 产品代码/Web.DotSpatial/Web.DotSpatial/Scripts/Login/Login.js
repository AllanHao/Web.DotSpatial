(function ($) {
    $(document).ready(function () {
        Main.fn.initPage();
        Main.data.getValiImg(); //加载验证码
        Main.data.loadOrg(); //加载组织
    });

    Main = {
        fn: {
            initPage: function () {
                //回车事件
                $("body").keypress(function (e) {
                    if (e.keyCode == 13) {
                        Main.data.doLogin();
                    }
                });
                //绑定验证码点击事件
                $("#imgVali").bind("click", Main.data.getValiImg);
                //组织
                $("#orgSelect").combotree({
                    onLoadSuccess: function (node, data) {
                        //默认选中第一个
                        $("#orgSelect").combotree("setValue", data[0].ID);
                    }
                });
            }
        },
        data: {
            getValiImg: function () {
                //获取验证码
                $("#imgVali").attr("src", "./PartHandler/GetValiHandler.ashx?rgimg=" + new Date().getTime());
                //清空验证码输入框
                // $("#userauthcode").val("");
            },
            loadOrg: function () {
                var args = {};
                //args.OrgCode = "YS";
                easyui.tree.getTreeNode("#orgSelect", "IWEHAVE.ERP.Auth.ServiceBP.Agent.GetLoginOrgBPProxy", args, "combotree", Main.data.formatNode, null, function (data) {
                    if (data) {
                        var obj = {};
                        obj.attributes = {};
                        obj.attributes.OrgType = 1;
                        obj.attributes.PId = 0;
                        obj.id = 1;
                        obj.text = "";
                        obj.iconCls = "icon-none";
                        data.push(obj);
                    }
                });
            },
            formatNode: function () {
                this.attributes = {};
                this.attributes.OrgType = this.OrgType;
                this.attributes.PId = this.PID;
                this.id = this.ID;
                this.text = this.OrgName;
                this.iconCls = "icon-org";
                if (!this.Leaf) {
                    this.state = "closed";
                }
            },
            checkData: function () {
                var code = $("#userCode").val();
                var pwd = $("#userPwd").val();
                var auth = $("#userauthcode").val();
                var org = $("#orgSelect").combotree('tree').tree('getSelected');
                if (code == "") {
                    $.messager.alert('温馨提示', '请输入用户名!', 'error', function () {
                        $("#userCode").focus();
                    });

                    return false;
                } else if (pwd == "") {
                    $.messager.alert('温馨提示', '请输入密码!', 'error', function () {
                        $("#userPwd").focus();
                    });

                    return false;
                } else if (code != "admin" && org == null) {
                    $.messager.alert('温馨提示', '请选择组织!', 'error', function () {
                        $("#orgSelect").focus();
                    });
                    return false;
                } else if (auth == "") {
                    $.messager.alert('温馨提示', '请输入验证码!', 'error', function () {
                        $("#userauthcode").focus();
                    });

                    return false;
                }
                return true;
            },
            doLogin: function () {
                if (Main.data.checkData()) {
                    var userCode = $.trim($("#userCode").val());
                    var userPwd = $.trim($("#userPwd").val());
                    var orgId = $("#orgSelect").combotree('tree').tree('getSelected') != null ? $("#orgSelect").combotree('tree').tree('getSelected').id : "1";
                    $.ajax({
                        url: "./PartHandler/ParticularHandler.ashx",
                        type: 'POST',
                        async: true,
                        data: { LOGIN: new Date().getTime(), VCode: $.trim($("#userauthcode").val()), UserCode: userCode, UserPwd: userPwd, Org: orgId },
                        success: function (result) {
                            if (result) {
                                var _data = eval("(" + result + ")");
                                if (_data.Result == "True") {
                                    form1.submit();
                                } else {
                                    $.messager.alert("提示", _data.ErrorEx, "error");
                                    Main.data.getValiImg();
                                    return false;
                                }
                            }
                        },
                        error: function (result) {
                            $.messager.alert("温馨提示", "网络通信故障,请刷新重试!", "error");
                            Main.data.getValiImg();
                            return false;
                        }
                    });
                }
            }
        }
    };
})(jQuery);