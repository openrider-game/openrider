import { Vector } from "../Vector.js";
import { CanvasHelper } from "../helper/CanvasHelper.js";

export class Item {

    constructor(x, y, parent) {
        this.pos = new Vector(x, y);
        this.track = parent;
        this.$id = Item.$id++;
    }

    render() {
        let drawer = CanvasHelper.getInstance();
        let track = this.track,
            pos = this.pos.toPixel(track);
        drawer.setProperty('fillStyle', this.$color);
        drawer.beginPath().moveTo(pos.x + 7 * track.zoomFactor, pos.y).arc(pos.x, pos.y, 7 * track.zoomFactor, 0, 2 * Math.PI, true).fill().stroke();
    }

    touch(part) {
        if (part.pos.distanceToSquared(this.pos) < 500 && !part.bike.isGhost) {
            this.onTouch(part);
        }
    }

    checkDelete(eraserPoint, radius) {
        if (eraserPoint.distanceTo(this.pos) < radius + 7) {
            this.remove();
            return this;
        }
        return false;
    }

    remove() {
        this.doRemove = true;
        this.track.remove(this.pos);
        this.onDelete();
        return this;
    }

    addToTrack() {
        this.track.addObject(this);
    }

    toString() {
        return this.$name + ' ' + this.pos.toString();
    }

    onTouch() {}
    onDelete() {}
}

Item.TYPES = {
    f: "Boost",
    g: "Gravity",
    t: "Target",
    c: "Checkpoint",
    e: "Bomb",
    s: "SlowMo"
};

Item.$id = 0;