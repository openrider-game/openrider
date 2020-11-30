import DirectionalItem from "../DirectionalItem.js";

export default class Boost extends DirectionalItem {
    static get itemName() { return 'Boost'; }
    static get color() { return '#ff0'; }
    static get code() { return 'B'; }

    onTouch(part) {
        for (let point of part.bike.points) {
            point.pos.selfAdd(this.direction);
        }
    }
}