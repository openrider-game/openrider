import Tool from "./../Tool.js";
import Item from "../../item/Item.js";

export default class ItemTool extends Tool {
    static get itemClass() { return Item; }

    onMouseDown(e) {
        if (e.button !== 2) {
            let itemClass = this.constructor.itemClass;
            /** @type {Item} */
            let item = new itemClass(this.track.mousePos.clone(), this.track);

            item.grid = this.track.grid;
            item.cache = this.track.cache;

            item.addToTrack();
            this.track.undoManager.push({
                undo: () => item.removeFromTrack(),
                redo: () => item.addToTrack()
            });
        }
    }

    render(ctx) {
        let pos = this.track.mousePos.toPixel(this.track);
        ctx.fillStyle = this.constructor.itemClass.color;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = Math.max(2 * this.track.zoomFactor, 0.5);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 7 * this.track.zoomFactor, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}