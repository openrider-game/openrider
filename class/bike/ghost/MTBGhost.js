import { GhostBike } from "./GhostBike.js";
import { MTB_INITIAL_STATE } from "../../constant/BikeConstants.js";
import { MTBRenderer } from "../renderer/MTBRenderer.js";

export class MTBGhost extends MTBRenderer(GhostBike) {
    constructor(parent, ghostKeys, last) {
        super(ghostKeys, parent);
        last = last || (console.log('fallback', last), MTB_INITIAL_STATE[0]);
        this.restore(last);
        this.head.size = 14;
        this.backWheel.size = 14;
        this.frontWheel.size = 14;
        this.headToBack.lengthTowards = 47;
        this.headToBack.BC = 0.2;
        this.headToBack.BE = 0.3;
        this.frontToBack.lengthTowards = 45;
        this.frontToBack.BC = 0.2;
        this.frontToBack.BE = 0.3;
        this.headToFront.lengthTowards = 45;
        this.headToFront.BC = 0.2;
        this.headToFront.BE = 0.3;
        this.rotationFactor = 8;
    }

    toString() {
        return BIKE_MTB;
    }
}