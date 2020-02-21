import { Evts } from "../Evts.js";
import { Shard } from "../Shard.js";
import { BodyPart } from "./part/BodyPart.js";
import { Wheel } from "./part/Wheel.js";
import { Joint } from "../Joint.js";
import { Point } from "../Point.js";
import { DeadBike } from "./dead/DeadBike.js";
import { MIN_TIME, SAVE_TARGET, SAVE_CHECKPOINT } from "../constant/TrackConstants.js";
import { left, right, up, down } from "../../unobfuscated_bhr.js";
import { GhostString } from "../helper/GhostString.js";

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
        this.keys = [{}, {}, {}, {}, {}];
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
        this.head.drive = () => this.die();
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
        this.parnt.targetsReached = last[27];
        for (let i = 0, l = this.parnt.objects.length; i < l; i++) {
            this.parnt.objects[i].reached = last[28][i];
        }
        this.time = last[29];
        if (this.time) {
            this.leftPressed = last[30];
            this.rightPressed = last[31];
            this.upPressed = last[32];
            this.downPressed = last[33];
            this.keys = last[34];
            for (let i = 0, l = this.keys.length; i < l; i++) {
                for (let BJ in this.keys[i]) {
                    if (BJ >= this.time) {
                        delete this.keys[i][BJ];
                    }
                }
            }
        }
    }

    turn() {
        this.doTurn = false;
        this.direction *= -1;
        this.frontToBack.turn();
        let tmp = this.headToBack.len;
        this.headToBack.len = this.headToFront.len;
        this.headToFront.len = tmp;
        this.emit('turn');
    }

    hitTarget() {
        let track = this.parnt;
        this.emit('hitTarget');
        if (this.doSave & SAVE_TARGET) {
            this.emit('hitGoal');
            if (track.numTargets && track.targetsReached === track.numTargets) {
                if (track.currentTime > MIN_TIME && (!track.time || this.time < track.time) && track.id !== undefined) {
                    if (confirm("You just set a new Track record!\nYour run will be saved for others to enjoy.")) {
                        let keystring = '';
                        for (let q, i = 0, l = this.keys.length; i < l; i++) {
                            for (q in this.keys[i]) {
                                if (!isNaN(q)) {
                                    keystring += q + ' ';
                                }
                            }
                            keystring += ",";
                        }
                        let request = new XMLHttpRequest();
                        request.open("POST", "/ghost/save", false);
                        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        request.send("tid=" + track.id + "&v=" + this.toString() + "&t=" + track.currentTime + "&c=" + keystring);
                        if (request.responseText !== 'ok') {
                            alert('Server responded: ' + request.responseText);
                        }
                    }
                    left = right = up = down = 0;
                }
            }
        } else if (this.doSave & SAVE_CHECKPOINT) {
            this.emit('hitCheckpoint');
            track.save();
            if (track.id && 0) {

                fetch(new Request('/ghost/checkpoint', {
                    method: 'POST',
                    body: 'k=' + GhostString.generate(this.keys) +
                        '&b=' + encodeURIComponent(JSON.stringify(bikeList)) + track.bike +
                        '&g=' + (ghostList ? encodeURIComponent(JSON.stringify(ghostList) + track.ghost) : '0') +
                        '&i=' + track.id
                })).then(function() { console.log('saved'); });
            }
        }
        this.doSave = 0;
    }

    die() {
        this.dead = true;
        this.head.drive = function() {};
        this.backWheel.speedValue = 0;
        this.backWheel.downPressed = false;
        this.frontWheel.downPressed = false;
        this.head.touch = false;
        let bike = this.parnt.bike = new DeadBike(this, this.getRider(), this.parnt);
        bike.hat = new Shard(this.head.pos.clone(), this);
        bike.hat.velocity = this.head.velocity.clone();
        bike.hat.size = 10;
        bike.hat.rotationSpeed = 0.1;
    }

    proceed() {
        if (this.doSave) {
            this.hitTarget();
        }
        let time = this.parnt.currentTime;
        if (left !== this.leftPressed) {
            this.keys[0][time] = 1;
            this.leftPressed = left;
        }
        if (right !== this.rightPressed) {
            this.keys[1][time] = 1;
            this.rightPressed = right;
        }
        if (up !== this.upPressed) {
            this.keys[2][time] = 1;
            this.upPressed = up;
        }
        if (down !== this.downPressed) {
            this.keys[3][time] = 1;
            this.downPressed = down;
        }
        if (this.turn) {
            this.keys[4][time] = 1;
        }
        if (!this.dead) {
            this.BS();
        }
        for (let T = this.joints.$length - 1; T >= 0; T--) {
            this.joints[T].proceed();
        }
        for (let u = this.points.$length - 1; u >= 0; u--) {
            this.points[u].proceed();
        }
        if (this.backWheel.driving && this.frontWheel.driving) {
            this.slow = false;
        }
        if (!this.slow && !this.dead) {
            this.BS();
            for (let T = this.joints.$length - 1; T >= 0; T--) {
                this.joints[T].proceed();
            }
            for (let u = this.points.$length - 1; u >= 0; u--) {
                this.points[u].proceed();
            }
        }
    }

    clone() {
        let backWheel = this.backWheel.clone(),
            frontWheel = this.frontWheel.clone(),
            head = this.head.clone(),
            headToBack = this.headToBack.clone(),
            frontToBack = this.frontToBack.clone(),
            headToFront = this.headToFront.clone();
        return {
            backWheel: backWheel,
            frontWheel: frontWheel,
            head: head,
            points: [head, backWheel, frontWheel],
            joints: [headToBack, frontToBack, headToFront],
            direction: this.direction,
            gravity: this.gravity.clone(),
            slow: this.slow,
            time: this.time
        };
    }

    toJSON() {
        return {
            $$: this.toString(),
            keys: this.keys.map(Object.keys),
            backWheel: this.backWheel,
            frontWheel: this.frontWheel,
            head: this.head,
            headToBack: this.headToBack,
            frontToBack: this.frontToBack,
            headToFront: this.headToFront,
            //~ points: [ head, backWheel, frontWheel ],
            //~ joints: [ headToBack, frontToBack, headToFront ],
            direction: this.direction,
            gravity: this.gravity,
            slow: this.slow,
            time: this.time
        };
    }

    toString() {
        return 'BikeGeneric';
    }
}