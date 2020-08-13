import { Vector } from "../../Vector.js";
import { track } from "../../../bootstrap.js";
import { Mass } from "./Mass.js";

export class Wheel extends Mass {
    /**
     *
     * @param {Vector} center
     * @param {(BMX|MTB|DeadRider)} parent
     */
    constructor(center, parent) {
        super(center);
        /** @type {(BMX|MTB|DeadRider)} */
        this.bike = parent;
        /** @type {Number} */
        this.size = 10;
        /** @type {Number} */
        this.friction = 0;
        /** @type {Boolean} */
        this.touch = true;
        /** @type {Number} */
        this.rotationSpeed = 0;
        /** @type {Number} */
        this.speedValue = 0;
    }

    /** @param {Vector} point */
    drive(point) {
        this.pos.selfAdd(point.scale(this.speedValue * this.bike.direction));
        if (this.downPressed) {
            this.pos.selfAdd(point.scale(-point.dot(this.velocity) * 0.3));
        }
        this.rotationSpeed = point.dot(this.velocity) / this.size;
        this.driving = true;
    }

    fixedUpdate() {
        this.velocity.selfAdd(this.bike.gravity).selfScale(0.99);
        this.pos.selfAdd(this.velocity);
        this.driving = false;
        if (this.touch) {
            track.touch(this);
        }
        this.velocity = this.pos.sub(this.oldPos);
        this.oldPos.set(this.pos);
    }

    clone() {
        let clone = new Wheel(this.pos, this.bike);
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