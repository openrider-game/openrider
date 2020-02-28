import { CanvasHelper } from "../../helper/CanvasHelper.js";
import { Joint } from "../../Joint.js";
import { Point } from "../../Point.js";
import { BodyPart } from "../part/BodyPart.js";

export class DeadRider {
    constructor(guy, parent) {
        this.dead = true;
        let U = new Point(0, 0),
            i = 0;
        this.direction = 1;
        this.parnt = parent;
        this.track = parent.parnt;
        this.points = {
            0: this.head = new BodyPart(U, this),
            1: this.hip = new BodyPart(U, this),
            2: this.elbow = new BodyPart(U, this),
            3: this.shadowElbow = new BodyPart(U, this),
            4: this.hand = new BodyPart(U, this),
            5: this.shadowHand = new BodyPart(U, this),
            6: this.knee = new BodyPart(U, this),
            7: this.shadowKnee = new BodyPart(U, this),
            8: this.foot = new BodyPart(U, this),
            9: this.shadowFoot = new BodyPart(U, this),
            $length: 10
        };
        this.joints = {
            0: new Joint(this.head, this.hip, this),
            1: new Joint(this.head, this.elbow, this),
            2: new Joint(this.elbow, this.hand, this),
            3: new Joint(this.head, this.shadowElbow, this),
            4: new Joint(this.shadowElbow, this.shadowHand, this),
            5: new Joint(this.hip, this.knee, this),
            6: new Joint(this.knee, this.foot, this),
            7: new Joint(this.hip, this.shadowKnee, this),
            8: new Joint(this.shadowKnee, this.shadowFoot, this),
            $length: 9
        };
        for (let i = 0, l = this.points.$length; i < l; i++) {
            this.points[i].size = 3;
            this.points[i].B6 = 0.05;
        }
        this.head.size = this.hip.size = 8;
        for (let i = 0, l = this.joints.$length; i < l; i++) {
            this.joints[i].springConstant = 0.4;
            this.joints[i].dampConstant = 0.7;
        }
        for (i in guy)
            if (guy.hasOwnProperty(i)) {
                this[i].pos.copy(guy[i]);
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
        head.selfAdd(head.cloneSub(hip).cloneScale(0.25));
        drawer.setProperty('lineWidth', 2 * track.zoomFactor);
        drawer.beginPath().moveTo(head.x + 5 * track.zoomFactor, head.y).arc(head.x, head.y, 5 * track.zoomFactor, 0, 2 * Math.PI, true).stroke();
        let A6 = head.cloneSub(hip),
            A7 = new Point(A6.y, -A6.x),
            AY = new Point(0, 0),
            Aa = new Point(0, 0);
        if (this.direction === 1) {
            AY = head.cloneAdd(A7.cloneScale(0.15)).cloneAdd(A6.cloneScale(-0.05));
            Aa = head.cloneAdd(A7.cloneScale(-0.35)).cloneAdd(A6.cloneScale(0.15));
        } else {
            AY = head.cloneAdd(A7.cloneScale(-0.15)).cloneAdd(A6.cloneScale(0.15));
            Aa = head.cloneAdd(A7.cloneScale(0.35)).cloneAdd(A6.cloneScale(-0.05));
        }
        AY = head.cloneAdd(A7.cloneScale(0.15 * this.direction)).cloneAdd(A6.cloneScale(-0.05));
        Aa = head.cloneAdd(A7.cloneScale(-0.35 * this.direction)).cloneAdd(A6.cloneScale(0.15));
        // Cap
        // drawer.beginPath();
        // drawer.moveTo(AY.x, AY.y);
        // drawer.lineTo(Aa.x, Aa.y);
        // drawer.stroke();
    }

    update() {
        for (let i = this.joints.$length - 1; i >= 0; i--) {
            this.joints[i].update();
        }
        for (let i = this.points.$length - 1; i >= 0; i--) {
            this.points[i].update();
        }
    }

    pull(upperForce, lowerForce) {
        upperForce.selfScale(0.7);
        lowerForce.selfScale(0.7);
        let len, upper, lower;
        for (let i = 0, l = this.joints.$length; i < l; i++) {
            len = this.joints[i].getLength();
            if (len > 20) {
                len = 20;
            }
            this.joints[i].lengthTowards = this.joints[i].len = len;
        }
        for (let i = 1; i < 5; i++) {
            this.joints[i].lengthTowards = 13;
            this.joints[i].len = 13;
        }
        upper = [this.head, this.elbow, this.shadowElbow, this.hand, this.shadowHand],
            lower = [this.hip, this.knee, this.shadowKnee, this.foot, this.shadowFoot];
        for (let i = 0, l = upper.length; i < l; i++) {
            upper[i].oldPos = upper[i].pos.cloneSub(upperForce);
        }
        for (let i = 0, l = lower.length; i < l; i++) {
            lower[i].oldPos = lower[i].pos.cloneSub(lowerForce);
        }
        for (let i = this.points.$length - 1; i >= 0; i--) {
            this.points[i].velocity.copy(this.points[i].pos.cloneSub(this.points[i].oldPos));
            this.points[i].velocity.x += Math.random() - Math.random();
            this.points[i].velocity.y += Math.random() - Math.random();
        }
    }
}