import { Evts } from "../Evts.js";
import { Joint } from "../Joint.js";
import { Point } from "../Point.js";
import { BodyPart } from "./part/BodyPart.js";
import { Wheel } from "./part/Wheel.js";

export class Bike extends Evts {
    constructor(parent) {
        super();
        this.parnt = parent;
        this.cap = 'hat';
        this.doSave =
            this.dead = false;
        this.distance =
            this.leftPressed =
            this.rightPressed =
            this.upPressed =
            this.downPressed = 0;
        this.rotationFactor = 1;
    }

    restore(last) {
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
        this.joints = {
            0: this.headToBack = new Joint(this.head, this.backWheel, this),
            1: this.frontToBack = new Joint(this.backWheel, this.frontWheel, this),
            2: this.headToFront = new Joint(this.frontWheel, this.head, this),
            $length: 3
        };
        this.headToBack.len = last[20];
        this.frontToBack.len = last[21];
        this.headToFront.len = last[22];
        this.direction = last[23];
        this.gravity = new Point(last[24], last[25]);
        this.slow = last[26];
        this.leftPressed = last[30] || 0;
        this.rightPressed = last[31] || 0;
        this.upPressed = last[32] || 0;
        this.downPressed = last[33] || 0;
    }

    turn() {
        this.direction *= -1;
        this.frontToBack.turn();
        let headToBack = this.headToBack.len;
        this.headToBack.len = this.headToFront.len;
        this.headToFront.len = headToBack;
    }

    updateControls(left, right, up, down) {
        if (this.doTurn) {
            this.turn();
        }
        this.backWheel.speedValue += (up - this.backWheel.speedValue) / 10;
        if (up) {
            this.distance += this.backWheel.rotationSpeed / 5;
        }
        this.backWheel.downPressed = this.frontWheel.downPressed = down;
        let rotate = left - right;
        this.headToBack.lean(rotate * 5 * this.direction, 5);
        this.headToFront.lean(-rotate * 5 * this.direction, 5);
        this.frontToBack.rotate(rotate / this.rotationFactor);
        if (!rotate && up) {
            this.headToBack.lean(-7, 5);
            this.headToFront.lean(7, 5);
        }
    }

    proceed(left, right, up, down) {
        if (this.backWheel.driving && this.frontWheel.driving) {
            this.slow = false;
        }
        // iterate twice if not slowed or dead
        for (let j = 0, i = this.slow || this.dead ? 1 : 2; j < i; j++) {
            if (!this.dead) {
                this.updateControls(left, right, up, down);
            }
            for (let t = this.joints.$length - 1; t >= 0; t--) {
                this.joints[t].proceed();
            }
            for (let u = this.points.$length - 1; u >= 0; u--) {
                this.points[u].proceed();
            }
        }
    }
}