import Vector from "../numeric/Vector.js";
import Item from "./Item.js";
import LinkedItem from "./LinkedItem.js";

export default class LinkedItemGroup extends LinkedItem {
    static get itemClass() { return LinkedItem; }
    static get code() { return this.itemClass.code; }
    static get itemCount() { return 2; }
    static get argumentCount() { return 2; }

    constructor(pos, track) {
        super(pos, track);
        /** @type {Item[]} */
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

    toString() {
        let string = this.constructor.code;
        for (let instance of this.instances) {
            instance.recorded = true;
            string += instance.toString(true).substring(1);
        }
        return string;
    }

    static createInstance(itemCode, track) {
        let itemGroup = new this(new Vector(), track);

        for (let itemCount = 0; itemCount < this.itemCount; itemCount++) {
            let itemCodeArguments = [itemCode[0]];
            for (let argumentCount = 1; argumentCount < this.argumentCount + 1; argumentCount++) {
                itemCodeArguments.push(itemCode[itemCount * this.argumentCount + argumentCount]);
            }

            /** @type {LinkedItem} */
            let instance = this.itemClass.createInstance(itemCodeArguments, track);
            instance.group = itemGroup;

            itemGroup.instances.push(instance);
        }

        return itemGroup;
    }
}