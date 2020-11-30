import Item from "./Item.js";

export default class Bomb extends Item {
    static get itemName() { return 'Bomb'; }
    static get color() { return '#f00'; }
    static get code() { return 'O'; }

    onTouch(part) {
        part.bike.runner.explode(this.pos, part.velocity);
    }
}