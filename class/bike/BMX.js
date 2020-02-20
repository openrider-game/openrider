import { Point } from "../Point.js";
import { Bike } from "./Bike.js";
import { up, down, left, right, context } from "../../unobfuscated_bhr.js";
import { bmxConstants } from "../constant/TrackConstants.js";
import { PI2, cos, sin, rand } from "../utils/MathUtils.js";
import { beginPath, arc, moveTo, stroke, lineTo, fill } from "../utils/DrawUtils.js";

export class BMX extends Bike {
    constructor(parent, last) {
        super(parent);
        last = last || bmxConstants[0];
        this.$consts = bmxConstants;

        this.restore(last);
        this.head.size = 14;
        this.backWheel.size = 11.7;
        this.frontWheel.size = 11.7;
        this.headToBack.lengthTowards = 45;
        this.headToBack.BC = 0.35;
        this.headToBack.BE = 0.3;
        this.frontToBack.lengthTowards = 42;
        this.frontToBack.BC = 0.35;
        this.frontToBack.BE = 0.3;
        this.headToFront.lengthTowards = 45;
        this.headToFront.BC = 0.35;
        this.headToFront.BE = 0.3;
    }

    BS() {
        if (this.doTurn) {
            this.turn();
        }
        this.backWheel.speedValue += (up - this.points[1].speedValue) / 10;
        if (up) {
            this.distance += this.backWheel.rotationSpeed / 5;
        }
        this.backWheel.downPressed = this.frontWheel.downPressed = down;
        var rotate = left - right;
        this.headToBack.lean(rotate * 5 * this.direction, 5);
        this.headToFront.lean(-rotate * 5 * this.direction, 5);
        this.frontToBack.rotate(rotate / 6);
        if (!rotate && up) {
            this.headToBack.lean(-7, 5);
            this.headToFront.lean(7, 5);
        }
    };

