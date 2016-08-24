MapManager.MapControl.prototype.DrawPoint = {
    draw: null,//画点
    wfsPointLayer: null,//点图层
    mapUrl: "http://localhost:8080",
    init: function () {
        var namespace = "ws_test";
        var pointLayerName = "P";
        var mapUrl = this.mapUrl;
        var wfsPointSource = new ol.source.Vector({
            loader: delegate(this, function (arry, resolution, projection, a, b) {
                var dataUrl = this.mapUrl + '/geoserver/' + namespace + '/ows?'
                        + 'service=WFS&request=GetFeature&'
                        + 'version=1.1.0&typename='
                        + namespace
                        + ':'
                        + pointLayerName + '&outputFormat=application/json';

                $.ajax({
                    url: '/Handler/OpenlayerProxy.ashx?URL=' + encodeURIComponent(dataUrl)
                }).done(delegate(this, function (response) {
                    var format = new ol.format.GeoJSON({
                        featureNS: 'www.gaia.asia',
                        featureType: pointLayerName
                    });
                    var features = format.readFeatures(response,
                            { featureProjection: projection }
                    );
                    //test
                    if (features && features.length > 0) {
                        features[0].setStyle(new ol.style.Style({
                            image: new ol.style.Icon({
                                src: '/Images/face_monkey.png'
                            })
                        }));
                    }

                    wfsPointSource.addFeatures(features);
                    this.features = features;
                    //添加绘制
                    this.draw = new ol.interaction.Draw({
                        source: wfsPointSource,
                        features: this.features,
                        type: 'Point'
                    });
                    this.draw.on('drawend', delegate(this, function (evt) {
                        console.log(evt.feature);
                        var geo = evt.feature.getGeometry();
                        var array = geo.flatCoordinates;
                        var args = {};
                        args.Type = 1;
                        args.PosList = new Array();
                        for (var i = 0; i < array.length; i = i + 2) {
                            args.PosList.push({ X: array[i], Y: array[i + 1] });
                        }
                        doActionAsync("GIS.DotSpatial.DataBP.Agent.InsertDataBPProxy", args, function (res) {
                            if (res) {

                            }
                        }, null, null, true);

                    }), this);
                }));
            }),
            strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                maxZoom: 17
            }))

        });


        this.wfsPointLayer = new ol.layer.Vector({
            source: wfsPointSource,
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    src: '/Images/marker.png'
                })
            })
        });
    }
}