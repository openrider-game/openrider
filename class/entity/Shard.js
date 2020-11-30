import LinePath from "../numeric/LinePath.js";
import Vector from "../numeric/Vector.js";
import Entity from "./Entity.js";

export default class Shard extends Entity {
    constructor(bike, pos, vel, explosion) {
        super(
            new Vector(pos.x + 5 * (Math.random() - Math.random()), pos.y + 5 * (Math.random() - Math.random())),
            new Vector(vel.x + 5 * (Math.random() - Math.random()), vel.y + 5 * (Math.random() - Math.random()))
        );

        this.bike = bike;
        this.explosion = explosion;
        this.track = this.explosion.track;

        this.size = 2 + Math.random() * 9;
        this.rotation = Math.random() * 2 * Math.PI;
        this.rotationSpeed = Math.random() - Math.random();
        this.friction = 0.05;
        this.touch = true;
        this.shape = [1, 0.7, 0.8, 0.9, 0.5, 1, 0.7, 1];
    }

    /** @param {Vector} point */
    drive(point) {
        this.rotationSpeed = point.dot(this.velocity) / this.size;
        this.pos.selfAdd(point.scale(-point.dot(this.velocity) * this.friction));
        this.rotation += this.rotationSpeed;
        let pos = point.getLength();
        if (pos > 0) {
            let distancePerpendicular = new Vector(-point.y / pos, point.x / pos);
            this.oldPos.selfAdd(distancePerpendicular.scale(distancePerpendicular.dot(this.velocity) * 0.8));
        }
    }

    fixedUpdate() {
        this.velocity.selfAdd(this.explosion.gravity);
        this.velocity = this.velocity.scale(0.99);
        this.pos.selfAdd(this.velocity);
        this.driving = false;
        if (this.touch) {
            this.track.touch(this);
        }
        this.velocity = this.pos.sub(this.oldPos);
        this.oldPos.set(this.pos);
        super.fixedUpdate();
    }

    update(progress, delta) {
        super.update(progress);
        this.rotation += this.rotationSpeed * delta / 40;
    }

    render(ctx) {
        let pos = this.displayPos.toPixel(this.track);
        let size = this.size * this.track.zoomFactor;

        let points = new Array();

        for (let i in this.shape) {
            let dist = this.shape[i] * size;
            let x = pos.x + dist * Math.cos(this.rotation + Math.PI * i / 4);
            let y = pos.y + dist * Math.sin(this.rotation + Math.PI * i / 4);
            points.push(new Vector(x, y));
        }

        ctx.fillStyle = '#000';
        LinePath.render(ctx, [
            points
        ]);
        ctx.fill();
    }
}