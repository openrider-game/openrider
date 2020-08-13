import { Vector } from "../../Vector.js";
import { track } from "../../../bootstrap.js";
import { Mass } from "./Mass.js";

export class BodyPart extends Mass {
    constructor(pos, parent) {
        super(pos);
        /** @type {(BMX|MTB|DeadRider)} */
        this.bike = parent;
        /** @type {number} */
        this.size = 10;
        /** @type {number} */
        this.friction = 0;
        /** @type {boolean} */
        this.touch = true;
    }

    /**
     * @param {Vector} point
     */
    drive(point) {
        this.pos.selfAdd(point.scale(-point.dot(this.velocity) * this.friction));
        this.driving = true;
    }

    fixedUpdate() {
        this.velocity.selfAdd(this.bike.gravity).selfScale(0.99);
        //~ this.velocity = this.velocity.scale(0.99);
        this.pos.selfAdd(this.velocity);
        this.driving = false;
        if (this.touch) {
            track.touch(this);
        }
        this.velocity = this.pos.sub(this.oldPos);
        this.oldPos.set(this.pos);
    }

    clone() {
        let clone = new BodyPart(this.pos, this.bike);
        clone.oldPos = this.oldPos.clone();
        clone.velocity = this.velocity.clone();
        clone.size = this.size;
        clone.friction = this.friction;
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