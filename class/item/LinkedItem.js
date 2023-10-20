import LinkedItemGroup from "./LinkedItemGroup.js";
import ReachableItem from "./ReachableItem.js";

export default class LinkedItem extends ReachableItem {
    static get itemCount() { return 2; }
    static get argumentCount() { return 2; }

    constructor(pos, track) {
        super(pos, track);
        /** @type {LinkedItemGroup} */
        this.group = null;
    }

    addToTrack(fromGroup) {
        if (fromGroup) {
            super.addToTrack();
        } else {
            this.group.addToTrack();
        }
    }

    removeFromTrack(fromGroup) {
        if (fromGroup) {
            super.removeFromTrack();
        } else {
            this.group.removeFromTrack();
        }
    }

    onTouch(part) {
        this.group.onTouch(part, this);
    }

    toString(fromGroup) {
        if (fromGroup) {
            return super.toString();
        } else {
            return this.group.toString(this.constructor.code);
        }
    }

    /**
     *
     * @param {CanvasRenderingContext2D} ctx
     */
    renderDebug(ctx) {
        ctx.save();
        ctx.strokeStyle = '#f00';
        let pos = this.pos.toPixel(this.track);
        ctx.moveTo(pos.x, pos.y);
        this.group.instances.filter(obj => obj !== this).forEach(other => {
            let pos = other.pos.toPixel(this.track);
            ctx.lineTo(pos.x, pos.y);
        });
        ctx.stroke();

        ctx.restore();
    }

    static createInstance(itemCode, track, fromGroup) {
        if (fromGroup) {
            return super.createInstance(itemCode, track);
        } else {
            return LinkedItemGroup.createInstance(itemCode, track, this);
        }
    }
}