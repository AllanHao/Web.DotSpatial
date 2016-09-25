MapManager.MapControl.prototype.DrawRegion = {
    draw: null,//画面
    modify: null,//改面
    wfsRegionLayer: null,//面图层
    mapUrl: "http://localhost:8080",
    drawedCallback: null,
    features: new ol.Collection(),
    init: function () {
        var namespace = "ws_test";
        var regionLayerName = "R";
        var mapUrl = this.mapUrl;
        var wfsRegionSource = new ol.source.Vector({
            loader: delegate(this, function (arry, resolution, projection, a, b) {
                var dataUrl = this.mapUrl + '/geoserver/' + namespace + '/ows?'
                        + 'service=WFS&request=GetFeature&'
                        + 'version=1.1.0&typename='
                        + namespace
                        + ':'
                        + regionLayerName + '&outputFormat=application/json';

                $.ajax({
                    url: '/Handler/OpenlayerProxy.ashx?URL=' + encodeURIComponent(dataUrl)
                }).done(delegate(this, function (response) {
                    var format = new ol.format.GeoJSON({
                        featureNS: 'www.gaia.asia',
                        featureType: regionLayerName
                    });
                    var features = format.readFeatures(response,
                            { featureProjection: projection }
                    );
                    if (features && features.length > 0) {
                        $.each(features, delegate(this, function (i, item) {
                            this.features.push(item);
                        }));
                    }
                    wfsRegionSource.addFeatures(features);
                    //添加绘制
                    this.draw = new ol.interaction.Draw({
                        source: wfsRegionSource,
                        features: this.features,
                        type: 'Polygon'
                    });
                    this.draw.on('drawend', delegate(this, function (evt) {
                        console.log(evt.feature);
                        var geo = evt.feature.getGeometry();
                        var array = geo.flatCoordinates;
                        var args = {};
                        args.Type = 3;
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
                    }), this);

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

                    this.modify.on('modifyend', function (evt) {
                        var feature;
                        var features = this.features.getArray();
                        $.each(features, delegate(this, function (i, item) {
                            if (item.values_.ID == MapManager.selectedFeatureID) {
                                feature = item;
                                return false;
                            }
                        }));
                        if (feature) {
                            var geo = feature.getGeometry();
                            var array = geo.flatCoordinates;
                            var args = {};
                            args.Type = 3;
                            args.CID = feature.values_.ID;
                            args.PosList = new Array();
                            for (var i = 0; i < array.length; i = i + 2) {
                                args.PosList.push({ X: array[i], Y: array[i + 1] });
                            }
                            doActionAsync("GIS.DotSpatial.DataBP.Agent.ModifyGeometryBPProxy", { DataDTO: args }, delegate(this, function (data) {
                                if (data) {
                                }
                            }), null, null, true);
                        }
                    }, this);
                }));
            }),
            strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                maxZoom: 17
            }))

        });

        function polygonStyleFunction(feature, resolution) {
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 255, 1.0)',
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: [0, 153, 255, 1]
                }),
                text: createTextStyle(feature, resolution)
            });
        }

        var createTextStyle = function (feature, resolution) {
            //var align = dom.align.value;
            //var baseline = dom.baseline.value;
            //var size = dom.size.value;
            //var offsetX = parseInt(dom.offsetX.value, 10);
            //var offsetY = parseInt(dom.offsetY.value, 10);
            //var weight = dom.weight.value;
            //var rotation = parseFloat(dom.rotation.value);
            //var font = weight + ' ' + size + ' ' + dom.font.value;
            //var fillColor = dom.color.value;
            //var outlineColor = dom.outline.value;
            //var outlineWidth = parseInt(dom.outlineWidth.value, 10);

            return new ol.style.Text({
                textAlign: 'Center',
                textBaseline: 'Middle',
                font: 'Bold 10px Verdana',
                text: getText(feature, resolution),
                fill: new ol.style.Fill({ color: 'black' }),
                stroke: new ol.style.Stroke({ color: 'yellow', width: 1 }),
                offsetX: 0,
                offsetY: 0
                //rotation: rotation
            });
        };


        var getText = function (feature, resolution) {
            // var type = dom.text.value;
            //var maxResolution = dom.maxreso.value;
            var text = feature.get('ID');

            //if (resolution > maxResolution) {
            //    text = '';
            //} else if (type == 'hide') {
            //    text = '';
            //} else if (type == 'shorten') {
            //    text = text.trunc(12);
            //} else if (type == 'wrap') {
            //    text = stringDivider(text, 16, '\n');
            //}

            return text;
        };


        this.wfsRegionLayer = new ol.layer.Vector({
            source: wfsRegionSource,
            style: polygonStyleFunction
        });
    }
}