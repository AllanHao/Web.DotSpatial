MapManager.MapControl.prototype.DrawLine = {
    draw: null,//画线
    wfsLineLayer: null,//线图层
    mapUrl: "http://localhost:8080",
    drawedCallback: null,
    init: function () {
        var namespace = "ws_test";
        var lineLayerName = "L";
        var mapUrl = this.mapUrl;
        var wfsLineSource = new ol.source.Vector({
            loader: delegate(this, function (arry, resolution, projection, a, b) {
                var dataUrl = this.mapUrl + '/geoserver/' + namespace + '/ows?'
                        + 'service=WFS&request=GetFeature&'
                        + 'version=1.1.0&typename='
                        + namespace
                        + ':'
                        + lineLayerName + '&outputFormat=application/json';

                $.ajax({
                    url: '/Handler/OpenlayerProxy.ashx?URL=' + encodeURIComponent(dataUrl)
                }).done(delegate(this, function (response) {
                    var format = new ol.format.GeoJSON({
                        featureNS: 'www.gaia.asia',
                        featureType: lineLayerName
                    });
                    var features = format.readFeatures(response,
                            { featureProjection: projection }
                    );
                    wfsLineSource.addFeatures(features);
                    this.features = features;
                    //添加绘制
                    this.draw = new ol.interaction.Draw({
                        source: wfsLineSource,
                        features: this.features,
                        type: 'LineString'
                    });
                    this.draw.on('drawend', delegate(this, function (evt) {
                        console.log(evt.feature);
                        var geo = evt.feature.getGeometry();
                        var array = geo.flatCoordinates;
                        var args = {};
                        args.Type = 2;
                        args.PosList = new Array();
                        for (var i = 0; i < array.length; i = i + 2) {
                            args.PosList.push({ X: array[i], Y: array[i + 1] });
                        }
                        doActionAsync("GIS.DotSpatial.DataBP.Agent.InsertDataBPProxy", { DataDTO: args }, delegate(this, function (data) {
                            if (data) {
                                evt.feature.values_.ID = data.CID;
                                if (this.drawedCallback) {
                                    this.drawedCallback();
                                }
                            }
                        }), null, null, true);

                    }), this);
                }));
            }),
            strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                maxZoom: 17
            }))

        });

        this.wfsLineLayer = new ol.layer.Vector({
            source: wfsLineSource,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 255, 1.0)',
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: [0, 153, 255, 1]
                })
            })
        });
    }
}