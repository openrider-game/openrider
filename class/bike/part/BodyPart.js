import { Point } from "../../Point.js";
import { track } from "../../../bootstrap.js";

export class BodyPart {
    constructor(pos, parent) {
        /** @type {Point} */
        this.pos = pos.clone();
        /** @type {Point} */
        this.oldPos = pos.clone();
        /** @type {Point} */
        this.velocity = new Point(0, 0);
        /** @type {(BMX|MTB|DeadRider)} */
        this.bike = parent;
        /** @type {number} */
        this.size = 10;
        /** @type {number} */
        this.B6 = 0;
        /** @type {boolean} */
        this.touch = true;
    }

    /**
     * @param {Point} point
     */
    drive(point) {
        this.pos.selfAdd(point.cloneScale(-point.dot(this.velocity) * this.B6));
        this.driving = true;
    }

    update() {
        this.velocity.selfAdd(this.bike.gravity).selfScale(0.99);
        //~ this.velocity = this.velocity.cloneScale(0.99);
        this.pos.selfAdd(this.velocity);
        this.driving = false;
        if (this.touch) {
            track.touch(this);
        }
        this.velocity = this.pos.cloneSub(this.oldPos);
        this.oldPos.copy(this.pos);
    }

    clone() {
        let clone = new BodyPart(this.pos, this.bike);
        clone.oldPos = this.oldPos.clone();
        clone.velocity = this.velocity.clone();
        clone.size = this.size;
        clone.B6 = this.B6;
        return clone;
    }

    toJSON() {
        return {
            $$: 'BodyPart',
            pos: this.pos,
            oldPos: this.oldPos,
            velocity: this.velocity,
            size: this.size
        };
    }
}