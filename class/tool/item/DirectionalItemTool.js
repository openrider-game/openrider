import ItemTool from "./ItemTool.js";
import DirectionalItem from "../../item/DirectionalItem.js";

export default class DirectionalItemTool extends ItemTool {
    static get itemClass() { return DirectionalItem; }

    onMouseDown(e) {
        if (e.button !== 2) {
            this.mouseDown = true;
        }
    }

    onMouseUp(e) {
        if (!this.mouseDown) return;

        this.mouseDown = false;

        let itemClass = this.constructor.itemClass;
        let radians = Math.atan2(this.track.lastClick.x - this.track.mousePos.x, this.track.mousePos.y - this.track.lastClick.y);
        let rotation = Math.round(radians * 180 / Math.PI);

        /** @type {DirectionalItem} */
        let item = new itemClass(this.track.lastClick.clone(), rotation, this.track);

        item.grid = this.track.grid;
        item.cache = this.track.cache;

        item.addToTrack();
        this.track.undoManager.push({
            undo: () => item.removeFromTrack(),
            redo: () => item.addToTrack()
        });
    }

    render(ctx) {
        let lastClick = this.track.lastClick.toPixel(this.track);
        let pos = this.track.mousePos.toPixel(this.track);

        ctx.beginPath();
        ctx.fillStyle = this.constructor.itemClass.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = Math.max(0.5, this.track.zoomFactor * 2);
        ctx.save();

        if (this.mouseDown) {
            ctx.arc(pos.x, pos.y, 3 * this.track.zoomFactor, 0, 2 * Math.PI);

            ctx.translate(lastClick.x, lastClick.y);
            ctx.rotate(Math.atan2(lastClick.x - pos.x, pos.y - lastClick.y));
        } else {
            ctx.translate(pos.x, pos.y);
        }

        ctx.moveTo(-7 * this.track.zoomFactor, -10 * this.track.zoomFactor);
        ctx.lineTo(0, 10 * this.track.zoomFactor);
        ctx.lineTo(7 * this.track.zoomFactor, -10 * this.track.zoomFactor);
        ctx.lineTo(-7 * this.track.zoomFactor, -10 * this.track.zoomFactor);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}