import { BIKE_MTB, MTB_INITIAL_STATE } from "../constant/BikeConstants.js";
import { MTBRenderer } from "./renderer/MTBRenderer.js";
import { PlayerBike } from "./PlayerBike.js";

export class MTB extends MTBRenderer(PlayerBike) {
    constructor(parent, last) {
        super(parent);
        last = last || MTB_INITIAL_STATE[0];
        this.$consts = MTB_INITIAL_STATE;

        this.restore(last);
        this.head.size = 14;
        this.backWheel.size = 14;
        this.frontWheel.size = 14;
        this.headToBack.lengthTowards = 47;
        this.headToBack.springConstant = 0.2;
        this.headToBack.dampConstant = 0.3;
        this.frontToBack.lengthTowards = 45;
        this.frontToBack.springConstant = 0.2;
        this.frontToBack.dampConstant = 0.3;
        this.headToFront.lengthTowards = 45;
        this.headToFront.springConstant = 0.2;
        this.headToFront.dampConstant = 0.3;
        this.rotationFactor = 8;
    }

    toString() {
        return BIKE_MTB;
    }
}