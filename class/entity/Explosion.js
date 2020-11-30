import LinePath from "../numeric/LinePath.js";
import Vector from "../numeric/Vector.js";
import Entity from "./Entity.js";
import Shard from "./Shard.js";

export default class Explosion extends Entity {
    constructor(pos, vel, bike, time, track) {
        super(pos, vel);
        this.track = track;
        this.speedValue = 30 + 20 * Math.random();
        this.pieces = [
            new Shard(bike, pos, vel, this),
            new Shard(bike, pos, vel, this),
            new Shard(bike, pos, vel, this),
            new Shard(bike, pos, vel, this),
            new Shard(bike, pos, vel, this)
        ];

        this.pos = pos.clone();
        this.gravity = bike.gravity.clone();
        this.time = time;
    }

    fixedUpdate() {
        for (let piece of this.pieces) {
            piece.fixedUpdate();
        }
    }

    update(progress, delta) {
        for (let piece of this.pieces) {
            piece.update(progress, delta);
        }
    }

    render(ctx) {
        if (this.speedValue > 0) {
            this.speedValue -= 10;

            let center = this.pos.toPixel(this.track);
            let angle = Math.random() * 2 * Math.PI;

            let points = new Array();

            for (let i = 0; i < 16; i++) {
                let dist = (this.speedValue + 30 * Math.random()) / 2;
                let x = center.x + dist * Math.cos(angle + 2 * Math.PI * i / 16);
                let y = center.y + dist * Math.sin(angle + 2 * Math.PI * i / 16);
                points.push(new Vector(x, y));
            }

            ctx.fillStyle = '#ff0';
            LinePath.render(ctx, [
                points
            ]);
            ctx.fill();
        }

        for (let piece of this.pieces) {
            piece.render(ctx);
        }
    }
}