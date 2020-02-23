import { Point } from "./Point.js";

export class Joint {
    constructor(a, b, parent) {
        this.a = a;
        this.b = b;
        this.parnt = parent;
        this.lengthTowards = 40;
        this.len = 40;
        this.BE = 0.5;
        this.BC = 0.7;
    }

    lean(AH, AK) {
        this.len += (this.lengthTowards - AH - this.len) / AK;
    }

    rotate(rad) {
        let vector = this.b.pos.cloneSub(this.a.pos);
        let DU = new Point(-vector.y / this.len, vector.x / this.len);
        this.a.pos.selfAdd(DU.cloneScale(rad));
        this.b.pos.selfAdd(DU.cloneScale(-rad));
    }

    update() {
        let vector = this.b.pos.cloneSub(this.a.pos);
        let length = vector.getLength();
        if (length < 1) {
            return this;
        }
        vector = vector.cloneScale(1 / length);
        let DD = vector.cloneScale((length - this.len) * this.BC);
        let B6 = this.b.velocity.cloneSub(this.a.velocity).dot(vector) * this.BE;
        DD.selfAdd(vector.cloneScale(B6));
        this.b.velocity.selfAdd(DD.cloneScale(-1));
        this.a.velocity.selfAdd(DD);
        return this;
    }

    turn() {
        let tmp = new Point();
        tmp.copy(this.a.pos);
        this.a.pos.copy(this.b.pos);
        this.b.pos.copy(tmp);
        tmp.copy(this.a.oldPos);
        this.a.oldPos.copy(this.b.oldPos);
        this.b.oldPos.copy(tmp);
        tmp.copy(this.a.velocity);
        this.a.velocity.copy(this.b.velocity);
        this.b.velocity.copy(tmp);
        tmp = this.a.rotation;
        this.a.rotation = this.b.rotation;
        this.b.rotation = tmp;
    }

    getLength() {
        return this.b.pos.cloneSub(this.a.pos).getLength();
    }

    clone() {
        let clone = new Joint(this.a, this.b, this.parnt);
        clone.lengthTowards = this.lengthTowards;
        clone.len = this.len;
        clone.BE = this.BE;
        clone.BC = this.BC;
        return clone;
    }

    toJSON() {
        return {
            $$: 'Joint',
            a: this.a,
            b: this.b,
            lengthTowards: this.lengthTowards,
            len: this.len,
            BE: this.BE,
            BC: this.BC
        };
    }
}