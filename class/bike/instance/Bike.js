import BikePart from "../../entity/BikePart.js";
import Wheel from "../../entity/Wheel.js";
import Transform from "../../numeric/Transform.js";
import Vector from "../../numeric/Vector.js";
import Track from "../../track/Track.js";
import BikeRunner from "../BikeRunner.js";
import Spring from "../physics/Spring.js";

export default class Bike {
    /**
     *
     * @param {Track} track
     * @param {BikeRunner} runner
     */
    constructor(track, runner) {
        /** @type {Track} */
        this.track = track;
        this.runner = runner;
        this.friction = 0.99;

        this.distance = 0;
        this.direction = 1;
        this.gravity = new Vector(0, 0.3);

        this.slow = false;
        this.slowParity = 0;

        this.color = '#000';
        this.headGear = 'hat';

        this.rotationFactor = 0;

        this.hitbox = new BikePart(new Vector(), this);
        this.hitbox.drive = (point) => this.runner.crash();
        this.backWheel = new Wheel(new Vector(), this);
        this.frontWheel = new Wheel(new Vector(), this);

        this.headToBack = new Spring(this.hitbox, this.backWheel);
        this.frontToBack = new Spring(this.backWheel, this.frontWheel);
        this.headToFront = new Spring(this.frontWheel, this.hitbox);

        this.points = [this.hitbox, this.backWheel, this.frontWheel];
        this.joints = [this.headToBack, this.frontToBack, this.headToFront];

        /** @type {Map<string, Array<string>>} */
        this.keyLog = new Map();
        this.keyLog.set('upPressed', new Array());
        this.keyLog.set('downPressed', new Array());
        this.keyLog.set('leftPressed', new Array());
        this.keyLog.set('rightPressed', new Array());
        this.keyLog.set('turnPressed', new Array());

        this.setBikeInitialState(track.origin);
    }

    setBikeInitialState(startPos) {}

    updatePhysics() {
        if (this.runner.turnPressed) {
            this.turn();
        }
        this.backWheel.speedValue += (this.runner.upPressed - this.backWheel.speedValue) / 10;
        let rotate = this.runner.leftPressed - this.runner.rightPressed;
        this.headToBack.lean(rotate * 5 * this.direction, 5);
        this.headToFront.lean(-rotate * 5 * this.direction, 5);
        this.frontToBack.rotate(rotate / this.rotationFactor);
        if (!rotate && this.runner.upPressed) {
            this.headToBack.lean(-7, 5);
            this.headToFront.lean(7, 5);
        }
    }

    /** @param {boolean} slow */
    setSlow(slow) {
        if ((!this.slow && slow) || !slow) {
            this.slowParity = 0;
        }
        this.slow = slow;
    }

    turn() {
        this.runner.doTurn = false;
        this.direction = -this.direction;
        this.frontToBack.turn();
        let headToBack = this.headToBack.len;
        this.headToBack.len = this.headToFront.len;
        this.headToFront.len = headToBack;
    }

    getRider() {
        let rider = {};
        let wheelsDistance = this.frontWheel.pos.sub(this.backWheel.pos);
        let wheelsToHitboxMedian = this.hitbox.pos.sub(this.frontWheel.pos.add(this.backWheel.pos).scale(0.5));
        let wheelsDistance90deg = new Vector(wheelsDistance.y * this.direction, -wheelsDistance.x * this.direction);
        let pedalPos = new Vector(6 * Math.cos(this.distance), 6 * Math.sin(this.distance));

        let armLength = 9;
        let forearmLength = 7;
        let legPartLength = 13;

        let headTransform = new Transform(this.backWheel.pos, wheelsDistance, wheelsToHitboxMedian);
        let bodyTransform = new Transform(this.backWheel.pos, wheelsDistance, wheelsDistance90deg);

        rider.head = headTransform.scale(0.35, 1.2);
        rider.hand = bodyTransform.scale(0.8, 0.68);
        rider.shadowHand = rider.hand.clone();
        rider.hip = bodyTransform.scale(0.2, 0.5);
        rider.foot = bodyTransform.scale(0.4, 0.05).add(pedalPos);
        rider.shadowFoot = bodyTransform.scale(0.4, 0.05).sub(pedalPos);

        let headToHandDistance = rider.head.sub(rider.hand);
        let headToHandDistance90deg = new Vector(headToHandDistance.y * this.direction, -headToHandDistance.x * this.direction);
        let armLengthRatio = (armLength ** 2 + forearmLength ** 2) / headToHandDistance90deg.lengthSquared();

        rider.elbow = rider.head.add(rider.hand).scale(0.5).add(headToHandDistance90deg.scale(armLengthRatio));
        rider.shadowElbow = rider.elbow.clone();

        let hipToFootDistance = rider.hip.sub(rider.foot);
        let hipToFootDistance90deg = new Vector(-hipToFootDistance.y * this.direction, hipToFootDistance.x * this.direction);
        let legLengthRatio = (2 * legPartLength ** 2) / hipToFootDistance90deg.lengthSquared();

        rider.knee = rider.hip.add(rider.foot).scale(0.5).add(hipToFootDistance90deg.scale(legLengthRatio));

        let hipToShadowFootDistance = rider.hip.sub(rider.shadowFoot);
        let hipToShadowFootDistance90deg = new Vector(-hipToShadowFootDistance.y * this.direction, hipToShadowFootDistance.x * this.direction);
        let shadowlegLengthRatio = (2 * legPartLength ** 2) / hipToShadowFootDistance90deg.lengthSquared();

        rider.shadowKnee = rider.hip.add(rider.shadowFoot).scale(0.5).add(hipToShadowFootDistance90deg.scale(shadowlegLengthRatio));

        return rider;
    }

    /** @returns {Bike} */
    clone() {
        let clone = new this.constructor(this.track, this.runner);

        clone.friction = this.friction;

        clone.distance = this.distance;
        clone.direction = this.direction;
        clone.gravity = this.gravity.clone();

        clone.slow = this.slow;
        clone.slowParity = this.slowParity;

        clone.color = this.color;
        clone.headGear = this.headGear;

        clone.rotationFactor = this.rotationFactor;

        clone.backWheel = this.backWheel.clone();
        clone.backWheel.bike = clone;

        clone.frontWheel = this.frontWheel.clone();
        clone.frontWheel.bike = clone;

        clone.hitbox = this.hitbox.clone();
        clone.hitbox.bike = clone;
        clone.hitbox.drive = (point) => clone.runner.crash();

        clone.headToBack = this.headToBack.clone();
        clone.headToBack.a = clone.hitbox;
        clone.headToBack.b = clone.backWheel;

        clone.frontToBack = this.frontToBack.clone();
        clone.frontToBack.a = clone.backWheel;
        clone.frontToBack.b = clone.frontWheel;

        clone.headToFront = this.headToFront.clone();
        clone.headToFront.a = clone.frontWheel;
        clone.headToFront.b = clone.hitbox;

        clone.points = [clone.hitbox, clone.backWheel, clone.frontWheel];
        clone.joints = [clone.headToBack, clone.frontToBack, clone.headToFront];

        let keyLogClone = new Map();
        keyLogClone.set('upPressed', [...this.keyLog.get('upPressed')]);
        keyLogClone.set('downPressed', [...this.keyLog.get('downPressed')]);
        keyLogClone.set('leftPressed', [...this.keyLog.get('leftPressed')]);
        keyLogClone.set('rightPressed', [...this.keyLog.get('rightPressed')]);
        keyLogClone.set('turnPressed', [...this.keyLog.get('turnPressed')]);
        clone.keyLog = keyLogClone;

        return clone;
    }
}