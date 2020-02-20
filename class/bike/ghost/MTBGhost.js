import { BodyPart } from "../part/BodyPart.js";
import { Wheel } from "../part/Wheel.js";
import { Joint } from "../../Joint.js";
import { Point } from "../../Point.js";
import { arc, beginPath, fill, lineTo, moveTo, stroke } from "../../utils/DrawUtils.js";
import { cos, PI2, sin } from "../../utils/MathUtils.js";
import { GhostBike } from "./GhostBike.js";
import { track, context } from "../../../unobfuscated_bhr.js";
import { mtbConstants } from "../../constant/TrackConstants.js";

export class MTBGhost extends GhostBike {
    constructor(parent, ghostKeys, last) {
        last = last || (console.log('fallback', last), enghosten([mtbConstants[0]])[0]);
        super(ghostKeys, last, parent);
        this.points = {
            0: this.head = new BodyPart(new Point(last[0], last[1]), this),
            1: this.backWheel = new Wheel(new Point(last[6], last[7]), this),
            2: this.frontWheel = new Wheel(new Point(last[13], last[14]), this),
            $length: 3
        };
        this.head.oldPos = new Point(last[2], last[3]);
        this.head.velocity = new Point(last[4], last[5]);
        this.backWheel.oldPos = new Point(last[8], last[9]);
        this.backWheel.velocity = new Point(last[10], last[11]);
        this.backWheel.speedValue = last[12];
        this.frontWheel.oldPos = new Point(last[15], last[16]);
        this.frontWheel.velocity = new Point(last[17], last[18]);
        this.frontWheel.speedValue = last[19];
        this.head.size = 14;
        this.head.drive = () => {};
        this.backWheel.size = 14;
        this.frontWheel.size = 14;
        this.joints = {
            0: this.headToBack = new Joint(this.head, this.backWheel, this),
            1: this.frontToBack = new Joint(this.backWheel, this.frontWheel, this),
            2: this.headToFront = new Joint(this.frontWheel, this.head, this),
            $length: 3
        };
        this.headToBack.lengthTowards = 47;
        this.headToBack.len = last[20];
        this.headToBack.BC = 0.2;
        this.headToBack.BE = 0.3;
        this.frontToBack.lengthTowards = 45;
        this.frontToBack.len = last[21];
        this.frontToBack.BC = 0.2;
        this.frontToBack.BE = 0.3;
        this.headToFront.lengthTowards = 45;
        this.headToFront.len = last[22];
        this.headToFront.BC = 0.2;
        this.headToFront.BE = 0.3;
        this.direction = last[23];
        this.gravity = new Point(last[24], last[25]);
        this.slow = last[26];
        this.leftPressed = last[27];
        this.rightPressed = last[28];
        this.upPressed = last[29];
        this.downPressed = last[30];
        this.time = ghostKeys[5];
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
        this.frontToBack.rotate(rotate / 8);
        if (!rotate && this.upPressed) {
            this.headToBack.lean(-7, 5);
            this.headToFront.lean(7, 5);
        }
    }

