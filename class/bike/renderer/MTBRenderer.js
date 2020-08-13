import { CanvasHelper } from "../../helper/CanvasHelper.js";
import { Vector } from "../../Vector.js";

export const MTBRenderer = (Base) => class extends Base {
    renderInternal(color, opacityFactor) {
        let drawer = CanvasHelper.getInstance();
        let track = this.track,
            backWheel = this.backWheel.displayPos.toPixel(track),
            frontWheel = this.frontWheel.displayPos.toPixel(track),
            head = this.head.displayPos.toPixel(track);
        let length = frontWheel.sub(backWheel);
        let AC = new Vector((frontWheel.y - backWheel.y) * this.direction, (backWheel.x - frontWheel.x) * this.direction);
        let middle = head.sub(backWheel.add(length.scale(0.5)));
        // Wheels
        drawer.setProperty('strokeStyle', color);
        drawer.setProperty('globalAlpha', opacityFactor);
        drawer.setProperty('lineWidth', 3.5 * track.zoomFactor);
        drawer.beginPath().arc(backWheel.x, backWheel.y, 12.5 * track.zoomFactor, 0, 2 * Math.PI, true).moveTo(frontWheel.x + 12.5 * track.zoomFactor, frontWheel.y).arc(frontWheel.x, frontWheel.y, 12.5 * track.zoomFactor, 0, 2 * Math.PI, true).stroke()
            // Wheel Axis
            .beginPath()
            .setProperty('fillStyle', color);
        drawer.setProperty('globalAlpha', 0.5 * opacityFactor);
        drawer.moveTo(backWheel.x + 5 * track.zoomFactor, backWheel.y).arc(backWheel.x, backWheel.y, 5 * track.zoomFactor, 0, 2 * Math.PI, true).moveTo(frontWheel.x + 4 * track.zoomFactor, frontWheel.y).arc(frontWheel.x, frontWheel.y, 4 * track.zoomFactor, 0, 2 * Math.PI, true).fill()
            //
            .beginPath()
            .setProperty('globalAlpha', opacityFactor)
            .setProperty('lineWidth', 5 * track.zoomFactor);
        drawer.moveTo(backWheel.x, backWheel.y).lineTo(backWheel.x + length.x * 0.4 + AC.x * 0.05, backWheel.y + length.y * 0.4 + AC.y * 0.05).moveTo(backWheel.x + length.x * 0.72 + middle.x * 0.64, backWheel.y + length.y * 0.72 + middle.y * 0.64).lineTo(backWheel.x + length.x * 0.46 + middle.x * 0.4, backWheel.y + length.y * 0.46 + middle.y * 0.4).lineTo(backWheel.x + length.x * 0.4 + AC.x * 0.05, backWheel.y + length.y * 0.4 + AC.y * 0.05).stroke()
            //
            .beginPath()
            .setProperty('lineWidth', 2 * track.zoomFactor);
        let Ap = new Vector(6 * Math.cos(this.distance) * track.zoomFactor, 6 * Math.sin(this.distance) * track.zoomFactor);
        drawer.moveTo(backWheel.x + length.x * 0.72 + middle.x * 0.64, backWheel.y + length.y * 0.72 + middle.y * 0.64).lineTo(backWheel.x + length.x * 0.43 + AC.x * 0.05, backWheel.y + length.y * 0.43 + AC.y * 0.05).moveTo(backWheel.x + length.x * 0.45 + middle.x * 0.3, backWheel.y + length.y * 0.45 + middle.y * 0.3).lineTo(backWheel.x + length.x * 0.3 + middle.x * 0.4, backWheel.y + length.y * 0.3 + middle.y * 0.4).lineTo(backWheel.x + length.x * 0.25 + middle.x * 0.6, backWheel.y + length.y * 0.25 + middle.y * 0.6).moveTo(backWheel.x + length.x * 0.17 + middle.x * 0.6, backWheel.y + length.y * 0.17 + middle.y * 0.6).lineTo(backWheel.x + length.x * 0.3 + middle.x * 0.6, backWheel.y + length.y * 0.3 + middle.y * 0.6).moveTo(backWheel.x + length.x * 0.43 + AC.x * 0.05 + Ap.x, backWheel.y + length.y * 0.43 + AC.y * 0.05 + Ap.y).lineTo(backWheel.x + length.x * 0.43 + AC.x * 0.05 - Ap.x, backWheel.y + length.y * 0.43 + AC.y * 0.05 - Ap.y).stroke()
            //
            .beginPath()
            .setProperty('lineWidth', track.zoomFactor);
        drawer.moveTo(backWheel.x + length.x * 0.46 + middle.x * 0.4, backWheel.y + length.y * 0.46 + middle.y * 0.4).lineTo(backWheel.x + length.x * 0.28 + middle.x * 0.5, backWheel.y + length.y * 0.28 + middle.y * 0.5).stroke().beginPath()
            .setProperty('lineWidth', 3 * track.zoomFactor);
        drawer.moveTo(frontWheel.x, frontWheel.y).lineTo(backWheel.x + length.x * 0.71 + middle.x * 0.73, backWheel.y + length.y * 0.71 + middle.y * 0.73).lineTo(backWheel.x + length.x * 0.73 + middle.x * 0.77, backWheel.y + length.y * 0.73 + middle.y * 0.77).lineTo(backWheel.x + length.x * 0.7 + middle.x * 0.8, backWheel.y + length.y * 0.7 + middle.y * 0.8).stroke();
        if (this.dead) {
            return;
        }
        drawer.setProperty('lineCap', 'round');
        AC = head.sub(backWheel.add(length.scale(0.5)));
        let crossFrameSaddle = backWheel.add(length.scale(0.3)).add(AC.scale(0.25));
        let B2 = backWheel.add(length.scale(0.4)).add(AC.scale(0.05));
        let Bp = B2.add(Ap);
        let A6 = B2.sub(Ap);
        let A7 = backWheel.add(length.scale(0.67)).add(AC.scale(0.8));
        let AY = crossFrameSaddle.add(length.scale(-0.05)).add(AC.scale(0.42));
        let Aa = Bp.sub(AY);
        middle = new Vector(Aa.y * this.direction, -Aa.x * this.direction).selfScale(track.zoomFactor * track.zoomFactor);
        let CZ = AY.add(Aa.scale(0.5)).add(middle.scale(200 / Aa.lengthSquared()));
        Aa = A6.sub(AY);
        middle = new Vector(Aa.y * this.direction, -Aa.x * this.direction).selfScale(track.zoomFactor * track.zoomFactor);
        let CX = AY.add(Aa.scale(0.5)).add(middle.scale(200 / Aa.lengthSquared()));
        drawer.beginPath()
            .setProperty('lineWidth', 6 * track.zoomFactor);
        drawer.setProperty('strokeStyle', color);
        drawer.setProperty('globalAlpha', 0.5 * opacityFactor)
            .moveTo(A6.x, A6.y).lineTo(CX.x, CX.y).lineTo(AY.x, AY.y).stroke().beginPath()
            .setProperty('strokeStyle', color);
        drawer.setProperty('globalAlpha', opacityFactor);
        drawer.moveTo(Bp.x, Bp.y).lineTo(CZ.x, CZ.y).lineTo(AY.x, AY.y).stroke()
            .setProperty('lineWidth', 8 * track.zoomFactor);
        let BX = crossFrameSaddle.add(length.scale(0.1)).add(AC.scale(0.93));
        let Bl = crossFrameSaddle.add(length.scale(0.2)).add(AC.scale(1.09));
        let CT = crossFrameSaddle.add(length.scale(0.4)).add(AC.scale(1.15));
        drawer.beginPath().moveTo(AY.x, AY.y).lineTo(BX.x, BX.y).stroke().beginPath()
            .setProperty('lineWidth', 2 * track.zoomFactor);
        drawer.moveTo(Bl.x + 5 * track.zoomFactor, Bl.y).arc(Bl.x, Bl.y, 5 * track.zoomFactor, 0, 2 * Math.PI, true).stroke()
            // Cap
            .beginPath();
        switch (this.cap) {
            case 'cap':
                let Ch = crossFrameSaddle.add(length.scale(0.4)).add(AC.scale(1.15)),
                    Cd = crossFrameSaddle.add(length.scale(0.1)).add(AC.scale(1.05));
                drawer.moveTo(Ch.x, Ch.y).lineTo(Cd.x, Cd.y).stroke();
                break;
            case 'hat':
                let hatFrontBottom = crossFrameSaddle.add(length.scale(0.37)).add(AC.scale(1.19)),
                    hatBackBottom = crossFrameSaddle.sub(length.scale(0.02)).add(AC.scale(1.14)),
                    hatFront = crossFrameSaddle.add(length.scale(0.28)).add(AC.scale(1.17)),
                    hatBack = crossFrameSaddle.add(length.scale(0.09)).add(AC.scale(1.15)),
                    hatFrontTop = hatFrontBottom.sub(length.scale(0.1)).selfAdd(AC.scale(0.2)),
                    hatBackTop = hatBackBottom.add(length.scale(0.02)).selfAdd(AC.scale(0.2));
                drawer.setProperty('fillStyle', color);
                drawer.moveTo(hatFrontBottom.x, hatFrontBottom.y).lineTo(hatFront.x, hatFront.y).lineTo(hatFrontTop.x, hatFrontTop.y).lineTo(hatBackTop.x, hatBackTop.y).lineTo(hatBack.x, hatBack.y).lineTo(hatBackBottom.x, hatBackBottom.y).stroke().fill();
        }
        length = BX.sub(A7);
        AC = new Vector(length.y * this.direction, -length.x * this.direction);
        AC = AC.scale(track.zoomFactor * track.zoomFactor);
        let CU = A7.add(length.scale(0.3)).add(AC.scale(80 / length.lengthSquared()));
        drawer.setProperty('lineWidth', 5 * track.zoomFactor);
        drawer.beginPath().moveTo(BX.x, BX.y).lineTo(CU.x, CU.y).lineTo(A7.x, A7.y).stroke();
        drawer.setProperty('strokeStyle', '#000').setProperty('globalAlpha', 1);
    }
}