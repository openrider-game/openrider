import Vector from "../numeric/Vector.js";
import Item from "./Item.js";
import LinkedItem from "./LinkedItem.js";

export default class LinkedItemGroup extends Item {

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