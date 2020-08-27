import { ReachableItem } from "./ReachableItem.js";
import { SAVE_CHECKPOINT } from "../constant/TrackConstants.js";
import { DEBUG } from "../../bootstrap.js";

export class Checkpoint extends ReachableItem {
    constructor(x, y, parent) {
        super(x, y, parent);
        this.$color = '#00f';
        this.$reachedColor = '#aaf';
        this.$name = 'C';
    }

    addToTrack() {
        this.track.collectables.push(this);
        super.addToTrack();
    }

    onReach(part) {
        part.bike.doSave |= SAVE_CHECKPOINT;
        DEBUG && console.log('cp', part.bike.time, JSON.stringify(part.bike));
    }
}