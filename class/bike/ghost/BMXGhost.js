import { BodyPart } from "../part/BodyPart.js";
import { Wheel } from "../part/Wheel.js";
import { Joint } from "../../Joint.js";
import { Point } from "../../Point.js";
import { arc, beginPath, fill, lineTo, moveTo, stroke } from "../../utils/DrawUtils.js";
import { cos, PI2, sin } from "../../utils/MathUtils.js";
import { GhostBike } from "./GhostBike.js";
import { context } from "../../../unobfuscated_bhr.js";
import { bmxConstants } from "../../constant/TrackConstants.js";

export class BMXGhost extends GhostBike {
    constructor(parent, ghostKeys, last) {
        last = last || (console.log('fallback', last), enghosten([bmxConstants[0]])[0]);
        super(ghostKeys, last, parent);
        this.points = {
            0: new BodyPart(new Point(last[0], last[1]), this),
            1: new Wheel(new Point(last[6], last[7]), this),
            2: new Wheel(new Point(last[13], last[14]), this),
            $length: 3
        };
        this.points[0].oldPos = new Point(last[2], last[3]);
        this.points[0].velocity = new Point(last[4], last[5]);
        this.points[1].oldPos = new Point(last[8], last[9]);
        this.points[1].velocity = new Point(last[10], last[11]);
        this.points[1].speedValue = last[12];
        this.points[2].oldPos = new Point(last[15], last[16]);
        this.points[2].velocity = new Point(last[17], last[18]);
        this.points[2].speedValue = last[19];
        this.head = this.points[0];
        this.head.size = 14;
        this.head.drive = () => {};
        this.backWheel = this.points[1];
        this.backWheel.size = 11.7;
        this.frontWheel = this.points[2];
        this.frontWheel.size = 11.7;
        this.joints = {
            0: this.headToBack = new Joint(this.points[0], this.points[1], this),
            1: this.frontToBack = new Joint(this.points[1], this.points[2], this),
            2: this.headToFront = new Joint(this.points[2], this.points[0], this),
            $length: 3
        };
        this.headToBack.lengthTowards = 45;
        this.headToBack.len = last[20];
        this.headToBack.BC = 0.35;
        this.headToBack.BE = 0.3;
        this.frontToBack.lengthTowards = 42;
        this.frontToBack.len = last[21];
        this.frontToBack.BC = 0.35;
        this.frontToBack.BE = 0.3;
        this.headToFront.lengthTowards = 45;
        this.headToFront.len = last[22];
        this.headToFront.BC = 0.35;
        this.headToFront.BE = 0.3;
        this.direction = last[23];
        this.gravity = new Point(last[24], last[25]);
        this.slow = last[26];
        this.leftPressed = last[27];
        this.rightPressed = last[28];
        this.upPressed = last[29];
        this.downPressed = last[30];
        this.time = this.ghostKeys[5];
        this.color = last[32];
    }

    BS() {
        this.backWheel.speedValue += (this.upPressed - this.points[1].speedValue) / 10;
        if (this.upPressed) {
            this.distance += this.backWheel.rotationSpeed / 5;
        }
        this.backWheel.downPressed = this.frontWheel.downPressed = this.downPressed;
        var rotate = this.leftPressed - this.rightPressed;
        this.headToBack.lean(rotate * 5 * this.direction, 5);
        this.headToFront.lean(-rotate * 5 * this.direction, 5);
        this.frontToBack.rotate(rotate / 6);
        if (!rotate && this.upPressed) {
            this.headToBack.lean(-7, 5);
            this.headToFront.lean(7, 5);
        }
    }

