<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Web.DotSpatial.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link href="Scripts/easyui1.4.4/themes/gray/easyui.css" rel="stylesheet" />
    <link href="Scripts/easyui1.4.4/themes/icon.css" rel="stylesheet" />
    <link href="Scripts/easyui1.4.4/themes/gray/easyui.customer.css" rel="stylesheet" />
    <link href="Scripts/easyui1.4.4/themes/public.css" rel="stylesheet" />
    <script src="Scripts/jquery-1.7.1.min.js"></script>
    <script src="Scripts/easyui1.4.4/jquery.easyui.min.js"></script>
    <script src="Scripts/easyui1.4.4/jquery.easyui.util.js"></script>
    <script src="Scripts/OpenLayers/ol.include.js"></script>
    <script src="Scripts/public.js"></script>
    <style type="text/css">
        .btnSelectedClass {
            background-color: gray;
        }
    </style>
    <script type="text/javascript">
        $(document).ready(function () {
            var mapWin = new MapManager.MapControl("map1");
            if (mapWin) {
                mapWin.LoadMap();
            }
            $("#btnPoint").click(function () {
                if ($("#btnPoint").hasClass("btnSelectedClass")) {
                    if (mapWin && mapWin.pointDraw) {
                        mapWin.map.removeInteraction(mapWin.pointDraw);
                        $("#btnPoint").removeClass("btnSelectedClass");
                    }

                } else {
                    if (mapWin && mapWin.pointDraw) {
                        mapWin.map.addInteraction(mapWin.pointDraw);
                        $("#btnPoint").addClass("btnSelectedClass");
                    }
                }
            });
            $("#btnLine").click(function () {
                if ($("#btnLine").hasClass("btnSelectedClass")) {
                    if (mapWin && mapWin.lineDraw) {
                        mapWin.map.removeInteraction(mapWin.lineDraw);
                        $("#btnLine").removeClass("btnSelectedClass");
                    }

                } else {
                    if (mapWin && mapWin.lineDraw) {
                        mapWin.map.addInteraction(mapWin.lineDraw);
                        $("#btnLine").addClass("btnSelectedClass");
                    }
                }
            });
            $("#btnRegion").click(function () {
                if ($("#btnRegion").hasClass("btnSelectedClass")) {
                    if (mapWin && mapWin.regionDraw) {
                        mapWin.map.removeInteraction(mapWin.regionDraw);
                        $("#btnRegion").removeClass("btnSelectedClass");
                    }

                } else {
                    if (mapWin && mapWin.regionDraw) {
                        mapWin.map.addInteraction(mapWin.regionDraw);
                        $("#btnRegion").addClass("btnSelectedClass");
                    }
                }
            });
        });
    </script>
</head>
<body class="easyui-layout">
    <form id="form1" runat="server">
        <div data-options="region:'center',split:false">
            <div data-options="region:'center' " style="overflow: hidden;">
                <div id="map1" style="width: 100%; height: 100%"></div>
            </div>
        </div>
        <div data-options="region:'east',split:true " style="width: 200px">
            <ul id="btnList">
                <li>
                    <input id="btnPoint" type="button" value="画点" />

                </li>
                <li>
                    <input id="btnLine" type="button" value="画线" />

                </li>
                <li>
                    <input id="btnRegion" type="button" value="画面" />

                </li>
            </ul>
        </div>
    </form>
</body>
</html>
