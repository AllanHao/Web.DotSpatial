//弹出窗体方法
var DialogManager = {
    fn: {
        init: function () {
            var tpl = "<div id=\"dialogFrame\" style=\"padding:5px;width:400px;height:200px;\">";
            tpl += "<iframe style='width:100%;height:100%' frameborder=no  border=0 >";
            tpl += "</iframe>";
            tpl += "</div>";

            $('body').append(tpl);

            $("#dialogFrame").dialog({
                closed: true,
                modal: true,
                resizable: true,
                minimizable: true,
                maximizable: true,
                buttons: [{
                    id: 'dialogOK',
                    iconCls: 'icon-ok',
                    text: '确定',
                    handler: function () {
                        var result = {};
                        var ifr = $("#dialogFrame iframe")[0];
                        if (ifr) {
                            var curWin = ifr.contentWindow;
                            if (!curWin) { closeDialog(); return; }
                            var callFunc = curWin[DialogManager.args.OK];
                            if (!callFunc) { closeDialog(); return; }
                            var callResult = callFunc("OK");
                            if (callResult === false) {
                                return;
                            }
                            result.returnValue = curWin.returnValue;
                        }
                        result.ActionType = "OK";
                        result.Args = DialogManager.args.Args;
                        DialogManager.callback.OK(result);
                        closeDialog();
                    }
                },
                {
                    id: 'dialogCancel',
                    iconCls: 'icon-cancel',
                    text: '取消',
                    handler: function () {
                        var result = {};
                        var ifr = $("#dialogFrame iframe")[0];
                        if (ifr) {
                            var curWin = ifr.contentWindow;
                            if (!curWin) { closeDialog(); return; }
                            var callFunc = curWin[DialogManager.args.Cancel];
                            if (!callFunc) { closeDialog(); return; }
                            var callResult = callFunc("OK");
                            if (callResult === false) {
                                return;
                            }
                            result.returnValue = curWin.returnValue;
                        }
                        result.ActionType = "Cancel";
                        result.Args = DialogManager.args.Args;
                        DialogManager.callback.Cancel(result);

                        closeDialog();
                    }
                }]
            });
            function closeDialog() {
                $('#dialogFrame').dialog('close');
                dispose();
            }
            function dispose() {
                // $("#dialogFrame iframe").attr("src", "#");
            }
        },
        showDialog: function (paramObj) {
            DialogManager.args.Args = {};
            if (paramObj != null) {
                if (paramObj.url) {
                    if (paramObj.url.indexOf("?") > 0) {
                        paramObj.url += "&"
                    } else {
                        paramObj.url += "?";
                    }
                    paramObj.url += "Dialog=1";
                    $("#dialogFrame iframe").attr("src", paramObj.url);
                }
                if (paramObj.args) {
                    DialogManager.args.Args = paramObj.args;
                }
            }
            paramObj.closed = false;



            var width = $("body").outerWidth();
            var height = $("body").outerHeight()
            var w = $("#dialogFrame").parent().outerWidth();
            var h = $("#dialogFrame").parent().outerHeight();
            paramObj.top = parseInt((height - h) / 2);
            paramObj.left = parseInt((width - w) / 2);

            $("#dialogFrame").dialog(paramObj);
            $("#dialogOK").linkbutton({ disabled: (paramObj.disabledOK == null ? false : paramObj.disabledOK) });

        }
    },
    callback: {
        OK: function (result) { },
        Cancel: function (result) { }

    },
    args: {
        OK: "OnOK",
        Cancel: "OnCancel",
        Args: {}
    }
}
//第一次运行的时候需要注册js到body中去
$(document).ready(function () {
    DialogManager.fn.init();
});

