import BikePart from "./BikePart.js";
import Entity from "./Entity.js";
import LinePath from "../numeric/LinePath.js";
import Vector from "../numeric/Vector.js";
import Spring from "../bike/physics/Spring.js";
import Bike from "../bike/instance/Bike.js";

export default class Ragdoll extends Entity {
    /**
     *
     * @param {{}} rider
     * @param {Bike} bike
     */
    constructor(rider, bike) {
        super(new Vector(), new Vector(), 0);

        this.rider = rider;
        this.track = bike.track;

        this.points = [
            this.head = new BikePart(rider.head, bike),
            this.hip = new BikePart(rider.hip, bike),
            this.elbow = new BikePart(rider.elbow, bike),
            this.shadowElbow = new BikePart(rider.shadowElbow, bike),
            this.hand = new BikePart(rider.hand, bike),
            this.shadowHand = new BikePart(rider.shadowHand, bike),
            this.knee = new BikePart(rider.knee, bike),
            this.shadowKnee = new BikePart(rider.shadowKnee, bike),
            this.foot = new BikePart(rider.foot, bike),
            this.shadowFoot = new BikePart(rider.shadowFoot, bike)
        ];

        this.inflexibleJoints = [
            new Spring(this.head, this.hip),
            new Spring(this.head, this.elbow),
            new Spring(this.elbow, this.hand),
            new Spring(this.head, this.shadowElbow),
            new Spring(this.shadowElbow, this.shadowHand)
        ];

        this.joints = this.inflexibleJoints.concat([
            new Spring(this.hip, this.knee),
            new Spring(this.knee, this.foot),
            new Spring(this.hip, this.shadowKnee),
            new Spring(this.shadowKnee, this.shadowFoot)
        ]);

        for (let point of this.points) {
            point.size = 3;
            point.friction = 0.05;
        }

        this.head.size = this.hip.size = 8;

        for (let joint of this.joints) {
            joint.springConstant = 0.4;
            joint.dampConstant = 0.7;
        }
    }

    /**
     *
     * @param {Vector} upperVel
     * @param {Vector} lowerVel
     */
    setVelocity(upperVel, lowerVel) {
        upperVel.selfScale(0.5);
        lowerVel.selfScale(0.5);

        for (let joint of this.joints) {
            let len = joint.getLength();

            if (len > 20) {
                len = 20;
            }

            joint.len = len;
            joint.lengthTowards = len;
        }

        for (let inflexibleJoint of this.inflexibleJoints) {
            inflexibleJoint.lengthTowards = 13;
            inflexibleJoint.len = 13;
        }

        let upper = [this.head, this.elbow, this.shadowElbow, this.hand, this.shadowHand];
        let lower = [this.hip, this.knee, this.shadowKnee, this.foot, this.shadowFoot];

        for (let point of upper) {
            point.oldPos = point.pos.sub(upperVel);
        }

        for (let point of lower) {
            point.oldPos = point.pos.sub(lowerVel);
        }

        for (let point of this.points) {
            point.velocity.set(point.pos.sub(point.oldPos));
            point.velocity.x += Math.random() - Math.random();
            point.velocity.y += Math.random() - Math.random();
        }
    }

    fixedUpdate() {
        for (let joint of this.joints) {
            joint.fixedUpdate();
        }

        for (let point of this.points) {
            point.fixedUpdate();
        }
    }

    update(progress, delta) {
        for (let point of this.points) {
            point.update(progress, delta);
        }
    }

    render(ctx) {
        let head = this.head.displayPos.toPixel(this.track);
        let elbow = this.elbow.displayPos.toPixel(this.track);
        let hand = this.hand.displayPos.toPixel(this.track);
        let shadowElbow = this.shadowElbow.displayPos.toPixel(this.track);
        let shadowHand = this.shadowHand.displayPos.toPixel(this.track);
        let knee = this.knee.displayPos.toPixel(this.track);
        let foot = this.foot.displayPos.toPixel(this.track);
        let shadowKnee = this.shadowKnee.displayPos.toPixel(this.track);
        let shadowFoot = this.shadowFoot.displayPos.toPixel(this.track);
        let hip = this.hip.displayPos.toPixel(this.track);

        ctx.lineWidth = 5 * this.track.zoomFactor;
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';

        LinePath.render(ctx, [
            [head, shadowElbow, shadowHand],
            [hip, shadowKnee, shadowFoot]
        ]);

        ctx.strokeStyle = '#000';

        LinePath.render(ctx, [
            [head, elbow, hand],
            [hip, knee, foot]
        ]);

        ctx.lineWidth = 8 * this.track.zoomFactor;

        LinePath.render(ctx, [
            [hip, head]
        ]);

        head.selfAdd(head.sub(hip).scale(0.25));

        ctx.lineWidth = 2 * this.track.zoomFactor;

        ctx.beginPath();
        ctx.moveTo(head.x + 5 * this.track.zoomFactor, head.y)
        ctx.arc(head.x, head.y, 5 * this.track.zoomFactor, 0, 2 * Math.PI, true)
        ctx.stroke();
    }
}