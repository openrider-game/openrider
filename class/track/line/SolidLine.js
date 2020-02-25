import { Point } from "../../Point.js";
import { Line } from "./Line.js";

export class SolidLine extends Line {
    constructor(x1, y1, x2, y2, parent) {
        super(x1, y1, x2, y2, parent);
    }

    touch(object) {
        if (this.touched) {
            return this;
        }
        this.touched = true;
        let pos = object.pos,
            vel = object.velocity,
            radius = object.size,
            N = new Point(0, 0),
            dist = 0,
            Ap = pos.cloneSub(this.a),
            Aw = Ap.dot(this.vector) / this.len / this.len;
        if (Aw >= 0 && Aw <= 1) {
            let B2 = (Ap.x * this.vector.y - Ap.y * this.vector.x) * ((Ap.x - vel.x) * this.vector.y - (Ap.y - vel.y) * this.vector.x) < 0 ? -1 : 1;
            N = Ap.cloneSub(this.vector.cloneScale(Aw));
            dist = N.getLength();
            if ((dist < radius || B2 < 0) && dist !== 0) {
                pos.selfAdd(N.cloneScale((radius * B2 - dist) / dist));
                object.drive(new Point(-N.y / dist, N.x / dist));
                return this;
            }
        }
        if (Aw * this.len < -radius || Aw * this.len > this.len + radius) {
            return this;
        }
        let Bp = Aw > 0 ? this.b : this.a;
        N = pos.cloneSub(Bp);
        dist = N.getLength();
        if (dist < radius && dist !== 0) {
            pos.selfAdd(N.cloneScale((radius - dist) / dist));
            object.drive(new Point(-N.y / dist, N.x / dist));
            return this;
        }
    }

    getEnd() {
        this.stringGot = true;
        let end = ' ' + this.b.toString(),
            next = this.parnt.grid[Math.floor(this.b.x / this.parnt.gridSize)][Math.floor(this.b.y / this.parnt.gridSize)].search(this.b, 'line');
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