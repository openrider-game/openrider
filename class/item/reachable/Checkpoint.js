import BikePart from "../../entity/BikePart.js";
import ReachableItem from "../ReachableItem.js";

export default class Checkpoint extends ReachableItem {
    static get itemName() { return 'Checkpoint'; }
    static get color() { return '#00f'; }
    static get reachedColor() { return '#aaf'; }
    static get code() { return 'C'; }

    /**
     *
     * @param {BikePart} part
     */
    onReach(part) {
        if (!part.bike.runner.checkpointsReached.has(this.id)) {
            part.bike.runner.actionQueue.push(this);
        }
    }

    onAdd() {
        this.track.checkpoints.set(this.id, this);
    }

    onDelete() {
        this.track.checkpoints.delete(this.id);
    }
}