import { BodyPart } from "../bike/part/BodyPart.js";
import { Shard } from "../Shard.js";
import { context } from "../../unobfuscated_bhr.js";
import { rand, PI2, cos, sin } from "../utils/MathUtils.js";
import { beginPath, moveTo, lineTo, fill } from "../utils/DrawUtils.js";

export class Explosion {
    constructor(pos, gravity, time, parent) {
        this.dead = true;
        this.parnt = parent;
        this.speedValue = 30 + 20 * rand();
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

    draw() {
        var i, l;
        if (this.speedValue > 0) {
            this.speedValue -= 10;
            var center = this.pos.toPixel(this.parnt),
                angle = rand() * PI2,
                dist = this.speedValue / 2,
                x = center.x + dist * cos(angle),
                y = center.y + dist * sin(angle);
            context.fillStyle = '#ff0';
            context[beginPath]()[moveTo](x, y);
            for (i = 1; i < 16; i++) {
                dist = (this.speedValue + 30 * rand()) / 2;
                x = center.x + dist * cos(angle + PI2 * i / 16);
                y = center.y + dist * sin(angle + PI2 * i / 16);
                context[lineTo](x, y);
            }
            context[fill]();
        }
        for (i = 0, l = this.pieces.length; i < l; i++) {
            this.pieces[i].draw();
        }
    }

    proceed() {
        for (var i = this.pieces.length - 1; i >= 0; i--) {
            this.pieces[i].proceed();
        }
    }
}