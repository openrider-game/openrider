import { Vector } from '../../Vector.js';

export class Mass {
    constructor(pos = new Vector(0, 0), vel = new Vector(0, 0), size) {
        /** @type {Vector} */
        this.pos = pos.clone();
        /** @type {Vector} */
        this.oldPos = pos.clone();
        /** @type {Vector} */
        this.displayPos = pos.add(vel);
        /** @type {Vector} */
        this.velocity = vel.clone();
        /** @type {Number} */
        this.size = 10;
    }

    drive() {}
    fixedUpdate() {
        this.displayPos = this.pos;
    }
    update(progress) {
        this.displayPos = this.pos.add(this.velocity.scale(progress));
    }
}