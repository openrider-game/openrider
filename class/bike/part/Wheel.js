import { Point } from "../../Point.js";
import { track } from "../../../bootstrap.js";

export class Wheel {
    constructor(center, parent) {
        this.pos = center.clone();
        this.oldPos = center.clone();
        this.velocity = new Point(0, 0);
        this.bike = parent;
        this.size = 10;
        this.B6 = 0;
        this.touch = true;
        this.gravity = true;
        this.rotationSpeed = 0;
        this.speedValue = 0;
    }

    drive(point) {
        this.pos.selfAdd(point.cloneScale(this.speedValue * this.bike.direction));
        if (this.downPressed) {
            this.pos.selfAdd(point.cloneScale(-point.dot(this.velocity) * 0.3));
        }
        this.rotationSpeed = point.dot(this.velocity) / this.size;
        this.driving = true;
    }

    update() {
        this.velocity.selfAdd(this.bike.gravity).selfScale(0.99);
        this.pos.selfAdd(this.velocity);
        this.driving = false;
        if (this.touch) {
            track.touch(this);
        }
        this.velocity = this.pos.cloneSub(this.oldPos);
        this.oldPos.copy(this.pos);
    }

    clone() {
        let clone = new Wheel(this.pos, this.bike);
        clone.oldPos = this.oldPos.clone();
        clone.velocity = this.velocity.clone();
        clone.speedValue = this.speedValue;
        return clone;
    }

    toJSON() {
        return {
            $$: 'Wheel',
            pos: this.pos,
            oldPos: this.oldPos,
            velocity: this.velocity,
            speedValue: this.speedValue,
            rotationSpeed: this.rotationSpeed,
            size: this.size,
            B6: this.B6
        };
    }
}