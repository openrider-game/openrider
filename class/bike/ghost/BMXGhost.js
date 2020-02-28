import { BIKE_BMX, BMX_INITIAL_STATE } from "../../constant/BikeConstants.js";
import { BMXRenderer } from "../renderer/BMXRenderer.js";
import { GhostBike } from "./GhostBike.js";

export class BMXGhost extends BMXRenderer(GhostBike) {
    constructor(parent, ghostKeys, last) {
        super(ghostKeys, parent);
        last = last || (console.log('fallback', last), BMX_INITIAL_STATE[0]);
        this.restore(last);
        this.head.size = 14;
        this.backWheel.size = 11.7;
        this.frontWheel.size = 11.7;
        this.headToBack.lengthTowards = 45;
        this.headToBack.springConstant = 0.35;
        this.headToBack.dampConstant = 0.3;
        this.frontToBack.lengthTowards = 42;
        this.frontToBack.springConstant = 0.35;
        this.frontToBack.dampConstant = 0.3;
        this.headToFront.lengthTowards = 45;
        this.headToFront.springConstant = 0.35;
        this.headToFront.dampConstant = 0.3;
        this.rotationFactor = 6;
    }

    toString() {
        return BIKE_BMX;
    }
}