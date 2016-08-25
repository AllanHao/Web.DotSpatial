<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Web.DotSpatial.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <link href="Portal/css/default.css" rel="stylesheet" />
    <link href="Scripts/easyui1.4.4/themes/gray/easyui.css" rel="stylesheet" />
    <link href="Scripts/easyui1.4.4/themes/gray/easyui.customer.css" rel="stylesheet" />
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

        li {
            padding-top: 5px;
        }

        .ol-popup-closer:after {
            content: "✖";
        }

        .easyui-linkbutton {
            width: 60px;
            margin-left: 5px;
            margin-top: 5px;
        }

        fieldset {
            padding: 1px;
        }

        ul {
            padding: 0 20px 0 20px;
        }
    </style>
    <script type="text/javascript">
        $(document).ready(function () {
            var mapWin = new MapManager.MapControl("map1");
            mapWin.Popup.init();// = new mapWin.Popup('popup', 'popup-content', 'popup-closer');
            mapWin.DrawPoint.init();
            mapWin.DrawLine.init();
            mapWin.DrawRegion.init();
            mapWin.loadSuccessCallback = function () {
                if (mapWin.map) {
                    if (mapWin.DrawPoint.wfsPointLayer) {
                        mapWin.map.addLayer(mapWin.DrawPoint.wfsPointLayer);
                    }
                    if (mapWin.DrawLine.wfsLineLayer) {
                        mapWin.map.addLayer(mapWin.DrawLine.wfsLineLayer);
                    }
                    if (mapWin.DrawRegion.wfsRegionLayer) {
                        mapWin.map.addLayer(mapWin.DrawRegion.wfsRegionLayer);
                    }

                    if (mapWin.Popup.overlay) {
                        mapWin.map.addOverlay(mapWin.Popup.overlay);
                    }
                }
            };
            if (mapWin) {
                mapWin.LoadMap();
            }
            mapWin.DrawPoint.drawedCallback = function () {
                //$("#btnPoint").linkbutton('click');
                $("#btnPoint").click();
            };
            mapWin.DrawLine.drawedCallback = function () {
                $("#btnLine").click();
            };
            mapWin.DrawRegion.drawedCallback = function () {
                $("#btnRegion").click();
            };
            $("#btnPoint").bind('click', function () {
                if ($("#btnPoint").linkbutton('options').selected) {
                    if (mapWin && mapWin.DrawPoint.draw) {
                        mapWin.map.removeInteraction(mapWin.DrawPoint.draw);
                        $("#btnPoint").linkbutton('unselect');
                        mapWin.map.on('click', mapWin.clickHandler, mapWin);
                    }

                } else {
                    if (mapWin && mapWin.DrawPoint.draw) {
                        mapWin.map.addInteraction(mapWin.DrawPoint.draw);
                        $("#btnPoint").linkbutton('select');
                        mapWin.map.un('click', mapWin.clickHandler, mapWin);
                    }
                }
            });
            $("#btnLine").bind('click', function () {
                if ($("#btnLine").linkbutton('options').selected) {
                    if (mapWin && mapWin.DrawLine.draw) {
                        mapWin.map.removeInteraction(mapWin.DrawLine.draw);
                        $("#btnLine").linkbutton('unselect');
                        mapWin.map.on('click', mapWin.clickHandler, mapWin);
                    }

                } else {
                    if (mapWin && mapWin.DrawLine.draw) {
                        mapWin.map.addInteraction(mapWin.DrawLine.draw);
                        $("#btnLine").linkbutton('select');
                        mapWin.map.un('click', mapWin.clickHandler, mapWin);
                    }
                }
            });
            $("#btnRegion").bind('click', function () {
                if ($("#btnRegion").linkbutton('options').selected) {
                    if (mapWin && mapWin.DrawRegion.draw) {
                        mapWin.map.removeInteraction(mapWin.DrawRegion.draw);
                        $("#btnRegion").linkbutton('unselect');
                        mapWin.map.on('click', mapWin.clickHandler, mapWin);
                    }

                } else {
                    if (mapWin && mapWin.DrawRegion.draw) {
                        mapWin.map.addInteraction(mapWin.DrawRegion.draw);
                        $("#btnRegion").linkbutton('select');
                        mapWin.map.un('click', mapWin.clickHandler, mapWin);
                    }
                }
            });
            $("#btnDelPoint").bind('click', function () {
                if (mapWin) {
                    mapWin.IsDel = true;
                    mapWin.DelType = 1;
                }
            });
            $("#btnDelLine").bind('click', function () {
                if (mapWin) {
                    mapWin.IsDel = true;
                    mapWin.DelType = 2;
                }
            });
            $("#btnDelRegion").bind('click', function () {
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
            <fieldset>
                <legend>数据操作</legend>
                <ul id="btnList">
                    <li>
                        <a id="btnPoint" class="easyui-linkbutton">画点</a>
                        <a id="btnLine" class="easyui-linkbutton">画线</a>
                    </li>
                    <li>
                        <a id="btnRegion" class="easyui-linkbutton">画面</a>
                    </li>
                    <li>
                        <a id="btnDelPoint" class="easyui-linkbutton">删点</a>
                        <a id="btnDelLine" class="easyui-linkbutton">删线</a>
                    </li>
                    <li>
                        <a id="btnDelRegion" class="easyui-linkbutton">删面</a>
                    </li>
                </ul>
            </fieldset>
        </div>
        <div data-options="region:'south',border:false">
            <div id="footer" class="cs-south" style="height: 25px;">
                <div class="footer-number" style="width: 30%; text-align: left; float: left; line-height: 25px;">
                    <span style="padding-left: 5px;"></span><a href="https://github.com/openlayers/ol3" target="_blank"
                        style="color: white;">OpenLayers</a>
                    <span style="padding-left: 5px;"></span><a href="https://github.com/geoserver/geoserver" target="_blank"
                        style="color: white;">GeoServer</a>
                    <span style="padding-left: 5px;"></span><a href="https://github.com/DotSpatial/DotSpatial" target="_blank"
                        style="color: white;">DotSpatial</a>
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
