MapManager.MapControl.prototype.Tile = {
    layer: null,//线图层
    mapUrl: "http://googlemap.gaiais.com/{z}/{x}/{y}.png",
    init: function () {
        var mapUrl = this.mapUrl;
        var tileSource = new ol.source.XYZ({
            attributions: new ol.Attribution({
                html: 'Tiles © GoogleMap'
            }),
            url: mapUrl,
            tilePixelRatio: 1, // THIS IS IMPORTANT
            minZoom: 14,
            maxZoom: 21

        });

        this.layer = new ol.layer.Tile({
            source: tileSource//,
            //  extent: ol.proj.transformExtent([-2.0037508342787E7, -2.0037508342787E7, 2.0037508342787E7, 2.0037508342787E7], 'EPSG:102100', "EPSG:4326")
        });
    }
}