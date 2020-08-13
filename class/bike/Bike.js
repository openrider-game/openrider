import { EventEmitter } from "../EventEmitter.js";
import { Joint } from "../Joint.js";
import { Vector } from "../Vector.js";
import { BodyPart } from "./part/BodyPart.js";
import { Wheel } from "./part/Wheel.js";

export class Bike extends EventEmitter {
    constructor(track) {
        super();
        this.track = track;
        this.cap = 'hat';
        this.doSave =
            this.dead = false;
        this.distance =
            this.leftPressed =
            this.rightPressed =
            this.upPressed =
            this.downPressed = 0;
        this.rotationFactor = 1;

        this.controls = this.track.controls;
    }

    restore(checkpoint) {
        this.points = [
            this.head = new BodyPart(new Vector(checkpoint[0], checkpoint[1]), this),
            this.backWheel = new Wheel(new Vector(checkpoint[6], checkpoint[7]), this),
            this.frontWheel = new Wheel(new Vector(checkpoint[13], checkpoint[14]), this)
        ];
        this.head.oldPos = new Vector(checkpoint[2], checkpoint[3]);
        this.head.velocity = new Vector(checkpoint[4], checkpoint[5]);
        this.backWheel.oldPos = new Vector(checkpoint[8], checkpoint[9]);
        this.backWheel.velocity = new Vector(checkpoint[10], checkpoint[11]);
        this.backWheel.speedValue = checkpoint[12];
        this.frontWheel.oldPos = new Vector(checkpoint[15], checkpoint[16]);
        this.frontWheel.velocity = new Vector(checkpoint[17], checkpoint[18]);
        this.frontWheel.speedValue = checkpoint[19];
        this.joints = [
            this.headToBack = new Joint(this.head, this.backWheel, this),
            this.frontToBack = new Joint(this.backWheel, this.frontWheel, this),
            this.headToFront = new Joint(this.frontWheel, this.head, this)
        ];
        this.headToBack.len = checkpoint[20];
        this.frontToBack.len = checkpoint[21];
        this.headToFront.len = checkpoint[22];
        this.direction = checkpoint[23];
        this.gravity = new Vector(checkpoint[24], checkpoint[25]);
        this.slow = checkpoint[26];
        this.leftPressed = checkpoint[30] || 0;
        this.rightPressed = checkpoint[31] || 0;
        this.upPressed = checkpoint[32] || 0;
        this.downPressed = checkpoint[33] || 0;
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

    update(progress, delta) {
        this.backWheel.update(progress);
        this.frontWheel.update(progress);
        this.head.update(progress);
        if (this.upPressed) {
            this.distance += this.backWheel.rotationSpeed * delta / 100;
        }
    }

    fixedUpdate(left, right, up, down) {
        if (this.backWheel.driving && this.frontWheel.driving) {
            this.slow = false;
        }
        if (!this.dead) {
            this.updateControls(left, right, up, down);
        }
        for (let t = this.joints.length - 1; t >= 0; t--) {
            this.joints[t].fixedUpdate();
        }
        for (let u = this.points.length - 1; u >= 0; u--) {
            this.points[u].fixedUpdate();
        }
    }
}