    draw() {
        var self = this,
            track = self.parnt,
            z = track.zoomFactor,
            dir = self.direction,
            backWheel = self.backWheel.pos.toPixel(track),
            frontWheel = self.frontWheel.pos.toPixel(track);
        // Wheels
        context.strokeStyle = '#000';
        context.lineWidth = 3.5 * z;
        context[beginPath]()
            // (front wheel)
            [arc](backWheel.x, backWheel.y, 10 * z, 0, PI2, true)
            // (back wheel)
            [moveTo](frontWheel.x + 10 * z, frontWheel.y)[arc](frontWheel.x, frontWheel.y, 10 * z, 0, PI2, true)[stroke]();
        var length = {
                x: frontWheel.x - backWheel.x,
                y: frontWheel.y - backWheel.y
            },
            AC = new Point((frontWheel.y - backWheel.y) * dir, (backWheel.x - frontWheel.x) * dir),
            crossFrameSaddle = {
                x: backWheel.x + length.x * 0.3 + AC.x * 0.25,
                y: backWheel.y + length.y * 0.3 + AC.y * 0.25
            },
            shadowSteer = {
                x: backWheel.x + length.x * 0.84 + AC.x * 0.42,
                y: backWheel.y + length.y * 0.84 + AC.y * 0.42
            },
            steer = {
                x: backWheel.x + length.x * 0.84 + AC.x * 0.37,
                y: backWheel.y + length.y * 0.84 + AC.y * 0.37
            },
            pedalHinge = {
                x: backWheel.x + length.x * 0.4 + AC.x * 0.05,
                y: backWheel.y + length.y * 0.4 + AC.y * 0.05
            };
        // Frame
        context.lineWidth = 3 * z;
        context[beginPath]()[moveTo](backWheel.x, backWheel.y)[lineTo](crossFrameSaddle.x, crossFrameSaddle.y)[lineTo](shadowSteer.x, shadowSteer.y)[moveTo](steer.x, steer.y)[lineTo](pedalHinge.x, pedalHinge.y)[lineTo](backWheel.x, backWheel.y);
        var CY = {
                x: 6 * cos(self.distance) * z,
                y: 6 * sin(self.distance) * z
            },
            pedal = {
                x: pedalHinge.x + CY.x,
                y: pedalHinge.y + CY.y
            },
            shadowPedal = {
                x: pedalHinge.x - CY.x,
                y: pedalHinge.y - CY.y
            },
            saddle = {
                x: backWheel.x + length.x * 0.17 + AC.x * 0.38,
                y: backWheel.y + length.y * 0.17 + AC.y * 0.38
            },
            Cg = {
                x: backWheel.x + length.x * 0.3 + AC.x * 0.45,
                y: backWheel.y + length.y * 0.3 + AC.y * 0.45
            },
            Ci = {
                x: backWheel.x + length.x * 0.25 + AC.x * 0.4,
                y: backWheel.y + length.y * 0.25 + AC.y * 0.4
            };
        // Saddle
        context[moveTo](pedal.x, pedal.y)[lineTo](shadowPedal.x, shadowPedal.y)[moveTo](saddle.x, saddle.y)[lineTo](Cg.x, Cg.y)[moveTo](pedalHinge.x, pedalHinge.y)[lineTo](Ci.x, Ci.y);
        var backWheelCenter = {
                x: backWheel.x + length.x,
                y: backWheel.y + length.y
            },
            Cl = {
                x: backWheel.x + length.x * 0.97,
                y: backWheel.y + length.y * 0.97
            },
            CO = {
                x: backWheel.x + length.x * 0.8 + AC.x * 0.48,
                y: backWheel.y + length.y * 0.8 + AC.y * 0.48
            },
            CbackWheel = {
                x: backWheel.x + length.x * 0.86 + AC.x * 0.5,
                y: backWheel.y + length.y * 0.86 + AC.y * 0.5
            },
            Ck = {
                x: backWheel.x + length.x * 0.82 + AC.x * 0.65,
                y: backWheel.y + length.y * 0.82 + AC.y * 0.65
            },
            steerCenter = {
                x: backWheel.x + length.x * 0.78 + AC.x * 0.67,
                y: backWheel.y + length.y * 0.78 + AC.y * 0.67
            };
        // Steering Wheel
        context[moveTo](backWheelCenter.x, backWheelCenter.y)[lineTo](Cl.x, Cl.y)[lineTo](CO.x, CO.y)[lineTo](CbackWheel.x, CbackWheel.y)[lineTo](Ck.x, Ck.y)[lineTo](steerCenter.x, steerCenter.y)[stroke]();
        if (self.dead) {
            return;
        }
        context.lineCap = 'round';
        var _head = self.head.pos.toPixel(track);
        AC = {
            x: _head.x - backWheel.x - length.x * 0.5,
            y: _head.y - backWheel.y - length.y * 0.5
        };
        var hip = {
                x: crossFrameSaddle.x - length.x * 0.1 + AC.x * 0.3,
                y: crossFrameSaddle.y - length.y * 0.1 + AC.y * 0.3
            },
            Ar = {
                x: pedal.x - hip.x,
                y: pedal.y - hip.y
            },
            BA = {
                x: Ar.y * dir * z * z,
                y: -Ar.x * dir * z * z
            };
        var ArLengthSquared = Ar.x * Ar.x + Ar.y * Ar.y;
        var knee = {
            x: hip.x + Ar.x * 0.5 + BA.x * 200 / ArLengthSquared,
            y: hip.y + Ar.y * 0.5 + BA.y * 200 / ArLengthSquared
        };
        Ar = {
            x: shadowPedal.x - hip.x,
            y: shadowPedal.y - hip.y
        };
        BA = {
            x: Ar.y * dir * z * z,
            y: -Ar.x * dir * z * z
        };
        ArLengthSquared = Ar.x * Ar.x + Ar.y * Ar.y;
        var shadowKnee = {
            x: hip.x + Ar.x * 0.5 + BA.x * 200 / ArLengthSquared,
            y: hip.y + Ar.y * 0.5 + BA.y * 200 / ArLengthSquared
        };
        // Shadow Leg
        context.lineWidth = 6 * z;
        context.strokeStyle = "rgba(0, 0, 0, 0.5)";
        context[beginPath]()[moveTo](shadowPedal.x, shadowPedal.y)[lineTo](shadowKnee.x, shadowKnee.y)[lineTo](hip.x, hip.y)[stroke]();
        // Leg
        context.strokeStyle = '#000';
        context[beginPath]()[moveTo](pedal.x, pedal.y)[lineTo](knee.x, knee.y)[lineTo](hip.x, hip.y)[stroke]();
        // Body
        var head = {
            x: crossFrameSaddle.x + length.x * 0.05 + AC.x * 0.88,
            y: crossFrameSaddle.y + length.y * 0.05 + AC.y * 0.88
        };
        context.lineWidth = 8 * z;
        context[beginPath]()[moveTo](hip.x, hip.y)[lineTo](head.x, head.y)[stroke]();
        // Head
        var headCenter = {
            x: crossFrameSaddle.x + length.x * 0.15 + AC.x * 1.05,
            y: crossFrameSaddle.y + length.y * 0.15 + AC.y * 1.05
        };
        context.lineWidth = 2 * z;
        context[beginPath]()[moveTo](headCenter.x + 5 * z, headCenter.y)[arc](headCenter.x, headCenter.y, 5 * z, 0, PI2, true)[stroke]()
            // Cap
            [beginPath]();
        switch (self.cap) {
            case 'cap':
                var capFront = {
                        x: crossFrameSaddle.x + length.x * 0.4 + AC.x * 1.1,
                        y: crossFrameSaddle.y + length.y * 0.4 + AC.y * 1.1
                    },
                    capBack = {
                        x: crossFrameSaddle.x + length.x * 0.05 + AC.x * 1.05,
                        y: crossFrameSaddle.y + length.y * 0.05 + AC.y * 1.05
                    };
                context[moveTo](capBack.x, capBack.y)[lineTo](capFront.x, capFront.y)[stroke]();
                break;
            case 'hat':
                var hatFrontBottom = {
                        x: crossFrameSaddle.x + length.x * 0.35 + AC.x * 1.15,
                        y: crossFrameSaddle.y + length.y * 0.35 + AC.y * 1.15
                    },
                    hatBackBottom = {
                        x: crossFrameSaddle.x - length.x * 0.05 + AC.x * 1.1,
                        y: crossFrameSaddle.y - length.y * 0.05 + AC.y * 1.1
                    },
                    hatFront = {
                        x: crossFrameSaddle.x + length.x * 0.25 + AC.x * 1.13,
                        y: crossFrameSaddle.y + length.y * 0.25 + AC.y * 1.13
                    },
                    hatBack = {
                        x: crossFrameSaddle.x + length.x * 0.05 + AC.x * 1.11,
                        y: crossFrameSaddle.y + length.y * 0.05 + AC.y * 1.11
                    },
                    hatFrontTop = {
                        x: hatFrontBottom.x - length.x * 0.1 + AC.x * 0.2,
                        y: hatFrontBottom.y - length.y * 0.1 + AC.y * 0.2
                    },
                    hatBackTop = {
                        x: hatBackBottom.x + length.x * 0.02 + AC.x * 0.2,
                        y: hatBackBottom.y + length.y * 0.02 + AC.y * 0.2
                    };
                context.fillStyle = '#000';
                context[moveTo](hatFrontBottom.x, hatFrontBottom.y)[lineTo](hatFront.x, hatFront.y)[lineTo](hatFrontTop.x, hatFrontTop.y)[lineTo](hatBackTop.x, hatBackTop.y)[lineTo](hatBack.x, hatBack.y)[lineTo](hatBackBottom.x, hatBackBottom.y)[stroke]()[fill]();
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
            case 'ninja':
                var capFront = {
                        x: crossFrameSaddle.x + length.x * 0.26 + AC.x * 1.1,
                        y: crossFrameSaddle.y + length.y * 0.26 + AC.y * 1.1
                    },
                    capBack = {
                        x: crossFrameSaddle.x + length.x * 0.05 + AC.x * 1.05,
                        y: crossFrameSaddle.y + length.y * 0.05 + AC.y * 1.05
                    };
                context.lineWidth = 5 * z;
                context[moveTo](capFront.x, capFront.y)[lineTo](capBack.x, capBack.y)[stroke]()
                    .lineWidth = 2 * z;
                context[lineTo](capBack.x - (8 + rand()) * z * dir, capBack.y - (4 + rand()) * z * dir)[moveTo](capBack.x, capBack.y)[lineTo](capBack.x - (8 + rand()) * z * dir, capBack.y + (4 + rand()) * z * dir)[stroke]();
        }
        length = {
            x: head.x - steerCenter.x,
            y: head.y - steerCenter.y
        };
        AC = {
            x: length.y * dir * z * z,
            y: -length.x * dir * z * z
        };
        var lengthLengthSquared = length.x * length.x + length.y * length.y,
            elbow = {
                x: steerCenter.x + length.x * 0.4 + AC.x * 130 / lengthLengthSquared,
                y: steerCenter.y + length.y * 0.4 + AC.y * 130 / lengthLengthSquared
            };
        // Arm
        context.lineWidth = 5 * z;
        context[beginPath]()[moveTo](head.x, head.y)[lineTo](elbow.x, elbow.y)[lineTo](steerCenter.x, steerCenter.y)[stroke]();
    }

