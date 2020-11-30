import GameObject from "../game/GameObject.js";
import Vector from "../numeric/Vector.js";

export default class Entity extends GameObject {
    /**
     *
     * @param {Vector} pos
     * @param {Vector} vel
     * @param {number} size
     */
    constructor(pos = new Vector(), vel = new Vector(), size = 10) {
        super();
        /** @type {Vector} */
        this.pos = pos.clone();
        /** @type {Vector} */
        this.oldPos = pos.clone();
        /** @type {Vector} */
        this.displayPos = pos.add(vel);
        /** @type {Vector} */
        this.velocity = vel.clone();
        /** @type {number} */
        this.size = size;
    }

    fixedUpdate() {
        this.displayPos = this.pos;
    }

    update(progress, delta) {
        this.displayPos = this.pos.add(this.velocity.scale(progress));
    }

    render(ctx) {}
}