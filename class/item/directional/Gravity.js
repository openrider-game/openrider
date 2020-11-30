import DirectionalItem from "../DirectionalItem.js";

export default class Gravity extends DirectionalItem {
    constructor(pos, rotation, track) {
        super(pos, rotation, track);
        this.direction.selfScale(0.3);
    }

    static get itemName() { return 'Gravity'; }
    static get color() { return '#0f0'; }
    static get code() { return 'G'; }

    onTouch(part) {
        part.bike.gravity.set(this.direction);
    }
}