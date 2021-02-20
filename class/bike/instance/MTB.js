import Vector from "../../numeric/Vector.js";
import Track from "../../track/Track.js";
import Bike from "./Bike.js";

export default class MTB extends Bike {
    /**
     *
     * @param {Track} track
     * @param {BikeRunner} runner
     */
    constructor(track, runner) {
        super(track, runner);

        this.hitbox.size = 14;
        this.backWheel.size = 14;
        this.frontWheel.size = 14;

        this.headToBack.len = 47;
        this.headToBack.lengthTowards = 47;
        this.headToBack.springConstant = 0.2;
        this.headToBack.dampConstant = 0.3;

        this.frontToBack.len = 45;
        this.frontToBack.lengthTowards = 45;
        this.frontToBack.springConstant = 0.2;
        this.frontToBack.dampConstant = 0.3;

        this.headToFront.len = 45;
        this.headToFront.lengthTowards = 45;
        this.headToFront.springConstant = 0.2;
        this.headToFront.dampConstant = 0.3;

        this.rotationFactor = 8;
    }

    setBikeInitialState(startPos) {
        this.hitbox.pos = new Vector(startPos.x + 2, startPos.y - 3);
        this.hitbox.oldPos = this.hitbox.pos.clone();
        this.hitbox.displayPos = this.hitbox.pos.clone();
        this.backWheel.pos = new Vector(startPos.x - 23, startPos.y + 35);
        this.backWheel.oldPos = this.backWheel.pos.clone();
        this.backWheel.displayPos = this.backWheel.pos.clone();
        this.frontWheel.pos = new Vector(startPos.x + 23, startPos.y + 35);
        this.frontWheel.oldPos = this.frontWheel.pos.clone();
        this.frontWheel.displayPos = this.frontWheel.pos.clone();
    }
}