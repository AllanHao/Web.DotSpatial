<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Web.DotSpatial.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link href="Portal/css/default.css" rel="stylesheet" />
    <link href="Scripts/easyui1.4.4/themes/gray/easyui.css" rel="stylesheet" />
    <link href="Scripts/easyui1.4.4/themes/icon.css" rel="stylesheet" />
    <link href="Scripts/easyui1.4.4/themes/gray/easyui.customer.css" rel="stylesheet" />
    <link href="Scripts/easyui1.4.4/themes/public.css" rel="stylesheet" />
    <script src="Scripts/jquery-1.7.1.min.js"></script>
    <script src="Scripts/easyui1.4.4/jquery.easyui.min.js"></script>
    <script src="Scripts/easyui1.4.4/jquery.easyui.util.js"></script>
    <script src="Scripts/jqueryJSON.js"></script>
    <script src="Scripts/OpenLayers/ol.include.js"></script>
    <script src="Scripts/public.js"></script>
    <style type="text/css">
        .btnSelectedClass {
            background-color: gray;
        }

        .ol-popup {
            position: absolute;
            background-color: white;
            -webkit-filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
            filter: drop-shadow(0 1px 4px rgba(0,0,0,0.2));
            padding: 15px;
            border-radius: 10px;
            border: 1px solid #cccccc;
            bottom: 12px;
            left: -50px;
            min-width: 280px;
        }

            .ol-popup:after, .ol-popup:before {
                top: 100%;
                border: solid transparent;
                content: " ";
                height: 0;
                width: 0;
                position: absolute;
                pointer-events: none;
            }

            .ol-popup:after {
                border-top-color: white;
                border-width: 10px;
                left: 48px;
                margin-left: -10px;
            }

            .ol-popup:before {
                border-top-color: #cccccc;
                border-width: 11px;
                left: 48px;
                margin-left: -11px;
            }

        .ol-popup-closer {
            text-decoration: none;
            position: absolute;
            top: 2px;
            right: 8px;
        }

            .ol-popup-closer:after {
                content: "✖";
            }
    </style>
    <script type="text/javascript">
        $(document).ready(function () {
            var mapWin = new MapManager.MapControl("map1");
            mapWin.popupObj = new mapWin.PopUp('popup', 'popup-content', 'popup-closer');
            var drawPoint = new mapWin.DrawPoint();
            mapWin.loadSuccessCallback = function () {
                if (mapWin.map) {
                    // mapWin.map.addOverLay(mapWin.popupObj.overlay);
                    if (drawPoint && drawPoint.wfsPointLayer) {
                        mapWin.map.addLayer(drawPoint.wfsPointLayer);
                    }
                }
            };
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
            $("#btnDelPoint").click(function () {
                if (mapWin) {
                    mapWin.IsDel = true;
                    mapWin.DelType = 1;
                }
            });
            $("#btnDelLine").click(function () {
                if (mapWin) {
                    mapWin.IsDel = true;
                    mapWin.DelType = 2;
                }
            });
            $("#btnDelRegion").click(function () {
                if (mapWin) {
                    mapWin.IsDel = true;
                    mapWin.DelType = 3;
                }
            });
        });
    </script>
</head>
<body class="easyui-layout">
    <form id="form1" runat="server">
        <div data-options="region:'north',border:'false',height:'50'" class="main-top" style="color: #fff; background: rgb(74, 91, 121);">
            <div class="head-left">
                <img class="logo" src="../../Images/top-left.png" style="width: 30px; height: 30px" /><span>DEMO OF OL+GEOSERVER+DOTSPATIAL</span>
            </div>
            <div class="head-right">

                <div id="calender" class="top-text" style="width: 320px; cursor: pointer;">
                </div>

            </div>
        </div>
        <div data-options="region:'center',split:false">
            <div id="map1" style="width: 100%; height: 100%"></div>
            <div id="popup" class="ol-popup">
                <a href="#" id="popup-closer" class="ol-popup-closer"></a>
                <div id="popup-content"></div>
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
                <li>
                    <input id="btnDelPoint" type="button" value="删点" />

                </li>
                <li>
                    <input id="btnDelLine" type="button" value="删线" />

                </li>
                <li>
                    <input id="btnDelRegion" type="button" value="删面" />

                </li>
            </ul>
        </div>
        <div data-options="region:'south',border:false">
            <div id="footer" class="cs-south" style="height: 25px;">
                <div class="footer-number" style="width: 30%; text-align: left; float: left; line-height: 25px;">
                    <span style="padding-left: 5px;"></span>Powered By：<a href="https://github.com/AllanHao/Web.DotSpatial" target="_blank"
                        style="color: white;">Allan.Hao</a>
                </div>
                <div class="footer-number" style="width: 40%; text-align: center; float: left; line-height: 25px; color: #fff;">
                    CopyRight © 2014 - 2016 By Allan.Hao
                </div>
                <div class="clear">
                </div>
            </div>
        </div>
    </form>
</body>
</html>
