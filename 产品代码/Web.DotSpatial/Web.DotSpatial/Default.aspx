<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Web.DotSpatial.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <script src="Scripts/OpenLayers/ol.include.js"></script>
    <script src="Scripts/jquery-1.7.1.min.js"></script>
    <script src="Scripts/public.js"></script>
    <script type="text/javascript">
        $(document).ready(function () {
            var mapWin = new MapManager.MapControl("map1");
            if (mapWin) {
                mapWin.LoadMap();
            }

        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div id="map1" style="width: 100%; height: 600px">
        </div>
    </form>
</body>
</html>
