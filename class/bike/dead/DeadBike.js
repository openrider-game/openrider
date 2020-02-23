import { DeadRider } from "./DeadRider.js";

export class DeadBike {
    constructor(bike, guy, parent) {
        this.dead = true;
        this.parnt = parent;
        this.rider = new DeadRider(guy, this);
        this.rider.pull(bike.head.velocity, bike.backWheel.velocity);
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

    update() {
        this.bike.update();
        this.rider.update();
        if (this.hat) {
            this.hat.update();
        }
    }
}