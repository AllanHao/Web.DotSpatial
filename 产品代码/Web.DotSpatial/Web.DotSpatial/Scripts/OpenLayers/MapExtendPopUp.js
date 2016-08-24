MapManager.MapControl.prototype.PopUp = function (container, content, closer) {
    // Elements that make up the popup.
    this.container = document.getElementById(container);//'popup'
    this.content = document.getElementById(content);//'popup-content'
    this.closer = document.getElementById(closer); //'popup-closer'


    //Create an overlay to anchor the popup to the map.
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