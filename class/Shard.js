import { Point } from "./Point.js";
import { cos, rand, sin } from "./utils/MathUtils.js";
import { CanvasHelper } from "./helper/CanvasHelper.js";

export class Shard {
    constructor(pos, parent) {
        /** @type {Point} */
        this.pos = new Point(pos.x + 5 * (rand() - rand()), pos.y + 5 * (rand() - rand()));
        /** @type {Point} */
        this.oldPos = new Point(this.pos.x, this.pos.y);
        /** @type {Point} */
        this.velocity = new Point(11 * (rand() - rand()), 11 * (rand() - rand()));
        /** @type {Object} */
        this.parnt = parent;
        this.track = parent.parnt;
        /** @type {number} */
        this.size = 2 + rand() * 9;
        /** @type {number} */
        this.rotation = rand() * 6.2;
        /** @type {number} */
        this.rotationSpeed = rand() - rand();
        /** @type {number} */
        this.B6 = 0.05;
        /** @type {boolean} */
        this.touch = true;
        /** @type {Array.<number>} */
        this.shape = [1, 0.7, 0.8, 0.9, 0.5, 1, 0.7, 1];
    }

    draw() {
        let drawer = CanvasHelper.getInstance();
        let pos = this.pos.toPixel(this.track),
            s = this.size * this.track.zoomFactor,
            dist = this.shape[0] * s,
            x = pos.x + dist * cos(this.rotation),
            y = pos.y + dist * sin(this.rotation),
            i = 2;
        drawer.beginPath().moveTo(x, y)
            .fillStyle = '#000';
        for (; i < 8; i++) {
            dist = this.shape[i - 1] * s / 2;
            x = pos.x + dist * cos(this.rotation + 6.283 * i / 8);
            y = pos.y + dist * sin(this.rotation + 6.283 * i / 8);
            drawer.lineTo(x, y);
        }
        drawer.fill();
    }

    /** @param {Point} point */
    drive(point) {
        this.rotationSpeed = point.dot(this.velocity) / this.size;
        this.pos.selfAdd(point.cloneScale(-point.dot(this.velocity) * this.B6));
        this.rotation += this.rotationSpeed;
        let pos = point.getLength();
        if (pos > 0) {
            let AS = new Point(-point.y / pos, point.x / pos);
            this.oldPos.selfAdd(AS.cloneScale(AS.dot(this.velocity) * 0.8));
        }
    }

    proceed() {
        this.rotation += this.rotationSpeed;
        this.velocity.selfAdd(this.parnt.gravity);
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