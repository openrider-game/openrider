import Vector from "../numeric/Vector.js";
import BikePart from "./BikePart.js";

export default class Wheel extends BikePart {
    constructor(center, bike) {
        super(center, bike);

        this.motor = 0.3;
        this.rotationSpeed = 0;
        this.speedValue = 0;
    }

    /** @param {Vector} point */
    drive(point) {
        this.pos.selfAdd(point.scale(this.speedValue * this.bike.direction));
        if (this.bike.runner.downPressed) {
            this.addFriction(point);
        }
        this.rotationSpeed = point.dot(this.velocity) / this.size;
        this.driving = true;
    }

    /** @returns {Wheel} */
    clone() {
        let clone = super.clone();
        clone.speedValue = this.speedValue;
        return clone;
    }
}