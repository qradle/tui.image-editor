/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 * @fileoverview Image rotation module
 */
'use strict';

var Component = require('../interface/Component');
var consts = require('../consts');

/**
 * Image Rotation component
 * @class Rotation
 * @extends {Component}
 * @param {Component} parent - parent component
 */
var Rotation = tui.util.defineClass(Component, /** @lends Rotation.prototype */ {
    init: function(parent) {
        this.setParent(parent);
    },

    /**
     * Component name
     * @type {string}
     */
    name: consts.componentNames.ROTATION,

    /**
     * Get current angle
     * @returns {Number}
     */
    getCurrentAngle: function() {
        return this.getCanvasImage().angle;
    },

    /**
     * Set angle of the image
     * @param {number} angle - Angle value
     * @returns {jQuery.Deferred}
     */
    setAngle: function(angle) {
        var current = this.getCurrentAngle();
        var jqDefer = $.Deferred();

        if (angle === current) {
            return jqDefer.reject();
        }

        /**
         * Do not call "this.setImageProperties" for setting angle directly.
         * Before setting angle, The originX,Y of image should be set to center.
         *  See "http://fabricjs.com/docs/fabric.Object.html#setAngle"
         */
        this.getCanvasImage()
            .setAngle(angle)
            .setCoords();
        this._adjustCanvasDimension();

        return jqDefer.resolve(angle);
    },

    /**
     * Adjust canvas dimension from image-rotation
     * @private
     */
    _adjustCanvasDimension: function() {
        var canvasImage = this.getCanvasImage(),
            boundingRect = canvasImage.getBoundingRect();

        // BoundingRect dimensions +1, so that don't get blurry image.
        boundingRect.width = Math.floor(boundingRect.width) + 1;
        boundingRect.height = Math.floor(boundingRect.height) + 1;

        this.setCanvasCssDimension({
            'max-width': boundingRect.width + 'px'
        });
        this.setCanvasBackstoreDimension({
            width: boundingRect.width,
            height: boundingRect.height
        });
        this.getCanvas().centerObject(canvasImage);
    },

    /**
     * Rotate the image
     * @param {number} additionalAngle - Additional angle
     * @returns {jQuery.Deferred}
     */
    rotate: function(additionalAngle) {
        var current = this.getCanvasImage().angle;

        // The angle is lower than 2*PI(===360 degrees)
        return this.setAngle((current + additionalAngle) % 360);
    }
});

module.exports = Rotation;
