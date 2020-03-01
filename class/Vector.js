import { track, canvas } from "../bootstrap.js";

export class Vector {
    constructor(x, y) {
        /** @type {?number} */
        this.x = x;
        /** @type {?number} */
        this.y = y;
    }

    /** @return {Vector} */
    toPixel(track) {
        return new Vector((this.x - track.camera.x) * track.zoomFactor + canvas.width / 2, (this.y - track.camera.y) * track.zoomFactor + canvas.height / 2);
    }

    /** @return {Vector} */
    normalizeToCanvas(track) {
        return new Vector((this.x - canvas.width / 2) / track.zoomFactor + track.camera.x, (this.y - canvas.height / 2) / track.zoomFactor + track.camera.y);
    }

    /** @return {Vector} */
    copy(point) {
        this.x = point.x;
        this.y = point.y;
        return this;
    }

    /** @return {Vector} */
    selfAdd(point) {
        this.x += point.x;
        this.y += point.y;
        return this;
    }

    /** @return {Vector} */
    selfSub(point) {
        this.x -= point.x;
        this.y -= point.y;
        return this;
    }

    /** @return {Vector} */
    selfScale(factor) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    /** @return {Vector} */
    clone() {
        return new Vector(this.x, this.y);
    }

    /** @return {Vector} */
    cloneAdd(point) {
        return new Vector(this.x + point.x, this.y + point.y);
    }

    /** @return {Vector} */
    cloneSub(point) {
        return new Vector(this.x - point.x, this.y - point.y);
    }

    /** @return {Vector} */
    cloneScale(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }

    /** @return {Vector} */
    cloneReciprocalScale(factor) {
        return new Vector(this.x / factor, this.y / factor);
    }

    /** @return {number} */
    dot(point) {
        return this.x * point.x + this.y * point.y;
    }

    /** @return {number} */
    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /** @return {number} */
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    /** @return {number} */
    distanceTo(point) {
        let dx = this.x - point.x,
            dy = this.y - point.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /** @return {number} */
    distanceToSquared(point) {
        let dx = this.x - point.x,
            dy = this.y - point.y;
        return dx * dx + dy * dy;
    }

    /** @return {string} */
    toString() {
        return Math.round(this.x).toString(32) + ' ' + Math.round(this.y).toString(32);
    }

    toJSON() {
        return [this.x, this.y];
    }
}