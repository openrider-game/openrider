import Item from "./Item.js";

export default class SlowMo extends Item {
    static get itemName() { return 'Slow-Motion'; }
    static get color() { return '#eee'; }
    static get code() { return 'S'; }

    onTouch(part) {
        part.bike.setSlow(true);
    }
}