import GameObject from "../../game/GameObject.js";
import Vector from "../../numeric/Vector.js";

export default class Spring extends GameObject {
    constructor(a, b) {
        super();
        this.a = a;
        this.b = b;
        this.lengthTowards = 40;
        this.len = 40;
        this.dampConstant = 0.5;
        this.springConstant = 0.7;
    }

    lean(rotation, factor) {
        this.len += (this.lengthTowards - rotation - this.len) / factor;
    }

    rotate(rad) {
        // this function basically adds a little bit of the perpendicular distance vector
        // one way for a and the other way for b
        let distance = this.b.pos.sub(this.a.pos);
        let perpendicular = new Vector(-distance.y / this.len, distance.x / this.len);
        this.a.pos.selfAdd(perpendicular.scale(rad));
        this.b.pos.selfAdd(perpendicular.scale(-rad));
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
        let clone = new Spring(this.a, this.b);
        clone.lengthTowards = this.lengthTowards;
        clone.len = this.len;
        clone.dampConstant = this.dampConstant;
        clone.springConstant = this.springConstant;
        return clone;
    }

    fixedUpdate() {
        let distance = this.b.pos.sub(this.a.pos);
        let length = distance.getLength();
        if (length < 1) {
            return this;
        }
        distance = distance.scale(1 / length);
        let force = distance.scale((length - this.len) * this.springConstant);
        let normalVelocity = this.b.velocity.sub(this.a.velocity).dot(distance) * this.dampConstant;
        force.selfAdd(distance.scale(normalVelocity));
        this.b.velocity.selfAdd(force.scale(-1));
        this.a.velocity.selfAdd(force);
        return this;
    }

    update(progress, delta) {}
    render(ctx) {}
}