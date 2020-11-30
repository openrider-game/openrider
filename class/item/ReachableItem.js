import Item from "./Item.js";
import BikePart from "../entity/BikePart.js";
import GhostRunner from "../bike/GhostRunner.js";

export default class ReachableItem extends Item {
    /**
     *
     * @param {Vector} pos
     * @param {Track} track
     */
    constructor(pos, track) {
        super(pos, track);
        /** @type {boolean} */
        this.reached = false;
    }

    static get reachedColor() { return '#fff'; }

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        let pos = this.pos.toPixel(this.track);
        ctx.fillStyle = this.reached ? this.constructor.reachedColor : this.constructor.color;
        ctx.lineWidth = Math.max(2 * this.track.zoomFactor, 0.5);
        ctx.beginPath();
        ctx.moveTo(pos.x + 7 * this.track.zoomFactor, pos.y);
        ctx.arc(pos.x, pos.y, 7 * this.track.zoomFactor, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.stroke();
    }

    /**
     *
     * @param {BikePart} part
     */
    onTouch(part) {
        if (part.bike.runner instanceof GhostRunner || !this.reached) {
            if (!(part.bike.runner instanceof GhostRunner)) {
                this.reached = true;
            }
            this.onReach(part);
        }
    }

    /**
     *
     * @param {BikePart} part
     */
    onReach(part) {}
}