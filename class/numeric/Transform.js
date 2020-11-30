import Vector from "./Vector.js";

export default class Transform {
    /**
     *
     * @param {Vector} vec
     * @param {Vector} x
     * @param {Vector} y
     */
    constructor(vec, x, y) {
        this.vec = vec;
        this.x = x;
        this.y = y;
    }

    /**
     *
     * @param {number} xFactor
     * @param {number} yFactor
     */
    scale(xFactor, yFactor) {
        return this.vec.add(this.x.scale(xFactor)).add(this.y.scale(yFactor));
    }
}