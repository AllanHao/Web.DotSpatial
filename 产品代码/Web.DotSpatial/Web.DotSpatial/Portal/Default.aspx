<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="IWEHAVE.ERP.GAIA.Center.Manage.Portal.Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>首页</title>
    <link href="../../Scripts/easyui1.4.4/themes/gray/easyui.css" rel="stylesheet" />
    <link href="../../Scripts/easyui1.4.4/themes/icon.css" rel="stylesheet" />
    <link href="css/default.css" rel="stylesheet" />
    <script src="../../Scripts/jquery-1.8.0.min.js" type="text/javascript"></script>
    <script src="../../Scripts/easyui1.4.4/jquery.easyui.min.js" type="text/javascript"></script>
    <script src="../../Scripts/easyui1.4.4/easyui-lang-zh_CN.js" type="text/javascript"></script>
    <script src="../../Scripts/public.js" type="text/javascript"></script>
    <script src="../../Scripts/jqueryJSON.js" type="text/javascript"></script>
    <script src="Layout.js" type="text/javascript"></script>
</head>
<body class="easyui-layout">
    <div data-options="region:'north',border:'false',height:'50'" class="main-top" style="color: #fff; background: rgb(74, 91, 121);">
        <div class="head-left">
            <img class="logo" src="../../Images/top-left.png" /><span>合同管理系统 V2.0 </span>
        </div>
        <div class="head-right">
            <div class="top-text">
                <div class="topbt">

                    <span class="topcancel"></span><a id="sysExit">安全退出</a>
                </div>
            </div>
            <div id="calender" class="top-text" style="width: 320px; cursor: pointer;">
            </div>

        </div>
    </div>
    <div data-options="region:'center'" title="">
        <div class="easyui-tabs" fit="true" border="false" id="tabs">
            <div title="客户管控系统合同">
                <iframe style='width: 100%; height: 100%' frameborder='0' src='../Motivation/ClientContractManage.aspx'></iframe>
            </div>
        </div>
    </div>
    <div data-options="region:'west',width:200,split:true" title="菜单列表">
        <div class="easyui-accordion" id="menuAccordion" fit="true" border="false">

            <div title="合同管理" selected="false">
                <ul class="ul-menu">
                    <li class="ul-menu-item icon-unique" url="/Manage/Motivation/CooContractManage.aspx">国内合作</li>
                    <li class="ul-menu-item icon-form" url="/Manage/Motivation/ClientContractManage.aspx">客户管控</li>
                </ul>
            </div>
            <div title="用户管理" selected="false">
                <ul class="ul-menu">
                    <li class="ul-menu-item icon-lock" url="/Manage/Project/UserInfo.aspx">登录用户</li>
                </ul>
            </div>
            <%-- <div title="企业联系信息">//公司主页留言用
                <ul class="ul-menu">
                    <li class="ul-menu-item icon-lock" url="/Manage/EnterpriseContactMgr/EnterpriseContactList.aspx">企业联系信息</li>
                </ul>
            </div>--%>
        </div>
    </div>
    <div data-options="region:'south',border:false">
        <div id="footer" class="cs-south" style="height: 25px;">
            <div class="footer-number" style="width: 30%; text-align: left; float: left; line-height: 25px;">
                <span style="padding-left: 5px;"></span>技术支持：<a href="http://www.blessing.wang" target="_blank"
                    style="color: white;">Allan.Hao</a>
            </div>
            <div class="footer-number" style="width: 40%; text-align: center; float: left; line-height: 25px; color: #fff;">
                CopyRight © 2014 - 2016 By Allan.Hao
            </div>
            <div class="clear">
            </div>
        </div>
    </div>
    <div id="tabsMenu" class="easyui-menu" style="width: 120px;">
        <div name="close">
            关闭
        </div>
        <div name="Other">
            关闭其他
        </div>
        <div name="All">
            关闭所有
        </div>
    </div>
</body>
</html>
