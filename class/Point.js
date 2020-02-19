import { track, canvas } from "../unobfuscated_bhr.js";
import { sqrt, round } from "./utils/MathUtils.js";

export class Point {
    constructor(x, y) {
        /** @type {?number} */
        this.x = x;
        /** @type {?number} */
        this.y = y;
    }

    /** @return {Point} */
    toPixel() {
        return new Point((this.x - track.camera.x) * track.zoomFactor + canvas.width / 2, (this.y - track.camera.y) * track.zoomFactor + canvas.height / 2);
    }

    /** @return {Point} */
    normalizeToCanvas() {
        return new Point((this.x - canvas.width / 2) / track.zoomFactor + track.camera.x, (this.y - canvas.height / 2) / track.zoomFactor + track.camera.y);
    }

    /** @return {Point} */
    copy(point) {
        this.x = point.x;
        this.y = point.y;
        return this;
    }

    /** @return {Point} */
    selfAdd(point) {
        this.x += point.x;
        this.y += point.y;
        return this;
    }

    /** @return {Point} */
    selfSub(point) {
        this.x -= point.x;
        this.y -= point.y;
        return this;
    }

    /** @return {Point} */
    selfScale(factor) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    /** @return {Point} */
    clone() {
        return new Point(this.x, this.y);
    }

    /** @return {Point} */
    cloneAdd(point) {
        return new Point(this.x + point.x, this.y + point.y);
    }

    /** @return {Point} */
    cloneSub(point) {
        return new Point(this.x - point.x, this.y - point.y);
    }

    /** @return {Point} */
    cloneScale(factor) {
        return new Point(this.x * factor, this.y * factor);
    }

    /** @return {Point} */
    cloneReciprocalScale(factor) {
        return new Point(this.x / factor, this.y / factor);
    }

    /** @return {number} */
    dot(point) {
        return this.x * point.x + this.y * point.y;
    }

    /** @return {number} */
    getLength() {
        return sqrt(this.x * this.x + this.y * this.y);
    }

    /** @return {number} */
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    /** @return {number} */
    distanceTo(point) {
        var dx = this.x - point.x,
            dy = this.y - point.y;
        return sqrt(dx * dx + dy * dy);
    }

    /** @return {number} */
    distanceToSquared(point) {
        var dx = this.x - point.x,
            dy = this.y - point.y;
        return dx * dx + dy * dy;
    }

    /** @return {string} */
    toString() {
        return round(this.x).toString(32) + ' ' + round(this.y).toString(32);
    }

    toJSON() {
        return [this.x, this.y];
    }
}