    getRider() {
        var guy = {},
            length = this.frontWheel.pos.cloneSub(this.backWheel.pos),
            pos = this.head.pos.cloneSub(this.frontWheel.pos.cloneAdd(this.backWheel.pos).cloneScale(0.5)),
            AS = new Point(length.y * this.direction, -length.x * this.direction);
        guy.head = this.backWheel.pos.cloneAdd(length.cloneScale(0.35)).cloneAdd(pos.cloneScale(1.2));
        guy.hand = guy.shadowHand = this.backWheel.pos.cloneAdd(length.cloneScale(0.8)).cloneAdd(AS.cloneScale(0.68));
        var N = guy.head.cloneSub(guy.hand);
        N = new Point(N.y * this.direction, -N.x * this.direction);
        guy.elbow = guy.shadowElbow = guy.head.cloneAdd(guy.hand).cloneScale(0.5).cloneAdd(N.cloneScale(130 / N.lengthSquared()));
        guy.hip = this.backWheel.pos.cloneAdd(length.cloneScale(0.2)).cloneAdd(AS.cloneScale(0.5));
        var direction = new Point(6 * cos(this.distance), 6 * sin(this.distance));
        guy.foot = this.backWheel.pos.cloneAdd(length.cloneScale(0.4)).cloneAdd(AS.cloneScale(0.05)).cloneAdd(direction);
        N = guy.hip.cloneSub(guy.foot);
        N = new Point(-N.y * this.direction, N.x * this.direction);
        guy.knee = guy.hip.cloneAdd(guy.foot).cloneScale(0.5).cloneAdd(N.cloneScale(160 / N.lengthSquared()));
        guy.shadowFoot = this.backWheel.pos.cloneAdd(length.cloneScale(0.4)).cloneAdd(AS.cloneScale(0.05)).cloneSub(direction);
        N = guy.hip.cloneSub(guy.shadowFoot);
        N = new Point(-N.y * this.direction, N.x * this.direction);
        guy.shadowKnee = guy.hip.cloneAdd(guy.shadowFoot).cloneScale(0.5).cloneAdd(N.cloneScale(160 / N.lengthSquared()));
        return guy;
    }

    toString() {
        return 'BMX';
    }
}