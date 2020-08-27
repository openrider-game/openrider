import { ReachableItem } from "./ReachableItem.js";
import { SAVE_TARGET } from "../constant/TrackConstants.js";

export class Target extends ReachableItem {
    constructor(x, y, parent) {
        super(x, y, parent);
        this.$color = '#ff0';
        this.$reachedColor = '#ffa';
        this.$name = 'T';
    }

    onReach(part) {
        let track = this.track;
        track.targetsReached++;
        if (track.numTargets && track.targetsReached === track.numTargets) {
            part.bike.doSave |= SAVE_TARGET;
        }
    }

    addToTrack() {
        this.track.collectables.push(this);
        this.track.numTargets++;
        super.addToTrack();
    }

    onReachGhost(part) {
        if (!part.bike.reached[this.$id]) {
            part.bike.reached[this.$id] = ++part.bike.targetsReached;
        }
    }

    onDelete() { this.track.numTargets--; }
}