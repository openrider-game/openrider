import { BodyPart } from "../bike/part/BodyPart.js";
import { Shard } from "./Shard.js";
import { CanvasHelper } from "../helper/CanvasHelper.js";

export class Explosion {
    constructor(pos, gravity, time, parent) {
        this.dead = true;
        this.track = parent;
        this.speedValue = 30 + 20 * Math.random();
        this.pointsf = 0;
        this.pieces = [
            new Shard(pos, this),
            new Shard(pos, this),
            new Shard(pos, this),
            new Shard(pos, this),
            new Shard(pos, this)
        ];
        this.pos = pos.clone();
        this.gravity = gravity;
        this.time = time;
        this.head = new BodyPart(pos, this);
        this.head.velocity.x = 20;
    }

    render() {
        let drawer = CanvasHelper.getInstance();
        if (this.speedValue > 0) {
            this.speedValue -= 10;
            let center = this.pos.toPixel(this.track),
                angle = Math.random() * 2 * Math.PI,
                dist = this.speedValue / 2,
                x = center.x + dist * Math.cos(angle),
                y = center.y + dist * Math.sin(angle);
            drawer.setProperty('fillStyle', '#ff0');
            drawer.beginPath().moveTo(x, y);
            for (let i = 1; i < 16; i++) {
                dist = (this.speedValue + 30 * Math.random()) / 2;
                x = center.x + dist * Math.cos(angle + 2 * Math.PI * i / 16);
                y = center.y + dist * Math.sin(angle + 2 * Math.PI * i / 16);
                drawer.lineTo(x, y);
            }
            drawer.fill();
        }
        for (let i = 0, l = this.pieces.length; i < l; i++) {
            this.pieces[i].render();
        }
    }

    fixedUpdate() {
        for (let i = this.pieces.length - 1; i >= 0; i--) {
            this.pieces[i].fixedUpdate();
        }
    }

    update(progress, delta) {
        for (let i = this.pieces.length - 1; i >= 0; i--) {
            this.pieces[i].update(progress, delta);
        }
    }
}