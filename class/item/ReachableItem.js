import { Item } from "./Item.js";
import { context } from "../../unobfuscated_bhr.js";
import { PI2 } from "../utils/MathUtils.js";
import { beginPath, moveTo, arc, fill, stroke } from "../utils/DrawUtils.js";

export class ReachableItem extends Item {
    constructor(x, y, parent) {
        super(x, y, parent);
        this.reached = false;
    }

    draw() {
        var track = this.parnt,
            pos = this.pos.toPixel(track);
        context.fillStyle = this.reached ? this.$reachedColor : this.$color;
        context.lineWidth = 2 * track.zoomFactor;
        context[beginPath]()[moveTo](pos.x + 7 * track.zoomFactor, pos.y)[arc](pos.x, pos.y, 7 * track.zoomFactor, 0, PI2, true)[fill]()[stroke]();
    }

    touch(part) {
        if (part.pos.distanceToSquared(this.pos) < 500) {
            this.onTouch(part);
        }
    }

    onTouch(part) {
        if (part.parnt.isGhost) {
            this.onReachGhost(part);
        } else if (!this.reached) {
            this.reached = true;
            this.onReach(part);
        }
    }

    onReach() {}
    onReachGhost() {}
}