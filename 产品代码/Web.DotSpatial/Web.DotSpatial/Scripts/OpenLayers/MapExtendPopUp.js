MapManager.MapControl.prototype.Popup = {
    // Elements that make up the popup.
    container: null,//气泡容器
    content: null,//气泡显示内容
    closer: null, //气泡关闭按钮
    overlay: null,//气泡所在图层

    init: function () {
        this.container = document.getElementById('popup');
        this.content = document.getElementById('popup-content');
        this.closer = document.getElementById('popup-closer');
        this.overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */({
            element: this.container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        }));
        /**
    * Add a click handler to hide the popup.
    * @return {boolean} Don't follow the href.
    */
        this.closer.onclick = delegate(this, function () {
            this.overlay.setPosition(undefined);
            this.closer.blur();
            return false;
        });
    }

}