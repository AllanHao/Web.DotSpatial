MapManager.MapControl.prototype.DrawPoint = {
    draw: null,//画点
    modify: null,//改点
    wfsPointLayer: null,//点图层
    mapUrl: "http://localhost:8080",
    features: [],
    drawedCallback: null,
    features: new ol.Collection(),
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
                    if (features && features.length > 0) {
                        $.each(features, delegate(this, function (i, item) {
                            this.features.push(item);
                        }));
                        //test
                        features[0].setStyle(new ol.style.Style({
                            image: new ol.style.Icon({
                                src: '/Images/face_monkey.png'
                            })
                        }));
                    }
                    wfsPointSource.addFeatures(features);
                    //添加绘制
                    this.draw = new ol.interaction.Draw({
                        source: wfsPointSource,
                        features: this.features,
                        type: 'Point'
                    });

                    this.draw.on('drawend', function (evt) {
                        console.log(evt.feature);
                        var geo = evt.feature.getGeometry();
                        var array = geo.flatCoordinates;
                        var args = {};
                        args.Type = 1;
                        args.PosList = new Array();
                        for (var i = 0; i < array.length; i = i + 2) {
                            args.PosList.push({ X: array[i], Y: array[i + 1] });
                        }
                        doActionAsync("GIS.DotSpatial.DataBP.Agent.InsertDataBPProxy", { DataDTO: args }, delegate(this, function (data) {
                            if (data) {
                                evt.feature.values_.ID = data.CID;
                                evt.feature.values_.Type = data.Type;
                                if (this.drawedCallback) {
                                    this.drawedCallback();
                                }
                            }
                        }), null, null, true);

                    }, this);

                    this.modify = new ol.interaction.Modify({
                        features: this.features,
                        // the SHIFT key must be pressed to delete vertices, so
                        // that new vertices can be drawn at the same position
                        // of existing vertices
                        deleteCondition: function (event) {
                            return ol.events.condition.shiftKeyOnly(event) &&
                                ol.events.condition.singleClick(event);
                        }
                    });
                    var modifiedFeatures = [];
                    this.modify.on('modifyend', function (evt) {
                        var features = evt.features.getArray();
                        console.log(features.length);
                        for (var i = 0; i < features.length; i++) {
                            var rev = features[i].getRevision();
                            if (rev > 1) {
                                console.log("feature with revision:" + rev + " has been modified");
                                modifiedFeatures.push(features[i]);
                            }
                        }
                    }, this);

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

        function loaderFunction(extent, resolution, projection) {
            var dataUrl = this.mapUrl + '/geoserver/' + namespace + '/ows?'
                        + 'service=WFS&request=GetFeature&'
                        + 'version=1.1.0&typename='
                        + namespace
                        + ':'
                        + pointLayerName + '&outputFormat=application/json';
            var url = '/Handler/OpenlayerProxy.ashx?URL=' + encodeURIComponent(dataUrl);
            $.ajax({
                url: url,
                success: function (data) {
                    var format = new ol.format.GeoJSON({
                        featureNS: 'www.gaia.asia',
                        featureType: pointLayerName
                    });
                    var features = format.readFeatures(data,
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
                    this.features = features;
                    wfsPointSource.clear(true);
                    wfsPointSource.addFeatures(features);
                }
            });
        }

    }
}