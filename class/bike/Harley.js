import { BIKE_HAR, HAR_INITIAL_STATE } from "../constant/BikeConstants.js";
import { CanvasHelper } from "../helper/CanvasHelper.js";
import { Vector } from "../Vector.js";
import { PlayerBike } from "./PlayerBike.js";

export class Harley extends PlayerBike {
    constructor(parent, last) {
        super(parent);
        last = last || HAR_INITIAL_STATE[0];
        this.$consts = HAR_INITIAL_STATE;

        this.restore(last);
        this.head.size = 14;
        this.backWheel.size = 14;
        this.frontWheel.size = 14;
        this.headToBack.lengthTowards = 35;
        this.headToBack.springConstant = 0.5;
        this.headToBack.dampConstant = 0.7;
        this.frontToBack.lengthTowards = 45;
        this.frontToBack.springConstant = 0.2;
        this.frontToBack.dampConstant = 0.3;
        this.headToFront.lengthTowards = 45;
        this.headToFront.springConstant = 0.2;
        this.headToFront.dampConstant = 0.3;
        this.rotationFactor = 10;
    }

    render() {
        let drawer = CanvasHelper.getInstance();
        let track = this.track;
        let backWheel = this.backWheel.pos.toPixel(track);
        let pos = this.frontWheel.pos.toPixel(track);
        let head = this.head.pos.toPixel(track);
        let length = pos.cloneSub(backWheel);
        let AC = new Vector((pos.y - backWheel.y) * this.direction, (backWheel.x - pos.x) * this.direction);
        let middle = head.cloneSub(backWheel.cloneAdd(length.cloneScale(0.5)));
        drawer.beginPath();
        drawer.setProperty('strokeStyle', '#000');
        drawer.setProperty('lineWidth', 3.5 * track.zoomFactor);
        drawer.arc(backWheel.x, backWheel.y, 12.5 * track.zoomFactor, 0, 2 * Math.PI, true);
        drawer.moveTo(pos.x + 12.5 * track.zoomFactor, pos.y);
        drawer.arc(pos.x, pos.y, 12.5 * track.zoomFactor, 0, 2 * Math.PI, true);
        drawer.stroke();
        drawer.beginPath();
        drawer.setProperty('fillStyle', 'grey');
        drawer.moveTo(backWheel.x + 5 * track.zoomFactor, backWheel.y);
        drawer.arc(backWheel.x, backWheel.y, 5 * track.zoomFactor, 0, 2 * Math.PI, true);
        drawer.moveTo(pos.x + 4 * track.zoomFactor, pos.y);
        drawer.arc(pos.x, pos.y, 4 * track.zoomFactor, 0, 2 * Math.PI, true);
        drawer.fill();
        drawer.beginPath();
        drawer.setProperty('lineWidth', 5 * track.zoomFactor);
        drawer.moveTo(backWheel.x, backWheel.y);
        drawer.lineTo(backWheel.x + length.x * 0.4 + AC.x * 0.05, backWheel.y + length.y * 0.4 + AC.y * 0.05);
        drawer.moveTo(backWheel.x + length.x * 0.57 + middle.x * 0.64, backWheel.y + length.y * 0.57 + middle.y * 0.64);
        drawer.lineTo(backWheel.x + length.x * 0.46 + middle.x * 0.4, backWheel.y + length.y * 0.46 + middle.y * 0.4);
        drawer.lineTo(backWheel.x + length.x * 0.4 + AC.x * 0.05, backWheel.y + length.y * 0.4 + AC.y * 0.05);
        drawer.stroke();
        drawer.beginPath();
        drawer.setProperty('lineWidth', 2 * track.zoomFactor);
        drawer.moveTo(backWheel.x + length.x * 0.57 + middle.x * 0.64, backWheel.y + length.y * 0.57 + middle.y * 0.64);
        drawer.lineTo(backWheel.x + length.x * 0.43 + AC.x * 0.05, backWheel.y + length.y * 0.43 + AC.y * 0.05);
        drawer.moveTo(backWheel.x + length.x * 0.45 + middle.x * 0.3, backWheel.y + length.y * 0.45 + middle.y * 0.3);
        drawer.lineTo(backWheel.x + length.x * 0.3 + middle.x * 0.4, backWheel.y + length.y * 0.3 + middle.y * 0.4);
        drawer.lineTo(backWheel.x + length.x * 0.25 + middle.x * 0.6, backWheel.y + length.y * 0.25 + middle.y * 0.6);
        drawer.moveTo(backWheel.x + length.x * 0.17 + middle.x * 0.6, backWheel.y + length.y * 0.17 + middle.y * 0.6);
        drawer.lineTo(backWheel.x + length.x * 0.3 + middle.x * 0.6, backWheel.y + length.y * 0.3 + middle.y * 0.6);
        // Engine box
        drawer.moveTo(backWheel.x + length.x * 0.57 + middle.x * 0.64, backWheel.y + length.y * 0.57 + middle.y * 0.64);
        drawer.lineTo(backWheel.x + length.x * 0.8 + middle.x * 0.2, backWheel.y + length.y * 0.8 + middle.y * 0.2);
        // Footstand
        drawer.lineTo(backWheel.x + length.x * 0.3 + AC.x * 0.05, backWheel.y + length.y * 0.3 + AC.y * 0.05);
        drawer.lineTo(backWheel.x + length.x * 0.5 + AC.x * 0.05, backWheel.y + length.y * 0.5 + AC.y * 0.05);
        drawer.stroke();
        drawer.beginPath();
        drawer.setProperty('lineWidth', track.zoomFactor);
        // Steering axis
        drawer.moveTo(backWheel.x + length.x * 0.46 + middle.x * 0.4, backWheel.y + length.y * 0.46 + middle.y * 0.4);
        drawer.lineTo(backWheel.x + length.x * 0.28 + middle.x * 0.5, backWheel.y + length.y * 0.28 + middle.y * 0.5);
        drawer.stroke();
        drawer.beginPath();
        drawer.setProperty('lineWidth', 3 * track.zoomFactor);
        drawer.moveTo(pos.x, pos.y);
        drawer.lineTo(backWheel.x + length.x * 0.56 + middle.x * 0.73, backWheel.y + length.y * 0.56 + middle.y * 0.73);
        let Ap = new Vector(6 * Math.cos(this.distance) * track.zoomFactor, 6 * Math.sin(this.distance) * track.zoomFactor);
        drawer.lineTo(backWheel.x + length.x * 0.58 + middle.x * 0.77, backWheel.y + length.y * 0.58 + middle.y * 0.77);
        drawer.lineTo(backWheel.x + length.x * 0.55 + middle.x * 0.8, backWheel.y + length.y * 0.55 + middle.y * 0.8);
        drawer.stroke();
        if (this.dead) {
            return;
        }
        AC = head.cloneSub(backWheel.cloneAdd(length.cloneScale(0.5)));
        let crossFrameSaddle = backWheel.cloneAdd(length.cloneScale(0.3)).cloneAdd(AC.cloneScale(0.25));
        let B2 = backWheel.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(0.05));
        let Bp = B2.cloneAdd(Ap);
        let A6 = B2.cloneSub(Ap);
        let A7 = backWheel.cloneAdd(length.cloneScale(0.67)).cloneAdd(AC.cloneScale(0.8));
        let AY = crossFrameSaddle.cloneAdd(length.cloneScale(-0.05)).cloneAdd(AC.cloneScale(0.42));
        let Aa = Bp.cloneSub(AY);
        middle = new Vector(Aa.y * this.direction, -Aa.x * this.direction);
        middle = middle.cloneScale(track.zoomFactor * track.zoomFactor);
        let CZ = AY.cloneAdd(Aa.cloneScale(0.5)).cloneAdd(middle.cloneScale(200 / Aa.lengthSquared()));
        Aa = A6.cloneSub(AY);
        middle = new Vector(Aa.y * this.direction, -Aa.x * this.direction);
        middle = middle.cloneScale(track.zoomFactor * track.zoomFactor);
        let CX = AY.cloneAdd(Aa.cloneScale(0.5)).cloneAdd(middle.cloneScale(200 / Aa.lengthSquared()));
        drawer.beginPath();
        drawer.setProperty('lineWidth', 6 * track.zoomFactor);
        drawer.setProperty('strokeStyle', 'rgba(0, 0, 0, 0.5)');
        drawer.moveTo(A6.x, A6.y);
        drawer.lineTo(CX.x, CX.y);
        drawer.lineTo(AY.x, AY.y);
        drawer.stroke();
        drawer.beginPath();
        drawer.setProperty('strokeStyle', '#000');
        drawer.moveTo(Bp.x, Bp.y);
        drawer.lineTo(CZ.x, CZ.y);
        drawer.lineTo(AY.x, AY.y);
        drawer.stroke();
        let BX = crossFrameSaddle.cloneAdd(length.cloneScale(0.1)).cloneAdd(AC.cloneScale(0.95));
        drawer.beginPath();
        drawer.setProperty('lineWidth', 8 * track.zoomFactor);
        drawer.moveTo(AY.x, AY.y);
        drawer.lineTo(BX.x, BX.y);
        drawer.stroke();
        let Bl = crossFrameSaddle.cloneAdd(length.cloneScale(0.2)).cloneAdd(AC.cloneScale(1.09));
        drawer.beginPath();
        drawer.setProperty('lineWidth', 2 * track.zoomFactor);
        drawer.moveTo(Bl.x + 5 * track.zoomFactor, Bl.y);
        drawer.arc(Bl.x, Bl.y, 5 * track.zoomFactor, 0, 2 * Math.PI, true);
        drawer.stroke();
        // Cap
        drawer.beginPath();
        switch (this.cap) {
            case 'cap':
                let Ch = crossFrameSaddle.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(1.15)),
                    Cd = crossFrameSaddle.cloneAdd(length.cloneScale(0.1)).cloneAdd(AC.cloneScale(1.05));
                drawer.moveTo(Ch.x, Ch.y);
                drawer.lineTo(Cd.x, Cd.y);
                drawer.stroke();
                break;
            case 'hat':
                let hatFrontBottom = crossFrameSaddle.cloneAdd(length.cloneScale(0.37)).cloneAdd(AC.cloneScale(1.19)),
                    hatBackBottom = crossFrameSaddle.cloneSub(length.cloneScale(0.02)).cloneAdd(AC.cloneScale(1.14)),
                    hatFront = crossFrameSaddle.cloneAdd(length.cloneScale(0.28)).cloneAdd(AC.cloneScale(1.17)),
                    hatBack = crossFrameSaddle.cloneAdd(length.cloneScale(0.09)).cloneAdd(AC.cloneScale(1.15)),
                    hatFrontTop = hatFrontBottom.cloneSub(length.cloneScale(0.1)).selfAdd(AC.cloneScale(0.2)),
                    hatBackTop = hatBackBottom.cloneAdd(length.cloneScale(0.02)).selfAdd(AC.cloneScale(0.2));
                drawer.moveTo(hatFrontBottom.x, hatFrontBottom.y);
                drawer.lineTo(hatFront.x, hatFront.y);
                drawer.lineTo(hatFrontTop.x, hatFrontTop.y);
                drawer.lineTo(hatBackTop.x, hatBackTop.y);
                drawer.lineTo(hatBack.x, hatBack.y);
                drawer.lineTo(hatBackBottom.x, hatBackBottom.y);
                drawer.setProperty('fillStyle', '#000');
                drawer.stroke();
                drawer.fill();
        }
        length = BX.cloneSub(A7);
        AC = new Vector(length.y * this.direction, -length.x * this.direction);
        AC = AC.cloneScale(track.zoomFactor * track.zoomFactor);
        let CU = A7.cloneAdd(length.cloneScale(0.3)).cloneAdd(AC.cloneScale(80 / length.lengthSquared()));
        drawer.beginPath();
        drawer.setProperty('lineWidth', 5 * track.zoomFactor);
        drawer.moveTo(BX.x, BX.y);
        drawer.lineTo(CU.x, CU.y);
        drawer.lineTo(A7.x, A7.y);
        drawer.stroke();
    }

    toString() {
        return BIKE_HAR;
    };
}