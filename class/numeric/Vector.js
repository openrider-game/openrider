import Track from "../track/Track.js";

export default class Vector {
    /**
     *
     * @param {number} x
     * @param {number} y
     */
    constructor(x = 0, y = 0) {
        /** @type {number} */
        this.x = x;
        /** @type {number} */
        this.y = y;
    }

    /**
     *
     * @param {Track} track
     * @returns {Vector}
     */
    toPixel(track) {
        return new Vector((this.x - track.camera.x) * track.zoomFactor + track.canvas.width / 2, (this.y - track.camera.y) * track.zoomFactor + track.canvas.height / 2);
    }

    /**
     *
     * @param {Track} track
     * @returns {Vector}
     */
    normalizeToCanvas(track) {
        return new Vector((this.x - track.canvas.width / 2) / track.zoomFactor + track.camera.x, (this.y - track.canvas.height / 2) / track.zoomFactor + track.camera.y);
    }

    /**
     *
     * @param {Vector} vector
     * @returns {Vector}
     */
    set(vector) {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }

    /**
     *
     * @param {Vector} vector
     * @returns {Vector}
     */
    selfAdd(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /**
     *
     * @param {Vector} vector
     * @returns {Vector}
     */
    selfSub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    /**
     *
     * @param {Vector} vector
     * @returns {Vector}
     */
    selfScale(factor) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    /** @returns {Vector} */
    clone() {
        return new Vector(this.x, this.y);
    }

    /**
     *
     * @param {Vector} vector
     * @returns {Vector}
     */
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    /**
     *
     * @param {Vector} vector
     * @returns {Vector}
     */
    sub(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    /**
     *
     * @param {Vector} vector
     * @returns {Vector}
     */
    scale(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }

    /**
     *
     * @param {Vector} vector
     * @returns {Vector}
     */
    recipScale(factor) {
        return new Vector(this.x / factor, this.y / factor);
    }

    /**
     *
     * @param {Vector} vector
     * @returns {number}
     */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    /** @returns {number} */
    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /** @returns {number} */
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    /**
     *
     * @param {Vector} vector
     * @returns {number}
     */
    distanceTo(vector) {
        let dx = this.x - vector.x,
            dy = this.y - vector.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     *
     * @param {Vector} vector
     * @returns {number}
     */
    distanceToSquared(vector) {
        let dx = this.x - vector.x,
            dy = this.y - vector.y;
        return dx * dx + dy * dy;
    }

    /** @returns {string} */
    toString() {
        return Math.round(this.x).toString(32) + ' ' + Math.round(this.y).toString(32);
    }

    /** @returns {[number, number]} */
    toArray() {
        return [this.x, this.y];
    }
}