    draw() {
        var color = this.color,
            backWheel = this.backWheel.pos.toPixel(track);
        var pos = this.frontWheel.pos.toPixel(track);
        var head = this.head.pos.toPixel(track);
        var length = pos.cloneSub(backWheel);
        var AC = new Point((pos.y - backWheel.y) * this.direction, (backWheel.x - pos.x) * this.direction);
        var middle = head.cloneSub(backWheel.cloneAdd(length.cloneScale(0.5)));
        context.strokeStyle = color;
        context.globalAlpha = 0.6;
        context.lineWidth = 3.5 * track.zoomFactor;
        context[beginPath]()[arc](backWheel.x, backWheel.y, 12.5 * track.zoomFactor, 0, PI2, true)[moveTo](pos.x + 12.5 * track.zoomFactor, pos.y)[arc](pos.x, pos.y, 12.5 * track.zoomFactor, 0, PI2, true)[stroke]()[beginPath]()
            .fillStyle = color;
        context.globalAlpha = 0.3;
        context[moveTo](backWheel.x + 5 * track.zoomFactor, backWheel.y)[arc](backWheel.x, backWheel.y, 5 * track.zoomFactor, 0, PI2, true)[moveTo](pos.x + 4 * track.zoomFactor, pos.y)[arc](pos.x, pos.y, 4 * track.zoomFactor, 0, PI2, true)[fill]()[beginPath]()
            .lineWidth = 5 * track.zoomFactor;
        context[moveTo](backWheel.x, backWheel.y)[lineTo](backWheel.x + length.x * 0.4 + AC.x * 0.05, backWheel.y + length.y * 0.4 + AC.y * 0.05)[moveTo](backWheel.x + length.x * 0.72 + middle.x * 0.64, backWheel.y + length.y * 0.72 + middle.y * 0.64)[lineTo](backWheel.x + length.x * 0.46 + middle.x * 0.4, backWheel.y + length.y * 0.46 + middle.y * 0.4)[lineTo](backWheel.x + length.x * 0.4 + AC.x * 0.05, backWheel.y + length.y * 0.4 + AC.y * 0.05)[stroke]()[beginPath]()
            .lineWidth = 2 * track.zoomFactor;
        var Ap = new Point(6 * cos(this.distance) * track.zoomFactor, 6 * sin(this.distance) * track.zoomFactor);
        context[moveTo](backWheel.x + length.x * 0.72 + middle.x * 0.64, backWheel.y + length.y * 0.72 + middle.y * 0.64)[lineTo](backWheel.x + length.x * 0.43 + AC.x * 0.05, backWheel.y + length.y * 0.43 + AC.y * 0.05)[moveTo](backWheel.x + length.x * 0.45 + middle.x * 0.3, backWheel.y + length.y * 0.45 + middle.y * 0.3)[lineTo](backWheel.x + length.x * 0.3 + middle.x * 0.4, backWheel.y + length.y * 0.3 + middle.y * 0.4)[lineTo](backWheel.x + length.x * 0.25 + middle.x * 0.6, backWheel.y + length.y * 0.25 + middle.y * 0.6)[moveTo](backWheel.x + length.x * 0.17 + middle.x * 0.6, backWheel.y + length.y * 0.17 + middle.y * 0.6)[lineTo](backWheel.x + length.x * 0.3 + middle.x * 0.6, backWheel.y + length.y * 0.3 + middle.y * 0.6)[moveTo](backWheel.x + length.x * 0.43 + AC.x * 0.05 + Ap.x, backWheel.y + length.y * 0.43 + AC.y * 0.05 + Ap.y)[lineTo](backWheel.x + length.x * 0.43 + AC.x * 0.05 - Ap.x, backWheel.y + length.y * 0.43 + AC.y * 0.05 - Ap.y)[stroke]()[beginPath]()
            .lineWidth = track.zoomFactor;
        context[moveTo](backWheel.x + length.x * 0.46 + middle.x * 0.4, backWheel.y + length.y * 0.46 + middle.y * 0.4)[lineTo](backWheel.x + length.x * 0.28 + middle.x * 0.5, backWheel.y + length.y * 0.28 + middle.y * 0.5)[stroke]()[beginPath]()
            .lineWidth = 3 * track.zoomFactor;
        context[moveTo](pos.x, pos.y)[lineTo](backWheel.x + length.x * 0.71 + middle.x * 0.73, backWheel.y + length.y * 0.71 + middle.y * 0.73)[lineTo](backWheel.x + length.x * 0.73 + middle.x * 0.77, backWheel.y + length.y * 0.73 + middle.y * 0.77)[lineTo](backWheel.x + length.x * 0.7 + middle.x * 0.8, backWheel.y + length.y * 0.7 + middle.y * 0.8)[stroke]()
            .lineWidth = 6 * track.zoomFactor;
        AC = head.cloneSub(backWheel.cloneAdd(length.cloneScale(0.5)));
        var crossFrameSaddle = backWheel.cloneAdd(length.cloneScale(0.3)).cloneAdd(AC.cloneScale(0.25));
        var B2 = backWheel.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(0.05));
        var Bp = B2.cloneAdd(Ap);
        var A6 = B2.cloneSub(Ap);
        var A7 = backWheel.cloneAdd(length.cloneScale(0.67)).cloneAdd(AC.cloneScale(0.8));
        var AY = crossFrameSaddle.cloneAdd(length.cloneScale(-0.05)).cloneAdd(AC.cloneScale(0.42));
        var Aa = Bp.cloneSub(AY);
        middle = new Point(Aa.y * this.direction, -Aa.x * this.direction);
        middle = middle.cloneScale(track.zoomFactor * track.zoomFactor);
        var CZ = AY.cloneAdd(Aa.cloneScale(0.5)).cloneAdd(middle.cloneScale(200 / Aa.lengthSquared()));
        Aa = A6.cloneSub(AY);
        middle = new Point(Aa.y * this.direction, -Aa.x * this.direction);
        middle = middle.cloneScale(track.zoomFactor * track.zoomFactor);
        var CX = AY.cloneAdd(Aa.cloneScale(0.5)).cloneAdd(middle.cloneScale(200 / Aa.lengthSquared()));
        context.strokeStyle = color;
        context.globalAlpha = 0.3;
        context[beginPath]()[moveTo](A6.x, A6.y)[lineTo](CX.x, CX.y)[lineTo](AY.x, AY.y)[stroke]()[beginPath]()
            .strokeStyle = color;
        context.globalAlpha = 0.6;
        context[moveTo](Bp.x, Bp.y)[lineTo](CZ.x, CZ.y)[lineTo](AY.x, AY.y)[stroke]()[beginPath]()
            .lineWidth = 8 * track.zoomFactor;
        var BX = crossFrameSaddle.cloneAdd(length.cloneScale(0.1)).cloneAdd(AC.cloneScale(0.95));
        context[moveTo](AY.x, AY.y)[lineTo](BX.x, BX.y)[stroke]()[beginPath]()
            .lineWidth = 2 * track.zoomFactor;
        // Cap
        switch (this.cap) {
            case 'cap':
                var Ch = crossFrameSaddle.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(1.15)),
                    Cd = crossFrameSaddle.cloneAdd(length.cloneScale(0.1)).cloneAdd(AC.cloneScale(1.05));
                context[moveTo](Ch.x, Ch.y)[lineTo](Cd.x, Cd.y)[stroke]();
                break;
            case 'hat':
                var hatFrontBottom = crossFrameSaddle.cloneAdd(length.cloneScale(0.37)).cloneAdd(AC.cloneScale(1.19)),
                    hatBackBottom = crossFrameSaddle.cloneSub(length.cloneScale(0.02)).cloneAdd(AC.cloneScale(1.14)),
                    hatFront = crossFrameSaddle.cloneAdd(length.cloneScale(0.28)).cloneAdd(AC.cloneScale(1.17)),
                    hatBack = crossFrameSaddle.cloneAdd(length.cloneScale(0.09)).cloneAdd(AC.cloneScale(1.15)),
                    hatFrontTop = hatFrontBottom.cloneSub(length.cloneScale(0.1)).selfAdd(AC.cloneScale(0.2)),
                    hatBackTop = hatBackBottom.cloneAdd(length.cloneScale(0.02)).selfAdd(AC.cloneScale(0.2));
                context[moveTo](hatFrontBottom.x, hatFrontBottom.y)[lineTo](hatFront.x, hatFront.y)[lineTo](hatFrontTop.x, hatFrontTop.y)[lineTo](hatBackTop.x, hatBackTop.y)[lineTo](hatBack.x, hatBack.y)[lineTo](hatBackBottom.x, hatBackBottom.y)
                    .fillStyle = color;
                context.globalAlpha = 0.6;
                context[stroke]()[fill]();
        }
        length = BX.cloneSub(A7);
        AC = new Point(length.y * this.direction, -length.x * this.direction);
        AC = AC.cloneScale(track.zoomFactor * track.zoomFactor);
        var CU = A7.cloneAdd(length.cloneScale(0.3)).cloneAdd(AC.cloneScale(80 / length.lengthSquared()));
        context[beginPath]()
            .lineWidth = 5 * track.zoomFactor;
        context[moveTo](BX.x, BX.y)[lineTo](CU.x, CU.y)[lineTo](A7.x, A7.y)[stroke]()
            .strokeStyle = '#000';
        context.globalAlpha = 1;
    }

    toString() { return 'MTB'; }
}