    draw() {
        var track = this.parnt,
            color = this.color,
            backWheel = this.backWheel.pos.toPixel(track),
            frontWheel = this.frontWheel.pos.toPixel(track),
            z = track.zoomFactor;
        // Wheels
        context[beginPath]();
        context.strokeStyle = color;
        context.globalAlpha = 0.6;
        context.lineWidth = 3.5 * z;
        // (front wheel)
        context[arc](backWheel.x, backWheel.y, 10 * z, 0, PI2, true);
        // (back wheel)
        context[moveTo](frontWheel.x + 10 * z, frontWheel.y);
        context[arc](frontWheel.x, frontWheel.y, 10 * z, 0, PI2, true);
        context[stroke]();
        var length = frontWheel.cloneSub(backWheel),
            AC = new Point((frontWheel.y - backWheel.y) * this.direction, (backWheel.x - frontWheel.x) * this.direction),
            crossFrameSaddle = backWheel.cloneAdd(length.cloneScale(0.3)).cloneAdd(AC.cloneScale(0.25)),
            shadowSteer = backWheel.cloneAdd(length.cloneScale(0.84)).cloneAdd(AC.cloneScale(0.42)),
            steer = backWheel.cloneAdd(length.cloneScale(0.84)).cloneAdd(AC.cloneScale(0.37)),
            pedalHinge = backWheel.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(0.05));
        // Frame
        context[beginPath]();
        context.lineWidth = 3 * z;
        context[moveTo](backWheel.x, backWheel.y);
        context[lineTo](crossFrameSaddle.x, crossFrameSaddle.y);
        context[lineTo](shadowSteer.x, shadowSteer.y);
        context[moveTo](steer.x, steer.y);
        context[lineTo](pedalHinge.x, pedalHinge.y);
        context[lineTo](backWheel.x, backWheel.y);
        var CY = new Point(6 * z * cos(this.distance), 6 * z * sin(this.distance)),
            pedal = pedalHinge.cloneAdd(CY),
            shadowPedal = pedalHinge.cloneSub(CY),
            saddle = backWheel.cloneAdd(length.cloneScale(0.17)).cloneAdd(AC.cloneScale(0.38)),
            Cg = backWheel.cloneAdd(length.cloneScale(0.3)).cloneAdd(AC.cloneScale(0.45)),
            Ci = backWheel.cloneAdd(length.cloneScale(0.25)).cloneAdd(AC.cloneScale(0.4));
        // Saddle
        context[moveTo](pedal.x, pedal.y);
        context[lineTo](shadowPedal.x, shadowPedal.y);
        context[moveTo](saddle.x, saddle.y);
        context[lineTo](Cg.x, Cg.y);
        context[moveTo](pedalHinge.x, pedalHinge.y);
        context[lineTo](Ci.x, Ci.y);
        var backWheelCenter = backWheel.cloneAdd(length.cloneScale(1)).cloneAdd(AC.cloneScale(0));
        var Cl = backWheel.cloneAdd(length.cloneScale(0.97)).cloneAdd(AC.cloneScale(0));
        var CO = backWheel.cloneAdd(length.cloneScale(0.8)).cloneAdd(AC.cloneScale(0.48));
        var CbackWheel = backWheel.cloneAdd(length.cloneScale(0.86)).cloneAdd(AC.cloneScale(0.5));
        var Ck = backWheel.cloneAdd(length.cloneScale(0.82)).cloneAdd(AC.cloneScale(0.65));
        var steerCenter = backWheel.cloneAdd(length.cloneScale(0.78)).cloneAdd(AC.cloneScale(0.67));
        // Steering Wheel
        context[moveTo](backWheelCenter.x, backWheelCenter.y);
        context[lineTo](Cl.x, Cl.y);
        context[lineTo](CO.x, CO.y);
        context[lineTo](CbackWheel.x, CbackWheel.y);
        context[lineTo](Ck.x, Ck.y);
        context[lineTo](steerCenter.x, steerCenter.y);
        context[stroke]();
        var h = this.head.pos.toPixel(track);
        AC = h.cloneSub(backWheel.cloneAdd(length.cloneScale(0.5)));
        var hip = crossFrameSaddle.cloneSub(length.cloneScale(0.1)).cloneAdd(AC.cloneScale(0.3));
        var Ar = pedal.cloneSub(hip);
        var BA = new Point(Ar.y * this.direction, -Ar.x * this.direction);
        BA = BA.cloneScale(z * z);
        var knee = hip.cloneAdd(Ar.cloneScale(0.5)).cloneAdd(BA.cloneScale(200 / Ar.lengthSquared()));
        Ar = shadowPedal.cloneSub(hip);
        BA = new Point(Ar.y * this.direction, -Ar.x * this.direction);
        BA = BA.cloneScale(z * z);
        var shadowKnee = hip.cloneAdd(Ar.cloneScale(0.5)).cloneAdd(BA.cloneScale(200 / Ar.lengthSquared()));
        // Shadow Leg
        context[beginPath]();
        context.lineWidth = 6 * z;
        context.globalAlpha = 0.3;
        context[moveTo](shadowPedal.x, shadowPedal.y);
        context[lineTo](shadowKnee.x, shadowKnee.y);
        context[lineTo](hip.x, hip.y);
        context[stroke]();
        // Leg
        context[beginPath]();
        context.globalAlpha = 0.6;
        context.lineWidth = 6 * z;
        context[moveTo](pedal.x, pedal.y);
        context[lineTo](knee.x, knee.y);
        context[lineTo](hip.x, hip.y);
        context[stroke]();
        // Body
        var head = crossFrameSaddle.cloneAdd(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(0.9));
        context[beginPath]();
        context.lineWidth = 8 * z;
        context[moveTo](hip.x, hip.y);
        context[lineTo](head.x, head.y);
        context[stroke]();
        // Cap
        context[beginPath]();
        context.lineWidth = 2 * z;
        switch (this.cap) {
            case 'cap':
                var Ch = crossFrameSaddle.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(1.1)),
                    Cd = crossFrameSaddle.cloneAdd(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(1.05));
                context[moveTo](Ch.x, Ch.y);
                context[lineTo](Cd.x, Cd.y);
                context[stroke]();
                break;
            case 'hat':
                var hatFrontBottom = crossFrameSaddle.cloneAdd(length.cloneScale(0.35)).cloneAdd(AC.cloneScale(1.15)),
                    hatBackBottom = crossFrameSaddle.cloneSub(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(1.1)),
                    hatFront = crossFrameSaddle.cloneAdd(length.cloneScale(0.25)).cloneAdd(AC.cloneScale(1.13)),
                    hatBack = crossFrameSaddle.cloneAdd(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(1.11)),
                    hatFrontTop = hatFrontBottom.cloneSub(length.cloneScale(0.1)).selfAdd(AC.cloneScale(0.2)),
                    //~ hatBackTop = hatBackBottom.cloneAdd(length.cloneScale(0.02)).selfAdd(AC.cloneScale(0.2));
                    hatBackTop = {
                        x: hatBackBottom.x + length.x * 0.02 + AC.x * 0.2,
                        y: hatBackBottom.y + length.y * 0.02 + AC.y * 0.2
                    };
                context[moveTo](hatFrontBottom.x, hatFrontBottom.y);
                context[lineTo](hatFront.x, hatFront.y);
                context[lineTo](hatFrontTop.x, hatFrontTop.y);
                context[lineTo](hatBackTop.x, hatBackTop.y);
                context[lineTo](hatBack.x, hatBack.y);
                context[lineTo](hatBackBottom.x, hatBackBottom.y);
                context.fillStyle = color;
                context[stroke]();
                context[fill]();
                break;
            case 'party':
                var capFront = {
                        x: crossFrameSaddle.x + length.x * 0.28 + AC.x * 1.15,
                        y: crossFrameSaddle.y + length.y * 0.28 + AC.y * 1.15
                    },
                    capBack = {
                        x: crossFrameSaddle.x + length.x * 0.0 + AC.x * 1.1,
                        y: crossFrameSaddle.y + length.y * 0.0 + AC.y * 1.1
                    },
                    capTop = {
                        x: capBack.x + length.x * 0.07 + AC.x * 0.33,
                        y: capBack.y + length.y * 0.07 + AC.y * 0.33
                    };
                context.fillStyle = '#3960ad';
                context[moveTo](capFront.x, capFront.y)[lineTo](capTop.x, capTop.y)[lineTo](capBack.x, capBack.y)[fill]()
                    .strokeStyle = '#70d135';
                context.lineWidth = 4 * z;
                context[beginPath]()[moveTo](capFront.x, capFront.y)[lineTo](capBack.x, capBack.y)[stroke]()
                    .fillStyle = '#ffd600';
                context.lineWidth = 2 * z;
                context[beginPath]()[moveTo](capTop.x, capTop.y)[arc](capTop.x - length.x * 0.01 - AC.x * 0.03, capTop.y - length.y * 0.01 - AC.y * 0.03, 3 * z, 0, PI2)[fill]()
                    .fillStyle = context.strokeStyle = '#000';
                break;
        }
        length = head.cloneSub(steerCenter);
        //~ AC = new Point(length.y * this.direction, -length.x * this.direction);
        AC = { x: length.y * this.direction, y: -length.x * this.direction };
        //~ AC = AC.cloneScale(z * z);
        AC = { x: AC.x * z * z, y: AC.y * z * z };
        //~ var CV = steerCenter.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(130 / length.lengthSquared()));
        var factor = 130 / (length.x * length.x + length.y * length.y);
        var CV = {
            x: steerCenter.x + length.x * 0.4 + AC.x * factor,
            y: steerCenter.y + length.y * 0.4 + AC.y * factor
        };
        context[beginPath]();
        context.lineWidth = 5 * track.zoomFactor;
        context[moveTo](head.x, head.y);
        context[lineTo](CV.x, CV.y);
        context[lineTo](steerCenter.x, steerCenter.y);
        context[stroke]();
        context.strokeStyle = '#000';
        context.globalAlpha = 1;
    }

    toString() { return 'BMX'; }
}