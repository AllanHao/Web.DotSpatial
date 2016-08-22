<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="OverView.aspx.cs" Inherits="IWEHAVE.ERP.GAIA.Center.Manage.Portal.OverView" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link href="../../Css/themes/default/easyui.css" rel="stylesheet" type="text/css" />
    <link href="../../Css/themes/icon.css" rel="stylesheet" type="text/css" />
    <link href="../../Css/themes/public.css" rel="stylesheet" type="text/css" />
    <script src="../../Scripts/jquery-1.8.0.min.js" type="text/javascript"></script>
    <script src="../../Scripts/jquery.easyui.min.js" type="text/javascript"></script>
    <script src="../../Scripts/jqueryJSON.js" type="text/javascript"></script>
    <script src="../../Scripts/public.js" type="text/javascript"></script>
    <script src="../../Scripts/ControlHelper.js" type="text/javascript"></script>
    <script src="../../Scripts/EasyUIExtend.js" type="text/javascript"></script>
    <script src="../../Scripts/EasyUIHelper.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            UI.fn.initPage();
            UI.fn.data.initData();
        });
        UI = {
            fn: {
                initPage: function () {
                    $("#preApplyList").datagrid({
                        fitColumns: true,
                        rownumbers: true, //是否加行号 
                        singleSelect: true,
                        frozenColumns: [[
                            { field: 'ck', checkbox: true }
                        ]],
                        columns: [[
                            { field: 'ContractNo', title: '合同号', width: 100 },
                            { field: 'Student', title: '学生', width: 100 },
                            { field: 'Counselor', title: '顾问', width: 100 }
                        ]]
                    });

                    $("#preUploadList").datagrid({
                        fitColumns: true,
                        rownumbers: true, //是否加行号 
                        singleSelect: true,
                        frozenColumns: [[
                            { field: 'ck', checkbox: true }
                        ]],
                        columns: [[
                            { field: 'ContractNo', title: '合同号', width: 100 },
                            { field: 'Student', title: '学生', width: 100 },
                             { field: 'School', title: '学校', width: 100 },
                             {
                                 field: 'SendTime', title: '申请时间', width: 100, formatter: function (value) {
                                     if (value) {
                                         return Util.DateTime.DateToStr(value, "yyyy-MM-dd");
                                     }
                                 }
                             }
                        ]]
                    });

                    $("#preVisaList").datagrid({
                        fitColumns: true,
                        rownumbers: true, //是否加行号 
                        singleSelect: true,
                        frozenColumns: [[
                            { field: 'ck', checkbox: true }
                        ]],
                        columns: [[
                            { field: 'ContractNo', title: '合同号', width: 100 },
                            { field: 'Student', title: '学生', width: 100 },
                            {
                                field: 'CASDate', title: 'CAS时间', width: 100, formatter: function (value) {
                                    if (value) {
                                        return Util.DateTime.DateToStr(value, "yyyy-MM-dd");
                                    }
                                }
                            },
                            {
                                field: 'LangDate', title: '语言课时间', width: 100, formatter: function (value) {
                                    if (value) {
                                        return Util.DateTime.DateToStr(value, "yyyy-MM-dd");
                                    }
                                }
                            },
                            {
                                field: 'CourseDate', title: '正式课时间', width: 100, formatter: function (value) {
                                    if (value) {
                                        return Util.DateTime.DateToStr(value, "yyyy-MM-dd");
                                    }
                                }
                            }
                        ]]
                    });

                    $("#dangerVisaList").datagrid({
                        fitColumns: true,
                        rownumbers: true, //是否加行号 
                        singleSelect: true,
                        frozenColumns: [[
                            { field: 'ck', checkbox: true }
                        ]],
                        columns: [[
                            { field: 'ContractNo', title: '合同号', width: 100 },
                            { field: 'Student', title: '学生', width: 100 },
                            {
                                field: 'CASDate', title: 'CAS时间', width: 100, formatter: function (value) {
                                    if (value) {
                                        return Util.DateTime.DateToStr(value, "yyyy-MM-dd");
                                    }
                                }
                            },
                            {
                                field: 'LangDate', title: '语言课时间', width: 100, formatter: function (value) {
                                    if (value) {
                                        return Util.DateTime.DateToStr(value, "yyyy-MM-dd");
                                    }
                                }
                            },
                            {
                                field: 'CourseDate', title: '正式课时间', width: 100, formatter: function (value) {
                                    if (value) {
                                        return Util.DateTime.DateToStr(value, "yyyy-MM-dd");
                                    }
                                }
                            }
                        ]]
                    });
                },
                data: {
                    initData: function () {
                        var args = {};
                        args.pageIndex = Util.Page.pageIndex;
                        args.pageSize = Util.Page.pageSize;
                        GetDataGridList($("#preApplyList"), args, "IWEHAVE.ERP.CenterBP.Agent.GetPreApplyStudentBPProxy");
                        GetDataGridList($("#preUploadList"), args, "IWEHAVE.ERP.CenterBP.Agent.GetPreUploadStudentBPProxy");
                        GetDataGridList($("#preVisaList"), args, "IWEHAVE.ERP.CenterBP.Agent.GetPreVisaStudentBPProxy");
                        GetDataGridList($("#dangerVisaList"), args, "IWEHAVE.ERP.CenterBP.Agent.GetDangerStudentBPProxy");
                    }
                }
            }
        }
    </script>

</head>
<body class="easyui-layout">
    <form id="form1" runat="server">
        <div data-options="region:'center',split:false">
            <div class="easyui-layout" data-options="fit:true">
                <div data-options="region:'center' " style="overflow: hidden;" title="待申请学生" iconcls="icon-user">
                    <table id="preApplyList" class="easyui-datagrid" data-options="fit:true,border:false" pagination="true">
                    </table>
                </div>
                <div data-options="region:'east',split:true,width:0.5,collapsed:true" title="待传材料学生" iconcls="icon-user">
                    <table id="preUploadList" class="easyui-datagrid" data-options="fit:true,border:false" pagination="true">
                    </table>
                </div>
            </div>

        </div>
        <div data-options="region:'south',split:true,height:0.5,collapsed:true " iconcls="icon-user" title="待递签学生">
            <div class="easyui-layout" data-options="fit:true">
                <div data-options="region:'center' " style="overflow: hidden;">
                    <table id="preVisaList" class="easyui-datagrid" data-options="fit:true,border:false" pagination="true">
                    </table>
                </div>
                <div data-options="region:'east',split:true,width:0.5   ">
                    <table id="dangerVisaList" class="easyui-datagrid" data-options="fit:true,border:false" pagination="true">
                    </table>
                </div>
            </div>
        </div>
    </form>
</body>
</html>
