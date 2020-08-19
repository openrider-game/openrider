import { Vector } from "../../Vector.js";

export class Line {
    constructor(x1, y1, x2, y2, parent) {
        this.a = x1 instanceof Vector ? x1 : new Vector(x1, y1);
        this.b = y1 instanceof Vector ? y1 : new Vector(x2, y2);
        this.vector = this.b.sub(this.a);
        this.len = this.vector.getLength();
        this.doRemove = false;
        this.track = parent;
    }

    render(context, offsetLeft, offsetTop) {
        context.moveTo(this.a.x * this.track.zoomFactor - offsetLeft, this.a.y * this.track.zoomFactor - offsetTop);
        context.lineTo(this.b.x * this.track.zoomFactor - offsetLeft, this.b.y * this.track.zoomFactor - offsetTop);
    }

    checkDelete(eraserPoint, radius) {
        let C4 = eraserPoint.sub(this.a);
        let B8 = C4.dot(this.vector.recipScale(this.len));
        let Bi = new Vector(0, 0);
        if (B8 <= 0) {
            Bi.set(this.a);
        } else if (B8 >= this.len) {
            Bi.set(this.b);
        } else {
            Bi.set(this.a.add(this.vector.recipScale(this.len).scale(B8)));
        }
        let DA = eraserPoint.sub(Bi);
        if (DA.getLength() <= radius) {
            this.remove();
            return this;
        }
        return false;
    }

    remove() {
        this.doRemove = true;
        this.track.remove(this.a, this.b);
        return this;
    }

    reAdd() {
        this.track.addLineInternal(this);
        return this;
    }

    toString() {
        return this.a + this.getEnd();
    }

    toJSON(cls) {
        return {
            $$: cls,
            a: this.a.toJSON(),
            b: this.b.toJSON()
        };
    }
}