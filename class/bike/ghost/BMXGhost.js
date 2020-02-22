import { BodyPart } from "../part/BodyPart.js";
import { Wheel } from "../part/Wheel.js";
import { Joint } from "../../Joint.js";
import { Point } from "../../Point.js";
import { cos, PI2, sin } from "../../utils/MathUtils.js";
import { GhostBike } from "./GhostBike.js";
import { bmxConstants } from "../../constant/TrackConstants.js";
import { CanvasHelper } from "../../helper/CanvasHelper.js";

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
        let rotate = this.leftPressed - this.rightPressed;
        this.headToBack.lean(rotate * 5 * this.direction, 5);
        this.headToFront.lean(-rotate * 5 * this.direction, 5);
        this.frontToBack.rotate(rotate / 6);
        if (!rotate && this.upPressed) {
            this.headToBack.lean(-7, 5);
            this.headToFront.lean(7, 5);
        }
    }

    draw() {
        let drawer = CanvasHelper.getInstance();
        let track = this.parnt,
            color = this.color,
            backWheel = this.backWheel.pos.toPixel(track),
            frontWheel = this.frontWheel.pos.toPixel(track),
            z = track.zoomFactor;
        // Wheels
        drawer.beginPath();
        drawer.setProperty('strokeStyle', color);
        drawer.setProperty('globalAlpha', 0.6);
        drawer.setProperty('lineWidth', 3.5 * z);
        // (front wheel)
        drawer.arc(backWheel.x, backWheel.y, 10 * z, 0, PI2, true);
        // (back wheel)
        drawer.moveTo(frontWheel.x + 10 * z, frontWheel.y);
        drawer.arc(frontWheel.x, frontWheel.y, 10 * z, 0, PI2, true);
        drawer.stroke();
        let length = frontWheel.cloneSub(backWheel),
            AC = new Point((frontWheel.y - backWheel.y) * this.direction, (backWheel.x - frontWheel.x) * this.direction),
            crossFrameSaddle = backWheel.cloneAdd(length.cloneScale(0.3)).cloneAdd(AC.cloneScale(0.25)),
            shadowSteer = backWheel.cloneAdd(length.cloneScale(0.84)).cloneAdd(AC.cloneScale(0.42)),
            steer = backWheel.cloneAdd(length.cloneScale(0.84)).cloneAdd(AC.cloneScale(0.37)),
            pedalHinge = backWheel.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(0.05));
        // Frame
        drawer.beginPath();
        drawer.setProperty('lineWidth', 3 * z);
        drawer.moveTo(backWheel.x, backWheel.y);
        drawer.lineTo(crossFrameSaddle.x, crossFrameSaddle.y);
        drawer.lineTo(shadowSteer.x, shadowSteer.y);
        drawer.moveTo(steer.x, steer.y);
        drawer.lineTo(pedalHinge.x, pedalHinge.y);
        drawer.lineTo(backWheel.x, backWheel.y);
        let CY = new Point(6 * z * cos(this.distance), 6 * z * sin(this.distance)),
            pedal = pedalHinge.cloneAdd(CY),
            shadowPedal = pedalHinge.cloneSub(CY),
            saddle = backWheel.cloneAdd(length.cloneScale(0.17)).cloneAdd(AC.cloneScale(0.38)),
            Cg = backWheel.cloneAdd(length.cloneScale(0.3)).cloneAdd(AC.cloneScale(0.45)),
            Ci = backWheel.cloneAdd(length.cloneScale(0.25)).cloneAdd(AC.cloneScale(0.4));
        // Saddle
        drawer.moveTo(pedal.x, pedal.y);
        drawer.lineTo(shadowPedal.x, shadowPedal.y);
        drawer.moveTo(saddle.x, saddle.y);
        drawer.lineTo(Cg.x, Cg.y);
        drawer.moveTo(pedalHinge.x, pedalHinge.y);
        drawer.lineTo(Ci.x, Ci.y);
        let backWheelCenter = backWheel.cloneAdd(length.cloneScale(1)).cloneAdd(AC.cloneScale(0));
        let Cl = backWheel.cloneAdd(length.cloneScale(0.97)).cloneAdd(AC.cloneScale(0));
        let CO = backWheel.cloneAdd(length.cloneScale(0.8)).cloneAdd(AC.cloneScale(0.48));
        let CbackWheel = backWheel.cloneAdd(length.cloneScale(0.86)).cloneAdd(AC.cloneScale(0.5));
        let Ck = backWheel.cloneAdd(length.cloneScale(0.82)).cloneAdd(AC.cloneScale(0.65));
        let steerCenter = backWheel.cloneAdd(length.cloneScale(0.78)).cloneAdd(AC.cloneScale(0.67));
        // Steering Wheel
        drawer.moveTo(backWheelCenter.x, backWheelCenter.y);
        drawer.lineTo(Cl.x, Cl.y);
        drawer.lineTo(CO.x, CO.y);
        drawer.lineTo(CbackWheel.x, CbackWheel.y);
        drawer.lineTo(Ck.x, Ck.y);
        drawer.lineTo(steerCenter.x, steerCenter.y);
        drawer.stroke();
        let h = this.head.pos.toPixel(track);
        AC = h.cloneSub(backWheel.cloneAdd(length.cloneScale(0.5)));
        let hip = crossFrameSaddle.cloneSub(length.cloneScale(0.1)).cloneAdd(AC.cloneScale(0.3));
        let Ar = pedal.cloneSub(hip);
        let BA = new Point(Ar.y * this.direction, -Ar.x * this.direction);
        BA = BA.cloneScale(z * z);
        let knee = hip.cloneAdd(Ar.cloneScale(0.5)).cloneAdd(BA.cloneScale(200 / Ar.lengthSquared()));
        Ar = shadowPedal.cloneSub(hip);
        BA = new Point(Ar.y * this.direction, -Ar.x * this.direction);
        BA = BA.cloneScale(z * z);
        let shadowKnee = hip.cloneAdd(Ar.cloneScale(0.5)).cloneAdd(BA.cloneScale(200 / Ar.lengthSquared()));
        // Shadow Leg
        drawer.beginPath();
        drawer.setProperty('lineWidth', 6 * z);
        drawer.setProperty('globalAlpha', 0.3);
        drawer.moveTo(shadowPedal.x, shadowPedal.y);
        drawer.lineTo(shadowKnee.x, shadowKnee.y);
        drawer.lineTo(hip.x, hip.y);
        drawer.stroke();
        // Leg
        drawer.beginPath();
        drawer.setProperty('globalAlpha', 0.6);
        drawer.setProperty('lineWidth', 6 * z);
        drawer.moveTo(pedal.x, pedal.y);
        drawer.lineTo(knee.x, knee.y);
        drawer.lineTo(hip.x, hip.y);
        drawer.stroke();
        // Body
        let head = crossFrameSaddle.cloneAdd(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(0.9));
        drawer.beginPath();
        drawer.setProperty('lineWidth', 8 * z);
        drawer.moveTo(hip.x, hip.y);
        drawer.lineTo(head.x, head.y);
        drawer.stroke();
        // Cap
        drawer.beginPath();
        drawer.setProperty('lineWidth', 2 * z);
        switch (this.cap) {
            case 'cap':
                let Ch = crossFrameSaddle.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(1.1)),
                    Cd = crossFrameSaddle.cloneAdd(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(1.05));
                drawer.moveTo(Ch.x, Ch.y);
                drawer.lineTo(Cd.x, Cd.y);
                drawer.stroke();
                break;
            case 'hat':
                let hatFrontBottom = crossFrameSaddle.cloneAdd(length.cloneScale(0.35)).cloneAdd(AC.cloneScale(1.15)),
                    hatBackBottom = crossFrameSaddle.cloneSub(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(1.1)),
                    hatFront = crossFrameSaddle.cloneAdd(length.cloneScale(0.25)).cloneAdd(AC.cloneScale(1.13)),
                    hatBack = crossFrameSaddle.cloneAdd(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(1.11)),
                    hatFrontTop = hatFrontBottom.cloneSub(length.cloneScale(0.1)).selfAdd(AC.cloneScale(0.2)),
                    //~ hatBackTop = hatBackBottom.cloneAdd(length.cloneScale(0.02)).selfAdd(AC.cloneScale(0.2));
                    hatBackTop = {
                        x: hatBackBottom.x + length.x * 0.02 + AC.x * 0.2,
                        y: hatBackBottom.y + length.y * 0.02 + AC.y * 0.2
                    };
                drawer.moveTo(hatFrontBottom.x, hatFrontBottom.y);
                drawer.lineTo(hatFront.x, hatFront.y);
                drawer.lineTo(hatFrontTop.x, hatFrontTop.y);
                drawer.lineTo(hatBackTop.x, hatBackTop.y);
                drawer.lineTo(hatBack.x, hatBack.y);
                drawer.lineTo(hatBackBottom.x, hatBackBottom.y);
                drawer.setProperty('fillStyle', color);
                drawer.stroke();
                drawer.fill();
                break;
            case 'party':
                let capFront = {
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
                drawer.setProperty('fillStyle', '#3960ad');
                drawer.moveTo(capFront.x, capFront.y).lineTo(capTop.x, capTop.y).lineTo(capBack.x, capBack.y).fill()
                    .setProperty('strokeStyle', '#70d135');
                drawer.setProperty('lineWidth', 4 * z);
                drawer.beginPath().moveTo(capFront.x, capFront.y).lineTo(capBack.x, capBack.y).stroke()
                    .setProperty('fillStyle', '#ffd600');
                drawer.setProperty('lineWidth', 2 * z);
                drawer.beginPath().moveTo(capTop.x, capTop.y).arc(capTop.x - length.x * 0.01 - AC.x * 0.03, capTop.y - length.y * 0.01 - AC.y * 0.03, 3 * z, 0, PI2).fill()
                    .setProperty('fillStyle', '#000').setProperty('strokeStyle', '#000');
                break;
        }
        length = head.cloneSub(steerCenter);
        //~ AC = new Point(length.y * this.direction, -length.x * this.direction);
        AC = { x: length.y * this.direction, y: -length.x * this.direction };
        //~ AC = AC.cloneScale(z * z);
        AC = { x: AC.x * z * z, y: AC.y * z * z };
        //~ let CV = steerCenter.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(130 / length.lengthSquared()));
        let factor = 130 / (length.x * length.x + length.y * length.y);
        let CV = {
            x: steerCenter.x + length.x * 0.4 + AC.x * factor,
            y: steerCenter.y + length.y * 0.4 + AC.y * factor
        };
        drawer.beginPath();
        drawer.setProperty('lineWidth', 5 * track.zoomFactor);
        drawer.moveTo(head.x, head.y);
        drawer.lineTo(CV.x, CV.y);
        drawer.lineTo(steerCenter.x, steerCenter.y);
        drawer.stroke();
        drawer.setProperty('strokeStyle', '#000');
        drawer.setProperty('globalAlpha', 1);
    }

    toString() { return 'BMX'; }
}