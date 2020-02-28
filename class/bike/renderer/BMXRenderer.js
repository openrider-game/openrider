import { CanvasHelper } from "../../helper/CanvasHelper.js";
import { Point } from "../../Point.js";

export const BMXRenderer = (Base) => class extends Base {
    renderInternal(color, opacityFactor) {
        let drawer = CanvasHelper.getInstance();
        let track = this.track,
            backWheel = this.backWheel.pos.toPixel(track),
            frontWheel = this.frontWheel.pos.toPixel(track),
            head = this.head.pos.toPixel(track),
            z = track.zoomFactor;
        // Wheels
        drawer.setProperty('strokeStyle', color);
        drawer.setProperty('globalAlpha', opacityFactor);
        drawer.setProperty('lineWidth', 3.5 * z);
        drawer.beginPath()
            // (front wheel)
            .arc(backWheel.x, backWheel.y, 10 * z, 0, 2 * Math.PI, true)
            // (back wheel)
            .moveTo(frontWheel.x + 10 * z, frontWheel.y).arc(frontWheel.x, frontWheel.y, 10 * z, 0, 2 * Math.PI, true).stroke();
        let length = frontWheel.cloneSub(backWheel),
            AC = new Point((frontWheel.y - backWheel.y) * this.direction, (backWheel.x - frontWheel.x) * this.direction),
            crossFrameSaddle = backWheel.cloneAdd(length.cloneScale(0.3)).cloneAdd(AC.cloneScale(0.25)),
            shadowSteer = backWheel.cloneAdd(length.cloneScale(0.84)).cloneAdd(AC.cloneScale(0.42)),
            steer = backWheel.cloneAdd(length.cloneScale(0.84)).cloneAdd(AC.cloneScale(0.37)),
            pedalHinge = backWheel.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(0.05));
        // Frame
        drawer.setProperty('lineWidth', 3 * z);
        drawer.beginPath().moveTo(backWheel.x, backWheel.y).lineTo(crossFrameSaddle.x, crossFrameSaddle.y).lineTo(shadowSteer.x, shadowSteer.y).moveTo(steer.x, steer.y).lineTo(pedalHinge.x, pedalHinge.y).lineTo(backWheel.x, backWheel.y);
        let CY = new Point(6 * z * Math.cos(this.distance), 6 * z * Math.sin(this.distance)),
            pedal = pedalHinge.cloneAdd(CY),
            shadowPedal = pedalHinge.cloneSub(CY),
            saddle = backWheel.cloneAdd(length.cloneScale(0.17)).cloneAdd(AC.cloneScale(0.38)),
            Cg = backWheel.cloneAdd(length.cloneScale(0.3)).cloneAdd(AC.cloneScale(0.45)),
            Ci = backWheel.cloneAdd(length.cloneScale(0.25)).cloneAdd(AC.cloneScale(0.4));
        // Saddle
        drawer.moveTo(pedal.x, pedal.y).lineTo(shadowPedal.x, shadowPedal.y).moveTo(saddle.x, saddle.y).lineTo(Cg.x, Cg.y).moveTo(pedalHinge.x, pedalHinge.y).lineTo(Ci.x, Ci.y);
        let backWheelCenter = backWheel.cloneAdd(length.cloneScale(1)).cloneAdd(AC.cloneScale(0));
        let Cl = backWheel.cloneAdd(length.cloneScale(0.97)).cloneAdd(AC.cloneScale(0));
        let CO = backWheel.cloneAdd(length.cloneScale(0.8)).cloneAdd(AC.cloneScale(0.48));
        let CbackWheel = backWheel.cloneAdd(length.cloneScale(0.86)).cloneAdd(AC.cloneScale(0.5));
        let Ck = backWheel.cloneAdd(length.cloneScale(0.82)).cloneAdd(AC.cloneScale(0.65));
        let steerCenter = backWheel.cloneAdd(length.cloneScale(0.78)).cloneAdd(AC.cloneScale(0.67));
        // Steering Wheel
        drawer.moveTo(backWheelCenter.x, backWheelCenter.y).lineTo(Cl.x, Cl.y).lineTo(CO.x, CO.y).lineTo(CbackWheel.x, CbackWheel.y).lineTo(Ck.x, Ck.y).lineTo(steerCenter.x, steerCenter.y).stroke();
        if (this.dead) {
            return;
        }
        drawer.setProperty('lineCap', 'round');
        AC = head.cloneSub(backWheel.cloneAdd(length.cloneScale(0.5)));
        let hip = crossFrameSaddle.cloneSub(length.cloneScale(0.1)).cloneAdd(AC.cloneScale(0.3));
        let Ar = pedal.cloneSub(hip);
        let BA = new Point(Ar.y * this.direction, -Ar.x * this.direction).cloneScale(z * z);
        let knee = hip.cloneAdd(Ar.cloneScale(0.5)).cloneAdd(BA.cloneScale(200 / Ar.lengthSquared()));
        Ar = shadowPedal.cloneSub(hip);
        BA = new Point(Ar.y * this.direction, -Ar.x * this.direction).cloneScale(z * z);
        let shadowKnee = hip.cloneAdd(Ar.cloneScale(0.5)).cloneAdd(BA.cloneScale(200 / Ar.lengthSquared()));
        // Shadow Leg
        drawer.beginPath()
            .setProperty('lineWidth', 6 * z)
            .setProperty('globalAlpha', 0.5 * opacityFactor)
            .moveTo(shadowPedal.x, shadowPedal.y).lineTo(shadowKnee.x, shadowKnee.y).lineTo(hip.x, hip.y).stroke();
        // Leg
        drawer.beginPath()
            .setProperty('globalAlpha', opacityFactor)
            .moveTo(pedal.x, pedal.y).lineTo(knee.x, knee.y).lineTo(hip.x, hip.y).stroke();
        // Body
        head = crossFrameSaddle.cloneAdd(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(0.9));
        drawer.beginPath()
            .setProperty('lineWidth', 8 * z)
            .moveTo(hip.x, hip.y).lineTo(head.x, head.y).stroke();
        // Head
        let headCenter = crossFrameSaddle.cloneAdd(length.cloneScale(0.15)).cloneAdd(AC.cloneScale(1.05));
        drawer.setProperty('lineWidth', 2 * z);
        drawer.beginPath().moveTo(headCenter.x + 5 * z, headCenter.y).arc(headCenter.x, headCenter.y, 5 * z, 0, 2 * Math.PI, true).stroke();
        // Cap
        drawer.beginPath();
        switch (this.cap) {
            case 'cap':
                let capFront = crossFrameSaddle.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(1.1)),
                    capBack = crossFrameSaddle.cloneAdd(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(1.05));
                drawer.moveTo(capBack.x, capBack.y).lineTo(capFront.x, capFront.y).stroke();
                break;
            case 'hat':
                let hatFrontBottom = crossFrameSaddle.cloneAdd(length.cloneScale(0.35)).cloneAdd(AC.cloneScale(1.15)),
                    hatBackBottom = crossFrameSaddle.cloneSub(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(1.1)),
                    hatFront = crossFrameSaddle.cloneAdd(length.cloneScale(0.25)).cloneAdd(AC.cloneScale(1.13)),
                    hatBack = crossFrameSaddle.cloneAdd(length.cloneScale(0.05)).cloneAdd(AC.cloneScale(1.11)),
                    hatFrontTop = hatFrontBottom.cloneSub(length.cloneScale(0.1)).selfAdd(AC.cloneScale(0.2)),
                    hatBackTop = hatBackBottom.cloneAdd(length.cloneScale(0.02)).selfAdd(AC.cloneScale(0.2));
                drawer.setProperty('fillStyle', color);
                drawer.moveTo(hatFrontBottom.x, hatFrontBottom.y).lineTo(hatFront.x, hatFront.y).lineTo(hatFrontTop.x, hatFrontTop.y).lineTo(hatBackTop.x, hatBackTop.y).lineTo(hatBack.x, hatBack.y).lineTo(hatBackBottom.x, hatBackBottom.y).stroke().fill();
                break;
            case 'party':
                let partyHatFront = {
                        x: crossFrameSaddle.x + length.x * 0.28 + AC.x * 1.15,
                        y: crossFrameSaddle.y + length.y * 0.28 + AC.y * 1.15
                    },
                    partyHatBack = {
                        x: crossFrameSaddle.x + length.x * 0.0 + AC.x * 1.1,
                        y: crossFrameSaddle.y + length.y * 0.0 + AC.y * 1.1
                    },
                    partyHatTop = {
                        x: partyHatBack.x + length.x * 0.07 + AC.x * 0.33,
                        y: partyHatBack.y + length.y * 0.07 + AC.y * 0.33
                    };
                drawer.setProperty('fillStyle', '#3960ad');
                drawer.moveTo(partyHatFront.x, partyHatFront.y).lineTo(partyHatTop.x, partyHatTop.y).lineTo(partyHatBack.x, partyHatBack.y).fill()
                    .setProperty('strokeStyle', '#70d135');
                drawer.setProperty('lineWidth', 4 * z);
                drawer.beginPath().moveTo(partyHatFront.x, partyHatFront.y).lineTo(partyHatBack.x, partyHatBack.y).stroke()
                    .setProperty('fillStyle', '#ffd600');
                drawer.setProperty('lineWidth', 2 * z);
                drawer.beginPath().moveTo(partyHatTop.x, partyHatTop.y).arc(partyHatTop.x - length.x * 0.01 - AC.x * 0.03, partyHatTop.y - length.y * 0.01 - AC.y * 0.03, 3 * z, 0, 2 * Math.PI).fill()
                    .setProperty('fillStyle', color).setProperty('strokeStyle', color);
                break;
            case 'ninja':
                let headBandFront = {
                        x: crossFrameSaddle.x + length.x * 0.26 + AC.x * 1.1,
                        y: crossFrameSaddle.y + length.y * 0.26 + AC.y * 1.1
                    },
                    headBandBack = {
                        x: crossFrameSaddle.x + length.x * 0.05 + AC.x * 1.05,
                        y: crossFrameSaddle.y + length.y * 0.05 + AC.y * 1.05
                    };
                drawer.setProperty('lineWidth', 5 * z);
                drawer.moveTo(headBandFront.x, headBandFront.y).lineTo(headBandBack.x, headBandBack.y).stroke()
                    .setProperty('lineWidth', 2 * z);
                drawer.lineTo(headBandBack.x - (8 + Math.random()) * z * this.direction, headBandBack.y - (4 + Math.random()) * z * this.direction).moveTo(headBandBack.x, headBandBack.y).lineTo(headBandBack.x - (8 + Math.random()) * z * this.direction, headBandBack.y + (4 + Math.random()) * z * this.direction).stroke();
        }
        length = head.cloneSub(steerCenter);
        AC = new Point(length.y * this.direction, -length.x * this.direction).cloneScale(z * z);
        let elbow = steerCenter.cloneAdd(length.cloneScale(0.4)).cloneAdd(AC.cloneScale(130 / length.lengthSquared()));
        // Arm
        drawer.beginPath()
            .setProperty('lineWidth', 5 * z)
            .moveTo(head.x, head.y).lineTo(elbow.x, elbow.y).lineTo(steerCenter.x, steerCenter.y).stroke();
        drawer.setProperty('strokeStyle', '#000');
        drawer.setProperty('globalAlpha', 1);
    }
}