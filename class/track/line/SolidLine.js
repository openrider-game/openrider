import { Vector } from "../../Vector.js";
import { Line } from "./Line.js";

export class SolidLine extends Line {
    constructor(x1, y1, x2, y2, parent) {
        super(x1, y1, x2, y2, parent);
    }

    // Collision detection.
    touch(object) {
        if (this.touched) {
            return this;
        }
        this.touched = true;
        let pos = object.pos;
        let vel = object.velocity;
        let radius = object.size;
        let pp = this.vector;
        let diff; // The vector from the closest point on the line to the object
        let dist;
        let aDiff = pos.sub(this.a);
        let u = aDiff.dot(this.vector) / this.len / this.len;  // Named "u" because it is sort of like uv coordinate
        if (u >= 0 && u <= 1) {
            // "passedThrough" is negative if the center of the mass has passed through the line.
            let passedThrough = (aDiff.x * this.vector.y - aDiff.y * this.vector.x) * ((aDiff.x - vel.x) * this.vector.y - (aDiff.y - vel.y) * this.vector.x) < 0 ? -1 : 1;
            if (passedThrough === -1) {
                let measure = (aDiff.y * vel.x - aDiff.x * vel.y) / (pp.y * vel.x - pp.x * vel.y);
                if (measure < 0 || measure > 1) {
                    return this;
                }
            }
            diff = aDiff.sub(this.vector.scale(u));
            dist = diff.getLength();
            if ((dist < radius || passedThrough < 0) && dist !== 0) {
                pos.selfAdd(diff.scale((radius * passedThrough - dist) / dist));
                object.drive(new Vector(-diff.y / dist, diff.x / dist));
                return this;
            }
        }
        if (u * this.len < -radius || u * this.len > this.len + radius) {
            return this;
        }
        let Bp = u > 0 ? this.b : this.a;
        diff = pos.sub(Bp);
        dist = diff.getLength();
        if (dist < radius && dist !== 0) {
            pos.selfAdd(diff.scale((radius - dist) / dist));
            object.drive(new Vector(-diff.y / dist, diff.x / dist));
            return this;
        }
    }

    getEnd() {
        this.stringGot = true;
        let end = ' ' + this.b.toString(),
            next = this.track.grid[Math.floor(this.b.x / this.track.gridSize)][Math.floor(this.b.y / this.track.gridSize)].search(this.b, 'line');
        if (next !== undefined) {
            end += next.getEnd();
        }
        return end;
    }

    toString() {
        return this.a + this.getEnd();
    }

    toJSON() {
        return super.toJSON('SolidLine');
    }
}