import Bike from "../bike/instance/Bike.js";
import Vector from "../numeric/Vector.js";
import Entity from "./Entity.js";

export default class BikePart extends Entity {
    constructor(pos, bike) {
        super(pos);

        /** @type {Bike} */
        this.bike = bike;

        this.motor = 0;
        this.touch = true;
        this.driving = false;
    }

    /** @param {Vector} point */
    drive(point) {
        this.addFriction(point);
        this.driving = true;
    }

    /** @param {Vector} point */
    addFriction(point) {
        this.pos.selfAdd(point.scale(-point.dot(this.velocity) * this.motor));
    }

    fixedUpdate() {
        this.velocity.selfAdd(this.bike.gravity).selfScale(this.bike.friction);
        this.pos.selfAdd(this.velocity);
        this.driving = false;
        if (this.touch) {
            this.bike.track.touch(this);
        }
        this.velocity = this.pos.sub(this.oldPos);
        this.oldPos.set(this.pos);
        super.fixedUpdate();
    }

    /** @returns {BikePart} */
    clone() {
        let clone = new this.constructor(this.pos, this.bike);
        clone.oldPos = this.oldPos.clone();
        clone.velocity = this.velocity.clone();
        clone.size = this.size;
        clone.friction = this.motor;
        clone.driving = this.driving;
        return clone;
    }
}