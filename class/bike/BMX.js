import { BIKE_BMX, BMX_INITIAL_STATE } from "../constant/BikeConstants.js";
import { BMXRenderer } from "./renderer/BMXRenderer.js";
import { PlayerBike } from "./PlayerBike.js";
export class BMX extends BMXRenderer(PlayerBike) {
    constructor(parent, last) {
        super(parent);
        last = last || BMX_INITIAL_STATE[0];
        this.$consts = BMX_INITIAL_STATE;

        this.restore(last);
        this.head.size = 14;
        this.backWheel.size = 11.7;
        this.frontWheel.size = 11.7;
        this.headToBack.lengthTowards = 45;
        this.headToBack.BC = 0.35;
        this.headToBack.BE = 0.3;
        this.frontToBack.lengthTowards = 42;
        this.frontToBack.BC = 0.35;
        this.frontToBack.BE = 0.3;
        this.headToFront.lengthTowards = 45;
        this.headToFront.BC = 0.35;
        this.headToFront.BE = 0.3;
        this.rotationFactor = 6;
    }

    toString() {
        return BIKE_BMX;
    }
}