import { Point } from "../Point.js";
import { Item } from "./Item.js";
import { context } from "../../unobfuscated_bhr.js";
import { sin, cos } from "../utils/MathUtils.js";
import { beginPath, moveTo, lineTo, fill, stroke } from "../utils/DrawUtils.js";

export class DirectionalItem extends Item {
    constructor(x, y, rotation, parent) {
        super(x, y, parent);
        let rad = rotation * Math.PI / 180;
        this.rotation = rotation;
        this.direction = new Point(-sin(rad), cos(rad));
    }

    draw() {
        let track = this.parnt,
            pos = this.pos.toPixel(track);
        context.fillStyle = this.$color;
        context[beginPath]()
            .save();
        context.translate(pos.x, pos.y);
        context.rotate(this.rotation * Math.PI / 180);
        context[moveTo](-7 * track.zoomFactor, -10 * track.zoomFactor)[lineTo](0, 10 * track.zoomFactor)[lineTo](7 * track.zoomFactor, -10 * track.zoomFactor)[lineTo](-7 * track.zoomFactor, -10 * track.zoomFactor)[fill]()[stroke]()
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