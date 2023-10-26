import ReachableItem from "./ReachableItem.js";

export default class StatusItem extends ReachableItem {

    /**
     * @param {CanvasRenderingContext2D} ctx
     */
    render(ctx) {
        let pos = this.pos.toPixel(this.track);

        ctx.save();
        ctx.fillStyle = this.reached ? this.constructor.reachedColor : this.constructor.color;
        ctx.lineWidth = Math.max(2 * this.track.zoomFactor, 0.5);
        ctx.beginPath();
        ctx.rect(pos.x - 7 * this.track.zoomFactor, pos.y - 7 * this.track.zoomFactor, 14 * this.track.zoomFactor, 14 * this.track.zoomFactor);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }
}