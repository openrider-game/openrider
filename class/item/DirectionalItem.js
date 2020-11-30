import Item from "./Item.js";
import Vector from "../numeric/Vector.js";
import Entity from "../entity/Entity.js";

export default class DirectionalItem extends Item {
    /**
     *
     * @param {Vector} pos
     * @param {number} rotation
     * @param {Track} track
     */
    constructor(pos, rotation, track) {
        super(pos, track);
        /** @type {number} */
        this.rotation = rotation;
        let rad = rotation * Math.PI / 180;
        /** @type {Vector} */
        this.direction = new Vector(-Math.sin(rad), Math.cos(rad));
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        let pos = this.pos.toPixel(this.track);
        ctx.fillStyle = this.constructor.color;
        ctx.lineWidth = Math.max(2 * this.track.zoomFactor, 0.5);
        ctx.beginPath();
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.moveTo(-7 * this.track.zoomFactor, -10 * this.track.zoomFactor);
        ctx.lineTo(0, 10 * this.track.zoomFactor);
        ctx.lineTo(7 * this.track.zoomFactor, -10 * this.track.zoomFactor);
        ctx.lineTo(-7 * this.track.zoomFactor, -10 * this.track.zoomFactor);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    /**
     *
     * @param {Entity} part
     */
    touch(part) {
        if (part.pos.distanceToSquared(this.pos) < 1000) {
            this.onTouch(part);
        }
    }

    toString() {
        return this.name + " " + this.pos.toString() + ' ' + (this.rotation - 180).toString(32);
    }
}