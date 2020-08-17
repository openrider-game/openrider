import { MIN_TIME, SAVE_CHECKPOINT, SAVE_TARGET } from "../constant/TrackConstants.js";
import { GhostString } from "../helper/GhostString.js";
import { Vector } from "../Vector.js";
import { Shard } from "../effect/Shard.js";
import { Bike } from "./Bike.js";
import { DeadBike } from "./dead/DeadBike.js";

export class PlayerBike extends Bike {
    constructor(parent) {
        super(parent);
        this.keys = [{}, {}, {}, {}, {}];

        this.controls.on('leftDown', e => {
            this.track.focalPoint = this.head;
            e.preventDefault();
        });
        this.controls.on('rightDown', e => {
            this.track.focalPoint = this.head;
            e.preventDefault();
        });
        this.controls.on('accelerateDown', e => {
            this.track.focalPoint = this.head;
            e.preventDefault();
        });
        this.controls.on('brakeDown', e => {
            this.track.focalPoint = this.head;
            e.preventDefault();
        });
        this.controls.on('turnDown', e => {
            this.track.focalPoint = this.head;
            this.doTurn = true;
            e.preventDefault();
        });
        this.controls.on('leftUp', e => e.preventDefault());
        this.controls.on('rightUp', e => e.preventDefault());
        this.controls.on('accelerateUp', e => e.preventDefault());
        this.controls.on('brakeUp', e => e.preventDefault());
    }

    restore(last) {
        super.restore(last);
        this.head.drive = () => this.die();
        this.track.targetsReached = last[27];
        for (let i = 0, l = this.track.collectables.length; i < l; i++) {
            this.track.collectables[i].reached = last[28][i];
        }
        this.time = last[29];
        if (this.time) {
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
        super.turn();
        this.emit('turn');
    }

    hitTarget() {
        let track = this.track;
        this.emit('hitTarget');
        if (this.doSave & SAVE_TARGET) {
            this.emit('hitGoal');
            if (track.numTargets && track.targetsReached === track.numTargets) {
                if (track.currentTime > MIN_TIME && (!track.time || this.time < track.time) && track.id !== undefined) {
                    if (confirm("You just set a new Track record!\nYour run will be saved for others to enjoy.")) {
                        let request = new XMLHttpRequest();
                        request.open("POST", "/ghost/save", false);
                        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                        request.send("tid=" + track.id + "&v=" + this.toString() + "&t=" + track.currentTime + "&c=" + GhostString.generate(this.keys));
                        if (request.responseText !== 'ok') {
                            alert('Server responded: ' + request.responseText);
                        }
                    }
                    this.track.left = this.track.right = this.track.up = this.track.down = 0;
                }
            }
        } else if (this.doSave & SAVE_CHECKPOINT) {
            this.emit('hitCheckpoint');
            track.save();
            if (track.id !== undefined && 0) {

                fetch(new Request('/ghost/checkpoint', {
                    method: 'POST',
                    body: 'k=' + GhostString.generate(this.keys) +
                        '&b=' + encodeURIComponent(JSON.stringify(bikeList)) + track.bike +
                        '&g=' + (ghostList ? encodeURIComponent(JSON.stringify(ghostList) + track.ghostInstances) : '0') +
                        '&i=' + track.id
                })).then(function() { console.log('saved'); });
            }
        }
        this.doSave = 0;
    }

    die() {
        this.dead = true;
        this.slow = true;
        this.head.drive = function() {};
        this.backWheel.speedValue = 0;
        this.backWheel.downPressed = false;
        this.frontWheel.downPressed = false;
        this.head.touch = false;
        let bike = this.track.bike = new DeadBike(this, this.getRider(), this.track);
        bike.hat = new Shard(this.head.pos.clone(), this);
        bike.hat.velocity = this.head.velocity.clone();
        bike.hat.size = 10;
        bike.hat.rotationSpeed = 0.1;
    }

    fixedUpdate() {
        const accelerating = this.controls.isDown('accelerate') ? 1 : 0;
        const left = this.controls.isDown('left') ? 1 : 0;
        const right = this.controls.isDown('right') ? 1 : 0;
        const braking = this.controls.isDown('brake') ? 1 : 0;

        if (this.doSave) {
            this.hitTarget();
        }
        let time = this.track.currentTime;
        if (left !== this.leftPressed) {
            this.keys[0][time] = 1;
            this.leftPressed = left;
        }
        if (right !== this.rightPressed) {
            this.keys[1][time] = 1;
            this.rightPressed = right;
        }
        if (accelerating !== this.upPressed) {
            this.keys[2][time] = 1;
            this.upPressed = accelerating;
        }
        if (braking !== this.downPressed) {
            this.keys[3][time] = 1;
            this.downPressed = braking;
        }
        if (this.doTurn) {
            this.keys[4][time] = 1;
        }

        super.fixedUpdate(left, right, accelerating, braking);
    }

    render() {
        this.renderInternal('#000', 1);
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

    getRider() {
        let rider = {},
            length = this.frontWheel.pos.sub(this.backWheel.pos),
            pos = this.head.pos.sub(this.frontWheel.pos.add(this.backWheel.pos).scale(0.5)),
            AS = new Vector(length.y * this.direction, -length.x * this.direction);
        rider.head = this.backWheel.pos.add(length.scale(0.35)).add(pos.scale(1.2));
        rider.hand = rider.shadowHand = this.backWheel.pos.add(length.scale(0.8)).add(AS.scale(0.68));
        let N = rider.head.sub(rider.hand);
        N = new Vector(N.y * this.direction, -N.x * this.direction);
        rider.elbow = rider.shadowElbow = rider.head.add(rider.hand).scale(0.5).add(N.scale(130 / N.lengthSquared()));
        rider.hip = this.backWheel.pos.add(length.scale(0.2)).add(AS.scale(0.5));
        let direction = new Vector(6 * Math.cos(this.distance), 6 * Math.sin(this.distance));
        rider.foot = this.backWheel.pos.add(length.scale(0.4)).add(AS.scale(0.05)).add(direction);
        N = rider.hip.sub(rider.foot);
        N = new Vector(-N.y * this.direction, N.x * this.direction);
        rider.knee = rider.hip.add(rider.foot).scale(0.5).add(N.scale(160 / N.lengthSquared()));
        rider.shadowFoot = this.backWheel.pos.add(length.scale(0.4)).add(AS.scale(0.05)).sub(direction);
        N = rider.hip.sub(rider.shadowFoot);
        N = new Vector(-N.y * this.direction, N.x * this.direction);
        rider.shadowKnee = rider.hip.add(rider.shadowFoot).scale(0.5).add(N.scale(160 / N.lengthSquared()));
        return rider;
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