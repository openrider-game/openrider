import GhostRunner from "../../bike/GhostRunner.js";
import BikePart from "../../entity/BikePart.js";
import Vector from "../../numeric/Vector.js";
import ReachableItem from "../ReachableItem.js";

export default class Teleporter extends ReachableItem {
    static get itemName() { return 'Teleporter'; }
    static get color() { return '#f0f'; }
    static get reachedColor() { return '#faf'; }
    static get code() { return 'W'; }

    constructor(pos, track) {
        super(pos, track);
        /** @type Teleporter */
        this.alt = null;
    }

    /**
     *
     * @param {BikePart} part
     */
    onReach(part) {
        super.onReach(part);

        if (!(part.bike.runner instanceof GhostRunner)) {
            this.alt.reached = true;
        }

        if (!part.bike.runner.reachablesReached.has(this.alt.id)) {
            part.bike.runner.actionQueue.push(this.alt);
        }

        let distance = this.alt.pos.sub(this.pos);
        part.bike.points.forEach(point => {
            point.pos.selfAdd(distance);
            point.oldPos.selfAdd(distance);
            this.track.camera.set(this.track.focalPoint.pos);
        });
    }

    addToTrack(alt = false) {
        if (!alt) {
            this.alt.grid = this.grid;
            this.alt.cache = this.cache;
            this.alt.addToTrack(true);
        }

        return super.addToTrack();
    }

    removeFromTrack(alt = false) {
        if (!alt) {
            this.alt.removeFromTrack(true);
        }

        return super.removeFromTrack();
    }

    toString() {
        return this.constructor.code + " " + this.pos.toString() + " " + this.alt.pos.toString();
    }

    static createInstance(itemCode, track) {
        let pos = new Vector(parseInt(itemCode[1], 32), parseInt(itemCode[2], 32));
        let altPos = new Vector(parseInt(itemCode[3], 32), parseInt(itemCode[4], 32));
        let first = new this(pos, track);
        let second = new this(altPos, track);
        first.alt = second;
        second.alt = first;
        return first;
    }
}