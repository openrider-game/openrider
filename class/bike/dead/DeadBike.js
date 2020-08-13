import { DeadRider } from "./DeadRider.js";
import { Bike } from "../Bike.js";

export class DeadBike extends Bike {
    constructor(bike, guy, track) {
        super(track);
        this.dead = true;
        this.rider = new DeadRider(guy, this);
        this.rider.setVelocity(bike.head.velocity, bike.backWheel.velocity);
        this.rider.direction = bike.direction;
        this.rider.gravity = bike.gravity;
        this.gravity = bike.gravity;
        this.time = bike.time;
        this.head = this.rider.head;
        this.bike = bike;
        this.deathPoint = bike.clone();
    }

    render() {
        this.bike.render();
        this.rider.render();
        if (this.hat) {
            this.hat.render();
        }
    }

    fixedUpdate() {
        this.bike.fixedUpdate();
        this.rider.fixedUpdate();
        if (this.hat) {
            this.hat.fixedUpdate();
        }
    }

    update(progress, delta) {
        this.bike.update(progress);
        this.rider.update(progress);
        if (this.hat) {
            this.hat.update(progress, delta);
        }
    }
}