export class Vector {
    constructor(x = 0, y = 0) {
        /** @type {?number} */
        this.x = x;
        /** @type {?number} */
        this.y = y;
    }

    /** @return {Vector} */
    toPixel(track) {
        return new Vector((this.x - track.camera.x) * track.zoomFactor + track.canvas.width / 2, (this.y - track.camera.y) * track.zoomFactor + track.canvas.height / 2);
    }

    /** @return {Vector} */
    normalizeToCanvas(track) {
        return new Vector((this.x - track.canvas.width / 2) / track.zoomFactor + track.camera.x, (this.y - track.canvas.height / 2) / track.zoomFactor + track.camera.y);
    }

    /** @return {Vector} */
    set(vector) {
        this.x = vector.x;
        this.y = vector.y;
        return this;
    }

    /** @return {Vector} */
    selfAdd(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    /** @return {Vector} */
    selfSub(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
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
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    /** @return {Vector} */
    sub(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    /** @return {Vector} */
    scale(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }

    /** @return {Vector} */
    recipScale(factor) {
        return new Vector(this.x / factor, this.y / factor);
    }

    /** @return {number} */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
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
    distanceTo(vector) {
        let dx = this.x - vector.x,
            dy = this.y - vector.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /** @return {number} */
    distanceToSquared(vector) {
        let dx = this.x - vector.x,
            dy = this.y - vector.y;
        return dx * dx + dy * dy;
    }

    /** @return {string} */
    toString() {
        return Math.round(this.x).toString(32) + ' ' + Math.round(this.y).toString(32);
    }

    toArray() {
        return [this.x, this.y];
    }

    toJSON() {
        return [this.x, this.y];
    }
}