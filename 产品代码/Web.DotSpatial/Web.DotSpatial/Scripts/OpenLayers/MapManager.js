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
        this.baseLayerName = "ws_test:f_1";
        this.selectControl = null;
        this.features = [];
        this.options = null;
        this.wmsLayer = null;
        this.wfsLayer = null;
        this.geojsonLayer = null;
        this.chinaLayer = null;


        this.pointDraw = null;//画点
        this.lineDraw = null;//画线
        this.regionDraw = null;//画面

        function init() {
            this.baseLayer = new ol.layer.Tile({ source: new ol.source.OSM() });

            /** geoJson Layer
            var vectorSource = new ol.source.Vector();

            var url = 'Scripts/data/beijing.json';
            $.ajax({
                url: url
            }).done(delegate(this, function (response) {
                this.features = (new ol.format.GeoJSON()).readFeatures(response)
                vectorSource.addFeatures(this.features);


                //添加绘制
                var draw = new ol.interaction.Draw({
                    source: vectorSource,
                    features: this.features,
                    type: 'Point'
                });
                this.map.addInteraction(draw);

                draw.on('drawend', delegate(this, function (evt) {
                    console.log(evt.feature);
                    var parser = new ol.format.GeoJSON();
                    //var features = vectorSource.getFeatures();
                    var featuresGeoJSON = parser.writeFeatures(this.features);
                    $.ajax({
                        url: url,
                        type: 'POST',
                        dataType: "jsonp",
                        data: featuresGeoJSON,
                        contentType: "application/x-www-form-urlencoded; charset=GBK",
                    });//.then(function (response) { console.log(response); })
                }), this);

            }))
            this.geojsonLayer = new ol.layer.Vector({
                source: vectorSource,
                style: new ol.style.Style({
                    image: new ol.style.Icon({
                        src: '../Theme/images/marker.png',
                        anchor: [0.5, 1]    // 设置图标位置
                    })
                })
            });
            **/

            /** China Vector Layer
            var chinaSource = new ol.source.Vector();
            
            $.ajax({
                url: 'Scripts/data/china.geojson'
            }).done(function (response) {
                chinaSource.addFeatures((new ol.format.GeoJSON()).readFeatures(response));
            })
            this.chinaLayer = new ol.layer.Vector({
                source: chinaSource
               
            });
            **/

            //wfsLayer
            var namespace = "ws_test";
            var layerName = "L";
            var mapUrl = this.mapUrl;
            var wfsSource = new ol.source.Vector({
                //format: new ol.format.GeoJSON(),
                //url: function (extent) {
                //    var dataUrl = mapUrl + '/geoserver/' + namespace + '/ows?'
                //         + 'service=WFS&request=GetFeature&'
                //         + 'version=1.1.0&typename='
                //         + namespace
                //         + ':'
                //         + layerName + '&outputFormat=application/json';
                //    return '/Handler/OpenlayerProxy.ashx?URL=' + encodeURIComponent(dataUrl);
                //}
                //url: function (extent) {
                //    return '/Handler/OpenlayerProxy.ashx?URL=' + encodeURIComponent('http://localhost:8080/geoserver/ws_test/ows?service=WFS&version=1.1.0&request=GetFeature&typename=ws_test:R&outputFormat=application/json');
                //}

                /**另一种方式**/
                loader: delegate(this, function (arry, resolution, projection, a, b) {
                    var dataUrl = this.mapUrl + '/geoserver/' + namespace + '/ows?'
                            + 'service=WFS&request=GetFeature&'
                            + 'version=1.1.0&typename='
                            + namespace
                            + ':'
                            + layerName + '&outputFormat=application/json';

                    $.ajax({
                        url: '/Handler/OpenlayerProxy.ashx?URL=' + encodeURIComponent(dataUrl)
                    }).done(delegate(this, function (response) {
                        var format = new ol.format.GeoJSON({
                            featureNS: 'www.gaia.asia',
                            featureType: layerName
                        });
                        var features = format.readFeatures(response,
                                { featureProjection: projection }
                        );
                        wfsSource.addFeatures(features);
                        this.features = features;
                        //添加绘制
                        this.lineDraw = new ol.interaction.Draw({
                            source: wfsSource,
                            features: this.features,
                            type: 'LineString'
                        });
                        //  this.map.addInteraction(lineDraw);

                        this.lineDraw.on('drawend', delegate(this, function (evt) {
                            console.log(evt.feature);
                            var parser = new ol.format.GeoJSON();
                            //var features = vectorSource.getFeatures();
                            var featuresGeoJSON = parser.writeFeatures(this.features);
                            //$.ajax({
                            //    url: url,
                            //    type: 'POST',
                            //    dataType: "jsonp",
                            //    data: featuresGeoJSON,
                            //    contentType: "application/x-www-form-urlencoded; charset=GBK",
                            //});//.then(function (response) { console.log(response); })
                        }), this);
                    }));
                }),
                strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
                    maxZoom: 17
                }))

            });


            this.wfsLayer = new ol.layer.Vector({
                source: wfsSource,
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


            //wmsLayer
            //var wmsSource = new ol.source.TileWMS({
            //    url: 'http://localhost:8080/geoserver/ws_test/wms',
            //    params: { 'LAYERS': 'ws_test:R' },
            //    serverType: 'geoserver',
            //    crossOrigin: 'anonymous',
            //    style: new ol.style.Style({
            //        stroke: new ol.style.Stroke({
            //            color: 'red',
            //            size: 1
            //        })
            //    })
            //});

            //this.wmsLayer = new ol.layer.Tile({
            //    source: wmsSource
            //});


            /** featureLayer
            this.featureLayer = new ol.layer.Vector({ source: new ol.source.Vector() });
            // 创建一个Feature，并设置好在地图上的位置
            var anchor = new ol.Feature({
                geometry: new ol.geom.Point([116.39142, 39.90255])
            });
            // 设置样式，在样式中就可以设置图标
            anchor.setStyle(new ol.style.Style({
                image: new ol.style.Icon({
                    src: '../Theme/images/marker.png',
                    anchor: [0.5, 1]    // 设置图标位置
                })
            }));
            // 添加到之前的创建的layer中去
            this.featureLayer.getSource().addFeature(anchor);
            **/

            this.options = {
                logo: { src: '/Images/face_monkey.png', href: 'http://www.openstreetmap.org/' },
                layers: [this.baseLayer, this.wfsLayer],
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
                var feature = this.map.forEachFeatureAtPixel(event.pixel, function (feature) {
                    return feature;
                });
                if (event) {

                }
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
        function destory() { }
        this.LoadMap = function () {
            init.call(this)
        }
    }
}