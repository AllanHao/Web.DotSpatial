function delegate(obj, callback) {
    return function () {
        if (obj) {
            callback.apply(obj, arguments);
        }
    }
}

var MapManager = {
    MapControl: function (id) {
        this.id = id;
        this.map = null;
        this.baseLayer = null;
        this.featureLayer = null;
        this.themeLayer = null;
        this.tailLayer = null;
        this.drawPolygon = null;
        this.selectedFeature = null;
        this.mapUrl = "http://localhost:8080";
        this.features = [];
        this.options = null;
        this.wmsLayer = null;
        this.wfsRegionLayer = null;
        this.wfsLineLayer = null;
        this.wfsPointLayer = null;
        this.geojsonLayer = null;
        this.chinaLayer = null;


        this.pointDraw = null;//画点
        this.lineDraw = null;//画线
        this.regionDraw = null;//画面
        this.IsDel = false;//是否执行删除操作
        this.DelType = "";//待删除数据类型

        function init() {
            this.baseLayer = new ol.layer.Tile({ source: new ol.source.OSM() });


            /**
      * Elements that make up the popup.
      */
            var container = document.getElementById('popup');
            var content = document.getElementById('popup-content');
            var closer = document.getElementById('popup-closer');


            /**
             * Create an overlay to anchor the popup to the map.
             */
            var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */({
                element: container,
                autoPan: true,
                autoPanAnimation: {
                    duration: 250
                }
            }));


            /**
             * Add a click handler to hide the popup.
             * @return {boolean} Don't follow the href.
             */
            closer.onclick = function () {
                overlay.setPosition(undefined);
                closer.blur();
                return false;
            };



            //wfsLayer
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
                        this.lineDraw = new ol.interaction.Draw({
                            source: wfsLineSource,
                            features: this.features,
                            type: 'LineString'
                        });
                        this.lineDraw.on('drawend', delegate(this, function (evt) {
                            console.log(evt.feature);
                            var geo = evt.feature.getGeometry();
                            var array = geo.flatCoordinates;
                            var args = {};
                            args.Type = 2;
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

            //wfsLayer

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
                        wfsRegionSource.addFeatures(features);
                        this.features = features;
                        //添加绘制
                        this.regionDraw = new ol.interaction.Draw({
                            source: wfsRegionSource,
                            features: this.features,
                            type: 'Polygon'
                        });
                        this.regionDraw.on('drawend', delegate(this, function (evt) {
                            console.log(evt.feature);
                            var geo = evt.feature.getGeometry();
                            var array = geo.flatCoordinates;
                            var args = {};
                            args.Type = 3;
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

            this.wfsRegionLayer = new ol.layer.Vector({
                source: wfsRegionSource,
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

            //wfsLayer

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
                        this.pointDraw = new ol.interaction.Draw({
                            source: wfsPointSource,
                            features: this.features,
                            type: 'Point'
                        });
                        this.pointDraw.on('drawend', delegate(this, function (evt) {
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


            this.options = {
                logo: { src: '/Images/face_monkey.png', href: 'http://www.openstreetmap.org/' },
                layers: [this.baseLayer, this.wfsLineLayer, this.wfsPointLayer, this.wfsRegionLayer],
                overlays: [overlay],
                view: new ol.View({
                    // 设置北京为地图中心，此处进行坐标转换， 把EPSG:4326的坐标，转换为EPSG:3857坐标，因为ol默认使用的是EPSG:3857坐标
                    //center: ol.proj.transform([104.06, 30.67], 'EPSG:4326', 'EPSG:3857'),
                    center: [116.51146342, 39.92331272],//[113.33243347168, 22.9747657775879],//
                    // 指定投影使用EPSG:4326 WGS-1984
                    projection: 'EPSG:4326',
                    zoom: 17,
                }),
                target: this.id
            };

            this.map = new ol.Map(this.options);
            //添加control控件
            this.map.addControl(new ol.control.MousePosition());
            this.map.addControl(new ol.control.Zoom());
            this.map.addControl(new ol.control.ScaleLine());



            // 监听地图点击事件
            this.map.on('click', delegate(this, function (event) {
                var feature = this.map.forEachFeatureAtPixel(event.pixel, delegate(this, function (feature) {
                    if (feature) {
                        if (this.IsDel) {
                            var id = feature.values_.ID;
                            var args = {};
                            args.ID = id;
                            args.Type = this.DelType;
                            $.messager.confirm("提示", "确认删除该地物？", function (r) {
                                if (r) {
                                    doActionAsync("GIS.DotSpatial.DataBP.Agent.DeleteDataBPProxy", args, function (res) {
                                        if (res) {
                                            this.IsDel = false;
                                        }
                                    }, null, null, true);
                                }
                            });
                        } else {
                            console.log(feature);
                            var coordinate = event.coordinate;
                            content.innerHTML = '<p>ID:' + feature.values_.ID + '</p> ';
                            overlay.setPosition(coordinate);
                        }
                    }
                    return feature;
                }));

            }));

            this.map.on('pointermove', delegate(this, function (evt) {
                if (evt.dragging) {
                    return;
                }
                //var pixel = this.map.getEventPixel(evt.originalEvent);
                //var hit = this.map.forEachLayerAtPixel(pixel, function () {
                //    return true;
                //});
                var feature = this.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                    return feature;
                });
                if (feature) {
                    this.map.getTargetElement().style.cursor = 'pointer';
                }
                else {
                    this.map.getTargetElement().style.cursor = '';
                }
                //this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
            }));

        }
        //释放图层
        function destory() {
            if (this.wfsRegionLayer) {

            }
        };
        this.LoadMap = function () {

            init.call(this)
        };
        window.onresize = delegate(this, function () {
            if (this.map) {
                this.map.updateSize();
            }
        });
    }
}