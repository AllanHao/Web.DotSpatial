

/**
 * @constructor
 * @extends {ol.interaction.Pointer}
 */
ol.interaction.Drag = function () {

    ol.interaction.Pointer.call(this, {
        handleDownEvent: ol.interaction.Drag.prototype.handleDownEvent,
        handleDragEvent: ol.interaction.Drag.prototype.handleDragEvent,
        handleMoveEvent: ol.interaction.Drag.prototype.handleMoveEvent,
        handleUpEvent: ol.interaction.Drag.prototype.handleUpEvent
    });

    /**
     * @type {ol.Pixel}
     * @private
     */
    this.coordinate_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    this.cursor_ = 'pointer';

    /**
     * @type {ol.Feature}
     * @private
     */
    this.feature_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    this.previousCursor_ = undefined;

};
ol.inherits(ol.interaction.Drag, ol.interaction.Pointer);


/**
 * @param {ol.MapBrowserEvent} evt Map browser event.
 * @return {boolean} `true` to start the drag sequence.
 */
ol.interaction.Drag.prototype.handleDownEvent = function (evt) {
    var map = evt.map;

    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
            return feature;
        });

    if (feature) {
        this.coordinate_ = evt.coordinate;
        this.feature_ = feature;
    }

    return !!feature;
};


/**
 * @param {ol.MapBrowserEvent} evt Map browser event.
 */
ol.interaction.Drag.prototype.handleDragEvent = function (evt) {
    var deltaX = evt.coordinate[0] - this.coordinate_[0];
    var deltaY = evt.coordinate[1] - this.coordinate_[1];

    var geometry = /** @type {ol.geom.SimpleGeometry} */
        (this.feature_.getGeometry());
    geometry.translate(deltaX, deltaY);

    this.coordinate_[0] = evt.coordinate[0];
    this.coordinate_[1] = evt.coordinate[1];
};


/**
 * @param {ol.MapBrowserEvent} evt Event.
 */
ol.interaction.Drag.prototype.handleMoveEvent = function (evt) {
    if (this.cursor_) {
        var map = evt.map;
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function (feature) {
                return feature;
            });
        var element = evt.map.getTargetElement();
        if (feature) {
            if (element.style.cursor != this.cursor_) {
                this.previousCursor_ = element.style.cursor;
                element.style.cursor = this.cursor_;
            }
        } else if (this.previousCursor_ !== undefined) {
            element.style.cursor = this.previousCursor_;
            this.previousCursor_ = undefined;
        }
    }
};


/**
 * @return {boolean} `false` to stop the drag sequence.
 */
ol.interaction.Drag.prototype.handleUpEvent = function () {
    var geo = this.feature_.getGeometry();
    var array = geo.flatCoordinates;
    var args = {};
    args.Type = this.feature_.values_.Type;
    args.PosList = new Array();
    args.CID = this.feature_.values_.ID;
    for (var i = 0; i < array.length; i = i + 2) {
        args.PosList.push({ X: array[i], Y: array[i + 1] });
    }
    doActionAsync("GIS.DotSpatial.DataBP.Agent.ModifyGeometryBPProxy", { DataDTO: args }, delegate(this, function (data) {
        if (data) {
            this.coordinate_ = null;
            this.feature_ = null;
            return false;
        }
    }), null, null, true);


};

MapManager.MapControl.prototype.drag = new ol.interaction.Drag();


