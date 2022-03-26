import LinkedItemGroup from "./LinkedItemGroup.js";
import ReachableItem from "./ReachableItem.js";

export default class LinkedItem extends ReachableItem {
    constructor(pos, track) {
        super(pos, track);
        /** @type {LinkedItemGroup} */
        this.group = null;
        /** @type {LinkedItem} */
        this.linkedItem = null;
    }

    addToTrack(fromGroup) {
        if (fromGroup) {
            super.addToTrack();
        } else {
            this.group.addToTrack();
        }
    }

    removeFromTrack(fromGroup) {
        if (fromGroup) {
            super.removeFromTrack();
        } else {
            this.group.removeFromTrack();
        }
    }

    onTouch(part, other) {
        if (!other) {
            this.group.instances.filter(obj => obj !== this).forEach(other => {
                other.onTouch(part, this);
            });
        }

        this.linkedItem = other;
        super.onTouch(part);
    }

    toString(fromGroup) {
        if (fromGroup) {
            return super.toString();
        } else {
            return this.group.toString();
        }
    }
}