import { Vector } from "../Vector.js";
import { CanvasHelper } from "../helper/CanvasHelper.js";

export class Shard {
    constructor(pos, parent) {
        /** @type {Vector} */
        this.pos = new Vector(pos.x + 5 * (Math.random() - Math.random()), pos.y + 5 * (Math.random() - Math.random()));
        /** @type {Vector} */
        this.oldPos = new Vector(this.pos.x, this.pos.y);
        /** @type {Vector} */
        this.velocity = new Vector(11 * (Math.random() - Math.random()), 11 * (Math.random() - Math.random()));
        /** @type {Object} */
        this.bike = parent;
        this.track = parent.track;
        /** @type {number} */
        this.size = 2 + Math.random() * 9;
        /** @type {number} */
        this.rotation = Math.random() * 6.2;
        /** @type {number} */
        this.rotationSpeed = Math.random() - Math.random();
        /** @type {number} */
        this.friction = 0.05;
        /** @type {boolean} */
        this.touch = true;
        /** @type {Array.<number>} */
        this.shape = [1, 0.7, 0.8, 0.9, 0.5, 1, 0.7, 1];
    }

    render() {
        let drawer = CanvasHelper.getInstance();
        let pos = this.pos.toPixel(this.track),
            s = this.size * this.track.zoomFactor,
            dist = this.shape[0] * s,
            x = pos.x + dist * Math.cos(this.rotation),
            y = pos.y + dist * Math.sin(this.rotation),
            i = 2;
        drawer.beginPath().moveTo(x, y)
            .fillStyle = '#000';
        for (; i < 8; i++) {
            dist = this.shape[i - 1] * s / 2;
            x = pos.x + dist * Math.cos(this.rotation + 6.283 * i / 8);
            y = pos.y + dist * Math.sin(this.rotation + 6.283 * i / 8);
            drawer.lineTo(x, y);
        }
        drawer.fill();
    }

    /** @param {Vector} point */
    drive(point) {
        this.rotationSpeed = point.dot(this.velocity) / this.size;
        this.pos.selfAdd(point.cloneScale(-point.dot(this.velocity) * this.friction));
        this.rotation += this.rotationSpeed;
        let pos = point.getLength();
        if (pos > 0) {
            let AS = new Vector(-point.y / pos, point.x / pos);
            this.oldPos.selfAdd(AS.cloneScale(AS.dot(this.velocity) * 0.8));
        }
    }

    update() {
        this.rotation += this.rotationSpeed;
        this.velocity.selfAdd(this.bike.gravity);
        this.velocity = this.velocity.cloneScale(0.99);
        this.pos.selfAdd(this.velocity);
        this.driving = false;
        if (this.touch) {
            this.track.touch(this);
        }
        this.velocity = this.pos.cloneSub(this.oldPos);
        this.oldPos.copy(this.pos);
    }
}