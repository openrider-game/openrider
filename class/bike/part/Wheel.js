import { Point } from "../../Point.js";
import { track } from "../../../bootstrap.js";

export class Wheel {
    /**
     * 
     * @param {Point} center 
     * @param {(BMX|MTB|DeadRider)} parent 
     */
    constructor(center, parent) {
        /** @type {Point} */
        this.pos = center.clone();
        /** @type {Point} */
        this.oldPos = center.clone();
        /** @type {Point} */
        this.velocity = new Point(0, 0);
        /** @type {(BMX|MTB|DeadRider)} */
        this.parnt = parent;
        /** @type {Number} */
        this.size = 10;
        /** @type {Number} */
        this.friction = 0;
        /** @type {Boolean} */
        this.touch = true;
        this.gravity = true;  // from what I can tell, this is never used.
        /** @type {Number} */
        this.rotationSpeed = 0;
        /** @type {Number} */
        this.speedValue = 0;
    }

    /** @param {Point} point */
    drive(point) {
        this.pos.selfAdd(point.cloneScale(this.speedValue * this.parnt.direction));
        if (this.downPressed) {
            this.pos.selfAdd(point.cloneScale(-point.dot(this.velocity) * 0.3));
        }
        this.rotationSpeed = point.dot(this.velocity) / this.size;
        this.driving = true;
    }

    update() {
        this.velocity.selfAdd(this.parnt.gravity).selfScale(0.99);
        this.pos.selfAdd(this.velocity);
        this.driving = false;
        if (this.touch) {
            track.touch(this);
        }
        this.velocity = this.pos.cloneSub(this.oldPos);
        this.oldPos.copy(this.pos);
    }

    clone() {
        let clone = new Wheel(this.pos, this.parnt);
        clone.oldPos = this.oldPos.clone();
        clone.velocity = this.velocity.clone();
        clone.speedValue = this.speedValue;
        return clone;
    }

    toJSON() {
        return {
            $$: 'Wheel',
            pos: this.pos,
            oldPos: this.oldPos,
            velocity: this.velocity,
            speedValue: this.speedValue,
            rotationSpeed: this.rotationSpeed,
            size: this.size,
            friction: this.friction
        };
    }
}