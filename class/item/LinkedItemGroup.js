import GhostRunner from "../bike/GhostRunner.js";
import Vector from "../numeric/Vector.js";
import Item from "./Item.js";
import LinkedItem from "./LinkedItem.js";
import ReachableItem from "./ReachableItem.js";

export default class LinkedItemGroup extends ReachableItem {

    constructor(track) {
        super(new Vector(), track);
        /** @type {Array<Item>} */
        this.instances = new Array();
    }

    addToTrack() {
        for (let instance of this.instances) {
            instance.grid = this.grid;
            instance.cache = this.cache;
            instance.addToTrack(true);
        }
    }

    removeFromTrack() {
        for (let instance of this.instances) {
            instance.removeFromTrack(true);
        }
    }

    toString(code) {
        let string = code;
        for (let instance of this.instances) {
            instance.recorded = true;
            string += instance.toString(true).substring(1);
        }
        return string;
    }

    onTouch(part, touchedInstance) {
        if (part.bike.runner instanceof GhostRunner || !this.reached) {
            if (!(part.bike.runner instanceof GhostRunner)) {
                this.reached = true;
                this.instances.forEach(instance => {
                    instance.reached = true;
                    if (!part.bike.runner.reachablesReached.has(instance.id)) {
                        part.bike.runner.actionQueue.set(instance.id, instance);
                    }
                });
            }

            this.onReach(part);
            this.instances.filter(obj => obj !== touchedInstance).forEach(other => {
                touchedInstance.onReach(part, other);
            });
        }
    }

    /**
     *
     * @param {Array<String>} itemCode
     * @param {Track} track
     * @param {*} itemClass
     * @returns
     */
    static createInstance(itemCode, track, itemClass) {
        let itemGroup = new this(track);

        for (let itemIndex = 0; itemIndex < itemClass.itemCount; itemIndex++) {
            let itemCodeArguments = [itemCode[0]];
            for (let argumentIndex = 1; argumentIndex < itemClass.argumentCount + 1; argumentIndex++) {
                itemCodeArguments.push(itemCode[itemIndex * itemClass.argumentCount + argumentIndex]);
            }

            /** @type {LinkedItem} */
            let instance = itemClass.createInstance(itemCodeArguments, track, true);
            instance.group = itemGroup;

            itemGroup.instances.push(instance);
        }

        return itemGroup;
    }
}