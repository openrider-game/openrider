import { Vector } from "../Vector.js";
import { Item } from "./Item.js";
import { CanvasHelper } from "../helper/CanvasHelper.js";

export class DirectionalItem extends Item {
    constructor(x, y, rotation, parent) {
        super(x, y, parent);
        let rad = rotation * Math.PI / 180;
        this.rotation = rotation;
        this.direction = new Vector(-Math.sin(rad), Math.cos(rad));
    }

    render() {
        let drawer = CanvasHelper.getInstance();
        let track = this.track,
            pos = this.pos.toPixel(track);
        drawer.setProperty('fillStyle', this.$color);
        drawer.beginPath()
            .save();
        drawer.translate(pos.x, pos.y);
        drawer.rotate(this.rotation * Math.PI / 180);
        drawer.moveTo(-7 * track.zoomFactor, -10 * track.zoomFactor).lineTo(0, 10 * track.zoomFactor).lineTo(7 * track.zoomFactor, -10 * track.zoomFactor).lineTo(-7 * track.zoomFactor, -10 * track.zoomFactor).fill().stroke()
            .restore();
    }

    touch(part) {
        if (part.pos.distanceToSquared(this.pos) < 1000) {
            this.onTouch(part);
        }
    }

    toString() {
        return this.$name + " " + this.pos.toString() + ' ' + (this.rotation - 180).toString(32);
    }
}