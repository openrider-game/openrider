import { CanvasHelper } from "../../helper/CanvasHelper.js";
import { Joint } from "../../Joint.js";
import { Vector } from "../../Vector.js";
import { BodyPart } from "../part/BodyPart.js";

export class DeadRider {
    constructor(guy, bike) {
        this.dead = true;
        let zeroVec = new Vector(0, 0);
        this.direction = bike.direction;
        this.bike = bike;
        this.track = bike.track;
        this.points = [
            this.head = new BodyPart(zeroVec, this),
            this.hip = new BodyPart(zeroVec, this),
            this.elbow = new BodyPart(zeroVec, this),
            this.shadowElbow = new BodyPart(zeroVec, this),
            this.hand = new BodyPart(zeroVec, this),
            this.shadowHand = new BodyPart(zeroVec, this),
            this.knee = new BodyPart(zeroVec, this),
            this.shadowKnee = new BodyPart(zeroVec, this),
            this.foot = new BodyPart(zeroVec, this),
            this.shadowFoot = new BodyPart(zeroVec, this)
        ];
        this.joints = [
            new Joint(this.head, this.hip, this),
            new Joint(this.head, this.elbow, this),
            new Joint(this.elbow, this.hand, this),
            new Joint(this.head, this.shadowElbow, this),
            new Joint(this.shadowElbow, this.shadowHand, this),
            new Joint(this.hip, this.knee, this),
            new Joint(this.knee, this.foot, this),
            new Joint(this.hip, this.shadowKnee, this),
            new Joint(this.shadowKnee, this.shadowFoot, this)
        ];
        for (let point of this.points) {
            point.size = 3;
            point.friction = 0.05;
        }
        this.head.size = this.hip.size = 8;
        for (let joint of this.joints) {
            joint.springConstant = 0.4;
            joint.dampConstant = 0.7;
        }
        for (let part in guy) {
            if (guy.hasOwnProperty(part)) {
                this[part].pos.copy(guy[part]);
            }
        }
    }

    render() {
        let drawer = CanvasHelper.getInstance();
        let track = this.track,
            head = this.head.pos.toPixel(track),
            elbow = this.elbow.pos.toPixel(track),
            hand = this.hand.pos.toPixel(track),
            shadowElbow = this.shadowElbow.pos.toPixel(track),
            shadowHand = this.shadowHand.pos.toPixel(track),
            knee = this.knee.pos.toPixel(track),
            foot = this.foot.pos.toPixel(track),
            shadowKnee = this.shadowKnee.pos.toPixel(track),
            shadowFoot = this.shadowFoot.pos.toPixel(track),
            hip = this.hip.pos.toPixel(track);
        drawer.setProperty('lineWidth', 5 * track.zoomFactor);
        drawer.setProperty('strokeStyle', 'rgba(0,0,0,0.5)');
        // Shadow Arm
        drawer.beginPath().moveTo(head.x, head.y).lineTo(shadowElbow.x, shadowElbow.y).lineTo(shadowHand.x, shadowHand.y)
            // Shadow Leg
            .moveTo(hip.x, hip.y).lineTo(shadowKnee.x, shadowKnee.y).lineTo(shadowFoot.x, shadowFoot.y).stroke();
        drawer.setProperty('strokeStyle', '#000');
        // Arm
        drawer.beginPath().moveTo(head.x, head.y).lineTo(elbow.x, elbow.y).lineTo(hand.x, hand.y)
            // Leg
            .moveTo(hip.x, hip.y).lineTo(knee.x, knee.y).lineTo(foot.x, foot.y).stroke();
        // Body
        drawer.setProperty('lineWidth', 8 * track.zoomFactor);
        drawer.beginPath().moveTo(hip.x, hip.y).lineTo(head.x, head.y).stroke();
        // Head
        head.selfAdd(head.sub(hip).scale(0.25));
        drawer.setProperty('lineWidth', 2 * track.zoomFactor);
        drawer.beginPath().moveTo(head.x + 5 * track.zoomFactor, head.y).arc(head.x, head.y, 5 * track.zoomFactor, 0, 2 * Math.PI, true).stroke();

        // Cap
        // let bodyVec = head.sub(hip),
        //     bodyNormal = new Vector(bodyVec.y, -bodyVec.x),
        //     capTip = head.add(bodyNormal.scale(0.15 * this.direction)).add(bodyVec.scale(-0.05)),
        //     capEnd = head.add(bodyNormal.scale(-0.35 * this.direction)).add(bodyVec.scale(0.15));
        // drawer.beginPath();
        // drawer.moveTo(capTip.x, capTip.y);
        // drawer.lineTo(capEnd.x, capEnd.y);
        // drawer.stroke();
    }

    update() {
        for (let i = this.joints.length - 1; i >= 0; i--) {
            this.joints[i].update();
        }
        for (let i = this.points.length - 1; i >= 0; i--) {
            this.points[i].update();
        }
    }

    pull(upperForce, lowerForce) {
        upperForce.selfScale(0.7);
        lowerForce.selfScale(0.7);
        for (let joint of this.joints) {
            let len = joint.getLength();
            if (len > 20) {
                len = 20;
            }
            joint.lengthTowards = joint.len = len;
        }
        for (let i = 1; i < 5; i++) {
            this.joints[i].lengthTowards = 13;
            this.joints[i].len = 13;
        }
        let upper = [this.head, this.elbow, this.shadowElbow, this.hand, this.shadowHand];
        let lower = [this.hip, this.knee, this.shadowKnee, this.foot, this.shadowFoot];
        for (let point of upper) {
            point.oldPos = point.pos.sub(upperForce);
        }
        for (let point of lower) {
            point.oldPos = point.pos.sub(lowerForce);
        }
        for (let point of this.points) {
            point.velocity.copy(point.pos.sub(point.oldPos));
            point.velocity.x += Math.random() - Math.random();
            point.velocity.y += Math.random() - Math.random();
        }
    }
}