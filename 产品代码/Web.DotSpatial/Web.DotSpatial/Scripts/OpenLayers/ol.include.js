/// <reference path="jquery-1.7.1.min.js" />
(function () {
    var baseurl = "/Scripts/OpenLayers/";

    function inputScript(inc) {
        var src = baseurl + inc;
        var script = "<script type='text/javascript' src=" + src + "></script>";
        document.writeln(script);
    }
    function inputCss(css) {
        var src = baseurl + css;
        var script = " <link href='" + src + "' rel='stylesheet' />";

        document.writeln(script);
    }
    //加载类库资源文件
    function loadOLLibs() {
        inputCss('ol/ol.css');
        inputScript('ol/ol-debug.js');
        //inputScript('deprecated.js');
        //inputScript('OpenLayers.debug.js');
        inputScript('MapManager.js');
        inputScript('MapExtendPopUp.js');
        inputScript('MapExtendDrawPoint.js');
        inputScript('MapExtendDrawLine.js');
        inputScript('MapExtendDrawRegion.js');
        //inputScript('jquery-1.7.1.min.js');
        //inputScript('public.js');
        //inputScript('OpenLayers.Control.Legend.js');
    }

    loadOLLibs();

})();
