import { Vector } from "./Vector.js";

export class Joint {
    constructor(a, b, parent) {
        this.a = a;
        this.b = b;
        this.parent = parent;
        this.lengthTowards = 40;
        this.len = 40;
        this.dampConstant = 0.5;
        this.springConstant = 0.7;
    }

    lean(AH, AK) {
        // timescale AK outside of the func i suppose
        this.len += (this.lengthTowards - AH - this.len) / AK;
    }

    rotate(rad) {
        // this function basically adds a little bit of the perpendicular distance vector
        // one way for a and the other way for b
        let vector = this.b.pos.sub(this.a.pos);
        // probably timescale the len?
        let perpendicular = new Vector(-vector.y / this.len, vector.x / this.len);
        this.a.pos.selfAdd(perpendicular.scale(rad));
        this.b.pos.selfAdd(perpendicular.scale(-rad));
    }

    fixedUpdate() {
        let vector = this.b.pos.sub(this.a.pos);
        let length = vector.getLength();
        if (length < 1) {
            return this;
        }
        vector = vector.scale(1 / length);
        let force = vector.scale((length - this.len) * this.springConstant);
        let normalVelocity = this.b.velocity.sub(this.a.velocity).dot(vector) * this.dampConstant;
        force.selfAdd(vector.scale(normalVelocity));
        this.b.velocity.selfAdd(force.scale(-1));
        this.a.velocity.selfAdd(force);
        return this;
    }

    turn() {
        let tmp = new Vector();

        tmp.set(this.a.pos);
        this.a.pos.set(this.b.pos);
        this.b.pos.set(tmp);

        tmp.set(this.a.oldPos);
        this.a.oldPos.set(this.b.oldPos);
        this.b.oldPos.set(tmp);

        tmp.set(this.a.velocity);
        this.a.velocity.set(this.b.velocity);
        this.b.velocity.set(tmp);

        tmp = this.a.rotation;
        this.a.rotation = this.b.rotation;
        this.b.rotation = tmp;
    }

    getLength() {
        return this.b.pos.sub(this.a.pos).getLength();
    }

    clone() {
        let clone = new Joint(this.a, this.b, this.parent);
        clone.lengthTowards = this.lengthTowards;
        clone.len = this.len;
        clone.dampConstant = this.dampConstant;
        clone.springConstant = this.springConstant;
        return clone;
    }

    toJSON() {
        return {
            $$: 'Joint',
            a: this.a,
            b: this.b,
            lengthTowards: this.lengthTowards,
            len: this.len,
            dampConstant: this.dampConstant,
            springConstant: this.springConstant
        };
    }
}