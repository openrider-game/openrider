import Part from "../../entity/Part.js";
import ReachableItem from "../ReachableItem.js";

export default class Target extends ReachableItem {
    static get itemName() { return 'Target'; }
    static get color() { return '#ff0'; }
    static get reachedColor() { return '#ffa'; }
    static get code() { return 'T'; }

    /**
     *
     * @param {Part} part
     */
    onReach(part) {
        if (!part.bike.runner.targetsReached.has(this.id)) {
            part.bike.runner.actionQueue.set(this.id, this);
        }
    }

    onAdd() {
        super.onAdd();
        this.track.targets.set(this.id, this);
    }

    onDelete() {
        super.onDelete();
        this.track.targets.delete(this.id);
    }
}