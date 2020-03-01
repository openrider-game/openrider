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
        let pos = object.pos,
            vel = object.velocity,
            radius = object.size,
            diff, // The vector from the closest point on the line to the object
            dist,
            Ap = pos.sub(this.a),
            u = Ap.dot(this.vector) / this.len / this.len;  // Named "u" because it is sort of like uv coordinates
        if (u >= 0 && u <= 1) {
            // "sign" is negative if the center of the mass has passed through the line.
            let sign = (Ap.x * this.vector.y - Ap.y * this.vector.x) * ((Ap.x - vel.x) * this.vector.y - (Ap.y - vel.y) * this.vector.x) < 0 ? -1 : 1;
            diff = Ap.sub(this.vector.scale(u));
            dist = diff.getLength();
            if ((dist < radius || sign < 0) && dist !== 0) {
                pos.selfAdd(diff.scale((radius * sign - dist) / dist));
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