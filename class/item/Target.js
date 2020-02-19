import { ReachableItem } from "./ReachableItem.js";
import { SAVE_TARGET } from "../../unobfuscated_bhr.js";

export class Target extends ReachableItem {
    constructor(x, y, parent) {
        super(x, y, parent);
        this.$color = '#ff0';
        this.$reachedColor = '#ffa';
        this.$name = 'T';
    }

    onReach(part) {
        var track = this.parnt;
        track.targetsReached++;
        if (track.numTargets && track.targetsReached === track.numTargets) {
            part.parnt.doSave |= SAVE_TARGET;
        }
    }

    onReachGhost(part) {
        if (!part.parnt.reached[this.$id]) {
            part.parnt.reached[this.$id] = ++part.parnt.targetsReached;
        }
    }

    onDelete() { this.parnt.numTargets--; }
}