import Entity from "../entity/Entity.js";
import Explosion from "../entity/Explosion.js";
import GameObject from "../game/GameObject.js";
import Checkpoint from "../item/reachable/Checkpoint.js";
import Target from "../item/reachable/Target.js";
import Track from "../track/Track.js";
import Bike from "./instance/Bike.js";
import Ragdoll from "../entity/Ragdoll.js";
import ReachableItem from "../item/ReachableItem.js";

export default class BikeRunner extends GameObject {
    constructor(track, bikeClass) {
        super();
        /** @type {Track} */
        this.track = track;

        this.done = false;
        this.snapshots = new Array();
        this.targetsReached = new Map();
        this.reachablesReached = new Map();

        /** @type {Bike} */
        this.instance = null;
        /** @type {Bike} */
        this.initialBike = null;
        this.bikeClass = bikeClass;

        this.upPressed = false;
        this.downPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.turnPressed = false;

        /** @type {Map<number, ReachableItem>} */
        this.actionQueue = new Map();

        this.dead = false;
        this.deadObject = null;
    }

    createBike() {
        let bikeClass = this.bikeClass;
        this.instance = new bikeClass(this.track, this);
        this.assignColor();
        this.initialBike = this.instance.clone();
    }

    assignColor() {}

    startFrom(snapshot) {
        this.done = false;
        this.dead = false;
        this.deadObject = null;

        let bike = this.initialBike;
        this.targetsReached = new Map();
        this.reachablesReached = new Map();

        this.upPressed = false;
        this.downPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.turnPressed = false;

        this.track.time = 0;

        if (snapshot) {
            bike = snapshot.bike;
            this.targetsReached = new Map(snapshot.targetsReached);
            this.reachablesReached = new Map(snapshot.reachablesReached);

            this.upPressed = snapshot.upPressed;
            this.downPressed = snapshot.downPressed;
            this.leftPressed = snapshot.leftPressed;
            this.rightPressed = snapshot.rightPressed;
            this.turnPressed = snapshot.turnPressed;

            this.track.time = snapshot.time;
        }

        this.instance = bike.clone();

        this.track.toolManager.active = false;
    }

    die() {
        this.dead = true;

        this.upPressed = false;
        this.downPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.turnPressed = false;

        this.instance.hitbox.touch = false;
        this.instance.hitbox.drive = () => {};
        this.instance.backWheel.speedValue = 0;
    }

    crash() {
        this.die();
        this.deadObject = new Ragdoll(this.instance.getRider(), this.instance);
        this.deadObject.setVelocity(this.instance.hitbox.velocity.clone(), this.instance.backWheel.velocity.clone());
    }

    explode(pos, vel) {
        this.die();
        this.deadObject = new Explosion(pos, vel, this.instance.clone(), this.track.time, this.track);
        this.instance = null;
    }

    /**
     * 
     * @param {ReachableItem} reachable 
     */
    hitReachable(reachable) {
        if (!this.reachablesReached.has(reachable.id)) {
            this.reachablesReached.set(reachable.id, true);
        }
    }

    /**
     *
     * @param {Target} target
     */
    hitTarget(target) {
        if (!this.targetsReached.has(target.id)) {
            this.targetsReached.set(target.id, true);
            this.onHitTarget();
        }
    }

    /**
     *
     * @param {Checkpoint} checkpoint
     */
    hitCheckpoint(checkpoint) {
        if (!this.reachablesReached.has(checkpoint.id)) {
            this.reachablesReached.set(checkpoint.id, true);
            this.onHitCheckpoint();
        }
    }

    onHitTarget() {}
    onHitCheckpoint() {}

    reset() {
        this.snapshots = new Array();
    }

    restart() {
        this.startFrom(this.snapshots[this.snapshots.length - 1]);
    }

    save() {
        this.snapshots.push(this.snapshot());
    }

    snapshot() {
        let snapshot = {
            time: this.track.time,
            targetsReached: new Map(this.targetsReached),
            reachablesReached: new Map(this.reachablesReached),
            upPressed: this.upPressed,
            downPressed: this.downPressed,
            leftPressed: this.leftPressed,
            rightPressed: this.rightPressed,
            turnPressed: this.turnPressed,
            bike: this.instance.clone()
        };

        return snapshot;
    }

    popCheckpoint() {
        this.snapshots.pop();
    }

    processActionQueue() {
        this.actionQueue.forEach((action) => {
            if (action instanceof Checkpoint) {
                this.hitCheckpoint(action);
            } else if (action instanceof Target) {
                this.hitTarget(action);
            } else if (action instanceof ReachableItem) {
                this.hitReachable(action);
            }
        });
    }

    updateControls() {
        throw new Exception('Unimplemented method updateControls()');
    }

    renderInstance(ctx) {
        throw new Exception('Unimplemented method renderInstance(ctx)');
    }

    fixedUpdate() {
        // We have to let all the parts process their fixedUpdate before we try to save
        // Otherwise, we get faulty values in the bike clone, since some of them are 1 cycle behind/ahead
        // Thus, the Checkpoints and Targets get added in the action queue instead of being processed directly
        if (this.actionQueue.size) {
            this.processActionQueue();
            this.actionQueue = new Map();
        }

        if (this.instance instanceof Bike) {
            if (this.instance.backWheel.driving && this.instance.frontWheel.driving && !this.dead) {
                this.instance.setSlow(false);
            }

            if (!this.dead) {
                this.updateControls();
            }

            this.instance.updatePhysics();

            if (this.instance.slow) {
                this.instance.slowParity = 1 - this.instance.slowParity;
            }

            if (!this.instance.slow || this.instance.slowParity === 0) {
                for (let i = this.instance.joints.length - 1; i >= 0; i--) {
                    this.instance.joints[i].fixedUpdate();
                }

                for (let i = this.instance.points.length - 1; i >= 0; i--) {
                    this.instance.points[i].fixedUpdate();
                }
            }
        }

        if (this.deadObject instanceof Entity) {
            this.deadObject.fixedUpdate();
        }
    }

    update(progress, delta) {
        if (this.instance instanceof Bike) {
            if (this.instance.slow) {
                progress = (progress + this.instance.slowParity) / 2;
            }
            this.instance.backWheel.update(progress);
            this.instance.frontWheel.update(progress);
            this.instance.hitbox.update(progress);
            if (this.upPressed) {
                this.instance.distance += this.instance.backWheel.rotationSpeed * delta / 100;
            }
        }

        if (this.deadObject instanceof Entity) {
            this.deadObject.update(progress, delta);
        }
    }

    render(ctx) {
        if (this.instance instanceof Bike) {
            this.renderInstance(ctx);
        }

        if (this.deadObject instanceof Entity) {
            this.deadObject.render(ctx);
        }
    }

}