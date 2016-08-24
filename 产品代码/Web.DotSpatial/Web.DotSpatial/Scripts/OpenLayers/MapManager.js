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

        this.IsDel = false;//是否执行删除操作
        this.DelType = "";//待删除数据类型

        this.popupObj = {};//气泡对象封装
        this.loadSuccessCallback = null;

        function init() {
            this.baseLayer = new ol.layer.Tile({ source: new ol.source.OSM() });
            //this.baseLayer.on('loadend', delegate(this, function () {
            //    if (this.loadSuccessCallback) {
            //        this.loadSuccessCallback;
            //    }
            //}));

            this.options = {
                logo: { src: '/Images/face_monkey.png', href: 'http://www.openstreetmap.org/' },
                layers: [this.baseLayer],
                //overlays: [this.popupObj.overlay],
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
                            this.popupObj.content.innerHTML = '<p>ID:' + feature.values_.ID + '</p> ';
                            this.popupObj.overlay.setPosition(coordinate);
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
            this.map.once('postrender', delegate(this, function () {
                if (this.loadSuccessCallback) {
                    this.loadSuccessCallback.call(this);
                }
                //alert(this.map);
            }));
        }
        //释放图层
        function destory() {
            if (this.wfsRegionLayer) {

            }
        };
        this.LoadMap = function () {
            init.call(this);
        };
        function checkSize() {
            //var small = this.map.getSize()[0] < 600;
            //attribution.setCollapsible(small);
            //attribution.setCollapsed(small);
            this.map.updateSize();
        }
        window.addEventListener('resize', delegate(this, checkSize));
        //checkSize.call(this);
        //window.onresize = delegate(this, function () {
        //    if (this.map) {
        //        this.map.updateSize();
        //    }
        //});
    }
}