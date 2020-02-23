import { Point } from "../Point.js";
import { eraserSize } from "../../bootstrap.js";
import { CanvasHelper } from "../helper/CanvasHelper.js";

export class Item {
    static TYPES = {
        f: "Boost",
        g: "Gravity",
        t: "Target",
        c: "Checkpoint",
        e: "Bomb",
        s: "SlowMo"
    };

    static $id = 0;

    constructor(x, y, parent) {
        this.pos = new Point(x, y);
        this.parnt = parent;
        this.$id = Item.$id++;
    }

    draw() {
        let drawer = CanvasHelper.getInstance();
        let track = this.parnt,
            pos = this.pos.toPixel(track);
        drawer.setProperty('fillStyle', this.$color);
        drawer.beginPath().moveTo(pos.x + 7 * track.zoomFactor, pos.y).arc(pos.x, pos.y, 7 * track.zoomFactor, 0, 2 * Math.PI, true).fill().stroke();
    }

    touch(part) {
        if (part.pos.distanceToSquared(this.pos) < 500 && !part.parnt.isGhost) {
            this.onTouch(part);
        }
    }

    checkDelete(eraserPoint) {
        if (eraserPoint.distanceTo(this.pos) < eraserSize + 7) {
            this.remove();
            return this;
        }
        return false;
    }

    remove() {
        this.doRemove = true;
        this.parnt.remove(this.pos);
        this.onDelete();
        return this;
    }

    toString() {
        return this.$name + ' ' + this.pos.toString();
    }

    onTouch() {}
    onDelete() {}
}