import { Bike } from "../Bike.js";

export class GhostBike extends Bike {
    constructor(ghostKeys, parent) {
        super(parent);
        this.ghostKeys = ghostKeys;
        this.name = ghostKeys[7] || 'Ghost';
        this.isGhost = true;
        this.currentTime = 0;
        this.reached = {};
    }

    restore(last) {
        super.restore(last);
        this.head.drive = () => {};
        this.targetsReached = last[27] || 0;
        this.time = this.ghostKeys[5];
        this.color = last[34];
    }

    fixedUpdate() {
        let bikeTime = this.track.currentTime;
        if (bikeTime > this.time) {
            return;
        }
        if (this.ghostKeys[0][bikeTime]) {
            this.leftPressed = this.leftPressed ? 0 : 1;
        }
        if (this.ghostKeys[1][bikeTime]) {
            this.rightPressed = this.rightPressed ? 0 : 1;
        }
        if (this.ghostKeys[2][bikeTime]) {
            this.upPressed = this.upPressed ? 0 : 1;
        }
        if (this.ghostKeys[3][bikeTime]) {
            this.downPressed = this.downPressed ? 0 : 1;
        }
        if (this.ghostKeys[4][bikeTime]) {
            this.turn();
        }
        super.fixedUpdate(this.leftPressed, this.rightPressed, this.upPressed, this.downPressed);
        this.currentTime += 40;
    }

    render() {
        this.renderInternal(this.color, 0.6);
    }
}