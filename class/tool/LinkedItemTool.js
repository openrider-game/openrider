import LinkedItem from "../item/LinkedItem.js";
import LinkedItemGroup from "../item/LinkedItemGroup.js";
import ItemTool from "./item/ItemTool.js";

export default class LinkedItemTool extends ItemTool {
    static get itemClass() { return LinkedItem; }

    constructor(track) {
        super(track);

        this.posToCreate = new Array();
        this.alwaysRender = true;
    }

    activate() {
        super.activate();
        this.posToCreate = new Array();
    }

    createGroup() {
        let group = new LinkedItemGroup(this.track);
        group.grid = this.track.grid;
        group.cache = this.track.cache;

        for (let posToCreate of this.posToCreate) {
            let itemClass = this.constructor.itemClass;
            /** @type {LinkedItem} */
            let item = new itemClass(posToCreate, this.track);

            item.group = group;
            group.instances.push(item);
        }

        group.addToTrack();
        this.track.undoManager.push({
            undo: () => group.removeFromTrack(),
            redo: () => group.addToTrack()
        });
    }

    onMouseDown(e) {
        if (this.posToCreate.length < this.constructor.itemClass.itemCount) {
            this.posToCreate.push(this.track.mousePos.clone());
        }

        if (this.posToCreate.length == this.constructor.itemClass.itemCount) {
            this.createGroup();
            this.posToCreate = new Array();
        }
    }

    render(ctx) {
        ctx.save();
        if (this.track.event.mouseIn) {
            super.render(ctx);
        }

        let pos = null;
        for (let posToCreate of this.posToCreate) {
            if (pos != null) {
                this.renderLink(ctx, pos, posToCreate);
            }
            pos = posToCreate.toPixel(this.track);
            ctx.fillStyle = this.constructor.itemClass.color;
            ctx.strokeStyle = '#000';
            ctx.lineWidth = Math.max(2 * this.track.zoomFactor, 0.5);
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 7 * this.track.zoomFactor, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }

        if (pos != null) {
            this.renderLink(ctx, pos, this.track.mousePos.toPixel(this.track));
        }
        ctx.restore();
    }

    renderLink(ctx, a, b) {
        ctx.strokeStyle = '#f00';
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
    }
}