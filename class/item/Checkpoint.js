import { ReachableItem } from "./ReachableItem.js";
import { SAVE_CHECKPOINT } from "../constant/TrackConstants.js";

export class Checkpoint extends ReachableItem {
    constructor(x, y, parent) {
        super(x, y, parent);
        this.$color = '#00f';
        this.$reachedColor = '#aaf';
        this.$name = 'C';
    }

    onReach(part) {
        part.bike.doSave |= SAVE_CHECKPOINT;
        window.debugMode && console.log('cp', part.bike.time, JSON.stringify(part.bike));
    }
}