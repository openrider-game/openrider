import ItemTool from "../ItemTool.js";

export default class StatusTool extends ItemTool {
    render(ctx) {
        let pos = this.track.mousePos.toPixel(this.track);
        ctx.fillStyle = this.constructor.itemClass.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = Math.max(2 * this.track.zoomFactor, 0.5);
        ctx.beginPath();
        ctx.rect(pos.x - 7 * this.track.zoomFactor, pos.y - 7 * this.track.zoomFactor, 14 * this.track.zoomFactor, 14 * this.track.zoomFactor);
        ctx.fill();
        ctx.stroke();
    }
}