import Vector from "../../numeric/Vector.js";
import Track from "../../track/Track.js";
import Bike from "./Bike.js";

export default class BMX extends Bike {
    /**
     *
     * @param {Track} track
     * @param {BikeRunner} runner
     */
    constructor(track, runner) {
        super(track, runner);

        this.hitbox.size = 14;
        this.backWheel.size = 11.7;
        this.frontWheel.size = 11.7;

        this.headToBack.len = 45;
        this.headToBack.lengthTowards = 45;
        this.headToBack.springConstant = 0.35;
        this.headToBack.dampConstant = 0.3;

        this.frontToBack.len = 42;
        this.frontToBack.lengthTowards = 42;
        this.frontToBack.springConstant = 0.35;
        this.frontToBack.dampConstant = 0.3;

        this.headToFront.len = 45;
        this.headToFront.lengthTowards = 45;
        this.headToFront.springConstant = 0.35;
        this.headToFront.dampConstant = 0.3;

        this.rotationFactor = 6;
    }

    setBikeInitialState(startPos) {
        this.hitbox.pos = new Vector(startPos.x, startPos.y - 1);
        this.hitbox.oldPos = this.hitbox.pos.clone();
        this.hitbox.displayPos = this.hitbox.pos.clone();
        this.backWheel.pos = new Vector(startPos.x - 21, startPos.y + 38);
        this.backWheel.oldPos = this.backWheel.pos.clone();
        this.backWheel.displayPos = this.backWheel.pos.clone();
        this.frontWheel.pos = new Vector(startPos.x + 21, startPos.y + 38);
        this.frontWheel.oldPos = this.frontWheel.pos.clone();
        this.frontWheel.displayPos = this.frontWheel.pos.clone();
    }
}